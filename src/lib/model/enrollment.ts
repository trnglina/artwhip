import { z } from 'zod';

const Enrollment = z.object({
  guildId: z.string(),
  userId: z.string(),
  channelId: z.string(),
  startingAt: z.number(),
  intervalHours: z.number(),
});

type Enrollment = z.infer<typeof Enrollment>;

export default Enrollment;
