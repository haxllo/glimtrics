import { PrismaClient } from "@prisma/client";

type PrismaGlobal = {
  prisma?: PrismaClient;
};

const globalForPrisma = globalThis as typeof globalThis & PrismaGlobal;

const getPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL env variable is not set");
  }

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });
  }

  return globalForPrisma.prisma;
};

const prismaProxy = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    if (prop === "then") {
      return undefined;
    }

    const client = getPrismaClient();
    const value = Reflect.get(client, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

export const prisma = prismaProxy;
export default prismaProxy;
