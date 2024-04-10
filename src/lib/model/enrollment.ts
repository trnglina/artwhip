import { z } from 'zod';

const Enrollment = z.object({
  guildId: z.string(),
  userId: z.string(),
  reminderChannelId: z.string(),
  deadline: z.string(),
});

type Enrollment = z.infer<typeof Enrollment>;

export default Enrollment;
