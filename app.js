/* Cloud247 Password Generator v1.0.2. Secrets exist only in this page's memory. */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const i18n = window.Cloud247I18n;
  const core = window.PasswordCore;
  if (!i18n || !core) {
    $('errorPanel').hidden = false;
    $('errorPanel').textContent = 'App files could not be loaded. Reload the page.';
    $('generateButton').disabled = true;
    return;
  }
  let mode = 'password';
  let results = [];
  let concealed = false;
  let errorCode = null;
  let toastTimer;
  const t = (key, values) => i18n.t(key, values);
  const format = number => new Intl.NumberFormat(i18n.getLanguage() === 'no' ? 'nb-NO' : 'en-GB', { maximumFractionDigits: 1 }).format(number);
  const presets = {
    standard: { length: 20, upper: true, lower: true, digits: true, symbols: true, excludeAmbiguous: true },
    readable: { length: 20, upper: true, lower: true, digits: true, symbols: false, excludeAmbiguous: true },
    long: { length: 32, upper: true, lower: true, digits: true, symbols: true, excludeAmbiguous: true }
  };
  function notify(message) {
    window.clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').classList.add('show');
    toastTimer = window.setTimeout(() => { $('toast').classList.remove('show'); $('toast').textContent = ''; }, 4500);
  }
  function readOptions() {
    if (mode === 'phrase') return {
      mode, words: Number($('phraseLength').value), separator: $('separator').value,
      capitalize: $('capitalize').checked, addNumber: $('addNumber').checked
    };
    if (mode === 'pin') return { mode, length: Number($('pinLength').value) };
    return {
      mode, length: Number($('passwordLength').value), upper: $('upper').checked,
      lower: $('lower').checked, digits: $('digits').checked, symbols: $('symbols').checked,
      excludeAmbiguous: $('excludeAmbiguous').checked
    };
  }
  function updatePresets() {
    const options = readOptions();
    document.querySelectorAll('[data-preset]').forEach(button => {
      const preset = presets[button.dataset.preset];
      const active = mode === 'password' && Object.keys(preset).every(key => options[key] === preset[key]);
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }
  function render() {
    $('errorPanel').hidden = !errorCode;
    $('errorPanel').textContent = errorCode ? t(errorCode) : '';
    const hasValue = results.length > 0;
    ['copyButton', 'clearButton', 'toggleVisibility', 'copyAllButton'].forEach(id => { $(id).disabled = !hasValue; });
    const output = $('passwordOutput');
    output.removeAttribute('data-i18n');
    output.classList.toggle('empty', !hasValue);
    output.classList.toggle('masked', hasValue && concealed);
    $('toggleVisibility').setAttribute('aria-pressed', String(concealed));
    const visibilityText = $('toggleVisibility').querySelector('span');
    visibilityText.textContent = t(concealed ? 'show' : 'hide');
    visibilityText.dataset.i18n = concealed ? 'show' : 'hide';
    $('outputLabel').textContent = t(mode === 'phrase' ? 'yourPhrase' : mode === 'pin' ? 'yourPin' : 'yourPassword');
    const count = Number($('quantity').value);
    $('generateButton').querySelector('span').textContent = count > 1 ? t('generateMany', { count }) : t('generate');
    $('batchSection').hidden = results.length < 2;
    $('batchList').replaceChildren();
    if (hasValue) {
      const first = results[0];
      output.textContent = concealed ? '\u2022'.repeat(16) : first.value;
      $('outputLength').textContent = t('lengthValue', { value: first.value.length });
      let level = first.bits >= 80 ? 'veryStrong' : first.bits >= 60 ? 'strong' : first.bits >= 40 ? 'moderate' : 'limited';
      if (first.mode === 'pin') level = 'pin';
      $('strengthSection').dataset.level = level;
      $('strengthLabel').textContent = t(level === 'pin' ? 'pinOnly' : level);
      $('entropyValue').textContent = t('bits', { value: format(first.bits) });
      $('strengthMeter').value = Math.min(128, first.bits);
      $('strengthMeter').setAttribute('aria-valuetext', t('bits', { value: format(first.bits) }));
      $('strengthHelp').textContent = t(first.mode === 'pin' ? 'pinWarning' : 'entropyHelp');
      if (results.length > 1) {
        const fragment = document.createDocumentFragment();
        results.forEach((item, index) => {
          const row = document.createElement('li');
          const value = document.createElement('code');
          value.textContent = concealed ? '\u2022'.repeat(16) : item.value;
          const copy = document.createElement('button');
          copy.type = 'button';
          copy.className = 'ghost-button';
          copy.dataset.index = String(index);
          copy.textContent = t('copy');
          copy.setAttribute('aria-label', t('copyItem', { index: index + 1 }));
          row.append(value, copy);
          fragment.append(row);
        });
        $('batchList').append(fragment);
      }
    } else {
      output.textContent = t('empty');
      $('outputLength').textContent = '\u2014';
      $('strengthLabel').textContent = '\u2014';
      $('entropyValue').textContent = '\u2014';
      $('strengthMeter').value = 0;
      $('strengthMeter').removeAttribute('aria-valuetext');
      $('strengthHelp').textContent = t('entropyHelp');
      delete $('strengthSection').dataset.level;
    }
    const wordCount = Array.isArray(window.Cloud247Words) ? window.Cloud247Words.length : 0;
    $('wordlistNote').textContent = wordCount ? t('wordlistNote', { count: wordCount, bits: format(Math.log2(wordCount)) }) : t('wordlistUnavailable');
    updatePresets();
  }
  function generate(announce = false) {
    results = [];
    errorCode = null;
    try {
      if (!window.isSecureContext) throw new core.GeneratorError('insecureContext');
      results = core.generateBatch(readOptions(), Number($('quantity').value));
    } catch (error) {
      // Error messages never include passwords, generated values or RNG state.
      errorCode = error instanceof core.GeneratorError ? error.code : 'unexpected';
    }
    render();
    if (announce && results.length) notify(results.length === 1 ? t('generated') : t('generatedMany', { count: results.length }));
  }
  async function writeClipboard(value) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
        return true;
      }
    } catch (_) { /* Try the user-initiated fallback; never read the clipboard. */ }
    const previousFocus = document.activeElement;
    const helper = document.createElement('textarea');
    helper.className = 'clipboard-helper';
    helper.value = value;
    helper.setAttribute('readonly', '');
    helper.setAttribute('aria-label', 'Copy');
    document.body.append(helper);
    let success = false;
    try {
      helper.focus({ preventScroll: true });
      helper.select();
      helper.setSelectionRange(0, helper.value.length);
      success = document.execCommand('copy');
    } catch (_) { success = false; }
    finally {
      helper.value = '';
      helper.remove();
      if (previousFocus && typeof previousFocus.focus === 'function') previousFocus.focus({ preventScroll: true });
    }
    return success;
  }
  async function copyOne(index) {
    if (!results[index]) return;
    const success = await writeClipboard(results[index].value);
    notify(t(success ? 'copied' : 'copyFailed'));
  }
  function selectMode(next) {
    if (!['password', 'phrase', 'pin'].includes(next)) return;
    mode = next;
    document.querySelectorAll('[data-mode]').forEach(button => {
      const selected = button.dataset.mode === mode;
      button.setAttribute('aria-selected', String(selected));
      button.tabIndex = selected ? 0 : -1;
      $('options-' + button.dataset.mode).hidden = !selected;
    });
    generate();
  }
  document.querySelectorAll('[data-mode]').forEach(button => {
    button.addEventListener('click', () => selectMode(button.dataset.mode));
    button.addEventListener('keydown', event => {
      const tabs = [...document.querySelectorAll('[data-mode]')];
      const index = tabs.indexOf(button);
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      tabs[next].focus();
      selectMode(tabs[next].dataset.mode);
    });
  });
  document.querySelectorAll('[data-preset]').forEach(button => {
    button.addEventListener('click', () => {
      const preset = presets[button.dataset.preset];
      $('passwordLength').value = String(preset.length);
      $('passwordRange').value = String(preset.length);
      $('passwordLength').removeAttribute('aria-invalid');
      Object.keys(core.CHARSETS).concat('excludeAmbiguous').forEach(id => { $(id).checked = preset[id]; });
      generate();
    });
  });
  for (const prefix of ['password', 'phrase', 'pin']) {
    const number = $(prefix + 'Length');
    const range = $(prefix + 'Range');
    number.addEventListener('input', () => {
      const valid = number.value !== '' && number.validity.valid && Number.isInteger(Number(number.value));
      number.setAttribute('aria-invalid', String(!valid));
      if (valid) range.value = number.value;
      generate();
    });
    range.addEventListener('input', () => {
      number.value = range.value;
      number.removeAttribute('aria-invalid');
      generate();
    });
  }
  ['upper', 'lower', 'digits', 'symbols', 'excludeAmbiguous', 'separator', 'capitalize', 'addNumber', 'quantity'].forEach(id => $(id).addEventListener('change', () => generate()));
  document.querySelectorAll('[data-language]').forEach(button => {
    button.addEventListener('click', () => {
      i18n.setLanguage(button.dataset.language);
      render(); // Never regenerate or lose a password just because the language changed.
    });
  });
  $('generateButton').addEventListener('click', () => generate(true));
  $('copyButton').addEventListener('click', () => copyOne(0));
  $('copyAllButton').addEventListener('click', async () => {
    if (!results.length) return;
    const count = results.length;
    const success = await writeClipboard(results.map(item => item.value).join('\n'));
    notify(success ? t('copiedAll', { count }) : t('copyFailed'));
  });
  $('batchList').addEventListener('click', event => {
    const button = event.target.closest('button[data-index]');
    if (button && $('batchList').contains(button)) copyOne(Number(button.dataset.index));
  });
  $('toggleVisibility').addEventListener('click', () => { concealed = !concealed; render(); });
  $('clearButton').addEventListener('click', () => {
    results = [];
    errorCode = null;
    render();
    notify(t('cleared'));
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && results.length) { concealed = true; render(); }
  });
  window.addEventListener('pagehide', () => {
    results = [];
    errorCode = null;
    render();
  });
  window.addEventListener('pageshow', event => {
    if (event.persisted) { results = []; errorCode = null; render(); }
  });
  $('year').textContent = String(new Date().getFullYear());
  $('version').textContent = 'v' + core.VERSION;
  i18n.apply();
  generate();
})();
