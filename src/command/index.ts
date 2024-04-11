import enroll, { execute as executeEnroll } from 'command/enroll';
import streak, { execute as executeStreak } from 'command/streak';
import type { Command, CommandExecute } from 'command/types';

const commands = [enroll, streak];
const map = {
  [enroll.name]: executeEnroll,
  [streak.name]: executeStreak,
};

export const getCommandExecute = (commandName: string): CommandExecute | null => map[commandName] ?? null;

export const getCommands = (): Command[] => commands;
