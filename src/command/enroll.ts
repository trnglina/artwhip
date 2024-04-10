import type { CommandOptions } from 'command/types';
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createEnrollment } from 'lib/service/enrollment';

export const execute = async (interaction: ChatInputCommandInteraction, options: CommandOptions): Promise<void> => {
  if (interaction.guildId === null) return;

  const deadline = options.getString('deadline');
  const deadlineAt = await createEnrollment(interaction.guildId, interaction.user.id, interaction.channelId, deadline);

  await interaction.reply(`You've set your deadline for posting an update at ${deadlineAt} each day. Good luck!`);
};

export default new SlashCommandBuilder()
  .setName('enroll')
  .setDescription('Enroll in the art challenge!')
  .addStringOption((option) =>
    option.setName('deadline').setDescription('The time that serves as your daily deadline for the challenge.')
  );
