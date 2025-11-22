import { db } from "@/lib/db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    // Get role-specific tasks based on current operations
    const [pendingReceipts, pendingDeliveries, scheduledTransfers, lowStockItems] = await Promise.all([
      db.receipt.count({ where: { status: { in: ["DRAFT", "WAITING"] } } }),
      db.deliveryOrder.count({ where: { status: { in: ["DRAFT", "READY"] } } }),
      db.internalTransfer.count({ where: { status: { in: ["DRAFT", "WAITING", "READY"] } } }),
      db.stockLevel.count({ where: { quantity: { lte: 10 } } }),
    ])

    const tasks = [
      {
        id: "pending-receipts",
        title: "Process Pending Receipts",
        description: `${pendingReceipts} receipts need validation`,
        priority: pendingReceipts > 5 ? "HIGH" : "MEDIUM",
        type: "RECEIPT",
        count: pendingReceipts,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      },
      {
        id: "pending-deliveries",
        title: "Process Delivery Orders",
        description: `${pendingDeliveries} orders ready for shipment`,
        priority: pendingDeliveries > 10 ? "HIGH" : "MEDIUM",
        type: "DELIVERY",
        count: pendingDeliveries,
        dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
      },
      {
        id: "scheduled-transfers",
        title: "Execute Internal Transfers",
        description: `${scheduledTransfers} transfers scheduled`,
        priority: scheduledTransfers > 3 ? "MEDIUM" : "LOW",
        type: "TRANSFER",
        count: scheduledTransfers,
        dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000), // 2 days
      },
      {
        id: "low-stock-review",
        title: "Review Low Stock Items",
        description: `${lowStockItems} items below minimum level`,
        priority: lowStockItems > 5 ? "HIGH" : "MEDIUM",
        type: "STOCK",
        count: lowStockItems,
        dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
      },
    ]

    return NextResponse.json({ tasks })
  } catch (error) {
    console.error("Get tasks error:", error)
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}