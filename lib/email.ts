import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
})

export async function sendOTP(email: string, otp: string) {
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
  })
}

export async function sendLowStockAlert(email: string, products: any[]) {
  const productRows = products.map(p => `
    <tr style="border-bottom: 1px solid #e9ecef;">
      <td style="padding: 12px; color: #333;">${p.name}</td>
      <td style="padding: 12px; color: #666; font-family: monospace;">${p.sku}</td>
      <td style="padding: 12px; color: #dc3545; font-weight: bold;">${p.currentStock}</td>
      <td style="padding: 12px; color: #666;">${p.minStockLevel}</td>
    </tr>
  `).join('')

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
  })
}

export async function sendReportEmail(email: string, reportType: string, reportData: any) {
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
  })
}

export async function checkAndSendLowStockAlerts() {
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
    })

    if (lowStockProducts.length > 0) {
      const adminUsers = await db.user.findMany({
        where: {
          role: { in: ['ADMIN', 'MANAGER'] },
          isActive: true
        }
      })

      const products = lowStockProducts.map(sl => ({
        name: sl.product.name,
        sku: sl.product.sku,
        currentStock: sl.quantity,
        minStockLevel: sl.product.minStockLevel
      }))

      for (const user of adminUsers) {
        await sendLowStockAlert(user.email, products)
      }
    }
  } catch (error) {
    console.error('Failed to send low stock alerts:', error)
  }
}