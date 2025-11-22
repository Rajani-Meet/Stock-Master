import { db } from "@/lib/db"
import { hashPassword } from "@/lib/auth"

async function main() {
  console.log("🌱 Starting seed...")

  // Create admin user
  const admin = await db.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin User",
      password: await hashPassword("password123"),
      role: "ADMIN",
    },
  })
  console.log("✓ Created admin user:", admin.email)

  // Create manager user
  const manager = await db.user.create({
    data: {
      email: "manager@example.com",
      name: "Manager User",
      password: await hashPassword("password123"),
      role: "MANAGER",
    },
  })
  console.log("✓ Created manager user:", manager.email)

  // Create warehouse staff user
  const staff = await db.user.create({
    data: {
      email: "staff@example.com",
      name: "Warehouse Staff",
      password: await hashPassword("password123"),
      role: "WAREHOUSE_STAFF",
    },
  })
  console.log("✓ Created warehouse staff:", staff.email)

  // Create categories
  const categories = await Promise.all([
    db.category.create({
      data: {
        name: "Raw Materials",
        description: "Raw materials and components",
      },
    }),
    db.category.create({
      data: {
        name: "Finished Goods",
        description: "Finished products ready for sale",
      },
    }),
    db.category.create({
      data: {
        name: "Equipment",
        description: "Tools and equipment",
      },
    }),
  ])
  console.log("✓ Created", categories.length, "categories")

  // Create warehouses
  const warehouses = await Promise.all([
    db.warehouse.create({
      data: {
        name: "Main Warehouse",
        code: "MW-001",
        address: "123 Industrial Ave, City, State",
        phone: "555-0001",
        email: "main@warehouse.com",
      },
    }),
    db.warehouse.create({
      data: {
        name: "Distribution Center",
        code: "DC-001",
        address: "456 Logistics Blvd, City, State",
        phone: "555-0002",
        email: "dist@warehouse.com",
      },
    }),
  ])
  console.log("✓ Created", warehouses.length, "warehouses")

  // Create locations
  const locations = await Promise.all([
    db.location.create({
      data: {
        warehouseId: warehouses[0].id,
        name: "Rack A",
        code: "A-01",
        description: "Main storage rack",
      },
    }),
    db.location.create({
      data: {
        warehouseId: warehouses[0].id,
        name: "Rack B",
        code: "A-02",
        description: "Secondary storage rack",
      },
    }),
    db.location.create({
      data: {
        warehouseId: warehouses[0].id,
        name: "Receiving Area",
        code: "REC-01",
        description: "Receiving dock",
      },
    }),
    db.location.create({
      data: {
        warehouseId: warehouses[1].id,
        name: "Distribution Rack",
        code: "D-01",
        description: "Distribution center rack",
      },
    }),
  ])
  console.log("✓ Created", locations.length, "locations")

  // Create products
  const products = await Promise.all([
    db.product.create({
      data: {
        name: "Steel Rods",
        sku: "SKU-STEEL-001",
        categoryId: categories[0].id,
        description: "High-quality steel rods",
        unit: "KG",
        minStockLevel: 50,
        maxStockLevel: 500,
        reorderQty: 100,
      },
    }),
    db.product.create({
      data: {
        name: "Aluminum Sheet",
        sku: "SKU-ALUM-001",
        categoryId: categories[0].id,
        description: "Aluminum sheets",
        unit: "SHEET",
        minStockLevel: 20,
        maxStockLevel: 200,
        reorderQty: 50,
      },
    }),
    db.product.create({
      data: {
        name: "Wooden Chairs",
        sku: "SKU-CHAIR-001",
        categoryId: categories[1].id,
        description: "Wooden office chairs",
        unit: "UNIT",
        minStockLevel: 10,
        maxStockLevel: 100,
        reorderQty: 25,
      },
    }),
    db.product.create({
      data: {
        name: "Desk Lamp",
        sku: "SKU-LAMP-001",
        categoryId: categories[1].id,
        description: "LED desk lamp",
        unit: "UNIT",
        minStockLevel: 5,
        maxStockLevel: 50,
        reorderQty: 15,
      },
    }),
  ])
  console.log("✓ Created", products.length, "products")

  // Create stock levels
  const stockLevels = await Promise.all([
    db.stockLevel.create({
      data: {
        warehouseId: warehouses[0].id,
        locationId: locations[0].id,
        productId: products[0].id,
        quantity: 150,
        availableQuantity: 150,
      },
    }),
    db.stockLevel.create({
      data: {
        warehouseId: warehouses[0].id,
        locationId: locations[0].id,
        productId: products[1].id,
        quantity: 75,
        availableQuantity: 75,
      },
    }),
    db.stockLevel.create({
      data: {
        warehouseId: warehouses[0].id,
        locationId: locations[1].id,
        productId: products[2].id,
        quantity: 45,
        availableQuantity: 45,
      },
    }),
    db.stockLevel.create({
      data: {
        warehouseId: warehouses[0].id,
        locationId: locations[1].id,
        productId: products[3].id,
        quantity: 12,
        availableQuantity: 12,
      },
    }),
    db.stockLevel.create({
      data: {
        warehouseId: warehouses[1].id,
        locationId: locations[3].id,
        productId: products[2].id,
        quantity: 30,
        availableQuantity: 30,
      },
    }),
  ])
  console.log("✓ Created", stockLevels.length, "stock levels")

  console.log("✅ Seed completed successfully!")
}

main().catch((e) => {
  console.error("❌ Seed failed:", e)
  process.exit(1)
})
