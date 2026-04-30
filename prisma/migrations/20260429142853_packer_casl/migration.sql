INSERT INTO "permissions" (
    "name",
    "action",
    "subject",
    "type"
) VALUES
('packer:read', 'read', 'Packer', 'can'),
('packer:create', 'create', 'Packer', 'can'),
('packer:update', 'update', 'Packer', 'can'),
('packer:delete', 'delete', 'Packer', 'can'),
('packer:manage', 'manage', 'Packer', 'can');