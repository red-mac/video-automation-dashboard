import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Helper functions for common queries
export async function getActiveSources() {
  return prisma.source.findMany({
    where: { isActive: true },
    include: { ideas: { take: 5, orderBy: { createdAt: 'desc' } } },
  });
}

export async function getPendingIdeas() {
  return prisma.idea.findMany({
    where: { status: 'pending' },
    include: { source: true },
    orderBy: { aiScore: 'desc' },
  });
}

export async function getProjectWithAssets(id: string) {
  return prisma.project.findUnique({
    where: { id },
    include: {
      idea: { include: { source: true } },
      script: { include: { segments: { include: { asset: true } } } },
      assets: true,
      renders: { orderBy: { createdAt: 'desc' } },
    },
  });
}

export async function getProjectsByStatus(status: string) {
  return prisma.project.findMany({
    where: { status },
    include: { idea: true },
    orderBy: { updatedAt: 'desc' },
  });
}