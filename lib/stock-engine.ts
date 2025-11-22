import { db } from "@/lib/db"

export interface StockMovement {
  productId: string
  quantity: number
  type: "RECEIPT" | "DELIVERY" | "TRANSFER_OUT" | "TRANSFER_IN" | "ADJUSTMENT_PLUS" | "ADJUSTMENT_MINUS"
  locationId: string
  referenceId?: string
  notes?: string
}

/**
 * Transaction-safe stock movement engine
 * Ensures all stock operations are atomic and logged
 */
export async function executeStockMovement(movements: StockMovement[]) {
  return db.$transaction(async (tx) => {
    const results = []

    for (const movement of movements) {
      // Get current stock level
      const stockLevel = await tx.stockLevel.findUnique({
        where: {
          warehouseId_locationId_productId: {
            warehouseId: movement.locationId.split("-")[0], // Extract warehouse from location
            locationId: movement.locationId,
            productId: movement.productId,
          },
        },
      })

      if (!stockLevel) {
        throw new Error(`Stock level not found for product ${movement.productId}`)
      }

      let newQuantity = stockLevel.quantity
      const quantityChange = movement.quantity

      // Calculate new quantity based on movement type
      if (["RECEIPT", "TRANSFER_IN", "ADJUSTMENT_PLUS"].includes(movement.type)) {
        newQuantity += movement.quantity
      } else if (["DELIVERY", "TRANSFER_OUT", "ADJUSTMENT_MINUS"].includes(movement.type)) {
        newQuantity -= movement.quantity
        if (newQuantity < 0) {
          throw new Error(`Insufficient stock for product ${movement.productId}`)
        }
      }

      // Update stock level
      const updated = await tx.stockLevel.update({
        where: { id: stockLevel.id },
        data: {
          quantity: newQuantity,
          availableQuantity: newQuantity - stockLevel.reservedQuantity,
          lastMovedAt: new Date(),
        },
      })

      // Log stock movement
      await tx.stockMove.create({
        data: {
          locationId: movement.locationId,
          productId: movement.productId,
          moveType: movement.type,
          quantity: movement.quantity,
          referenceId: movement.referenceId,
          notes: movement.notes,
        },
      })

      results.push(updated)
    }

    return results
  })
}

/**
 * Get low stock products for alerts
 */
export async function getLowStockProducts(warehouseId?: string) {
  const where = warehouseId ? { warehouseId } : {}

  return db.stockLevel.findMany({
    where: {
      ...where,
      quantity: {
        gt: 0,
      },
    },
    include: {
      product: {
        include: { category: true },
      },
      location: true,
      warehouse: true,
    },
    orderBy: { quantity: "asc" },
    take: 50,
  })
}
