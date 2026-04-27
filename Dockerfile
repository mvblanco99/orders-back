# Etapa 1: Dependencias y Build
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Generar el cliente de Prisma
RUN pnpm prisma generate

# Construir la aplicación
RUN pnpm run build

# Magia de pnpm: Eliminamos devDependencies pero conservamos Prisma y los symlinks intactos
RUN pnpm prune --prod

# Etapa 2: Producción
FROM node:20-alpine AS production

RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app

# Copiamos package.json por si algún script de runtime lo necesita
COPY package.json ./

# Copiar la carpeta dist desde el builder
COPY --from=builder /app/dist ./dist

# Copiar Prisma (para migraciones si es necesario)
COPY --from=builder /app/prisma ./prisma

# IMPORTANTE: Copiamos el node_modules COMPLETO (ya purgado por pnpm prune)
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE $PORT

# Ejecutamos Node directamente para un correcto manejo de señales
CMD ["node", "dist/main.js"]