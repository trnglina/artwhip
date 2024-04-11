import * as chrono from 'chrono-node';
import { add, formatISO } from 'date-fns';
import { and, eq, isNull } from 'drizzle-orm';
import db from 'lib/db';
import type Enrollment from 'lib/model/enrollment';
import * as schema from 'schema';

export const getEnrollments = async (): Promise<Enrollment[]> => {
  return await db.select().from(schema.enrollments);
};

export const getEnrollment = async (guildId: string, userId: string): Promise<Enrollment | null> => {
  const [row] = await db.select().from(schema.enrollments)
    .where(and(
      eq(schema.enrollments.guildId, guildId),
      eq(schema.enrollments.userId, userId),
    ));

  return row ?? null;
};

export const createEnrollment = async (
  guildId: string,
  userId: string,
  channelId: string,
  maybeStartingTime: string | null,
  maybeIntervalHours: number | null,
): Promise<[Date, number]> => {
  const now = new Date();
  const intervalHours = maybeIntervalHours ?? 24;

  const startingAt = (() => {
    const fallback = add(now, { hours: intervalHours });
    if (maybeStartingTime === null) return fallback;
    const parsed = chrono.parseDate(maybeStartingTime, now);
    if (parsed === null) return fallback;
    if (parsed.getTime() < now.getTime()) return fallback;
    return parsed;
  })();

  console.info(`Enrolling ${guildId}/${userId} from ${formatISO(startingAt)} every ${intervalHours} hour(s)`);

  await db.transaction(async (tx) => {
    await tx.insert(schema.enrollments).values([{
      guildId,
      userId,
      channelId,
      startingAt: startingAt.getTime(),
      intervalHours,
    }]).onConflictDoUpdate({
      target: [schema.enrollments.guildId, schema.enrollments.userId],
      set: { channelId, startingAt: startingAt.getTime(), intervalHours },
    });

    // Remove all existing unfired reminders for the current enrollment.
    await tx.delete(schema.reminders).where(and(
      eq(schema.reminders.guildId, guildId),
      eq(schema.reminders.userId, userId),
      isNull(schema.reminders.startAt),
    ));

    // Schedule reminder for the current enrollment.
    console.debug(`Scheduling reminder for ${guildId}/${userId} at ${formatISO(startingAt)}`);
    const remindAt = startingAt.getTime();
    await tx.insert(schema.reminders).values([{
      guildId,
      userId,
      remindAt,
    }]);
  });

  return [startingAt, intervalHours];
};
