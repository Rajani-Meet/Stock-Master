import { db } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const format = searchParams.get('format') || 'csv'
    const warehouseId = searchParams.get('warehouseId')
    const dateFrom = searchParams.get('dateFrom')
    const dateTo = searchParams.get('dateTo')

    const whereClause: any = {}
    if (warehouseId && warehouseId !== 'all') {
      whereClause.location = { warehouseId }
    }
    if (dateFrom || dateTo) {
      whereClause.createdAt = {}
      if (dateFrom) whereClause.createdAt.gte = new Date(dateFrom)
      if (dateTo) whereClause.createdAt.lte = new Date(dateTo)
    }

    const stockMoves = await db.stockMove.findMany({
      where: whereClause,
      include: {
        product: true,
        location: {
          include: { warehouse: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    if (format === 'csv') {
      const csvHeaders = 'Date,Product,SKU,Type,Quantity,Warehouse,Location,Reference\n'
      const csvData = stockMoves.map(item => [
        new Date(item.createdAt).toLocaleDateString(),
        item.product.name,
        item.product.sku,
        item.moveType,
        item.quantity,
        item.location.warehouse.name,
        item.location.name,
        item.referenceId || ''
      ].join(',')).join('\n')

      return new NextResponse(csvHeaders + csvData, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="movements-report.csv"'
        }
      })
    }

    return NextResponse.json({ error: 'Invalid format' }, { status: 400 })
  } catch (error) {
    console.error('Download report error:', error)
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 })
  }
}