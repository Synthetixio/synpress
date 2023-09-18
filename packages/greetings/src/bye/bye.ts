import chalk from 'chalk'

export function bye(name: string) {
  return `Bye ${chalk.red(name)}!`;
}
