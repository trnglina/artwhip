import { getCommandExecute, getCommands } from 'command';
import { Events, Routes } from 'discord.js';
import client from 'lib/client';
import { getEnrollment } from 'lib/service/enrollment';
import { createShare } from 'lib/service/share';

new Worker(new URL('worker/reminder.ts', import.meta.url).href, { ref: false });

client.once(Events.ClientReady, async (client) => {
  console.info(`Ready as ${client.user.tag}!`);

  console.debug(`Updating commands for application ${client.application.id}...`);
  await client.rest.put(Routes.applicationCommands(client.application.id), { body: getCommands() });
  console.debug('Commands updated.');
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const execute = getCommandExecute(interaction.commandName);
  if (!execute) return;

  try {
    await execute(interaction, interaction.options);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: 'An error was encountered while executing this command.',
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: 'An error was encountered while executing this command.',
        ephemeral: true,
      });
    }
  }
});

client.on(Events.MessageCreate, async (message) => {
  if (!message.guild || !message.content.includes('+log')) return;

  const enrollment = await getEnrollment(message.guild.id, message.author.id);
  if (!enrollment) return;

  await createShare(enrollment);
  await message.react('🎨');
});

await client.login(process.env['DISCORD_TOKEN']);
