import { z } from 'zod';

const FiredReminder = z.object({
  id: z.number(),
  guildId: z.string(),
  userId: z.string(),
  firedAt: z.date(),
});

type FiredReminder = z.infer<typeof FiredReminder>;

export default FiredReminder;
