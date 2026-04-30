INSERT INTO "permissions" (
    "name",
    "action",
    "subject",
    "type"
) VALUES
('delivery:read', 'read', 'Delivery', 'can'),
('delivery:create', 'create', 'Delivery', 'can'),
('delivery:update', 'update', 'Delivery', 'can'),
('delivery:delete', 'delete', 'Delivery', 'can'),
('delivery:manage', 'manage', 'Delivery', 'can');