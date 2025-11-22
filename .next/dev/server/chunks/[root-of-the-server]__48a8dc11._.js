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
"[project]/lib/stock-engine.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkReorderRules",
    ()=>checkReorderRules,
    "executeStockMovement",
    ()=>executeStockMovement,
    "getLowStockProducts",
    ()=>getLowStockProducts,
    "reserveStock",
    ()=>reserveStock,
    "unreserveStock",
    ()=>unreserveStock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
async function executeStockMovement(movements, auditLog) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].$transaction(async (tx)=>{
        const results = [];
        for (const movement of movements){
            // Lock and fetch current stock level
            const stockLevel = await tx.stockLevel.findUniqueOrThrow({
                where: {
                    warehouseId_locationId_productId: {
                        warehouseId: await getWarehouseIdFromLocation(tx, movement.locationId),
                        locationId: movement.locationId,
                        productId: movement.productId
                    }
                }
            });
            let newQuantity = stockLevel.quantity;
            // Calculate new quantity based on movement type
            if ([
                "RECEIPT",
                "TRANSFER_IN",
                "ADJUSTMENT_PLUS"
            ].includes(movement.type)) {
                newQuantity += movement.quantity;
            } else if ([
                "DELIVERY",
                "TRANSFER_OUT",
                "ADJUSTMENT_MINUS"
            ].includes(movement.type)) {
                newQuantity -= movement.quantity;
                if (newQuantity < 0) {
                    throw new Error(`Insufficient stock for product ${movement.productId} in location ${movement.locationId}`);
                }
            }
            // Update stock level atomically
            const updated = await tx.stockLevel.update({
                where: {
                    id: stockLevel.id
                },
                data: {
                    quantity: newQuantity,
                    availableQuantity: newQuantity - stockLevel.reservedQuantity,
                    lastMovedAt: new Date()
                },
                include: {
                    product: true,
                    location: {
                        include: {
                            warehouse: true
                        }
                    }
                }
            });
            // Create stock move record
            await tx.stockMove.create({
                data: {
                    locationId: movement.locationId,
                    productId: movement.productId,
                    moveType: movement.type,
                    quantity: movement.quantity,
                    referenceId: movement.referenceId,
                    referenceType: movement.referenceType,
                    notes: movement.notes
                }
            });
            results.push(updated);
        }
        // Log audit entry
        await tx.auditLog.create({
            data: {
                userId: auditLog.userId,
                action: auditLog.action,
                entityType: auditLog.entityType,
                entityId: auditLog.entityId,
                changes: auditLog.changes ? JSON.stringify(auditLog.changes) : null,
                details: auditLog.details
            }
        });
        return results;
    });
}
/**
 * Helper: Get warehouse ID from location
 */ async function getWarehouseIdFromLocation(tx, locationId) {
    const location = await tx.location.findUniqueOrThrow({
        where: {
            id: locationId
        }
    });
    return location.warehouseId;
}
async function reserveStock(productId, locationId, quantity, userId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].$transaction(async (tx)=>{
        const warehouseId = await getWarehouseIdFromLocation(tx, locationId);
        const stockLevel = await tx.stockLevel.findUniqueOrThrow({
            where: {
                warehouseId_locationId_productId: {
                    warehouseId,
                    locationId,
                    productId
                }
            }
        });
        if (stockLevel.availableQuantity < quantity) {
            throw new Error(`Insufficient available stock to reserve`);
        }
        const updated = await tx.stockLevel.update({
            where: {
                id: stockLevel.id
            },
            data: {
                reservedQuantity: stockLevel.reservedQuantity + quantity,
                availableQuantity: stockLevel.availableQuantity - quantity
            }
        });
        // Log the reservation
        await tx.stockMove.create({
            data: {
                locationId,
                productId,
                moveType: "RESERVED",
                quantity
            }
        });
        await tx.auditLog.create({
            data: {
                userId,
                action: "RESERVE",
                entityType: "StockLevel",
                entityId: stockLevel.id,
                details: `Reserved ${quantity} units`
            }
        });
        return updated;
    });
}
async function unreserveStock(productId, locationId, quantity, userId) {
    return __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].$transaction(async (tx)=>{
        const warehouseId = await getWarehouseIdFromLocation(tx, locationId);
        const stockLevel = await tx.stockLevel.findUniqueOrThrow({
            where: {
                warehouseId_locationId_productId: {
                    warehouseId,
                    locationId,
                    productId
                }
            }
        });
        const updated = await tx.stockLevel.update({
            where: {
                id: stockLevel.id
            },
            data: {
                reservedQuantity: Math.max(0, stockLevel.reservedQuantity - quantity),
                availableQuantity: stockLevel.availableQuantity + quantity
            }
        });
        await tx.stockMove.create({
            data: {
                locationId,
                productId,
                moveType: "UNRESERVED",
                quantity
            }
        });
        await tx.auditLog.create({
            data: {
                userId,
                action: "UNRESERVE",
                entityType: "StockLevel",
                entityId: stockLevel.id,
                details: `Unreserved ${quantity} units`
            }
        });
        return updated;
    });
}
async function getLowStockProducts(warehouseId) {
    const where = {
        quantity: {
            gt: 0
        }
    };
    if (warehouseId) {
        where.warehouseId = warehouseId;
    }
    const lowStocks = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stockLevel.findMany({
        where,
        include: {
            product: {
                include: {
                    category: true,
                    reorderRules: true
                }
            },
            location: true,
            warehouse: true
        },
        orderBy: {
            quantity: "asc"
        },
        take: 50
    });
    // Filter by min stock level
    return lowStocks.filter((sl)=>sl.quantity <= sl.product.minStockLevel);
}
async function checkReorderRules() {
    const rules = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].reorderRule.findMany({
        where: {
            isActive: true
        },
        include: {
            product: {
                include: {
                    stockLevels: true
                }
            }
        }
    });
    for (const rule of rules){
        const totalStock = rule.product.stockLevels.reduce((sum, sl)=>sum + sl.quantity, 0);
        if (totalStock <= rule.minLevel) {
            // Check if alert already exists
            const existingAlert = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].alert.findFirst({
                where: {
                    productId: rule.productId,
                    type: "LOW_STOCK",
                    isResolved: false
                }
            });
            if (!existingAlert) {
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].alert.create({
                    data: {
                        type: "LOW_STOCK",
                        productId: rule.productId,
                        severity: totalStock === 0 ? "CRITICAL" : "WARNING",
                        message: `Low stock alert for ${rule.product.name}. Current stock: ${totalStock}, Reorder Level: ${rule.minLevel}`
                    }
                });
            }
        }
    }
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/deliveries/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "PUT",
    ()=>PUT
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stock$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/stock-engine.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const warehouseId = searchParams.get("warehouseId");
        const skip = parseInt(searchParams.get("skip") || "0");
        const take = parseInt(searchParams.get("take") || "20");
        const where = {};
        if (status) where.status = status;
        if (warehouseId) where.warehouseId = warehouseId;
        const [deliveries, total] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].deliveryOrder.findMany({
                where,
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    },
                    warehouse: true
                },
                orderBy: {
                    createdAt: "desc"
                },
                skip,
                take
            }),
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].deliveryOrder.count({
                where
            })
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            deliveries,
            total
        });
    } catch (error) {
        console.error("Get deliveries error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch deliveries"
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const body = await req.json();
        const { customerName, warehouseId, deliveryDate, items, notes } = body;
        if (!customerName || !warehouseId || !items?.length) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing required fields"
            }, {
                status: 400
            });
        }
        const deliveryNo = `DEL-${Date.now()}`;
        const delivery = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].deliveryOrder.create({
            data: {
                deliveryNo,
                customerName,
                warehouseId,
                deliveryDate: new Date(deliveryDate),
                notes,
                items: {
                    create: items.map((item)=>({
                            productId: item.productId,
                            quantityOrdered: item.quantity
                        }))
                }
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                warehouse: true
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(delivery, {
            status: 201
        });
    } catch (error) {
        console.error("Create delivery error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create delivery"
        }, {
            status: 500
        });
    }
}
async function PUT(req) {
    try {
        const body = await req.json();
        const { deliveryId, status, userId } = body;
        if (!deliveryId || !userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing delivery ID or user ID"
            }, {
                status: 400
            });
        }
        const delivery = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].deliveryOrder.findUnique({
            where: {
                id: deliveryId
            },
            include: {
                items: true,
                warehouse: true
            }
        });
        if (!delivery) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Delivery not found"
            }, {
                status: 404
            });
        }
        if (status === "DONE") {
            // Get stock locations and create deliveries
            const location = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].location.findFirst({
                where: {
                    warehouseId: delivery.warehouseId
                }
            });
            if (!location) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "No location found for warehouse"
                }, {
                    status: 400
                });
            }
            const movements = delivery.items.map((item)=>({
                    productId: item.productId,
                    quantity: item.quantityOrdered,
                    type: "DELIVERY",
                    locationId: location.id,
                    referenceId: deliveryId,
                    referenceType: "Delivery",
                    notes: `Delivery: ${delivery.deliveryNo}`
                }));
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stock$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["executeStockMovement"])(movements, {
                userId,
                action: "COMPLETE_DELIVERY",
                entityType: "DeliveryOrder",
                entityId: deliveryId,
                details: `Completed delivery ${delivery.deliveryNo}`
            });
            // Unreserve stock if status was READY
            if (delivery.status === "READY") {
                for (const item of delivery.items){
                    try {
                        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$stock$2d$engine$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["unreserveStock"])(item.productId, location.id, item.quantityOrdered, userId);
                    } catch (e) {
                        console.error(`Failed to unreserve stock for ${item.productId}`, e);
                    }
                }
            }
        }
        const result = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].deliveryOrder.update({
            where: {
                id: deliveryId
            },
            data: {
                status
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                warehouse: true
            }
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(result);
    } catch (error) {
        console.error("Update delivery error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to update delivery"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__48a8dc11._.js.map