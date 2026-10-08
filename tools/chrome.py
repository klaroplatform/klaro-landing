#!/usr/bin/env python3
"""Stamp the shared header, footer and icon sprite into every page of the site.

The site stays plain HTML with no build step: each page is a complete file that GitHub Pages and
Cloudflare serve as it is. The parts every page shares live once in partials/, and this script
copies them into each page between markers:

    <!-- chrome:sprite --><!-- /chrome:sprite -->
    <!-- chrome:header --><!-- /chrome:header -->
    <!-- chrome:footer --><!-- /chrome:footer -->

Partials use {root} for the path to the site root ("" on the home page, "../../" two folders
down) and {home} for the home page link. A page picks the partials for its language from
<html lang="...">: header.en.html, header.ar.html and so on.

Run it after changing a partial, or after adding a page:

    python3 tools/chrome.py                  # rewrite pages that are out of date
    python3 tools/chrome.py research/*.html  # only these pages
    python3 tools/chrome.py --check          # exit 1 if any page is out of date (for CI)
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARTIALS = os.path.join(ROOT, 'partials')
SKIP = {'design', 'partials', 'tools', 'node_modules', '.git', '.wrangler'}
BLOCK = re.compile(r'(<!-- chrome:(\w+) -->)(.*?)(<!-- /chrome:\2 -->)', re.S)


def partial(name, lang):
    for candidate in (f'{name}.{lang}.html', f'{name}.en.html', f'{name}.svg', f'{name}.html'):
        path = os.path.join(PARTIALS, candidate)
        if os.path.exists(path):
            with open(path, encoding='utf-8') as f:
                return f.read().strip('\n')
    raise SystemExit(f'No partial for "{name}" ({lang})')


def stamp(path):
    with open(path, encoding='utf-8') as f:
        html = f.read()
    if '<!-- chrome:' not in html:
        return None
    rel = os.path.relpath(ROOT, os.path.dirname(path))
    root = '' if rel == '.' else rel.replace(os.sep, '/') + '/'
    lang = (re.search(r'<html[^>]*\blang="([\w-]+)"', html) or [None, 'en'])[1].split('-')[0]

    def fill(m):
        body = partial(m.group(2), lang).replace('{root}', root).replace('{home}', root or './')
        return f'{m.group(1)}\n{body}\n{m.group(4)}'

    out = BLOCK.sub(fill, html)
    return out if out != html else False


def main():
    check = '--check' in sys.argv
    only = [os.path.abspath(a) for a in sys.argv[1:] if not a.startswith('--')]
    stale = []
    for path in only or pages():
        out = stamp(path)
        if out:
            stale.append(os.path.relpath(path, ROOT))
            if not check:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(out)
    for p in stale:
        print(('out of date: ' if check else 'stamped: ') + p)
    if check and stale:
        sys.exit(1)


def pages():
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP and not d.startswith('.')]
        for name in sorted(filenames):
            if name.endswith('.html'):
                yield os.path.join(dirpath, name)


if __name__ == '__main__':
    main()
