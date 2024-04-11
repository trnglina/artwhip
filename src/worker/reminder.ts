import { formatISO } from 'date-fns';
import { Events, Routes } from 'discord.js';
import client from 'lib/client';
import { processReminders } from 'lib/service/reminder';
import { setIntervalAsync } from 'set-interval-async';

client.once(Events.ClientReady, (client) => {
  console.info(`Ready in reminders worker as ${client.user.tag}!`);
});

await client.login(process.env['DISCORD_TOKEN']);

let previous = new Date();
setIntervalAsync(async () => {
  const now = new Date();
  console.debug(`Processing reminders between ${formatISO(previous)} and ${formatISO(now)}`);

  const enrollments = await processReminders(previous, now);
  for (const enrollment of enrollments) {
    await client.rest.post(Routes.channelMessages(enrollment.channelId), {
      body: {
        content: `<@${enrollment.userId}>, don't forget to post an update.`,
      },
    });
  }

  previous = now;
}, 30 * 1000);
