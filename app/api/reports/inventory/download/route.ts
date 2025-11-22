import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') || 'csv'
    const warehouseId = searchParams.get('warehouseId')
    const categoryId = searchParams.get('categoryId')

    const whereClause: any = {}
    if (warehouseId && warehouseId !== 'all') {
      whereClause.location = { warehouseId }
    }
    if (categoryId && categoryId !== 'all') {
      whereClause.product = { categoryId }
    }

    const stockLevels = await db.stockLevel.findMany({
      where: whereClause,
      include: {
        product: {
          include: { category: true }
        },
        location: {
          include: { warehouse: true }
        }
      }
    })

    if (format === 'csv') {
      const csvHeaders = 'Product,SKU,Category,Warehouse,Location,Quantity,Min Level,Status\n'
      const csvData = stockLevels.map(item => {
        const status = item.quantity === 0 ? 'Out of Stock' : 
                      item.quantity <= item.product.minStockLevel ? 'Low Stock' : 'In Stock'
        return [
          item.product.name,
          item.product.sku,
          item.product.category?.name || '',
          item.location.warehouse.name,
          item.location.name,
          item.quantity,
          item.product.minStockLevel,
          status
        ].join(',')
      }).join('\n')

      return new NextResponse(csvHeaders + csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="inventory-report.csv"'
        }
      })
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
  } catch (error) {
    console.error('Download report error:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}