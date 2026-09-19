import json, os, sys
sys.stdout.reconfigure(encoding='utf-8')

print('1. Checking vercel.json...')
with open('vercel.json', encoding='utf-8') as f:
    v = json.load(f)
    print('   PASS: vercel.json is valid, keys:', list(v.keys()))

print('2. Checking package.json...')
with open('package.json', encoding='utf-8') as f:
    p = json.load(f)
    print('   PASS: package.json is valid, name:', p['name'])

print('3. Checking manifest.json...')
with open('manifest.json', encoding='utf-8') as f:
    m = json.load(f)
    print('   PASS: manifest.json is valid, name:', m['name'])

print('4. Checking critical files...')
files = [
    'index.html', 'logo.png', 'assets/logo.png', 'css/app.css', 'sw.js',
    'js/store.js', 'js/auth.js', 'js/sync-hub.js', 'js/workspaces.js',
    'js/ai-analytics.js', 'js/gamification.js', 'js/exam-hub.js',
    'js/voice-assistant.js', 'js/security.js', 'js/xlsx.full.min.js'
]
all_exist = True
for path in files:
    if os.path.exists(path):
        sz = os.path.getsize(path)
        print(f'   PASS: {path:<25} ({sz} bytes)')
    else:
        print(f'   FAIL: {path:<25} MISSING')
        all_exist = False

print('5. Overall Status:', '100% READY FOR VERCEL' if all_exist else 'ISSUES FOUND')
