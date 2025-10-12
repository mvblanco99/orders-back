import { Prisma } from '@prisma/client';

export const menuItems: Prisma.MenuItemsCreateManyInput[] = [
  {
    title: 'Configuraciones',
    caption: 'Gestión de configuraciones',
    order: 99,
    icon: 'sym_r_settings',
    type: 'dropdown',
  },
  {
    title: 'Perfiles',
    order: 1,
    link: 'settings/profiles',
    caption: 'Gestión de perfiles',
    type: 'link',
    parentId: 1,
  },
  {
    title: 'Menus',
    caption: 'Gestión de menus',
    order: 2,
    link: 'settings/menus',
    type: 'link',
    parentId: 1,
  },
  {
    title: 'Usuarios',
    caption: 'Gestión de usuarios',
    order: 3,
    link: 'settings/users',
    type: 'link',
    parentId: 1,
  },
];

export const profileMenuItems: Prisma.ProfileMenuItemsCreateManyInput[] = [
  {
    menuItemId: 1,
    profileId: 1,
  },
  {
    menuItemId: 2,
    profileId: 1,
  },
  {
    menuItemId: 3,
    profileId: 1,
  },
  {
    menuItemId: 4,
    profileId: 1,
  },
];
