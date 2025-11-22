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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/auth.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "comparePassword",
    ()=>comparePassword,
    "generateOTP",
    ()=>generateOTP,
    "generateResetToken",
    ()=>generateResetToken,
    "getCurrentUser",
    ()=>getCurrentUser,
    "hashPassword",
    ()=>hashPassword,
    "verifyPassword",
    ()=>verifyPassword
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/bcryptjs/index.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-route] (ecmascript)");
;
;
async function hashPassword(password) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hash"])(password, 10);
}
async function comparePassword(password, hashedPassword) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compare"])(password, hashedPassword);
}
async function verifyPassword(password, hashedPassword) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$bcryptjs$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["compare"])(password, hashedPassword);
}
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
function generateResetToken() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
async function getCurrentUser() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["cookies"])();
    const authToken = cookieStore.get("auth_token");
    if (!authToken) {
        return null;
    }
    try {
        const decoded = JSON.parse(Buffer.from(authToken.value, "base64").toString());
        return decoded;
    } catch  {
        return null;
    }
}
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/url [external] (url, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("url", () => require("url"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[externals]/dns [external] (dns, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("dns", () => require("dns"));

module.exports = mod;
}),
"[externals]/os [external] (os, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("os", () => require("os"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[project]/lib/email.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "checkAndSendLowStockAlerts",
    ()=>checkAndSendLowStockAlerts,
    "sendLowStockAlert",
    ()=>sendLowStockAlert,
    "sendOTP",
    ()=>sendOTP,
    "sendReportEmail",
    ()=>sendReportEmail
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/nodemailer/lib/nodemailer.js [app-route] (ecmascript)");
;
const transporter = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$nodemailer$2f$lib$2f$nodemailer$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});
async function sendOTP(email, otp) {
    await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: 'StockMaster - Password Reset OTP',
        html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset OTP</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">StockMaster</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0; font-size: 16px;">Inventory Management System</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">Password Reset Request</h2>
            <p style="color: #666; line-height: 1.6; margin: 0 0 30px 0; font-size: 16px;">We received a request to reset your password. Use the verification code below to proceed:</p>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
              <p style="color: white; margin: 0 0 10px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
              <div style="background: white; border-radius: 6px; padding: 20px; display: inline-block; min-width: 200px;">
                <span style="font-size: 32px; font-weight: bold; color: #333; letter-spacing: 4px; font-family: 'Courier New', monospace;">${otp}</span>
              </div>
            </div>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">⚠️ This code expires in <strong>10 minutes</strong> for security reasons.</p>
            </div>
            
            <p style="color: #666; line-height: 1.6; margin: 20px 0 0 0; font-size: 14px;">If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
          
          <!-- Footer -->
          <div style="background: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e9ecef; text-align: center;">
            <p style="color: #6c757d; margin: 0; font-size: 12px;">© 2024 StockMaster. All rights reserved.</p>
            <p style="color: #6c757d; margin: 5px 0 0 0; font-size: 12px;">This is an automated message, please do not reply.</p>
          </div>
        </div>
      </body>
      </html>
    `
    });
}
async function sendLowStockAlert(email, products) {
    const productRows = products.map((p)=>`
    <tr style="border-bottom: 1px solid #e9ecef;">
      <td style="padding: 12px; color: #333;">${p.name}</td>
      <td style="padding: 12px; color: #666; font-family: monospace;">${p.sku}</td>
      <td style="padding: 12px; color: #dc3545; font-weight: bold;">${p.currentStock}</td>
      <td style="padding: 12px; color: #666;">${p.minStockLevel}</td>
    </tr>
  `).join('');
    await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: `StockMaster - Low Stock Alert (${products.length} items)`,
        html: `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">⚠️ Low Stock Alert</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0;">StockMaster Inventory System</p>
          </div>
          <div style="padding: 30px;">
            <p style="color: #666; margin: 0 0 20px 0;">The following products are running low on stock and need immediate attention:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f8f9fa;">
                  <th style="padding: 12px; text-align: left; color: #333;">Product</th>
                  <th style="padding: 12px; text-align: left; color: #333;">SKU</th>
                  <th style="padding: 12px; text-align: left; color: #333;">Current</th>
                  <th style="padding: 12px; text-align: left; color: #333;">Min Level</th>
                </tr>
              </thead>
              <tbody>${productRows}</tbody>
            </table>
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">📋 Please review and reorder these items to maintain optimal inventory levels.</p>
            </div>
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center;">
            <p style="color: #6c757d; margin: 0; font-size: 12px;">© 2024 StockMaster. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
    });
}
async function sendReportEmail(email, reportType, reportData) {
    await transporter.sendMail({
        from: process.env.FROM_EMAIL,
        to: email,
        subject: `StockMaster - ${reportType} Report Generated`,
        html: `
      <!DOCTYPE html>
      <html>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">📊 Report Generated</h1>
            <p style="color: rgba(255, 255, 255, 0.9); margin: 8px 0 0 0;">StockMaster Analytics</p>
          </div>
          <div style="padding: 30px;">
            <h2 style="color: #333; margin: 0 0 20px 0;">${reportType} Report Summary</h2>
            <div style="background: #f8f9fa; border-radius: 6px; padding: 20px; margin: 20px 0;">
              ${reportType === 'Inventory' ? `
                <p style="margin: 5px 0; color: #666;"><strong>Total Products:</strong> ${reportData.summary?.totalProducts || 0}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Total Value:</strong> $${reportData.summary?.totalValue || 0}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Low Stock Items:</strong> ${reportData.summary?.lowStockCount || 0}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Out of Stock:</strong> ${reportData.summary?.outOfStockCount || 0}</p>
              ` : `
                <p style="margin: 5px 0; color: #666;"><strong>Total Movements:</strong> ${reportData.summary?.totalMovements || 0}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Inbound:</strong> ${reportData.summary?.inbound || 0}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Outbound:</strong> ${reportData.summary?.outbound || 0}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Adjustments:</strong> ${reportData.summary?.adjustments || 0}</p>
              `}
            </div>
            <p style="color: #666; margin: 20px 0 0 0; font-size: 14px;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
          </div>
          <div style="background: #f8f9fa; padding: 20px; text-align: center;">
            <p style="color: #6c757d; margin: 0; font-size: 12px;">© 2024 StockMaster. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `
    });
}
async function checkAndSendLowStockAlerts() {
    try {
        const lowStockProducts = await db.stockLevel.findMany({
            where: {
                quantity: {
                    lte: db.product.fields.minStockLevel
                }
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
        if (lowStockProducts.length > 0) {
            const adminUsers = await db.user.findMany({
                where: {
                    role: {
                        in: [
                            'ADMIN',
                            'MANAGER'
                        ]
                    },
                    isActive: true
                }
            });
            const products = lowStockProducts.map((sl)=>({
                    name: sl.product.name,
                    sku: sl.product.sku,
                    currentStock: sl.quantity,
                    minStockLevel: sl.product.minStockLevel
                }));
            for (const user of adminUsers){
                await sendLowStockAlert(user.email, products);
            }
        }
    } catch (error) {
        console.error('Failed to send low stock alerts:', error);
    }
}
}),
"[project]/app/api/reports/inventory/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/email.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
;
;
;
async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const warehouseId = searchParams.get("warehouseId");
        const categoryId = searchParams.get("categoryId");
        const sendEmail = searchParams.get("sendEmail") === 'true';
        const where = {};
        if (warehouseId) where.warehouseId = warehouseId;
        if (categoryId) where.product = {
            categoryId
        };
        const stockLevels = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].stockLevel.findMany({
            where,
            include: {
                product: {
                    include: {
                        category: true
                    }
                },
                warehouse: true,
                location: true
            }
        });
        const totalValue = stockLevels.reduce((sum, sl)=>sum + sl.quantity * 10, 0) // Assuming avg price 10
        ;
        const lowStockCount = stockLevels.filter((sl)=>sl.quantity <= sl.product.minStockLevel).length;
        const outOfStockCount = stockLevels.filter((sl)=>sl.quantity === 0).length;
        const reportData = {
            summary: {
                totalProducts: stockLevels.length,
                totalValue,
                lowStockCount,
                outOfStockCount
            },
            details: stockLevels
        };
        if (sendEmail) {
            const currentUser = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getCurrentUser"])();
            if (currentUser) {
                const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["db"].user.findUnique({
                    where: {
                        id: currentUser.userId
                    }
                });
                if (user) {
                    await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$email$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendReportEmail"])(user.email, 'Inventory', reportData);
                }
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ...reportData,
            success: true
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Failed to generate inventory report"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__74c99fe2._.js.map