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
"[project]/app/api/receipts/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const warehouseId = searchParams.get("warehouseId");
        const category = searchParams.get("category");
        const dateFrom = searchParams.get("dateFrom");
        const dateTo = searchParams.get("dateTo");
        const skip = parseInt(searchParams.get("skip") || "0");
        const take = parseInt(searchParams.get("take") || "20");
        const where = {};
        if (status) where.status = status;
        if (warehouseId) where.warehouseId = warehouseId;
        if (dateFrom || dateTo) {
            where.receivedDate = {};
            if (dateFrom) where.receivedDate.gte = new Date(dateFrom);
            if (dateTo) where.receivedDate.lte = new Date(dateTo);
        }
        if (category) {
            where.items = {
                some: {
                    product: {
                        categoryId: category
                    }
                }
            };
        }
        const [receipts, total] = await Promise.all([
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].receipt.findMany({
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
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].receipt.count({
                where
            })
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            receipts,
            total
        });
    } catch (error) {
        console.error("Get receipts error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to fetch receipts"
        }, {
            status: 500
        });
    }
}
async function POST(req) {
    try {
        const body = await req.json();
        const { supplierName, warehouseId, receivedDate, items, notes } = body;
        if (!supplierName || !warehouseId || !items?.length) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing required fields"
            }, {
                status: 400
            });
        }
        const receiptNo = `RCP-${Date.now()}`;
        const receipt = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].receipt.create({
            data: {
                receiptNo,
                supplierName,
                warehouseId,
                receivedDate: new Date(receivedDate),
                notes,
                items: {
                    create: items.map((item)=>({
                            productId: item.productId,
                            quantityOrdered: item.quantity,
                            unitPrice: item.unitPrice
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(receipt, {
            status: 201
        });
    } catch (error) {
        console.error("Create receipt error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to create receipt"
        }, {
            status: 500
        });
    }
}
async function PUT(req) {
    try {
        const body = await req.json();
        const { receiptId, status, items, userId } = body;
        if (!receiptId || !userId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Missing receipt ID or user ID"
            }, {
                status: 400
            });
        }
        if (status === "VALIDATED") {
            // Process stock movements
            const receipt = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].receipt.findUnique({
                where: {
                    id: receiptId
                },
                include: {
                    items: true,
                    warehouse: true
                }
            });
            if (!receipt) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Receipt not found"
                }, {
                    status: 404
                });
            }
            // Get default location for warehouse (or use first location)
            const location = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].location.findFirst({
                where: {
                    warehouseId: receipt.warehouseId
                }
            });
            if (!location) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "No location found for warehouse"
                }, {
                    status: 400
                });
            }
            // Create or update stock levels for each item
            for (const item of receipt.items){
                const existingStock = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stockLevel.findUnique({
                    where: {
                        warehouseId_locationId_productId: {
                            warehouseId: receipt.warehouseId,
                            locationId: location.id,
                            productId: item.productId
                        }
                    }
                });
                if (existingStock) {
                    // Update existing stock
                    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stockLevel.update({
                        where: {
                            id: existingStock.id
                        },
                        data: {
                            quantity: existingStock.quantity + item.quantityOrdered,
                            availableQuantity: existingStock.availableQuantity + item.quantityOrdered,
                            lastMovedAt: new Date()
                        }
                    });
                } else {
                    // Create new stock level
                    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stockLevel.create({
                        data: {
                            warehouseId: receipt.warehouseId,
                            locationId: location.id,
                            productId: item.productId,
                            quantity: item.quantityOrdered,
                            availableQuantity: item.quantityOrdered,
                            reservedQuantity: 0
                        }
                    });
                }
                // Create stock move record
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stockMove.create({
                    data: {
                        locationId: location.id,
                        productId: item.productId,
                        moveType: "RECEIPT",
                        quantity: item.quantityOrdered,
                        referenceId: receiptId,
                        referenceType: "Receipt",
                        notes: `Receipt validation: ${receipt.receiptNo}`
                    }
                });
            }
            // Create audit log
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].auditLog.create({
                data: {
                    userId,
                    action: "VALIDATE_RECEIPT",
                    entityType: "Receipt",
                    entityId: receiptId,
                    details: `Validated receipt ${receipt.receiptNo} with ${receipt.items.length} items`
                }
            });
        }
        const updatedReceipt = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].receipt.update({
            where: {
                id: receiptId
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(updatedReceipt);
    } catch (error) {
        console.error("Update receipt error:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to update receipt"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e3c35f85._.js.map