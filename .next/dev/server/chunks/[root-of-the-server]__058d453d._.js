module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "db",
    ()=>db
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = /*TURBOPACK member replacement*/ __turbopack_context__.g;
const db = globalForPrisma.prisma || new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: [
        "query",
        "error"
    ]
});
if ("TURBOPACK compile-time truthy", 1) globalForPrisma.prisma = db;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/dashboard/kpis/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const warehouseId = searchParams.get("warehouseId");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        const dateFilter = {};
        if (dateFrom || dateTo) {
            dateFilter.createdAt = {};
            if (dateFrom) dateFilter.createdAt.gte = new Date(dateFrom);
            if (dateTo) dateFilter.createdAt.lte = new Date(dateTo);
        }
        // Get total products and inventory value
        const stockLevels = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stockLevel.findMany({
            where: warehouseId ? {
                warehouseId
            } : {},
            include: {
                product: true
            }
        });
        const totalProducts = stockLevels.filter((sl)=>sl.quantity > 0).length;
        const totalInventoryValue = stockLevels.reduce((sum, sl)=>sum + sl.quantity * 10, 0) // Assuming avg price
        ;
        const lowStockItems = stockLevels.filter((sl)=>sl.quantity > 0 && sl.quantity <= (sl.product.minStockLevel || 10)).length;
        const outOfStockItems = stockLevels.filter((sl)=>sl.quantity === 0).length;
        // Get pending documents count
        const [pendingReceipts, pendingDeliveries, scheduledTransfers] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].receipt.count({
                where: {
                    status: {
                        in: [
                            "DRAFT",
                            "WAITING"
                        ]
                    }
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].deliveryOrder.count({
                where: {
                    status: {
                        in: [
                            "DRAFT",
                            "READY"
                        ]
                    }
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].internalTransfer.count({
                where: {
                    status: {
                        in: [
                            "DRAFT",
                            "WAITING"
                        ]
                    }
                }
            })
        ]);
        // Get recent alerts - disabled until schema is updated
        const recentAlerts = [];
        // Get stock movement summary (last 30 days or custom range)
        const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const moveFilter = {
            createdAt: dateFrom || dateTo ? dateFilter.createdAt : {
                gte: thirtyDaysAgo
            },
            ...warehouseId && {
                location: {
                    warehouseId
                }
            }
        };
        const [recentMoves, dailyMovements] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stockMove.groupBy({
                by: [
                    "moveType"
                ],
                where: moveFilter,
                _count: true,
                _sum: {
                    quantity: true
                }
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stockMove.findMany({
                where: moveFilter,
                select: {
                    createdAt: true,
                    moveType: true,
                    quantity: true
                },
                orderBy: {
                    createdAt: "desc"
                },
                take: 100
            })
        ]);
        // Calculate performance metrics
        const totalMovements = recentMoves.reduce((sum, move)=>sum + move._count, 0);
        const inboundMovements = recentMoves.filter((m)=>[
                "RECEIPT",
                "TRANSFER_IN",
                "ADJUSTMENT_PLUS"
            ].includes(m.moveType)).reduce((sum, move)=>sum + move._count, 0);
        const outboundMovements = recentMoves.filter((m)=>[
                "DELIVERY",
                "TRANSFER_OUT",
                "ADJUSTMENT_MINUS"
            ].includes(m.moveType)).reduce((sum, move)=>sum + move._count, 0);
        // Group daily movements for trend analysis
        const movementTrends = dailyMovements.reduce((acc, move)=>{
            const date = move.createdAt.toISOString().split('T')[0];
            if (!acc[date]) acc[date] = {
                inbound: 0,
                outbound: 0
            };
            if ([
                "RECEIPT",
                "TRANSFER_IN",
                "ADJUSTMENT_PLUS"
            ].includes(move.moveType)) {
                acc[date].inbound += move.quantity;
            } else {
                acc[date].outbound += move.quantity;
            }
            return acc;
        }, {});
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            inventory: {
                totalProducts,
                totalInventoryValue,
                lowStockItems,
                outOfStockItems
            },
            operations: {
                pendingReceipts,
                pendingDeliveries,
                scheduledTransfers,
                totalMovements,
                inboundMovements,
                outboundMovements
            },
            alerts: recentAlerts,
            trends: {
                stockMovementSummary: recentMoves,
                dailyMovements: Object.entries(movementTrends).map(([date, data])=>({
                        date,
                        ...data
                    })).slice(-7) // Last 7 days
            }
        });
    } catch (error) {
        console.error("Get KPIs error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch KPIs"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__058d453d._.js.map