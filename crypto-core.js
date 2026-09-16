/* Cloud247 Password Generator v1.0.2. No network, storage or Math.random. */
(function (root) {
  'use strict';
  const VERSION = '1.0.2';
  const CHARSETS = Object.freeze({
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    lower: 'abcdefghijklmnopqrstuvwxyz',
    digits: '0123456789',
    symbols: '!@#$%^&*()-_=+[]{};:,.?/~'
  });
  const AMBIGUOUS = 'Il1O0o|';
  class GeneratorError extends Error {
    constructor(code) { super(code); this.name = 'GeneratorError'; this.code = code; }
  }
  function integer(value, min, max, code) {
    if (!Number.isSafeInteger(value) || value < min || value > max) throw new GeneratorError(code);
    return value;
  }
  // Rejection sampling discards the incomplete upper interval: no modulo bias.
  // A fresh pool belongs to one batch only. Its remaining contents are wiped.
  class SecureRandom {
    constructor(provider = root.crypto) {
      if (!provider || typeof provider.getRandomValues !== 'function') throw new GeneratorError('cryptoUnavailable');
      this.provider = provider;
      this.pool = new Uint32Array(256);
      this.offset = this.pool.length;
    }
    next() {
      if (this.offset >= this.pool.length) {
        this.provider.getRandomValues(this.pool);
        this.offset = 0;
      }
      const value = this.pool[this.offset];
      this.pool[this.offset++] = 0;
      return value;
    }
    int(size) {
      integer(size, 1, 4294967296, 'invalidRange');
      const limit = Math.floor(4294967296 / size) * size;
      for (let attempts = 0; attempts < 10000; attempts++) {
        const value = this.next();
        if (value < limit) return value % size;
      }
      throw new GeneratorError('randomFailure');
    }
    destroy() { this.pool.fill(0); this.offset = this.pool.length; }
  }
  function getGroups(options) {
    const excluded = new Set(options.excludeAmbiguous ? AMBIGUOUS : '');
    const groups = Object.keys(CHARSETS)
      .filter(key => options[key] === true)
      .map(key => [...CHARSETS[key]].filter(char => !excluded.has(char)).join(''));
    if (!groups.length) throw new GeneratorError('noCharacters');
    return groups;
  }
  // Exact size of the valid sample space using inclusion-exclusion.
  // All groups are disjoint; each enabled group must appear at least once.
  function validPasswordCount(length, groups) {
    let total = 0n;
    for (let mask = 0; mask < (1 << groups.length); mask++) {
      let alphabetSize = 0;
      let missingGroups = 0;
      for (let i = 0; i < groups.length; i++) {
        if (mask & (1 << i)) missingGroups++;
        else alphabetSize += groups[i].length;
      }
      const term = BigInt(alphabetSize) ** BigInt(length);
      total += missingGroups % 2 ? -term : term;
    }
    return total;
  }
  function log2BigInt(value) {
    if (value < 1n) throw new GeneratorError('invalidRange');
    const binary = value.toString(2);
    const significant = binary.slice(0, 53);
    return Math.log2(parseInt(significant, 2)) + binary.length - significant.length;
  }
  function generatePassword(options, random) {
    const length = integer(options.length, 8, 128, 'passwordLength');
    const groups = getGroups(options);
    const alphabet = groups.join('');
    // Draw uniform complete strings and reject ones missing a selected group.
    // Unlike force-inserting characters and shuffling, this is uniform over
    // every valid password. Never fall back to a weaker algorithm.
    for (let attempt = 0; attempt < 10000; attempt++) {
      let value = '';
      for (let i = 0; i < length; i++) value += alphabet[random.int(alphabet.length)];
      if (groups.every(group => [...value].some(char => group.includes(char)))) {
        return { value, bits: log2BigInt(validPasswordCount(length, groups)), mode: 'password' };
      }
    }
    throw new GeneratorError('randomFailure');
  }
  function validateWords(words) {
    if (!Array.isArray(words) || words.length < 256 || new Set(words).size !== words.length ||
        words.some(word => typeof word !== 'string' || !/^[a-z]{3,12}$/.test(word))) {
      throw new GeneratorError('wordlistUnavailable');
    }
  }
  function generatePhrase(options, random, words) {
    const count = integer(options.words, 6, 12, 'phraseLength');
    if (!['-', '.', ' '].includes(options.separator)) throw new GeneratorError('invalidSeparator');
    validateWords(words);
    // With replacement. Repeated words are valid and are not filtered out.
    const chosen = [];
    for (let i = 0; i < count; i++) {
      const word = words[random.int(words.length)];
      chosen.push(options.capitalize ? word[0].toUpperCase() + word.slice(1) : word);
    }
    if (options.addNumber) chosen.push(String(random.int(100)).padStart(2, '0'));
    return {
      value: chosen.join(options.separator),
      bits: count * Math.log2(words.length) + (options.addNumber ? Math.log2(100) : 0),
      mode: 'phrase'
    };
  }
  function generatePin(options, random) {
    const length = integer(options.length, 4, 12, 'pinLength');
    let value = '';
    for (let i = 0; i < length; i++) value += String(random.int(10));
    return { value, bits: length * Math.log2(10), mode: 'pin' };
  }
  function generateBatch(options, count = 1, words = root.Cloud247Words, provider = root.crypto) {
    integer(count, 1, 50, 'batchCount');
    if (!options || !['password', 'phrase', 'pin'].includes(options.mode)) throw new GeneratorError('invalidMode');
    const random = new SecureRandom(provider);
    try {
      const results = [];
      for (let i = 0; i < count; i++) {
        results.push(options.mode === 'password' ? generatePassword(options, random)
          : options.mode === 'phrase' ? generatePhrase(options, random, words)
          : generatePin(options, random));
      }
      return results;
    } finally { random.destroy(); }
  }
  const api = Object.freeze({ VERSION, CHARSETS, AMBIGUOUS, GeneratorError, SecureRandom,
    getGroups, validPasswordCount, log2BigInt, generateBatch, validateWords });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PasswordCore = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
