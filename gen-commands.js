/**
 * A script to automatically generate Synpress Commands (API) documentation from
 * types definition.
 */

// Match comments + type defs https://regex101.com/r/KkO2II/1
// Math comments only: https://regex101.com/r/CKPtWg/1

const fs = require('node:fs');

const TYPES_FILE = 'support/index.d.ts';
const OUTPUT_FILE = 'docs/synpress-commands.md';

// Entry point
main();
function main() {
  const code = fs.readFileSync(TYPES_FILE).toString('utf-8');

  const reBlocks = /\/\*\*[\s\S]*?>;/g;
  const reComment = /\/\*\*[\s\S]*?\/\n/g;

  const blocks = code.match(reBlocks);
  if (!blocks) throw new Error(`Unable to parse types`);

  const synpressCommands = blocks.map(block => {
    const commentMatchRes = block.match(reComment);
    if (!commentMatchRes) throw new Error('Missing or invalid comment');
    const fullComment = commentMatchRes[0];
    const firstLine = fullComment.split('\n')[1].trim().slice(2);
    const functionSignature = block.replace(fullComment, '').trim();
    const functionName = functionSignature.split('(')[0].trim();

    return {
      description: firstLine,
      commandSig: functionSignature,
      commandName: functionName,
    };
  });

  saveToFile(intoMarkdownString(synpressCommands));
}

function formatCommandSig(commandSig) {
  return commandSig
    .split('\n')
    .map(line => {
      if (!line.startsWith(' ')) return line;
      return line.replace(' '.repeat(4), '');
    })
    .join('\n');
}

function intoMarkdownString(commands) {
  return commands.reduce((acc, { commandName, commandSig, description }) => {
    return (
      acc +
      [
        `#### \`cy.${commandName}()\``,
        `${description}.`,
        ['```ts', formatCommandSig(commandSig), '```\n\n'].join('\n'),
      ].join('\n\n')
    );
  }, '# Synprss Commands\n\n');
}

function saveToFile(markdownStr) {
  if (!fs.existsSync(OUTPUT_FILE))
    throw new Error(`{${OUTPUT_FILE}} file not found`);

  fs.writeFileSync(OUTPUT_FILE, markdownStr);
}
