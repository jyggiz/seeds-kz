/**
 * Chunks an array into smaller arrays of the specified size.
 *
 * @param {Array} inputArray The input array to chunk.
 * @param {number} chunkSize The size of each chunk. Must be a positive integer.
 * @param {boolean} [includeSmallerChunks=true] Whether to include smaller chunks at the end of the array.
 * @returns {Array} An array of chunks.
 */
export const chunkArray = (
  array: Array<any>,
  chunkSize: number,
  includeSmallerChunks = true,
): Array<any> => {
  if (!Array.isArray(array)) {
    throw new Error('Input must be an array');
  }
  if (typeof chunkSize !== 'number' || chunkSize < 1) {
    throw new Error('Chunk size must be a positive integer');
  }

  const isChunkingFinished = includeSmallerChunks ? array.length === 0 : array.length < chunkSize;

  if (isChunkingFinished) {
    return [];
  }

  const arrayCopy = array.slice();
  const chunk = arrayCopy.splice(0, chunkSize);

  return [chunk, ...chunkArray(arrayCopy, chunkSize, includeSmallerChunks)];
};
