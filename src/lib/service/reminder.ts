import { formatISO } from 'date-fns';
import { and, desc, eq, gt, isNull, lte } from 'drizzle-orm';
import db from 'lib/db';
import type Enrollment from 'lib/model/enrollment';
import * as schema from 'schema';

export const processReminders = async (
  start: Date,
  end: Date,
): Promise<Enrollment[]> =>
  db.transaction(async (tx) => {
    const reminders = await tx.select()
      .from(schema.reminders)
      .where(and(
        isNull(schema.reminders.startAt),
        gt(schema.reminders.remindAt, start.getTime()),
        lte(schema.reminders.remindAt, end.getTime()),
      ));

    console.debug(`Processing ${reminders.length} reminders`);

    const enrollments: Enrollment[] = [];
    for (const { id, guildId, userId, remindAt } of reminders) {
      const [enrollment] = await tx.select().from(schema.enrollments).where(
        and(
          eq(schema.enrollments.guildId, guildId),
          eq(schema.enrollments.userId, userId),
        ),
      );

      if (!enrollment) continue;

      const startAt = remindAt - (enrollment.intervalHours * 60 * 60 * 1000);
      const [share] = await tx.select().from(schema.shares).where(
        and(
          eq(schema.shares.guildId, guildId),
          eq(schema.shares.userId, userId),
          gt(schema.shares.createdAt, startAt),
          lte(schema.shares.createdAt, remindAt),
        ),
      ).orderBy(desc(schema.shares.createdAt)).limit(1);

      // Mark the reminder as fired by setting an interval for which the
      // reminder was active.
      await tx.update(schema.reminders).set({ startAt }).where(
        eq(schema.reminders.id, id),
      );

      // Schedule the next reminder.
      console.debug(`Scheduling reminder for ${guildId}/${userId} at ${formatISO(remindAt)}`);
      const nextRemindAt = remindAt + (enrollment.intervalHours * 60 * 60 * 1000);
      await tx.insert(schema.reminders).values([{
        guildId,
        userId,
        remindAt: nextRemindAt,
      }]);

      // Notify the user if they haven't shared an update.
      if (!share) {
        enrollments.push(enrollment);
      }
    }

    return enrollments;
  });
