'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { webcrypto } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const core = require('../crypto-core.js');
const words = require('../assets/words.js');
const standard = { mode: 'password', length: 20, upper: true, lower: true, digits: true, symbols: true, excludeAmbiguous: true };
const make = (options = standard, count = 1, rng = webcrypto) => core.generateBatch(options, count, words, rng);
const hasCode = code => error => error instanceof core.GeneratorError && error.code === code;

test('default output has requested length and all selected categories', () => {
  for (const result of make(standard, 50)) {
    assert.equal(result.value.length, 20);
    for (const group of core.getGroups(standard)) assert.ok([...result.value].some(char => group.includes(char)));
    assert.ok([...result.value].every(char => !core.AMBIGUOUS.includes(char)));
    assert.ok(result.bits > 120);
  }
});
test('all 15 nonempty character combinations work at minimum and maximum length', () => {
  const keys = Object.keys(core.CHARSETS);
  for (let mask = 1; mask < 16; mask++) {
    for (const length of [8, 128]) {
      for (const excludeAmbiguous of [false, true]) {
        const options = { mode: 'password', length, excludeAmbiguous };
        keys.forEach((key, index) => { options[key] = Boolean(mask & (1 << index)); });
        const groups = core.getGroups(options);
        for (const result of make(options, 5)) {
          assert.equal(result.value.length, length);
          assert.ok([...result.value].every(char => groups.join('').includes(char)));
          assert.ok(groups.every(group => [...result.value].some(char => group.includes(char))));
          assert.ok(Number.isFinite(result.bits));
        }
      }
    }
  }
});
test('empty character selection fails closed', () => {
  assert.throws(() => make({ mode: 'password', length: 20 }), hasCode('noCharacters'));
});
test('invalid lengths are rejected rather than silently adjusted', () => {
  for (const length of [0, 7, 129, 20.5, NaN, Infinity, '20']) {
    assert.throws(() => make({ ...standard, length }), hasCode('passwordLength'));
  }
  for (const length of [3, 13, 4.1]) assert.throws(() => make({ mode: 'pin', length }), hasCode('pinLength'));
});
test('batch limits, modes and separators are validated', () => {
  for (const count of [0, 51, 1.5, NaN]) assert.throws(() => make(standard, count), hasCode('batchCount'));
  assert.throws(() => make({ mode: 'unknown' }), hasCode('invalidMode'));
  assert.throws(() => make({ mode: 'phrase', words: 10, separator: '' }), hasCode('invalidSeparator'));
});
test('rejection sampling discards an incomplete upper interval', () => {
  const rng = new core.SecureRandom({ getRandomValues(array) { array.fill(0); array[0] = 4294967295; array[1] = 17; return array; } });
  assert.equal(rng.int(10), 7);
  assert.equal(rng.offset, 2);
  assert.equal(rng.pool[0], 0);
  assert.equal(rng.pool[1], 0);
  rng.destroy();
  assert.ok(rng.pool.every(value => value === 0));
});
test('RNG supports singleton and full uint32 bounds', () => {
  const rng = new core.SecureRandom({ getRandomValues(array) { array.fill(4294967295); return array; } });
  assert.equal(rng.int(1), 0);
  assert.equal(rng.int(4294967296), 4294967295);
  assert.throws(() => rng.int(0), hasCode('invalidRange'));
  assert.throws(() => rng.int(4294967297), hasCode('invalidRange'));
  rng.destroy();
});
test('a broken RNG fails instead of returning biased output', () => {
  const rng = new core.SecureRandom({ getRandomValues(array) { array.fill(4294967295); return array; } });
  assert.throws(() => rng.int(10), hasCode('randomFailure'));
  rng.destroy();
  assert.throws(() => make(standard, 1, { getRandomValues(array) { array.fill(0); return array; } }), hasCode('randomFailure'));
});
test('absence of Web Crypto fails closed', () => {
  assert.throws(() => make(standard, 1, null), hasCode('cryptoUnavailable'));
  assert.throws(() => new core.SecureRandom({}), hasCode('cryptoUnavailable'));
});
test('valid sample-space count agrees with exhaustive enumeration', () => {
  const groups = ['ab', '1', '!'];
  for (let length = 1; length <= 5; length++) {
    let valid = 0n;
    function enumerate(prefix) {
      if (prefix.length === length) { if (groups.every(group => [...prefix].some(char => group.includes(char)))) valid++; return; }
      for (const char of groups.join('')) enumerate(prefix + char);
    }
    enumerate('');
    assert.equal(core.validPasswordCount(length, groups), valid);
  }
  assert.equal(core.validPasswordCount(4, ['ab', '1']), 64n);
});
test('large-integer entropy is stable and accounts for composition constraints', () => {
  assert.equal(core.log2BigInt(1n << 1024n), 1024);
  assert.equal(core.log2BigInt(1n), 0);
  assert.ok(Math.abs(core.log2BigInt(10n ** 128n) - 128 * Math.log2(10)) < 1e-10);
  const groups = core.getGroups(standard);
  assert.ok(core.log2BigInt(core.validPasswordCount(8, groups)) < 8 * Math.log2(groups.join('').length));
});
test('bundled list has 512 unique lowercase English words', () => {
  assert.equal(words.length, 512);
  core.validateWords(words);
  assert.throws(() => core.validateWords([...words.slice(1), words[1]]), hasCode('wordlistUnavailable'));
  assert.throws(() => core.validateWords(undefined), hasCode('wordlistUnavailable'));
});
test('passphrases are built from the list with correct entropy for every separator', () => {
  for (const separator of ['-', '.', ' ']) {
    for (const count of [6, 10, 12]) {
      for (const result of make({ mode: 'phrase', words: count, separator }, 10)) {
        assert.equal(result.value.split(separator).length, count);
        assert.ok(result.value.split(separator).every(word => words.includes(word)));
        assert.equal(result.bits, count * 9);
      }
    }
  }
});
test('capitalization adds no entropy, random two-digit suffix adds log2(100)', () => {
  const [result] = make({ mode: 'phrase', words: 10, separator: '-', capitalize: true, addNumber: true });
  const parts = result.value.split('-');
  assert.equal(parts.length, 11);
  assert.ok(parts.slice(0, 10).every(word => /^[A-Z][a-z]+$/.test(word) && words.includes(word.toLowerCase())));
  assert.match(parts[10], /^\d{2}$/);
  assert.equal(result.bits, 90 + Math.log2(100));
});
test('passphrase word repetition is allowed, as required by the entropy model', () => {
  const [result] = make({ mode: 'phrase', words: 10, separator: '-', addNumber: true }, 1, { getRandomValues(array) { array.fill(0); return array; } });
  assert.equal(result.value, Array(10).fill(words[0]).concat('00').join('-'));
});
test('PINs retain leading zeros and do not discard repeated digits', () => {
  const [zero] = make({ mode: 'pin', length: 6 }, 1, { getRandomValues(array) { array.fill(0); return array; } });
  assert.equal(zero.value, '000000');
  for (const length of [4, 6, 12]) {
    for (const result of make({ mode: 'pin', length }, 50)) {
      assert.match(result.value, /^\d+$/);
      assert.equal(result.value.length, length);
      assert.equal(result.bits, length * Math.log2(10));
    }
  }
});
test('source contains no insecure RNG, network sinks or password persistence', () => {
  const root = path.join(__dirname, '..');
  for (const file of ['crypto-core.js', 'app.js']) {
    const text = fs.readFileSync(path.join(root, file), 'utf8');
    assert.doesNotMatch(text, /Math\.random\s*\(/);
    assert.doesNotMatch(text, /\b(?:fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/);
    assert.doesNotMatch(text, /\b(?:localStorage|sessionStorage|indexedDB)\b/);
    assert.doesNotMatch(text, /console\.(?:log|info|warn|error)\s*\(/);
    assert.doesNotMatch(text, /\.innerHTML\s*=/);
  }
});
test('English and Norwegian cover the same translation keys', () => {
  const vm = require('node:vm');
  const text = fs.readFileSync(path.join(__dirname, '../i18n.js'), 'utf8').replace('const STORAGE_KEY =', 'root.__messages = messages; const STORAGE_KEY =');
  const window = { localStorage: { getItem() { return null; } } };
  vm.runInNewContext(text, { window });
  assert.deepEqual(Object.keys(window.__messages.no).sort(), Object.keys(window.__messages.en).sort());
});
