import db from 'lib/db';
import type Enrollment from 'lib/model/enrollment';
import * as schema from 'schema';

export const createShare = async (enrollment: Enrollment): Promise<void> => {
  await db.insert(schema.shares).values([{
    guildId: enrollment.guildId,
    userId: enrollment.userId,
    createdAt: new Date().getTime(),
  }]);
};
