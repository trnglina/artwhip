import { Events, Routes } from 'discord.js';
import client from 'lib/client';
import { fireReminder, getEnrollments, shouldFireReminder } from 'lib/service/enrollment';
import { setIntervalAsync } from 'set-interval-async';

client.once(Events.ClientReady, (client) => {
  console.info(`Ready in reminders worker as ${client.user.tag}!`);
});

await client.login(process.env['DISCORD_TOKEN']);

let previous = new Date();
setIntervalAsync(async () => {
  const enrollments = await getEnrollments();
  const now = new Date();
  console.debug(`processing enrollments at ${now.toISOString()}...`);

  for (const enrollment of enrollments) {
    if (!(await shouldFireReminder(enrollment, now, previous))) continue;
    await fireReminder(enrollment.guildId, enrollment.userId, now);
    await client.rest.post(Routes.channelMessages(enrollment.reminderChannelId), {
      body: {
        content: `<@${enrollment.userId}>, don't forget to post an update.`,
      },
    });
  }

  previous = now;
}, 10_000);
