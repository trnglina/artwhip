import enroll, { execute as executeEnroll } from 'command/enroll';
import type { Command, CommandExecute } from 'command/types';

const commands = [enroll];
const map = {
  [enroll.name]: executeEnroll,
};

export const getCommandExecute = (commandName: string): CommandExecute | null => map[commandName] ?? null;

export const getCommands = (): Command[] => commands;
