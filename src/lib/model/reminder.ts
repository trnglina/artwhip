import { z } from 'zod';

const Reminder = z.object({
  id: z.number(),
  guildId: z.string(),
  userId: z.string(),
  remindAt: z.number(),
  fired: z.number(),
});

type Reminder = z.infer<typeof Reminder>;

export default Reminder;
