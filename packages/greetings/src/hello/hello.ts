import chalk from 'chalk'

export function hello(name: string) {
  return `Hello ${chalk.green(name)}!`
}
