import type { ChatInputCommandInteraction, CommandInteractionOptionResolver, SlashCommandBuilder } from 'discord.js';

export type Command = Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
export type CommandOptions = Omit<CommandInteractionOptionResolver, 'getMessage' | 'getFocused'>;
export type CommandExecute = (interaction: ChatInputCommandInteraction, options: CommandOptions) => Promise<void>;
