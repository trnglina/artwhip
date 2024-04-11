import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getStreak } from 'lib/service/streak';

export const execute = async (interaction: ChatInputCommandInteraction): Promise<void> => {
  if (interaction.guildId === null) return;

  const streak = await getStreak(interaction.guildId, interaction.user.id);
  if (streak === null) {
    await interaction.reply('Looks like you\'re not enrolled yet. Use `/enroll` to start!');
    return;
  } else if (streak < 3) {
    await interaction.reply(
      `You're on a ${streak}-day streak. That's not very impressive, but it might be, if you keep it up!`,
    );
    return;
  } else {
    await interaction.reply(`You're on a ${streak}-day streak. Keep up the good work!`);
  }
};

export default new SlashCommandBuilder()
  .setName('streak')
  .setDescription('View your current streak.');
