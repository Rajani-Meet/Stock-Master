# StockMaster - Inventory Management System

A comprehensive, modern inventory management system built with Next.js, TypeScript, and PostgreSQL. Designed for businesses to digitize and streamline all stock-related operations.

## Features

### Core Functionality
- **Product Management**: Create and manage products with SKU, categories, and stock levels
- **Warehouse Management**: Multi-warehouse support with location tracking
- **Stock Operations**: 
  - Receipts (incoming goods from vendors)
  - Delivery Orders (outgoing goods to customers)
  - Internal Transfers (between locations/warehouses)
  - Stock Adjustments (physical counts, damage, loss)
- **Real-time Inventory**: Live stock level tracking with reserved quantity management
- **Alerts & Notifications**: Low stock alerts, out-of-stock warnings
- **Role-Based Access Control**: Admin, Manager, and Warehouse Staff roles
- **Audit Logging**: Complete history of all inventory movements
- **Reports & Analytics**: Dashboard KPIs and stock movement summaries

### Advanced Features
- **Reorder Rules**: Automatic reorder point management
- **Stock Movement Ledger**: Transaction-safe operations with atomic updates
- **Multi-location Tracking**: Track inventory across warehouses and racks
- **OTP-based Password Reset**: Secure authentication
- **User Management**: Role-based access and permissions

## Technology Stack

- **Frontend**: Next.js 15+ (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with secure password hashing
- **API**: RESTful API routes

## Project Structure

\`\`\`
stockmaster/
├── app/
│   ├── api/
│   │   ├── auth/           # Authentication endpoints
│   │   ├── products/       # Product management
│   │   ├── warehouses/     # Warehouse management
│   │   ├── receipts/       # Receipt operations
│   │   ├── deliveries/     # Delivery operations
│   │   ├── stock-levels/   # Stock level endpoints
│   │   └── dashboard/      # Dashboard KPIs
│   ├── (authenticated)/    # Protected routes
│   │   ├── dashboard/      # Main dashboard
│   │   ├── products/       # Product pages
│   │   ├── receipts/       # Receipt pages
│   │   └── deliveries/     # Delivery pages
│   ├── login/              # Login page
│   └── layout.tsx          # Root layout
├── prisma/
│   └── schema.prisma       # Database schema
├── lib/
│   ├── auth.ts            # Auth utilities
│   ├── db.ts              # Prisma client
│   └── stock-engine.ts    # Stock movement engine
├── scripts/
│   └── seed.ts            # Database seeding
└── public/                # Static assets
\`\`\`

## Setup Instructions

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL database

### Environment Variables

Create a `.env.local` file:

\`\`\`env
DATABASE_URL="postgresql://user:password@localhost:5432/stockmaster"
NODE_ENV="development"
\`\`\`

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up the database:
   \`\`\`bash
   npx prisma migrate dev --name init
   \`\`\`

4. Seed the database:
   \`\`\`bash
   npx ts-node scripts/seed.ts
   \`\`\`

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

Visit `http://localhost:3000` to access the application.

## Demo Credentials

After seeding, you can log in with:

- **Admin**: admin@example.com / password123
- **Manager**: manager@example.com / password123
- **Staff**: staff@example.com / password123

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - List all products
- `POST /api/products` - Create new product

### Warehouses
- `GET /api/warehouses` - List all warehouses
- `POST /api/warehouses` - Create new warehouse

### Stock Levels
- `GET /api/stock-levels` - Get stock levels
- `POST /api/stock-levels` - Create stock level

### Receipts
- `GET /api/receipts` - List receipts
- `POST /api/receipts` - Create receipt
- `PUT /api/receipts` - Update receipt status

### Dashboard
- `GET /api/dashboard/kpis` - Get dashboard KPIs

## Stock Movement Engine

The system uses a transaction-safe stock movement engine that ensures atomic operations:

- All stock movements are logged in the `stock_moves` table
- Inventory levels are updated in real-time
- Reserved quantities are tracked separately
- All operations include comprehensive audit logs

## Database Schema

Key models:
- **User**: User accounts with role-based access
- **Product**: Product catalog with categories
- **Warehouse**: Physical warehouse locations
- **Location**: Specific racks/bins within warehouses
- **StockLevel**: Real-time inventory quantities
- **Receipt/DeliveryOrder/InternalTransfer/StockAdjustment**: Operational documents
- **StockMove**: Complete audit trail of inventory movements
- **AuditLog**: System-wide audit logging

## Security Features

- Bcrypt password hashing
- Secure session management with httpOnly cookies
- Role-based access control (RBAC)
- Transaction-safe database operations
- Input validation on all endpoints
- Audit logging for compliance

## Performance Optimizations

- Database indexing on frequently queried columns
- Pagination for list endpoints
- Efficient stock movement calculations
- Connection pooling with Prisma

## Future Enhancements

- Email notifications for alerts
- Barcode/QR code scanning
- Mobile app
- Advanced reporting and analytics
- Integration with accounting systems
- Batch operations
- Predictive reordering

## Support & Contribution

For issues, feature requests, or contributions, please open an issue or submit a pull request.

## License

MIT License - See LICENSE file for details
