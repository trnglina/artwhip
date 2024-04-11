import type { CommandOptions } from 'command/types';
import { format } from 'date-fns';
import { type ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { createEnrollment } from 'lib/service/enrollment';

export const execute = async (interaction: ChatInputCommandInteraction, options: CommandOptions): Promise<void> => {
  if (interaction.guildId === null) return;

  const maybeStart = options.getString('start');
  const maybeInterval = options.getNumber('interval');

  const [start, interval] = await createEnrollment(
    interaction.guildId,
    interaction.user.id,
    interaction.channelId,
    maybeStart,
    maybeInterval,
  );

  await interaction.reply(
    `Great! Your first deadline will be at ${
      format(start, 'HH:mm')
    }, and then every ${interval} hour(s) after that. Good luck!`,
  );
};

export default new SlashCommandBuilder()
  .setName('enroll')
  .setDescription('Enroll in the art challenge!')
  .addStringOption((option) =>
    option
      .setName('start')
      .setDescription('At what time should the challenge start? (e.g. 3pm, or in two hours) (default: now)')
  )
  .addNumberOption((option) =>
    option
      .setName('interval')
      .setDescription('How many hours between challenges? (default: 24)')
  );
