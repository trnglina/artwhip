import { formatISO } from 'date-fns';
import { and, desc, eq, gt, gte, isNotNull, lte } from 'drizzle-orm';
import db from 'lib/db';
import { getEnrollment } from 'lib/service/enrollment';
import * as schema from 'schema';

export const getStreak = async (guildId: string, userId: string): Promise<number | null> => {
  const enrollment = await getEnrollment(guildId, userId);
  if (enrollment === null) return null;

  const now = new Date();
  const startingAt = new Date(enrollment.startingAt);
  console.debug(`Calculating streak for ${guildId}/${userId} from ${formatISO(startingAt)} to ${formatISO(now)}`);

  const reminders = await db.select()
    .from(schema.reminders)
    .where(and(
      eq(schema.reminders.guildId, guildId),
      eq(schema.reminders.userId, userId),
      gte(schema.reminders.remindAt, startingAt.getTime()),
      lte(schema.reminders.remindAt, now.getTime()),
      isNotNull(schema.reminders.startAt),
    ))
    .orderBy(desc(schema.reminders.remindAt));
  console.debug(`Found ${reminders.length} relevant reminders`);

  let streak = 0;
  for (const reminder of reminders) {
    if (reminder.startAt === null) break;
    const [share] = await db.select().from(schema.shares).where(
      and(
        eq(schema.shares.guildId, guildId),
        eq(schema.shares.userId, userId),
        gt(schema.shares.createdAt, reminder.startAt),
        lte(schema.shares.createdAt, reminder.remindAt),
      ),
    );
    if (!share) break;
    streak += 1;
  }

  return streak;
};
