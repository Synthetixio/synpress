import { gzip } from 'zlib';
import { promisify } from 'util';
import { Buffer } from 'buffer';

/**
 * @typedef {import('fs').promises['readFile']} PromisifiedFSReadFile
 */

/** @param {PromisifiedFSReadFile} readFile */
export const makeCompressFile = readFile => async filePath => {
  const fileContents = await readFile(filePath, 'utf8');
  const buffer = Buffer.from(fileContents, 'utf-8');
  const compressed = await promisify(gzip)(buffer);
  return compressed;
};
