import { Prisma } from '@prisma/client';

// All
const all: Prisma.PermissionCreateManyInput[] = [
  {
    name: 'all:read',
    action: 'read',
    subject: 'all',
    type: 'can',
  },
  {
    name: 'all:create',
    action: 'create',
    subject: 'all',
    type: 'can',
  },
  {
    name: 'all:update',
    action: 'update',
    subject: 'all',
    type: 'can',
  },
  {
    name: 'all:delete',
    action: 'delete',
    subject: 'all',
    type: 'can',
  },
  {
    name: 'all:manage',
    action: 'manage',
    subject: 'all',
    type: 'can',
  },
];

// User
const user: Prisma.PermissionCreateManyInput[] = [
  {
    name: 'user:read',
    action: 'read',
    subject: 'User',
    type: 'can',
  },
  {
    name: 'user:create',
    action: 'create',
    subject: 'User',
    type: 'can',
  },
  {
    name: 'user:update',
    action: 'update',
    subject: 'User',
    type: 'can',
  },
  {
    name: 'user:delete',
    action: 'delete',
    subject: 'User',
    type: 'can',
  },
  {
    name: 'user:manage',
    action: 'manage',
    subject: 'User',
    type: 'can',
  },
];

// Profile
const profile: Prisma.PermissionCreateManyInput[] = [
  {
    name: 'profile:read',
    action: 'read',
    subject: 'Profile',
    type: 'can',
  },
  {
    name: 'profile:create',
    action: 'create',
    subject: 'Profile',
    type: 'can',
  },
  {
    name: 'profile:update',
    action: 'update',
    subject: 'Profile',
    type: 'can',
  },
  {
    name: 'profile:delete',
    action: 'delete',
    subject: 'Profile',
    type: 'can',
  },
  {
    name: 'profile:manage',
    action: 'manage',
    subject: 'Profile',
    type: 'can',
  },
];

// Permission
const permission: Prisma.PermissionCreateManyInput[] = [
  {
    name: 'permission:read',
    action: 'read',
    subject: 'Permission',
    type: 'can',
  },
  {
    name: 'permission:create',
    action: 'create',
    subject: 'Permission',
    type: 'can',
  },
  {
    name: 'permission:update',
    action: 'update',
    subject: 'Permission',
    type: 'can',
  },
  {
    name: 'permission:delete',
    action: 'delete',
    subject: 'Permission',
    type: 'can',
  },
  {
    name: 'permission:manage',
    action: 'manage',
    subject: 'Permission',
    type: 'can',
  },
];

// DropDown
const dropDown: Prisma.PermissionCreateManyInput[] = [
  {
    name: 'dropDown:read',
    action: 'read',
    subject: 'DropDown',
    type: 'can',
  },
  {
    name: 'dropDown:create',
    action: 'create',
    subject: 'DropDown',
    type: 'cannot',
  },
  {
    name: 'dropDown:update',
    action: 'update',
    subject: 'DropDown',
    type: 'cannot',
  },
  {
    name: 'dropDown:delete',
    action: 'delete',
    subject: 'DropDown',
    type: 'cannot',
  },
  {
    name: 'dropDown:manage',
    action: 'manage',
    subject: 'DropDown',
    type: 'cannot',
  },
];

// MenuItem
const menuItems: Prisma.PermissionCreateManyInput[] = [
  {
    name: 'menuItems:read',
    action: 'read',
    subject: 'MenuItems',
    type: 'can',
  },
  {
    name: 'menuItems:create',
    action: 'create',
    subject: 'MenuItems',
    type: 'cannot',
  },
  {
    name: 'menuItems:update',
    action: 'update',
    subject: 'MenuItems',
    type: 'cannot',
  },
  {
    name: 'menuItems:delete',
    action: 'delete',
    subject: 'MenuItems',
    type: 'cannot',
  },
  {
    name: 'menuItems:manage',
    action: 'manage',
    subject: 'MenuItems',
    type: 'cannot',
  },
];

export const permissionTo = {
  all: all.slice(0, -1).map((p) => ({ name: p.name })),
  permission: permission.slice(0, -1).map((p) => ({ name: p.name })),
  profile: profile.slice(0, -1).map((p) => ({ name: p.name })),
  user: user.slice(0, -1).map((p) => ({ name: p.name })),
  dropDown: dropDown.slice(0, -1).map((p) => ({ name: p.name })),
  menuItems: menuItems.slice(0, -1).map((p) => ({ name: p.name })),
};

export const permissionData = [
  ...all,
  ...user,
  ...profile,
  ...permission,
  ...dropDown,
  ...menuItems,
];
