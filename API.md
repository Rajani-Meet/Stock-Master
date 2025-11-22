# StockMaster API Documentation

## Base URL
```
http://localhost:3000/api
```

## Authentication
All endpoints except `/auth/login` and `/auth/register` require a JWT token in the Authorization header:

```bash
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "securepassword",
  "role": "WAREHOUSE_STAFF"
}
```

**Success Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "cuid123",
    "email": "user@example.com",
    "name": "John Doe",
    "role": "WAREHOUSE_STAFF"
  }
}
```

### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cuid123",
    "email": "admin@example.com",
    "name": "Admin User",
    "role": "ADMIN"
  }
}
```

---

## Product Endpoints

### List Products
```http
GET /products?categoryId=cat123&skip=0&take=20
```

**Response (200):**
```json
{
  "products": [
    {
      "id": "prod123",
      "name": "Steel Rods",
      "sku": "SKU-STEEL-001",
      "categoryId": "cat123",
      "description": "High-quality steel rods",
      "unit": "KG",
      "minStockLevel": 50,
      "maxStockLevel": 500,
      "reorderQty": 100,
      "isActive": true,
      "category": {
        "id": "cat123",
        "name": "Raw Materials"
      }
    }
  ],
  "total": 45,
  "skip": 0,
  "take": 20
}
```

### Create Product
```http
POST /products
Content-Type: application/json

{
  "name": "Aluminum Sheet",
  "sku": "SKU-ALUM-001",
  "categoryId": "cat123",
  "unit": "SHEET",
  "minStockLevel": 20,
  "maxStockLevel": 200,
  "reorderQty": 50,
  "description": "High-quality aluminum sheets"
}
```

**Success Response (201):**
```json
{
  "id": "prod456",
  "name": "Aluminum Sheet",
  "sku": "SKU-ALUM-001",
  ...
}
```

---

## Warehouse Endpoints

### List Warehouses
```http
GET /warehouses
```

**Response (200):**
```json
{
  "warehouses": [
    {
      "id": "wh123",
      "name": "Main Warehouse",
      "code": "MW-001",
      "address": "123 Industrial Ave",
      "phone": "555-0001",
      "email": "main@warehouse.com",
      "isActive": true,
      "locations": [
        {
          "id": "loc123",
          "name": "Rack A",
          "code": "A-01",
          "description": "Main storage rack"
        }
      ]
    }
  ],
  "total": 2
}
```

### Create Warehouse
```http
POST /warehouses
Content-Type: application/json

{
  "name": "Distribution Center",
  "code": "DC-001",
  "address": "456 Logistics Blvd",
  "phone": "555-0002",
  "email": "dist@warehouse.com"
}
```

---

## Receipt Endpoints (Inbound)

### List Receipts
```http
GET /receipts?status=DRAFT&warehouseId=wh123&skip=0&take=20
```

**Status Options:** DRAFT, WAITING, VALIDATED, CANCELLED

### Create Receipt
```http
POST /receipts
Content-Type: application/json

{
  "supplierName": "Supplier Inc",
  "warehouseId": "wh123",
  "receivedDate": "2024-11-22T10:00:00Z",
  "notes": "Delivery notes",
  "items": [
    {
      "productId": "prod123",
      "quantity": 100,
      "unitPrice": 25.50
    }
  ]
}
```

### Validate Receipt
```http
PUT /receipts
Content-Type: application/json

{
  "receiptId": "rcp123",
  "status": "VALIDATED",
  "userId": "user123"
}
```

**Note:** When validated, stock movements are created automatically.

---

## Delivery Endpoints (Outbound)

### List Deliveries
```http
GET /deliveries?status=DRAFT&warehouseId=wh123
```

**Status Options:** DRAFT, READY, DONE, CANCELLED

### Create Delivery
```http
POST /deliveries
Content-Type: application/json

{
  "customerName": "Customer Corp",
  "warehouseId": "wh123",
  "deliveryDate": "2024-11-25T10:00:00Z",
  "notes": "Delivery notes",
  "items": [
    {
      "productId": "prod123",
      "quantity": 50
    }
  ]
}
```

### Complete Delivery
```http
PUT /deliveries
Content-Type: application/json

{
  "deliveryId": "del123",
  "status": "DONE",
  "userId": "user123"
}
```

---

## Transfer Endpoints (Internal)

### List Transfers
```http
GET /transfers?status=DRAFT
```

### Create Transfer
```http
POST /transfers
Content-Type: application/json

{
  "fromLocationId": "loc123",
  "toLocationId": "loc456",
  "transferDate": "2024-11-22T10:00:00Z",
  "items": [
    {
      "productId": "prod123",
      "quantity": 25
    }
  ]
}
```

### Complete Transfer
```http
PUT /transfers
Content-Type: application/json

{
  "transferId": "trf123",
  "status": "DONE",
  "userId": "user123"
}
```

---

## Adjustment Endpoints

### List Adjustments
```http
GET /adjustments?skip=0&take=20
```

### Create Adjustment
```http
POST /adjustments
Content-Type: application/json

{
  "type": "PHYSICAL_COUNT",
  "locationId": "loc123",
  "adjustmentDate": "2024-11-22T10:00:00Z",
  "reason": "Physical inventory count discrepancy",
  "userId": "user123",
  "items": [
    {
      "productId": "prod123",
      "currentQty": 100,
      "adjustedQty": 95
    }
  ]
}
```

**Adjustment Types:** PHYSICAL_COUNT, DAMAGE, LOSS, GAIN, EXPIRY

---

## Stock Level Endpoints

### Get Stock Levels
```http
GET /stock-levels?warehouseId=wh123&locationId=loc123&skip=0&take=20
```

**Response (200):**
```json
{
  "stockLevels": [
    {
      "id": "sl123",
      "warehouseId": "wh123",
      "locationId": "loc123",
      "productId": "prod123",
      "quantity": 150,
      "reservedQuantity": 20,
      "availableQuantity": 130,
      "lastMovedAt": "2024-11-22T10:00:00Z"
    }
  ],
  "total": 120
}
```

### Create Stock Level
```http
POST /stock-levels
Content-Type: application/json

{
  "warehouseId": "wh123",
  "locationId": "loc123",
  "productId": "prod123",
  "quantity": 100
}
```

---

## Alert Endpoints

### Get Unresolved Alerts
```http
GET /alerts?isResolved=false&skip=0&take=20
```

### Resolve Alert
```http
PATCH /alerts
Content-Type: application/json

{
  "alertId": "alert123"
}
```

---

## Dashboard KPI Endpoint

### Get Dashboard KPIs
```http
GET /dashboard/kpis?warehouseId=wh123
```

**Response (200):**
```json
{
  "totalProducts": 45,
  "lowStockItems": 8,
  "outOfStockItems": 2,
  "pendingReceipts": 5,
  "pendingDeliveries": 3,
  "scheduledTransfers": 2,
  "recentAlerts": [
    {
      "id": "alert123",
      "type": "LOW_STOCK",
      "severity": "WARNING",
      "message": "Low stock alert for Steel Rods",
      "isResolved": false
    }
  ],
  "stockMovementSummary": [
    {
      "moveType": "RECEIPT",
      "_count": 15
    }
  ]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "SKU already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently not implemented. Add in production using a middleware like `next-rate-limit`.

## CORS

Currently allows all origins in development. Configure in production via `next.config.js`.

---

**Last Updated:** November 2024
