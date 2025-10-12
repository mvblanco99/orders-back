import { PrismaClient } from '@prisma/client';
import { hash as hashSync } from 'argon2';

import { permissionData, permissionTo } from './data/permissions';
import { menuItems, profileMenuItems } from './data/menu-items';

const prisma = new PrismaClient();

async function main() {
  console.log(`Start seeding ...`);

  await prisma.permission.createMany({
    data: permissionData,
  });

  await prisma.profile.create({
    data: {
      name: 'Gerente de Sistemas',
      Permissions: {
        connect: [...permissionTo.all],
      },
    },
  });

  await prisma.profile.create({
    data: {
      name: 'Usuario',
      Permissions: {
        // Conectamos solo los permisos que un usuario estándar necesita.
        // En este caso, solo permisos de LECTURA para varias entidades.
        connect: [
          ...permissionTo.user.filter(p => p.name.includes('read')),
          ...permissionTo.profile.filter(p => p.name.includes('read')),
          ...permissionTo.dropDown.filter(p => p.name.includes('read')),
          ...permissionTo.menuItems.filter(p => p.name.includes('read')),
        ],
      },
    },
  });

  console.log(`Profiles seeding finished.`);

  await prisma.user.create({
    data: {
      email: process.env.LOGIN_EMAIL || 'default@admin.com',
      password: await hashSync(
        process.env.LOGIN_PASSWORD || 'defaultPassword1!',
      ),
      name: 'SysAdmin',
      slug:'gerente',
      profileId: 1
    },
  });

  console.log(`User seeding finished.`);

  await prisma.menuItems.createMany({
    data: menuItems,
  });

  console.log(`Menu items seeding finished.`);

  await prisma.profileMenuItems.createMany({
    data: profileMenuItems,
  });

  console.log(`Profile menu items seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
