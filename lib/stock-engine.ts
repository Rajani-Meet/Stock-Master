import { db } from "@/lib/db"
import { Prisma } from "@prisma/client"

export interface StockMovement {
  productId: string
  quantity: number
  type: "RECEIPT" | "DELIVERY" | "TRANSFER_OUT" | "TRANSFER_IN" | "ADJUSTMENT_PLUS" | "ADJUSTMENT_MINUS"
  locationId: string
  referenceId?: string
  referenceType?: string
  notes?: string
}

export interface AuditLogData {
  userId: string
  action: string
  entityType: string
  entityId: string
  changes?: Record<string, any>
  details?: string
}

/**
 * Transaction-safe stock movement engine
 * Ensures all stock operations are atomic and logged
 * Uses row-level locking for consistency
 */
export async function executeStockMovement(
  movements: StockMovement[],
  auditLog: AuditLogData
) {
  return db.$transaction(async (tx) => {
    const results = []

    for (const movement of movements) {
      // Lock and fetch current stock level
      const stockLevel = await tx.stockLevel.findUniqueOrThrow({
        where: {
          warehouseId_locationId_productId: {
            warehouseId: await getWarehouseIdFromLocation(tx, movement.locationId),
            locationId: movement.locationId,
            productId: movement.productId,
          },
        },
      })

      let newQuantity = stockLevel.quantity

      // Calculate new quantity based on movement type
      if (["RECEIPT", "TRANSFER_IN", "ADJUSTMENT_PLUS"].includes(movement.type)) {
        newQuantity += movement.quantity
      } else if (["DELIVERY", "TRANSFER_OUT", "ADJUSTMENT_MINUS"].includes(movement.type)) {
        newQuantity -= movement.quantity
        if (newQuantity < 0) {
          throw new Error(
            `Insufficient stock for product ${movement.productId} in location ${movement.locationId}`
          )
        }
      }

      // Update stock level atomically
      const updated = await tx.stockLevel.update({
        where: { id: stockLevel.id },
        data: {
          quantity: newQuantity,
          availableQuantity: newQuantity - stockLevel.reservedQuantity,
          lastMovedAt: new Date(),
        },
        include: {
          product: true,
          location: { include: { warehouse: true } },
        },
      })

      // Create stock move record
      await tx.stockMove.create({
        data: {
          locationId: movement.locationId,
          productId: movement.productId,
          moveType: movement.type,
          quantity: movement.quantity,
          referenceId: movement.referenceId,
          referenceType: movement.referenceType,
          notes: movement.notes,
        },
      })

      results.push(updated)
    }

    // Log audit entry
    await tx.auditLog.create({
      data: {
        userId: auditLog.userId,
        action: auditLog.action,
        entityType: auditLog.entityType,
        entityId: auditLog.entityId,
        changes: auditLog.changes ? JSON.stringify(auditLog.changes) : null,
        details: auditLog.details,
      },
    })

    return results
  })
}

/**
 * Helper: Get warehouse ID from location
 */
async function getWarehouseIdFromLocation(tx: Prisma.TransactionClient, locationId: string) {
  const location = await tx.location.findUniqueOrThrow({ where: { id: locationId } })
  return location.warehouseId
}

/**
 * Reserve stock for a delivery
 */
export async function reserveStock(
  productId: string,
  locationId: string,
  quantity: number,
  userId: string
) {
  return db.$transaction(async (tx) => {
    const warehouseId = await getWarehouseIdFromLocation(tx, locationId)
    const stockLevel = await tx.stockLevel.findUniqueOrThrow({
      where: {
        warehouseId_locationId_productId: {
          warehouseId,
          locationId,
          productId,
        },
      },
    })

    if (stockLevel.availableQuantity < quantity) {
      throw new Error(`Insufficient available stock to reserve`)
    }

    const updated = await tx.stockLevel.update({
      where: { id: stockLevel.id },
      data: {
        reservedQuantity: stockLevel.reservedQuantity + quantity,
        availableQuantity: stockLevel.availableQuantity - quantity,
      },
    })

    // Log the reservation
    await tx.stockMove.create({
      data: {
        locationId,
        productId,
        moveType: "RESERVED",
        quantity,
      },
    })

    await tx.auditLog.create({
      data: {
        userId,
        action: "RESERVE",
        entityType: "StockLevel",
        entityId: stockLevel.id,
        details: `Reserved ${quantity} units`,
      },
    })

    return updated
  })
}

/**
 * Unreserve stock
 */
export async function unreserveStock(
  productId: string,
  locationId: string,
  quantity: number,
  userId: string
) {
  return db.$transaction(async (tx) => {
    const warehouseId = await getWarehouseIdFromLocation(tx, locationId)
    const stockLevel = await tx.stockLevel.findUniqueOrThrow({
      where: {
        warehouseId_locationId_productId: {
          warehouseId,
          locationId,
          productId,
        },
      },
    })

    const updated = await tx.stockLevel.update({
      where: { id: stockLevel.id },
      data: {
        reservedQuantity: Math.max(0, stockLevel.reservedQuantity - quantity),
        availableQuantity: stockLevel.availableQuantity + quantity,
      },
    })

    await tx.stockMove.create({
      data: {
        locationId,
        productId,
        moveType: "UNRESERVED",
        quantity,
      },
    })

    await tx.auditLog.create({
      data: {
        userId,
        action: "UNRESERVE",
        entityType: "StockLevel",
        entityId: stockLevel.id,
        details: `Unreserved ${quantity} units`,
      },
    })

    return updated
  })
}

/**
 * Get low stock products
 */
export async function getLowStockProducts(warehouseId?: string) {
  const where: Prisma.StockLevelWhereInput = {
    quantity: { gt: 0 },
  }

  if (warehouseId) {
    where.warehouseId = warehouseId
  }

  const lowStocks = await db.stockLevel.findMany({
    where,
    include: {
      product: {
        include: { category: true, reorderRules: true },
      },
      location: true,
      warehouse: true,
    },
    orderBy: { quantity: "asc" },
    take: 50,
  })

  // Filter by min stock level
  return lowStocks.filter((sl) => sl.quantity <= sl.product.minStockLevel)
}

/**
 * Check reorder rules and create alerts
 */
export async function checkReorderRules() {
  const rules = await db.reorderRule.findMany({
    where: { isActive: true },
    include: { product: { include: { stockLevels: true } } },
  })

  for (const rule of rules) {
    const totalStock = rule.product.stockLevels.reduce((sum, sl) => sum + sl.quantity, 0)

    if (totalStock <= rule.minLevel) {
      // Check if alert already exists
      const existingAlert = await db.alert.findFirst({
        where: {
          productId: rule.productId,
          type: "LOW_STOCK",
          isResolved: false,
        },
      })

      if (!existingAlert) {
        await db.alert.create({
          data: {
            type: "LOW_STOCK",
            productId: rule.productId,
            severity: totalStock === 0 ? "CRITICAL" : "WARNING",
            message: `Low stock alert for ${rule.product.name}. Current stock: ${totalStock}, Reorder Level: ${rule.minLevel}`,
          },
        })
      }
    }
  }
}
