import { format, formatISO, parseISO } from 'date-fns';
import { and, desc, eq } from 'drizzle-orm';
import db from 'lib/db';
import { makeCanonicalTime, parseCanonicalTime } from 'lib/model/canonical-time';
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
  reminderChannelId: string,
  time: string | null,
): Promise<string> => {
  const now = new Date();
  const deadline = makeCanonicalTime(time, now);
  console.info(`Enrolling ${userId} in ${guildId} with deadline at ${deadline}`);

  await db.insert(schema.enrollments).values([{
    guildId,
    userId,
    reminderChannelId,
    deadline,
  }]).onConflictDoUpdate({
    target: [schema.enrollments.guildId, schema.enrollments.userId],
    set: { reminderChannelId, deadline },
  });

  return format(parseCanonicalTime(deadline, now), 'HH:mm');
};

export const shouldFireReminder = async (
  enrollment: Enrollment,
  reference: Date,
  previous: Date | null = null,
  offsetMs: number = 0,
): Promise<boolean> => {
  if (!previous) return true;

  const [lastFiredReminder] = await db.select().from(schema.firedReminders)
    .where(and(
      eq(schema.firedReminders.guildId, enrollment.guildId),
      eq(schema.firedReminders.userId, enrollment.userId),
    ))
    .orderBy(desc(schema.firedReminders.firedAt)).limit(1);

  const [lastShare] = await db.select().from(schema.shares)
    .where(and(
      eq(schema.shares.guildId, enrollment.guildId),
      eq(schema.shares.userId, enrollment.userId),
    ))
    .orderBy(desc(schema.shares.createdAt)).limit(1);

  const now = reference.getTime();
  const start = previous.getTime();

  const lastFiredAt = lastFiredReminder ? parseISO(lastFiredReminder.firedAt).getTime() : null;
  const lastShareAt = lastShare ? parseISO(lastShare.createdAt).getTime() : null;

  const shouldFireAt = parseCanonicalTime(enrollment.deadline, reference).getTime() + offsetMs;

  const shouldFireAtInWindow = shouldFireAt > start && shouldFireAt <= now;
  const lastFiredAtInWindow = lastFiredAt !== null ? lastFiredAt > start && lastFiredAt <= now : false;

  const alreadyShared = lastShareAt !== null && lastShareAt > shouldFireAt - (24 * 60 * 60 * 1000) &&
    lastShareAt <= now;

  return !lastFiredAtInWindow && !alreadyShared && shouldFireAtInWindow;
};

export const fireReminder = async (guildId: string, userId: string, reference: Date): Promise<void> => {
  console.info(`firing reminder for ${userId} in ${guildId} at ${formatISO(reference)}`);

  await db.insert(schema.firedReminders).values([{
    guildId,
    userId,
    firedAt: formatISO(reference),
  }]);
};
