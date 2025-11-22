-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Seed Categories
INSERT INTO "Category" (id, name, description, "isActive", "createdAt", "updatedAt") VALUES
('cat-001', 'Raw Materials', 'Raw materials and components', true, NOW(), NOW()),
('cat-002', 'Finished Goods', 'Finished products ready for sale', true, NOW(), NOW()),
('cat-003', 'Equipment', 'Tools and equipment', true, NOW(), NOW());

-- Seed Warehouses
INSERT INTO "Warehouse" (id, name, code, address, phone, email, "isActive", "createdAt", "updatedAt") VALUES
('wh-001', 'Main Warehouse', 'MW-001', '123 Industrial Ave, City, State', '555-0001', 'main@warehouse.com', true, NOW(), NOW()),
('wh-002', 'Distribution Center', 'DC-001', '456 Logistics Blvd, City, State', '555-0002', 'dist@warehouse.com', true, NOW(), NOW());

-- Seed Locations
INSERT INTO "Location" (id, "warehouseId", name, code, description, "isActive", "createdAt", "updatedAt") VALUES
('loc-001', 'wh-001', 'Rack A', 'A-01', 'Main storage rack', true, NOW(), NOW()),
('loc-002', 'wh-001', 'Rack B', 'A-02', 'Secondary storage rack', true, NOW(), NOW()),
('loc-003', 'wh-001', 'Receiving Area', 'REC-01', 'Receiving dock', true, NOW(), NOW()),
('loc-004', 'wh-002', 'Distribution Rack', 'D-01', 'Distribution center rack', true, NOW(), NOW());

-- Seed Products
INSERT INTO "Product" (id, name, sku, "categoryId", description, unit, "minStockLevel", "maxStockLevel", "reorderQty", "isActive", "createdAt", "updatedAt") VALUES
('prod-001', 'Steel Rods', 'SKU-STEEL-001', 'cat-001', 'High-quality steel rods', 'KG', 50, 500, 100, true, NOW(), NOW()),
('prod-002', 'Aluminum Sheet', 'SKU-ALUM-001', 'cat-001', 'Aluminum sheets', 'SHEET', 20, 200, 50, true, NOW(), NOW()),
('prod-003', 'Wooden Chairs', 'SKU-CHAIR-001', 'cat-002', 'Wooden office chairs', 'UNIT', 10, 100, 25, true, NOW(), NOW()),
('prod-004', 'Desk Lamp', 'SKU-LAMP-001', 'cat-002', 'LED desk lamp', 'UNIT', 5, 50, 15, true, NOW(), NOW());

-- Seed Stock Levels
INSERT INTO "StockLevel" (id, "warehouseId", "locationId", "productId", quantity, "reservedQuantity", "availableQuantity", "lastMovedAt", "createdAt", "updatedAt") VALUES
('sl-001', 'wh-001', 'loc-001', 'prod-001', 150, 0, 150, NOW(), NOW(), NOW()),
('sl-002', 'wh-001', 'loc-001', 'prod-002', 75, 0, 75, NOW(), NOW(), NOW()),
('sl-003', 'wh-001', 'loc-002', 'prod-003', 45, 0, 45, NOW(), NOW(), NOW()),
('sl-004', 'wh-001', 'loc-002', 'prod-004', 12, 0, 12, NOW(), NOW(), NOW()),
('sl-005', 'wh-002', 'loc-004', 'prod-003', 30, 0, 30, NOW(), NOW(), NOW());
