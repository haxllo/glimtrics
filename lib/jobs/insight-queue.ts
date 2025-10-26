import {
  Queue,
  Worker,
  JobsOptions,
  Job,
  QueueEvents,
} from "bullmq";
import { Prisma } from "@prisma/client";
import { getRedisConnection } from "@/lib/redis";
import { prisma } from "@/lib/prisma";
import { analyzeData } from "@/lib/analytics";
import { generateDatasetInsights } from "@/lib/openai";
import { DashboardData } from "@/types/dashboard";

const baseConnection = getRedisConnection();
const connection = baseConnection.duplicate();
const QUEUE_NAME = "insight-generation";

declare global {
  // eslint-disable-next-line no-var
  var __glimtrics_insight_queue__: Queue<InsightJobData> | undefined;
  // eslint-disable-next-line no-var
  var __glimtrics_insight_worker__: Worker<InsightJobData, InsightJobResult> | undefined;
  // eslint-disable-next-line no-var
  var __glimtrics_insight_events__: QueueEvents | undefined;
}

export type InsightJobData = {
  dashboardId: string;
  userId: string;
};

export type InsightJobResult = {
  insights: {
    id: string;
    type: string;
    title: string;
    description: string;
    data: unknown;
    createdAt: Date;
  }[];
};

function ensureQueueEvents(): QueueEvents {
  if (!global.__glimtrics_insight_events__) {
    global.__glimtrics_insight_events__ = new QueueEvents(QUEUE_NAME, {
      connection,
    });

    global.__glimtrics_insight_events__.on("failed", ({ jobId, failedReason }) => {
      console.error("[InsightQueue] Job failed event", jobId, failedReason);
    });

    global.__glimtrics_insight_events__.on("completed", ({ jobId }) => {
      console.log("[InsightQueue] Job completed event", jobId);
    });
  }

  return global.__glimtrics_insight_events__;
}

function ensureWorker(): Worker<InsightJobData, InsightJobResult> {
  if (!global.__glimtrics_insight_worker__) {
    global.__glimtrics_insight_worker__ = new Worker<InsightJobData, InsightJobResult>(
      QUEUE_NAME,
      async (job) => {
        job.updateProgress(5);

        const dashboard = await prisma.dashboard.findUnique({
          where: { id: job.data.dashboardId },
        });

        if (!dashboard || dashboard.userId !== job.data.userId) {
          throw new Error("Dashboard not found or access denied");
        }

        if (!dashboard.data) {
          throw new Error("Dashboard has no data to analyze");
        }

        job.updateProgress(15);
        await prisma.insight.deleteMany({
          where: { dashboardId: job.data.dashboardId },
        });

        job.updateProgress(25);
        const data = dashboard.data as unknown as DashboardData;
        const analytics = analyzeData(data);

        job.updateProgress(55);
        const aiInsights = await generateDatasetInsights(
          dashboard.name,
          analytics.summary,
          analytics.statistics,
          data.rows,
        );

        job.updateProgress(80);
        const savedInsights = await Promise.all(
          aiInsights.map((insight) =>
            prisma.insight.create({
              data: {
                dashboardId: job.data.dashboardId,
                type: insight.type,
                title: insight.title,
                description: insight.description,
                data: (insight.data ?? {}) as Prisma.InputJsonValue,
              },
            }),
          ),
        );

        job.updateProgress(100);
        return {
          insights: savedInsights.map((insight) => ({
            id: insight.id,
            type: insight.type,
            title: insight.title,
            description: insight.description,
            data: insight.data,
            createdAt: insight.createdAt,
          })),
        };
      },
      {
        connection,
        concurrency: Number(process.env.INSIGHT_JOB_CONCURRENCY ?? "3"),
      },
    );

    global.__glimtrics_insight_worker__.on("failed", (job, err) => {
      console.error("[InsightQueue] Job failed", job?.id, err);
    });

    global.__glimtrics_insight_worker__.on("completed", (job) => {
      console.log("[InsightQueue] Job completed", job.id);
    });
  }

  return global.__glimtrics_insight_worker__;
}

function getQueue(): Queue<InsightJobData> {
  if (!global.__glimtrics_insight_queue__) {
    global.__glimtrics_insight_queue__ = new Queue<InsightJobData>(QUEUE_NAME, {
      connection,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    });
  }

  return global.__glimtrics_insight_queue__;
}

export async function enqueueInsightGeneration(
  data: InsightJobData,
  options?: JobsOptions,
): Promise<Job<InsightJobData, InsightJobResult>> {
  ensureQueueEvents();
  ensureWorker();
  const queue = getQueue();
  return queue.add("generate", data, options);
}

export function getInsightQueueEvents(): QueueEvents {
  return ensureQueueEvents();
}

export { connection as insightQueueConnection, getQueue as getInsightQueue };
