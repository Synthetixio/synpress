/**
 * A script to automatically generate Synpress Commands (API) documentation from
 * types definition.
 *
 * This script make the following assumption about the types file
 * 1. All comments are multiline.
 * 2. First line of the comment is where the description is located
 */

const fs = require('node:fs');
const TYPES_FILE = 'support/index.d.ts';
const OUTPUT_FILE = 'docs/synpress-commands.md';
/**
 * A regex to extract comment + function signature for every command.
 * Live Demo: https://regex101.com/r/KkO2II/1
 */
const BLOCKS_REGEX = /\/\*\*[\s\S]*?>;/g;
/**
 * A regex to extract the comment only.
 * Live Demo: https://regex101.com/r/CKPtWg/1
 */
const MULTILINE_COMMENT_REGEX = /\/\*\*[\s\S]*?\/\n/g;

// Entry point
main();
function main() {
  const types = loadTypes();
  const synpressCommands = parseTypes(types);
  const markdown = intoMarkdownString(synpressCommands);
  saveToFile(markdown);
}

// Remove unnecessary indentation.
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
  fs.writeFileSync(OUTPUT_FILE, markdownStr);
}

function loadTypes() {
  if (!fs.existsSync(TYPES_FILE))
    throw new Error(`{${TYPES_FILE}} file not found`);
  return fs.readFileSync(TYPES_FILE).toString('utf-8');
}

function parseTypes(code) {
  // Block = comment + function signature
  // Block Example
  // -------------------- Start --------------------
  // /**
  //    * Assert that element is within viewport
  //    * @example
  //    * cy.get('selector').isWithinViewport()
  //    * cy.get('selector').isWithinViewport(800, 600)
  //    */
  //  isWithinViewport(
  //   viewportWidth: number,
  //   viewportHeight: number,
  // ): Chainable<Subject>;
  // -------------------- End --------------------
  const blocks = code.match(BLOCKS_REGEX);
  if (!blocks) throw new Error(`Unable to parse types`);

  const synpressCommands = blocks.map(block => {
    // Extract the comment from the block
    const commentMatchRes = block.match(MULTILINE_COMMENT_REGEX);
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

  return synpressCommands;
}
