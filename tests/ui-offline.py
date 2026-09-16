"""Offline DOM fixture only. No navigation, real hosting or CSP test.
Delivered files are not modified. Secure context and clipboard are test doubles.
Browser-managed navigation policies remain unchanged.
"""
from pathlib import Path
import json, re, os, base64
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'test-results'
OUT.mkdir(exist_ok=True)
html=ROOT.joinpath('index.html').read_text()
html=re.sub(r'<meta[^>]+http-equiv="Content-Security-Policy"[^>]*>', '', html, flags=re.I)
html=re.sub(r'<link[^>]*>', '', html)
html=re.sub(r'<script\b[^>]*>.*?</script>', '', html, flags=re.S)
logo=base64.b64encode(ROOT.joinpath('assets/cloud247-logo.svg').read_bytes()).decode()
html=re.sub(r'src="assets/cloud247-logo\.svg[^"]*"', lambda m: 'src="data:image/svg+xml;base64,'+logo+'"', html)
records=[]
def ok(s):
 records.append(s)
 print(s, flush=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),headless=True,args=['--no-sandbox'])
 page=b.new_page(viewport={'width':1440,'height':1100})
 page.set_default_timeout(2000)
 errors=[]
 page.on('pageerror', lambda e: errors.append(str(e)))
 page.set_content(html)
 page.add_style_tag(content=ROOT.joinpath('styles.css').read_text())
 # The fixture uses native browser crypto; only context/clipboard are mocked.
 assert page.evaluate('typeof crypto.getRandomValues')=='function'
 page.evaluate("""() => {
 Object.defineProperty(window,'isSecureContext',{value:true,configurable:true});
 window.__copied='';
 Object.defineProperty(navigator,'clipboard',{value:{writeText:async(v)=>{window.__copied=v}},configurable:true});
 }""")
 for name in ['assets/words.js','crypto-core.js','i18n.js','app.js']:
  page.add_script_tag(content=ROOT.joinpath(name).read_text())
 assert not errors,errors
 initial=page.locator('#passwordOutput').inner_text()
 assert len(initial)==20, initial
 ok('Default generation with native Web Crypto in offline fixture')
 page.screenshot(path=str(OUT/'desktop.png'),full_page=True)
 page.locator('#copyButton').click()
 assert page.evaluate('window.__copied')==initial
 page.locator('[data-language="en"]').click()
 assert page.locator('#passwordOutput').inner_text()==initial
 assert page.locator('#settingsTitle').inner_text()=='Your preferences'
 page.locator('[data-language="no"]').click()
 ok('NO/EN switch preserves secret')
 # Approved hero copy must translate without changing the header or secret.
 expected_copy = {
  'no': ('Sterke passord. Helt enkelt.', 'Lag passord, passfraser og PIN-koder p\u00e5 sekunder. Velg lengde og innhold \u2013 generer, kopier og bruk.'),
  'en': ('Strong passwords. Made simple.', 'Create passwords, passphrases and PINs in seconds. Choose your settings \u2014 generate, copy and go.')
 }
 for lang, (heading, description) in expected_copy.items():
  page.locator('[data-language="'+lang+'"]').click()
  assert ' '.join(page.locator('h1').inner_text().split())==heading
  assert page.locator('.hero-description').inner_text()==description
  assert page.locator('.header-label').inner_text()=='Password Generator'
  assert page.locator('#passwordOutput').inner_text()==initial
 page.locator('[data-language="no"]').click()
 ok('Approved NO/EN hero copy, unchanged header name and preserved secret')
 # Source-aligned header checks at the exact reference breakpoints.
 for width in [320,390,420,421,620,621,700,760,761,1024,1440,1920]:
  page.set_viewport_size({'width':width,'height':1100})
  assert page.locator('.cloud-brand img').evaluate('(img)=>img.complete && img.naturalWidth===1024')
  brand=page.locator('.cloud-brand').bounding_box()
  shell=page.locator('.header-inner').bounding_box()
  expected_width=180 if width<=620 else 230
  expected_shell=min(1160,width-(28 if width<=620 else 40))
  assert abs(brand['width']-expected_width)<0.1, (width,brand)
  assert abs(shell['width']-expected_shell)<0.1, (width,shell)
  expected_x=(width-expected_width)/2 if width<=620 else (width-expected_shell)/2
  assert abs(brand['x']-expected_x)<0.1, (width,brand)
  assert page.locator('.header-label').is_visible()==(width>760)
  assert page.locator('.site-header').evaluate('(e)=>getComputedStyle(e).backgroundColor')=='rgb(6, 26, 47)'
  assert page.locator('.site-header').bounding_box()['height']==expected_width+1
  assert page.locator('.header-account').evaluate('(e)=>e.firstElementChild.className')=='language-switcher'
  for lang in ['en','no']:
   button=page.locator('[data-language="'+lang+'"]')
   button.click()
   assert button.get_attribute('aria-pressed')=='true'
   assert button.evaluate('(e)=>getComputedStyle(e).backgroundColor')=='rgb(250, 214, 58)'
   assert page.locator('#passwordOutput').inner_text()==initial
   assert ' '.join(page.locator('h1').inner_text().split())==expected_copy[lang][0]
   assert page.locator('.hero-description').inner_text()==expected_copy[lang][1]
   heading_box=page.locator('h1').bounding_box()
   line_height=page.locator('h1').evaluate('(e)=>parseFloat(getComputedStyle(e).lineHeight)')
   assert abs(heading_box['height'] - 2*line_height)<2, (width,lang,heading_box,line_height)
   assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'), (width,lang)
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth')
 page.set_viewport_size({'width':1440,'height':1100})
 page.evaluate('document.activeElement.blur();window.scrollTo(0,0)')
 ok('ExpiryGuard header logo, order, colors, alignment and controls at 12 widths')
 page.locator('#toggleVisibility').click()
 assert initial not in page.locator('body').inner_text()
 page.locator('#copyButton').click()
 assert page.evaluate('window.__copied')==initial
 page.locator('#toggleVisibility').click()
 assert page.locator('#passwordOutput').inner_text()==initial
 ok('Hide/show and clipboard payload (mock clipboard)')
 page.locator('#passwordLength').fill('128')
 assert len(page.locator('#passwordOutput').inner_text())==128
 page.locator('#passwordLength').fill('7')
 assert page.locator('#errorPanel').is_visible()
 assert page.locator('#copyButton').is_disabled()
 page.locator('#passwordLength').fill('20')
 assert not page.locator('#errorPanel').is_visible()
 ok('Length validation clears stale output')
 for ident in ['upper','lower','digits','symbols']:
  page.locator('#'+ident).uncheck()
 assert page.locator('#errorPanel').is_visible()
 assert page.locator('#copyButton').is_disabled()
 page.locator('[data-preset="readable"]').click()
 assert page.locator('#passwordOutput').inner_text().isalnum()
 page.locator('[data-preset="long"]').click()
 assert len(page.locator('#passwordOutput').inner_text())==32
 ok('Category validation and presets')
 page.locator('#tab-phrase').click()
 assert len(page.locator('#passwordOutput').inner_text().split('-'))==10
 assert '90' in page.locator('#entropyValue').inner_text()
 page.locator('#capitalize').check()
 page.locator('#addNumber').check()
 parts=page.locator('#passwordOutput').inner_text().split('-')
 assert len(parts)==11 and len(parts[-1])==2 and parts[-1].isdigit()
 assert all(word[0].isupper() for word in parts[:-1])
 page.locator('#separator').select_option(' ')
 assert len(page.locator('#passwordOutput').inner_text().split(' '))==11
 ok('Passphrase count, entropy, case, separator and suffix')
 page.locator('#quantity').select_option('50')
 values=page.locator('#batchList code').all_inner_texts()
 assert len(values)==50 and values[0]==page.locator('#passwordOutput').inner_text()
 page.locator('#copyAllButton').click()
 assert page.evaluate('window.__copied')=='\n'.join(values)
 page.locator('#batchList li').nth(4).locator('button').click()
 assert page.evaluate('window.__copied')==values[4]
 page.locator('#toggleVisibility').click()
 assert all(set(v)=={'\u2022'} for v in page.locator('#batchList code').all_inner_texts())
 page.locator('#toggleVisibility').click()
 ok('Batch 50, copy payloads and masking')
 page.locator('#tab-pin').click()
 assert 'PIN' in page.locator('#strengthLabel').inner_text()
 page.locator('#pinLength').fill('4')
 assert len(page.locator('#passwordOutput').inner_text())==4
 page.locator('#tab-pin').focus()
 page.keyboard.press('ArrowRight')
 assert page.locator('#tab-password').get_attribute('aria-selected')=='true'
 page.keyboard.press('End')
 assert page.locator('#tab-pin').get_attribute('aria-selected')=='true'
 ok('PIN mode and keyboard tabs')
 page.locator('#clearButton').click()
 assert page.locator('#copyButton').is_disabled()
 assert page.locator('#batchList li').count()==0
 ok('Explicit clear')
 page.locator('#quantity').select_option('1')
 page.locator('#tab-password').click()
 page.locator('[data-preset="standard"]').click()
 page.evaluate("Object.defineProperty(document,'hidden',{configurable:true,value:true});document.dispatchEvent(new Event('visibilitychange'));delete document.hidden")
 assert set(page.locator('#passwordOutput').inner_text())=={'\u2022'}
 page.locator('#toggleVisibility').click()
 page.evaluate("window.dispatchEvent(new PageTransitionEvent('pagehide'));window.dispatchEvent(new PageTransitionEvent('pageshow',{persisted:true}))")
 assert page.locator('#copyButton').is_disabled()
 page.locator('#generateButton').click()
 ok('Tab-hidden and page-transition handlers (simulated events)')
 for width in [320,390,768,1024,1050,1440,1920]:
  page.set_viewport_size({'width':width,'height':1000})
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
  page.locator('#tab-phrase').click()
  page.locator('#phraseLength').fill('12')
  assert page.evaluate('document.documentElement.scrollWidth<=innerWidth'),width
  page.locator('#tab-password').click()
 ok('No horizontal overflow at seven widths 320-1920 px')
 page.set_viewport_size({'width':390,'height':844})
 page.evaluate('document.activeElement.blur(); window.scrollTo(0, 0)')
 page.wait_for_timeout(4700)
 page.screenshot(path=str(OUT/'mobile.png'),full_page=True)
 page.evaluate("Object.defineProperty(window,'isSecureContext',{value:false,configurable:true})")
 page.locator('#generateButton').click()
 assert page.locator('#errorPanel').is_visible()
 assert page.locator('#copyButton').is_disabled()
 ok('Fail-closed insecure-context branch (test double)')
 assert not errors,errors
 ok('No JavaScript exceptions in offline interactive fixture')
 b.close()
report={'harness':'Offline DOM fixture; context and clipboard are mocks; no hosting, real clipboard, transport or CSP verification','passed':len(records),'tests':records}
(OUT/'offline-ui-results.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
