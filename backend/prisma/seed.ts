import { PrismaClient, Role, RecordState } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const saltRounds = 10;

  // Credenciales de prueba oficiales del sistema
  const adminPasswordHash = await bcrypt.hash('Admin2026!', saltRounds);
  const userPasswordHash = await bcrypt.hash('Detective2026!', saltRounds);

  // 1. Administrador del sistema (Upsert idempotente)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@forense.test' },
    update: {
      name: 'Investigador Principal Admin',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      state: RecordState.ACTIVE,
    },
    create: {
      name: 'Investigador Principal Admin',
      email: 'admin@forense.test',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      state: RecordState.ACTIVE,
    },
  });

  // 2. Detective / Usuario regular del sistema (Upsert idempotente)
  const detective = await prisma.user.upsert({
    where: { email: 'detective@forense.test' },
    update: {
      name: 'Detective de Campo',
      passwordHash: userPasswordHash,
      role: Role.USER,
      state: RecordState.ACTIVE,
    },
    create: {
      name: 'Detective de Campo',
      email: 'detective@forense.test',
      passwordHash: userPasswordHash,
      role: Role.USER,
      state: RecordState.ACTIVE,
    },
  });

  process.stdout.write(
    `[SEED COMPLETADO]\nAdmin: ${admin.email} (Rol: ${admin.role})\nUser:  ${detective.email} (Rol: ${detective.role})\n`,
  );
}

main()
  .catch((e) => {
    process.stderr.write(`[SEED ERROR]: ${e instanceof Error ? e.message : String(e)}\n`);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
