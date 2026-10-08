#!/usr/bin/env python3
"""Stamp the shared parts and the metadata into every page, write sitemap.xml and llms.txt, and
check the pages. Python 3 standard library only.

The site stays plain HTML with no build step: each page is a complete file that Cloudflare serves
as it is, and everything this tool writes is committed. What every page shares lives once, and the
tool copies it into each page between markers:

    <!-- chrome:meta --><!-- /chrome:meta -->       in <head>: generated (see below)
    <!-- chrome:sprite --><!-- /chrome:sprite -->   partials/sprite.svg
    <!-- chrome:header --><!-- /chrome:header -->   partials/header.<lang>.html
    <!-- chrome:footer --><!-- /chrome:footer -->   partials/footer.<lang>.html

Partials use {root} for the path to the site root ("" on the home page, "../../" two folders
down, "/" on 404.html, which is served at any depth), {home} for this language's home page and
{twin} for the same page in the other language (the other language's home when there is none,
and always on a 404 page), {home_tutors} and {home_students} for the two audience homes in the
page's language, and {aud} for the audience home a page points to (from / the students' home,
from /students/ the tutors' one, from a product page the home of its site.json "group", else the
students' home). A page picks the partials for its language from <html lang="...">. An ar/ page
takes its English twin's entry in site.json (type, group, audience, index).

Not pages: the top-level folders in SKIP (notes, tooling, and the built showcase app with its
media), which are never stamped or checked; links into them are checked. A page marked "frozen"
in site.json (v1/, the old landing) is never written and only gets one warning.

Metadata. Each page owns its <title> and <meta name="description">, written above the meta block.
The meta block is built from those, the page's path and tools/site.json (site-wide facts and the
few things a page can't say about itself): canonical, hreflang (only where the page and its ar/
translation both exist), robots noindex, the klaro-app address, icons, theme colour, Open Graph,
Twitter and one JSON-LD @graph (Organization, WebSite, the page's WebPage, WebApplication on each
home page, BreadcrumbList, FAQPage from the page's visible .faq-item markup, and an Article with
its citations from the visible .rs-cite references, and a VideoObject for each recording the page
embeds with data-recording="<name>", from media/<name>.json, its poster and the heading and caption
next to it). Texts in site.json may be per language.

On every page (but frozen ones) --check fails on any mention of AI: the owner's rule, with no motto
exception since the literal motto left the site (design/brief/redesign.md, 8.1).

On ar/ pages --check also applies the machine-checkable rules of design/brief/arabic.md, section 9:
lang="ar" dir="rtl", an Arabic title and description, no text arrow → outside English course
material (lang="en"), no .flip on text and no Eastern Arabic digits. A link to an ar/ page that
doesn't exist yet is reported once, with the pages that link to it.

App links. The href of every link marked data-signup, data-signup-as, data-signin or data-legal is
set to its real address in the app (site.json "app"), so it works without JavaScript; klaro.js
and site.js still refine them for the audience switch. Partials may write href="#" for these.

Fonts. The Google Fonts links are the tool's: it writes them at the end of the meta block, for the
page's language (site.json "fonts": Readex Pro, the Arabic face, only on Arabic pages), and removes
any font link a page writes in its own <head>.

Illustration sizes. With site.json "srcset" on, every <img> of a full-size illustration
(img/ill/NN-name.webp) gets srcset (its -480 and -800 versions, where they exist) and sizes.

The same run writes sitemap.xml (indexable pages, lastmod from git, hreflang alternates) and
llms.txt (llmstxt.org format). A page is indexable unless site.json says "index": false or
.assetsignore keeps it off the site. lastmod is the date of the last commit that changed the page
outside the chrome blocks (today if the working copy differs), so restamping a header doesn't
move every date.

    python3 tools/site.py                 # stamp every page, write sitemap.xml and llms.txt, check
    python3 tools/site.py research/*.html # stamp only these pages (sitemap and llms.txt still all)
    python3 tools/site.py --check         # write nothing; exit 1 if anything is out of date or wrong
    python3 tools/site.py --report        # every page's title and description, with lengths
"""
import datetime
import fnmatch
import json
import os
import posixpath
import re
import subprocess
import sys
from html import unescape
from html.parser import HTMLParser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARTIALS = os.path.join(ROOT, 'partials')
# Folders that hold no pages of ours: notes and tooling, and Omar's built app and its media (the
# showcase is a generated app; never stamp or check it). Links into them are still checked.
SKIP = {'design', 'partials', 'tools', 'showcase', 'media', 'demo', 'brand', 'illustrations'}
SKIP_ANYWHERE = {'node_modules'}
BLOCK = re.compile(r'(<!-- chrome:(\w+) -->)(.*?)(<!-- /chrome:\2 -->)', re.S)
TODAY = datetime.date.today().isoformat()
TITLE_MAX, TITLE_SHORT, DESC_MIN, DESC_MAX = 60, 30, 50, 160

with open(os.path.join(ROOT, 'tools', 'site.json'), encoding='utf-8') as _f:
    SITE = json.load(_f)
BASE = SITE['base']


# ---------------------------------------------------------------- small helpers

def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def attr(s):
    """Escape a value for a double-quoted HTML attribute (apostrophes stay readable)."""
    return s.replace('&', '&amp;').replace('"', '&quot;').replace('<', '&lt;').replace('>', '&gt;')


def squash(s):
    return ' '.join(s.split())


def git(*args):
    try:
        r = subprocess.run(['git', '-C', ROOT, *args], capture_output=True, text=True)
    except OSError:
        return None
    return r.stdout if r.returncode == 0 else None


def strip_chrome(html):
    return BLOCK.sub(lambda m: m.group(1) + m.group(4), html)


def assetsignore():
    path = os.path.join(ROOT, '.assetsignore')
    if not os.path.exists(path):
        return []
    rules = []
    for line in read(path).splitlines():
        line = line.strip()
        if line and not line.startswith('#'):
            rules.append(line)
    return rules


IGNORE = assetsignore()


def deployed(rel):
    """False when .assetsignore (gitignore syntax, simplified) keeps this file off the site."""
    parts = rel.split('/')
    prefixes = ['/'.join(parts[:i]) for i in range(1, len(parts) + 1)]
    out = True
    for rule in IGNORE:
        neg = rule.startswith('!')
        pat = rule[1:] if neg else rule
        anchored = pat.startswith('/') or '/' in pat.strip('/').replace('**/', '')
        pat = pat.strip('/')
        if pat.startswith('**/'):
            pat, anchored = pat[3:], False
        hit = any(fnmatch.fnmatch(p, pat) if anchored else fnmatch.fnmatch(p.rsplit('/', 1)[-1], pat)
                  for p in prefixes)
        if hit:
            out = neg
    return out


def partial(name, lang):
    for candidate in (f'{name}.{lang}.html', f'{name}.en.html', f'{name}.svg', f'{name}.html'):
        path = os.path.join(PARTIALS, candidate)
        if os.path.exists(path):
            return read(path).strip('\n')
    raise SystemExit(f'No partial for "{name}" ({lang})')


# ---------------------------------------------------------------- a small DOM, for reading pages

VOID = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param',
        'source', 'track', 'wbr'}


class Node:
    __slots__ = ('tag', 'attrs', 'children', 'parent', 'line')

    def __init__(self, tag, attrs, parent, line):
        self.tag, self.attrs, self.children, self.parent, self.line = tag, attrs, [], parent, line

    def classes(self):
        return self.attrs.get('class', '').split()

    def iter(self):
        yield self
        for c in self.children:
            if isinstance(c, Node):
                yield from c.iter()

    def find(self, pred):
        return [n for n in self.iter() if pred(n)]

    def text(self):
        return ''.join(c if isinstance(c, str) else c.text() for c in self.children)

    def ancestors(self):
        n = self.parent
        while n is not None:
            yield n
            n = n.parent


class Tree(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.root = Node('#root', {}, None, 0)
        self.cur = self.root
        self.feed(html)
        self.close()

    def _node(self, tag, attrs):
        n = Node(tag, {k: (v if v is not None else '') for k, v in attrs}, self.cur, self.getpos()[0])
        self.cur.children.append(n)
        return n

    def handle_starttag(self, tag, attrs):
        n = self._node(tag, attrs)
        if tag not in VOID:
            self.cur = n

    def handle_startendtag(self, tag, attrs):
        self._node(tag, attrs)

    def handle_endtag(self, tag):
        n = self.cur
        while n is not self.root and n.tag != tag:
            n = n.parent
        if n is not self.root:
            self.cur = n.parent

    def handle_data(self, data):
        self.cur.children.append(data)


# ---------------------------------------------------------------- pages

class Page:
    def __init__(self, rel):
        self.rel = rel                                   # products/study-view/index.html
        self.file = os.path.join(ROOT, rel)
        self.path = rel[:-len('index.html')] if rel.endswith('index.html') else rel   # products/study-view/
        self.html = read(self.file)
        conf = SITE['pages'].get(self.path)
        if conf is None and self.path.startswith('ar/'):
            # An Arabic page takes its English twin's hints, except the English words.
            conf = {k: v for k, v in SITE['pages'].get(self.path[3:], {}).items() if k not in ('label', 'llms')}
        self.conf = conf or {}
        m = re.search(r'<html[^>]*\blang="([\w-]+)"', self.html)
        self.lang = (m.group(1) if m else 'en').split('-')[0]
        if self.conf.get('rootAbsolute'):
            self.root = '/'
        else:
            up = posixpath.relpath('.', posixpath.dirname(rel) or '.')
            self.root = '' if up == '.' else up + '/'
        self.url = BASE + self.path
        self.deployed = deployed(rel)
        self.indexable = self.deployed and self.conf.get('index', True)
        m = re.search(r'<title>(.*?)</title>', self.html, re.S)
        self.title = squash(unescape(m.group(1))) if m else ''
        m = re.search(r'<meta name="description" content="([^"]*)"', self.html)
        self.description = squash(unescape(m.group(1))) if m else ''
        m = re.search(r'<body\b[^>]*\bdata-default-as="(\w+)"', self.html)
        self.default_as = m.group(1) if m else 'student'
        core = self.path[3:] if self.path.startswith('ar/') else self.path
        self.type = self.conf.get('type') or ('product' if core.startswith('products/') else 'page')
        self.frozen = bool(self.conf.get('frozen'))      # kept as it is: never stamped, checked loosely
        self.tree = Tree(self.html)

    @property
    def label(self):
        if self.conf.get('label'):
            return self.conf['label']
        t = self.title.split(' · ')[0]
        return t.split(':')[0].strip()

    @property
    def og_title(self):
        suffix = ' · ' + SITE['name']
        return self.title[:-len(suffix)] if self.title.endswith(suffix) else self.title


def discover():
    found = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        top = os.path.samefile(dirpath, ROOT)
        dirnames[:] = sorted(d for d in dirnames if not d.startswith('.') and d not in SKIP_ANYWHERE
                             and not (top and d in SKIP))
        for name in sorted(filenames):
            if name.endswith('.html'):
                found.append(os.path.relpath(os.path.join(dirpath, name), ROOT).replace(os.sep, '/'))
    return found


ORDER = {path: i for i, path in enumerate(SITE['pages'])}


def order_key(page):
    # The order of site.json's "pages" (home first, products as in the menu); an ar/ page right
    # after its English twin.
    core = page.path[3:] if page.path.startswith('ar/') else page.path
    return (ORDER.get(page.path, ORDER.get(core, len(ORDER))), page.lang != 'en', page.path)


# ---------------------------------------------------------------- dates from git

def last_modified(page, content):
    """Date of the last commit that changed the page outside the chrome blocks."""
    stripped = strip_chrome(content)
    head = git('show', f'HEAD:{page.rel}')
    if head is None or strip_chrome(head) != stripped:
        return TODAY
    log = git('log', '--format=%H %cs', '--', page.rel) or ''
    commits = [line.split() for line in log.splitlines() if line.strip()]
    for sha, date in commits:
        before = git('show', f'{sha}^:{page.rel}')
        if before is None or strip_chrome(before) != stripped:
            return date
    return commits[-1][1] if commits else TODAY


def first_published(page):
    log = git('log', '--diff-filter=A', '--format=%cs', '--', page.rel) or ''
    dates = [d for d in log.split() if d]
    return dates[-1] if dates else TODAY


# ---------------------------------------------------------------- app links

APP_LINK = re.compile(r'<a\b[^>]*>')


def app_href(tag, page):
    app = SITE['app'].rstrip('/')
    lang = 'lang=ar' if page.lang == 'ar' else ''

    def link(path, query=''):
        q = '&'.join(x for x in (query, lang) if x)
        return app + path + ('?' + q if q else '')

    m = re.search(r'\sdata-signup-as="(\w+)"', tag)
    if m:
        return link('/sign-up', 'as=' + m.group(1))
    if re.search(r'\sdata-signup(?=[\s>=])', tag):
        return link('/sign-up', 'as=' + page.default_as)
    if re.search(r'\sdata-signin(?=[\s>=])', tag):
        return link('/sign-in')
    m = re.search(r'\sdata-legal="(\w+)"', tag)
    if m:
        return link('/' + m.group(1))
    return None


def fill_app_links(html, page):
    def fix(m):
        tag = m.group(0)
        href = app_href(tag, page)
        if href is None:
            return tag
        href = attr(href)
        if re.search(r'\shref="[^"]*"', tag):
            return re.sub(r'(\shref=")[^"]*(")', lambda h: h.group(1) + href + h.group(2), tag, count=1)
        return tag[:-1] + f' href="{href}">'
    return APP_LINK.sub(fix, html)


# ---------------------------------------------------------------- fonts and illustration sizes

FONT_LINK = re.compile(r'[ \t]*<link\b[^>]*\bhref="https://fonts\.(?:googleapis|gstatic)\.com[^"]*"[^>]*>[ \t]*\n?')


def font_links(page):
    """The Google Fonts links for the page's language (site.json "fonts"), for its meta block."""
    families = SITE['fonts'].get(page.lang) or SITE['fonts']['en']
    return ['<link rel="preconnect" href="https://fonts.googleapis.com">',
            '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
            f'<link rel="stylesheet" href="{attr("https://fonts.googleapis.com/css2?" + families + "&display=swap")}">']


def outside_chrome(html, fn):
    """Apply fn to the parts of html outside the chrome blocks."""
    out, last = [], 0
    for m in BLOCK.finditer(html):
        out += [fn(html[last:m.start()]), m.group(0)]
        last = m.end()
    return ''.join(out) + fn(html[last:])


ILL_IMG = re.compile(r'<img\b[^>]*\ssrc="((?:[^"]*/)?img/ill/)(\d\d-[a-z0-9-]+?)\.webp"[^>]*>')


def fill_srcset(html):
    """site.json "srcset": every <img> of a full-size illustration (img/ill/NN-name.webp) whose
    smaller versions exist gets srcset and sizes, so a 150px tile doesn't download 1200px."""
    conf = SITE.get('srcset') or {}
    if not conf.get('on'):
        return html

    def fix(m):
        tag, prefix, name = m.group(0), m.group(1), m.group(2)
        width = re.search(r'\swidth="(\d+)"', tag)
        if not width or re.search(r'-\d+$', name):
            return tag
        widths = [w for w in conf['widths'] if w < int(width.group(1))
                  and os.path.exists(os.path.join(ROOT, 'img', 'ill', f'{name}-{w}.webp'))]
        if not widths:
            return tag
        srcset = ', '.join([f'{prefix}{name}-{w}.webp {w}w' for w in widths] + [f'{prefix}{name}.webp {width.group(1)}w'])
        tag = re.sub(r'\s(?:srcset|sizes)="[^"]*"', '', tag)
        # 'auto' (the drawn size) only on a lazy image: on an eager one Chrome takes 100vw.
        sizes = ('auto, ' if re.search(r'\sloading="lazy"', tag) else '') + conf['sizes']
        return tag[:-1].rstrip('/').rstrip() + f' srcset="{srcset}" sizes="{sizes}">'
    return ILL_IMG.sub(fix, html)


def fill_page(html, page):
    """What the tool writes outside the chrome blocks: the app links, illustration srcsets, and no
    font links (they live in the meta block, per language)."""
    html = fill_app_links(html, page)
    if '<!-- chrome:meta -->' in html:
        html = outside_chrome(html, lambda part: FONT_LINK.sub('', part))
    return outside_chrome(html, fill_srcset)


# ---------------------------------------------------------------- JSON-LD

def ref(i):
    return {'@id': i}


def localized(value, lang):
    """A site.json text that is either one string or {"en": ..., "ar": ...}."""
    if isinstance(value, dict):
        return value.get(lang) or value.get('en', '')
    return value


def image_object(img):
    return {'@type': 'ImageObject', 'url': BASE + img['path'], 'width': img['width'], 'height': img['height']}


def org_node():
    o = SITE['org']
    node = {'@type': 'Organization', '@id': BASE + '#org', 'name': SITE['name'], 'url': BASE,
            'logo': image_object(SITE['logo']), 'description': o['description'], 'slogan': o['slogan']}
    for key in ('legalName', 'alternateName', 'email', 'foundingDate'):
        if o.get(key):
            node[key] = o[key]
    address = {k: o[k] for k in ('addressCountry', 'addressLocality') if o.get(k)}
    if address:
        node['address'] = {'@type': 'PostalAddress', **address}
    if o.get('sameAs'):
        node['sameAs'] = o['sameAs']
    return node


def website_node(pages):
    langs = sorted({p.lang for p in pages if p.indexable}, key=lambda l: (l != 'en', l))
    return {'@type': 'WebSite', '@id': BASE + '#website', 'url': BASE, 'name': SITE['name'],
            'inLanguage': langs, 'publisher': ref(BASE + '#org')}


def audiences(roles):
    return [{'@type': 'EducationalAudience', 'educationalRole': r} for r in roles]


def products(pages):
    return sorted((p for p in pages if p.type == 'product' and p.indexable and p.lang == 'en'), key=order_key)


def app_node(pages, lang):
    """The app, on each home page. Its languages are the app's (both); its feature list is in the
    page's language, from the product pages in that language (English where one is missing)."""
    roles, features = [], []
    by_path = {p.path: p for p in pages}
    for p in products(pages):
        roles += [r for r in p.conf.get('audience', []) if r not in roles]
        local = by_path.get('ar/' + p.path) if lang == 'ar' else None
        shown = local if local is not None and local.indexable else p
        features.append(f'{shown.label}: {shown.description}')
    node = {'@type': 'WebApplication', '@id': BASE + '#app', 'name': SITE['name'], 'url': BASE,
            'applicationCategory': 'EducationalApplication', 'operatingSystem': 'Web browser',
            'inLanguage': website_node(pages)['inLanguage'], 'publisher': ref(BASE + '#org'),
            'featureList': features}
    if roles:
        node['audience'] = audiences(roles)
    return node


def breadcrumb(page, pages):
    home_path = 'ar/' if page.lang == 'ar' else ''
    home = next((p for p in pages if p.path == home_path and p.indexable), None)
    items = [(SITE['name'], home.url if home else BASE)]
    hub = next((p for p in pages if p.type == 'hub' and p.indexable and p.lang == page.lang), None)
    if page.type == 'product' and hub:
        items.append((hub.label, hub.url))
    items.append((page.label, None))
    out = []
    for i, (name, url) in enumerate(items, 1):
        item = {'@type': 'ListItem', 'position': i, 'name': name}
        if url:
            item['item'] = url
        out.append(item)
    return {'@type': 'BreadcrumbList', '@id': page.url + '#breadcrumb', 'itemListElement': out}


def faq(page):
    qa = []
    for item in page.tree.root.find(lambda n: 'faq-item' in n.classes()):
        q = next((n for n in item.iter() if n.tag == 'button'), None)
        a = next((n for n in item.iter() if 'answer' in n.classes()), None)
        if q is not None and a is not None:
            qa.append((squash(q.text()), squash(a.text())))
    return qa


CITE = re.compile(r'^(?P<authors>.+?) \((?P<year>\d{4})\)\. (?P<title>.+?)\.?$')


def person(apa):
    family, _, given = apa.partition(', ')
    return {'@type': 'Person', 'name': f'{given} {family}'.strip(), 'familyName': family, 'givenName': given}


def citations(page, warn):
    out = []
    for cite in page.tree.root.find(lambda n: 'rs-cite' in n.classes()):
        texts = [c for c in cite.children]
        link = next((n for n in cite.iter() if n.tag == 'a' and n.attrs.get('href')), None)
        doi = link.attrs['href'] if link is not None else None
        whole = squash(cite.text())
        node = {'@type': 'ScholarlyArticle'}
        try:
            pre = squash(texts[0])
            journal = next(c for c in texts if isinstance(c, Node) and c.tag == 'i')
            post = squash(texts[texts.index(journal) + 1])
            m = CITE.match(pre)
            j = re.match(r'^(?P<name>.+?),\s*(?P<volume>\d+)$', squash(journal.text()))
            p = re.match(r'^\((?P<issue>[^)]+)\),\s*(?P<pages>[\d–-]+)\.?$', post)
            names = re.split(r'(?<=\.), ', m.group('authors').replace(', & ', ', '))
            if doi:
                node.update({'@id': doi, 'url': doi})
            node.update({
                'name': m.group('title'),
                'author': [person(n) for n in names],
                'datePublished': m.group('year'),
                'isPartOf': {'@type': 'PublicationIssue', 'issueNumber': p.group('issue'),
                             'isPartOf': {'@type': 'PublicationVolume', 'volumeNumber': j.group('volume'),
                                          'isPartOf': {'@type': 'Periodical', 'name': j.group('name')}}},
                'pagination': p.group('pages'),
            })
        except (AttributeError, IndexError, StopIteration, ValueError):
            warn(page.rel, f'could not read the parts of a reference, so it is cited as text: {whole[:60]}…')
            node = {'@type': 'CreativeWork', 'name': whole}
            if doi:
                node.update({'@id': doi, 'url': doi})
        out.append(node)
    return out


def recordings(page, warn):
    """A VideoObject for each recording the page embeds (data-recording="<name>", with
    media/<name>.json, .mp4 and -poster.jpg or -poster.webp). Name and description come from the
    page's own text next to it (a heading and the caption), so the markup says what the page says."""
    out = []
    for el in page.tree.root.find(lambda n: n.attrs.get('data-recording')):
        name = el.attrs['data-recording']
        meta_path = os.path.join(ROOT, 'media', name + '.json')
        if not os.path.exists(meta_path):
            warn(page.rel, f'line {el.line}: data-recording="{name}" has no media/{name}.json')
            continue
        with open(meta_path, encoding='utf-8') as f:
            info = json.load(f)
        # The name: the first heading in the nearest figure, article or section round the
        # recording that has one (the recording's own step, feature card or section). The
        # description: the recording's own caption.
        heading = None
        for a in [el, *el.ancestors()]:
            if a.tag in ('figure', 'article', 'section'):
                heading = next((n for n in a.iter() if n.tag in ('h2', 'h3', 'h4')), None)
                if heading is not None:
                    break
        figure = next((a for a in [el, *el.ancestors()] if a.tag == 'figure'), el)
        caption = next((n for n in figure.iter() if n.tag == 'figcaption'), None)
        # The page's heading first; a "name" in the JSON that is only the file's name says nothing.
        json_name = info.get('name') if info.get('name') not in (None, '', name, name.split('/')[-1]) else ''
        title = (squash(heading.text()) if heading is not None else '') or json_name \
            or el.attrs.get('aria-label', '')
        poster = info.get('poster') or next((f'media/{name}-poster.{ext}' for ext in ('jpg', 'webp')
                                             if os.path.exists(os.path.join(ROOT, 'media', f'{name}-poster.{ext}'))), '')
        if not title or not poster or not os.path.exists(os.path.join(ROOT, poster)):
            warn(page.rel, f'line {el.line}: recording "{name}" needs a heading next to it and a poster for VideoObject')
            continue
        video = f'media/{name}.mp4'
        first = (git('log', '--diff-filter=A', '--format=%cs', '--', video) or '').split()
        node = {'@type': 'VideoObject', '@id': f'{page.url}#video-{name}', 'name': title,
                'thumbnailUrl': BASE + poster, 'uploadDate': info.get('uploadDate') or (first[-1] if first else TODAY),
                'inLanguage': page.lang}
        description = info.get('description') or (squash(caption.text()) if caption is not None else '')
        if description:
            node['description'] = description
        if info.get('duration'):
            node['duration'] = f'PT{round(float(info["duration"]))}S'
        if os.path.exists(os.path.join(ROOT, video)):
            node['contentUrl'] = BASE + video
        out.append(node)
    return out


def graph(page, pages, lastmod, warn):
    nodes = [org_node(), website_node(pages)]
    url = page.url
    web = {'@type': 'WebPage', '@id': url + '#webpage', 'url': url, 'name': page.title,
           'description': page.description, 'inLanguage': page.lang, 'isPartOf': ref(BASE + '#website'),
           'primaryImageOfPage': image_object(SITE['image']), 'dateModified': lastmod}
    if page.type == 'home':
        nodes.append(app_node(pages, page.lang))
    if page.type in ('home', 'hub', 'product'):
        web['about'] = ref(BASE + '#app')
    if page.conf.get('audience'):
        web['audience'] = audiences(page.conf['audience'])
    if page.type != 'home':
        web['breadcrumb'] = ref(url + '#breadcrumb')
    videos = recordings(page, warn)
    if videos:
        web['video'] = [ref(v['@id']) for v in videos]
    nodes.append(web)
    nodes += videos
    if page.type != 'home':
        nodes.append(breadcrumb(page, pages))
    qa = faq(page)
    if qa:
        nodes.append({'@type': 'FAQPage', '@id': url + '#faq', 'url': url, 'inLanguage': page.lang,
                      'isPartOf': ref(BASE + '#website'),
                      'mainEntity': [{'@type': 'Question', 'name': q,
                                      'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in qa]})
    if page.type == 'article':
        h1 = next((n for n in page.tree.root.iter() if n.tag == 'h1'), None)
        article = {'@type': 'Article', '@id': url + '#article',
                   'headline': squash(h1.text()) if h1 is not None else page.og_title,
                   'description': page.description, 'inLanguage': page.lang,
                   'datePublished': first_published(page), 'dateModified': lastmod,
                   'author': ref(BASE + '#org'), 'publisher': ref(BASE + '#org'),
                   'isPartOf': ref(BASE + '#website'), 'mainEntityOfPage': ref(url + '#webpage'),
                   'image': BASE + SITE['image']['path']}
        cited = citations(page, warn)
        if cited:
            article['citation'] = cited
        web['mainEntity'] = ref(url + '#article')
        nodes.append(article)
    data = json.dumps({'@context': 'https://schema.org', '@graph': nodes}, ensure_ascii=False, indent=1)
    return data.replace('</', '<\\/')


# ---------------------------------------------------------------- the meta block

def translation(page, pages):
    """(en page, ar page) when this page and its ar/ twin both exist and are indexable."""
    by_path = {p.path: p for p in pages}
    if page.lang == 'ar' and page.path.startswith('ar/'):
        en, ar = by_path.get(page.path[3:]), page
    else:
        en, ar = page, by_path.get('ar/' + page.path)
    if en and ar and en.indexable and ar.indexable:
        return en, ar
    return None


def meta_block(page, pages, lastmod, warn):
    r = page.root
    out = []
    pair = translation(page, pages) if page.indexable else None
    if page.indexable:
        out.append(f'<link rel="canonical" href="{page.url}">')
        if pair:
            en, ar = pair
            out += [f'<link rel="alternate" hreflang="en" href="{en.url}">',
                    f'<link rel="alternate" hreflang="ar" href="{ar.url}">',
                    f'<link rel="alternate" hreflang="x-default" href="{en.url}">']
    else:
        out.append('<meta name="robots" content="noindex, follow">')
    out += [f'<meta name="klaro-app" content="{attr(SITE["app"])}">',
            f'<meta name="theme-color" content="{SITE["themeColor"]}">',
            f'<link rel="icon" href="{r}favicon.ico" sizes="32x32">',
            f'<link rel="icon" href="{r}favicon.svg" type="image/svg+xml">',
            f'<link rel="apple-touch-icon" href="{r}apple-touch-icon.png">']
    img = SITE['image']
    alt = localized(img['alt'], page.lang)
    locales = SITE['locales']
    out += [f'<meta property="og:type" content="{"article" if page.type == "article" else "website"}">',
            f'<meta property="og:site_name" content="{attr(SITE["name"])}">',
            f'<meta property="og:locale" content="{locales.get(page.lang, page.lang)}">']
    if pair:
        other = 'ar' if page.lang == 'en' else 'en'
        out.append(f'<meta property="og:locale:alternate" content="{locales[other]}">')
    if page.indexable:
        out.append(f'<meta property="og:url" content="{page.url}">')
    out += [f'<meta property="og:title" content="{attr(page.og_title)}">',
            f'<meta property="og:description" content="{attr(page.description)}">',
            f'<meta property="og:image" content="{BASE + img["path"]}">',
            f'<meta property="og:image:width" content="{img["width"]}">',
            f'<meta property="og:image:height" content="{img["height"]}">',
            f'<meta property="og:image:alt" content="{attr(alt)}">',
            '<meta name="twitter:card" content="summary_large_image">']
    if page.indexable:
        out.append('<script type="application/ld+json">\n' + graph(page, pages, lastmod, warn) + '\n</script>')
    out += font_links(page)
    return '\n'.join(out)


def href_to(page, path):
    """A link from this page to a site path ('' is the home page, 'ar/' the Arabic home)."""
    if page.root == '/':
        return '/' + path
    up = posixpath.relpath(path.rstrip('/') or '.', posixpath.dirname(page.rel) or '.')
    return './' if up == '.' else up + '/'


def placeholders(page, pages):
    """{root}: the site root. {home}: this language's home page (the tutors' home).
    {twin}: this page in the other language when it exists, else the other language's home page.
    {home_tutors}, {home_students}: the two audience homes in this page's language (the English one
    while an Arabic one is missing). {aud}: the audience home a page points to: from the tutors'
    home, the students' one; from the students' home, the tutors' one; from a product page, the home
    of its "group" in site.json; from any other page, the students' home."""
    paths = {p.path for p in pages if p.deployed}
    if page.lang == 'ar':
        home, other_home = 'ar/', ''
        twin = page.path[3:] if page.path.startswith('ar/') else None
    else:
        home, other_home = '', 'ar/'
        twin = 'ar/' + page.path
    # A 404 page's language link goes to the other language's home, never to the other 404.
    if twin is None or twin not in paths or page.type == 'notfound':
        twin = other_home

    def local(en_path):
        ar = 'ar/' + en_path
        return ar if page.lang == 'ar' and ar in paths else en_path

    tutors, students = local(''), local('students/')
    core = page.path[3:] if page.path.startswith('ar/') else page.path
    if core == '':
        aud = students
    elif core == 'students/':
        aud = tutors
    elif page.conf.get('group') == 'tutors':
        aud = tutors
    else:
        aud = students
    return {'{root}': page.root, '{home}': href_to(page, home), '{twin}': href_to(page, twin),
            '{home_tutors}': href_to(page, tutors), '{home_students}': href_to(page, students),
            '{aud}': href_to(page, aud)}


def stamp(page, pages, lastmods, warn):
    values = placeholders(page, pages)

    def fill(m):
        name = m.group(2)
        if name == 'meta':
            body = meta_block(page, pages, lastmods[page.rel], warn)
        else:
            body = partial(name, page.lang)
            for key, value in values.items():
                body = body.replace(key, value)
        return f'{m.group(1)}\n{body}\n{m.group(4)}'
    return fill_page(BLOCK.sub(fill, page.html), page)


# ---------------------------------------------------------------- sitemap.xml and llms.txt

def sitemap(pages, lastmods):
    lines = ['<?xml version="1.0" encoding="UTF-8"?>',
             '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">']
    for p in sorted((p for p in pages if p.indexable), key=order_key):
        lines += ['  <url>', f'    <loc>{p.url}</loc>', f'    <lastmod>{lastmods[p.rel]}</lastmod>']
        pair = translation(p, pages)
        if pair:
            en, ar = pair
            lines += [f'    <xhtml:link rel="alternate" hreflang="en" href="{en.url}"/>',
                      f'    <xhtml:link rel="alternate" hreflang="ar" href="{ar.url}"/>',
                      f'    <xhtml:link rel="alternate" hreflang="x-default" href="{en.url}"/>']
        lines.append('  </url>')
    lines.append('</urlset>')
    return '\n'.join(lines) + '\n'


def llms(pages):
    by_path = {p.path: p for p in pages}
    home = by_path.get('')
    ar = by_path.get('ar/')
    site = f'- Website: {BASE}' + (f' (Arabic: {ar.url})' if ar and ar.indexable else '')
    out = [f'# {SITE["name"]}', '', f'> {SITE["org"]["description"]}', '']
    out += [f'- {fact}' for fact in SITE.get('facts', [])]
    out += [site, f'- App: {SITE["app"]}', '']

    def line(p):
        return f'- [{p.label}]({p.url}): {p.conf.get("llms") or p.description}'

    listed = [p for p in sorted(pages, key=order_key)
              if p.indexable and p.lang == 'en' and p is not home]
    for group, head in (('students', 'For students'), ('tutors', 'For tutors')):
        members = [p for p in listed if p.conf.get('group') == group]
        if members:
            out += [f'## {head}', ''] + [line(p) for p in members] + ['']
    rest = [p for p in listed if not p.conf.get('group')]
    if rest:
        out += ['## More', ''] + [line(p) for p in rest] + ['']
    # The Arabic pages: one short line each, naming the English page they translate.
    arabic = []
    for p in sorted(pages, key=order_key):
        if p.indexable and p.lang == 'ar':
            en = by_path.get(p.path[3:]) if p.path.startswith('ar/') else None
            what = 'The home page' if p.path == 'ar/' else (en.label if en else p.label)
            arabic.append(f'- [{p.label}]({p.url}): {what}, in Arabic.')
    if arabic:
        out += ['## Arabic', ''] + arabic + ['']
    return '\n'.join(out).rstrip('\n') + '\n'


# ---------------------------------------------------------------- checks

SCHEMA_PARENT = {
    'CreativeWork': 'Thing', 'Organization': 'Thing', 'Person': 'Thing', 'Intangible': 'Thing',
    'MediaObject': 'CreativeWork', 'ImageObject': 'MediaObject', 'VideoObject': 'MediaObject', 'WebSite': 'CreativeWork',
    'WebPage': 'CreativeWork', 'FAQPage': 'WebPage', 'SoftwareApplication': 'CreativeWork',
    'WebApplication': 'SoftwareApplication', 'Article': 'CreativeWork', 'ScholarlyArticle': 'Article',
    'Comment': 'CreativeWork', 'Answer': 'Comment', 'Question': 'Comment',
    'PublicationIssue': 'CreativeWork', 'PublicationVolume': 'CreativeWork',
    'CreativeWorkSeries': 'CreativeWork', 'Periodical': 'CreativeWorkSeries',
    'StructuredValue': 'Intangible', 'ContactPoint': 'StructuredValue', 'PostalAddress': 'ContactPoint',
    'ItemList': 'Intangible', 'BreadcrumbList': 'ItemList', 'ListItem': 'Intangible',
    'Audience': 'Intangible', 'EducationalAudience': 'Audience', 'DefinedTerm': 'Intangible',
}
# The schema.org properties this site uses, by the type that defines them (checked 2026-10-08).
SCHEMA_PROPS = {
    'Thing': {'name', 'url', 'description', 'image', 'sameAs', 'alternateName', 'mainEntityOfPage', 'identifier'},
    'CreativeWork': {'inLanguage', 'isPartOf', 'about', 'author', 'publisher', 'datePublished', 'dateModified',
                     'headline', 'citation', 'audience', 'mainEntity', 'text', 'hasPart', 'keywords',
                     'thumbnailUrl', 'video'},
    'Organization': {'logo', 'slogan', 'email', 'legalName', 'foundingDate', 'address', 'founder', 'contactPoint'},
    'Person': {'familyName', 'givenName', 'jobTitle'},
    'MediaObject': {'width', 'height', 'contentUrl', 'embedUrl', 'uploadDate', 'duration'},
    'VideoObject': {'caption', 'transcript'},
    'ImageObject': {'caption'},
    'WebPage': {'breadcrumb', 'primaryImageOfPage', 'lastReviewed'},
    'SoftwareApplication': {'applicationCategory', 'operatingSystem', 'featureList'},
    'Article': {'pagination', 'articleSection'},
    'Question': {'acceptedAnswer', 'suggestedAnswer', 'answerCount'},
    'PublicationIssue': {'issueNumber', 'pagination'},
    'PublicationVolume': {'volumeNumber', 'pagination'},
    'Periodical': {'issn'},
    'PostalAddress': {'addressCountry', 'addressLocality', 'addressRegion', 'postalCode', 'streetAddress'},
    'ContactPoint': {'email', 'contactType', 'telephone'},
    'ItemList': {'itemListElement', 'numberOfItems'},
    'ListItem': {'position', 'item'},
    'Audience': {'audienceType'},
    'EducationalAudience': {'educationalRole'},
}


def schema_errors(value, where='@graph'):
    errors = []
    if isinstance(value, list):
        for i, v in enumerate(value):
            errors += schema_errors(v, f'{where}[{i}]')
        return errors
    if not isinstance(value, dict):
        return errors
    if set(value) <= {'@id'}:
        return errors                                     # a reference to a node
    types = value.get('@type')
    if types is None:
        return [f'{where}: no @type']
    allowed = set()
    for t in types if isinstance(types, list) else [types]:
        if t not in SCHEMA_PARENT and t != 'Thing':
            errors.append(f'{where}: unknown type {t}')
        while t:
            allowed |= SCHEMA_PROPS.get(t, set())
            t = SCHEMA_PARENT.get(t)
    for key, v in value.items():
        if key.startswith('@'):
            continue
        if key not in allowed:
            errors.append(f'{where}: {types} has no property "{key}"')
        errors += schema_errors(v, f'{where}.{key}')
    return errors


def resolve(page, link):
    """(target file relative to the root, fragment), None for an outside link, or an error string."""
    if link.startswith(BASE):
        link = '/' + link[len(BASE):]
    if re.match(r'^[a-z][a-z0-9+.-]*:', link, re.I) or link.startswith('//'):
        return None
    path, _, frag = link.partition('#')
    path = path.split('?')[0]
    if path == '':
        return page.rel, frag
    if path.startswith('/'):
        target = posixpath.normpath(path.lstrip('/') or '.')
    else:
        target = posixpath.normpath(posixpath.join(posixpath.dirname(page.rel), path))
    if target == '..' or target.startswith('../'):
        return f'{link} leaves the site'
    if target == '.':
        target = 'index.html'
    elif path.endswith('/') or os.path.isdir(os.path.join(ROOT, target)):
        target = target + '/index.html'
    return target, frag


def ids(tree):
    return {n.attrs['id'] for n in tree.root.iter() if n.attrs.get('id')}


ARABIC = re.compile(r'[\u0600-\u06ff]')
LATIN = re.compile(r'[A-Za-z]')
EASTERN_DIGITS = re.compile(r'[\u0660-\u0669\u06f0-\u06f9]')
HARAKAT = re.compile(r'[\u064b-\u0652\u0640]')
AI_WORDS = re.compile(r'(?<![A-Za-z])AI(?![A-Za-z])|(?i:artificial intelligence|chatbot|\bassistant\b|\bGPT\b)|ذكاء\s*(?:ال)?اصطناعي')
TEXT_ATTRS = ('alt', 'aria-label', 'title', 'placeholder')


def mostly_arabic(text):
    text = text.replace(SITE['name'], '')
    return len(ARABIC.findall(text)) > len(LATIN.findall(text))


def check_arabic(page, problem):
    """design/brief/arabic.md, section 9: the rules a machine can check on an ar/ page."""
    rel = page.rel
    for what, value in (('title', page.title), ('description', page.description)):
        if value and not mostly_arabic(value):
            problem(rel, f'the {what} is not in Arabic: {value}')
        if value and EASTERN_DIGITS.search(value):
            problem(rel, f'the {what} has Eastern Arabic digits (use 0–9)')
    for n in page.tree.root.iter():
        if n.tag in ('script', 'style'):
            continue
        chain = [n, *n.ancestors()]
        english = any(a.attrs.get('lang', '').startswith('en') for a in chain)
        texts = [('text', c) for c in n.children if isinstance(c, str) and c.strip()]
        texts += [(f'{k}=', n.attrs[k]) for k in TEXT_ATTRS if n.attrs.get(k)]
        for where, text in texts:
            short = squash(text)[:50]
            if '→' in text and not english:
                problem(rel, f'line {n.line}: a text arrow → in Arabic copy (write ←, or the SVG icon): {where} {short}')
            if EASTERN_DIGITS.search(text):
                problem(rel, f'line {n.line}: Eastern Arabic digits (use 0–9): {where} {short}')
        if 'flip' in n.classes() and n.tag != 'svg' and squash(n.text()):
            problem(rel, f'line {n.line}: .flip on text ("{squash(n.text())[:10]}"); text arrows mirror by themselves, use .flip only on SVG icons')


def visible_texts(page):
    """(element, where, text) for the page's text and its text attributes (not scripts or styles)."""
    for n in page.tree.root.iter():
        if n.tag in ('script', 'style'):
            continue
        for c in n.children:
            if isinstance(c, str) and c.strip():
                yield n, 'text', c
        for k in TEXT_ATTRS:
            if n.attrs.get(k):
                yield n, f'{k}=', n.attrs[k]


def check_no_ai(page, problem):
    """The owner's rule: the site never mentions AI (redesign.md 8.1: no motto exception)."""
    for what, value in (('title', page.title), ('description', page.description)):
        if value and AI_WORDS.search(HARAKAT.sub('', value)):
            problem(page.rel, f'the {what} mentions AI')
    for n, where, text in visible_texts(page):
        if AI_WORDS.search(HARAKAT.sub('', text)):
            problem(page.rel, f'line {n.line}: mentions AI: {where} {squash(text)[:50]}')


def check_page(page, pages, problem, warn, missing):
    rel = page.rel
    root = page.tree.root
    by_rel = {p.rel: p for p in pages}
    # Language matches the folder.
    html = next((n for n in root.iter() if n.tag == 'html'), None)
    want = ('ar', 'rtl') if page.path.startswith('ar/') else ('en', 'ltr')
    got = (html.attrs.get('lang', '') if html is not None else '', html.attrs.get('dir', 'ltr') if html is not None else '')
    if got[0].split('-')[0] != want[0] or (want[1] == 'rtl' and got[1] != 'rtl'):
        problem(rel, f'<html lang="{got[0]}" dir="{got[1]}"> should be lang="{want[0]}" dir="{want[1]}"')
    if page.path.startswith('ar/'):
        check_arabic(page, problem)
    check_no_ai(page, problem)
    # Title and description.
    if not page.title:
        problem(rel, 'no <title>')
    elif len(page.title) > TITLE_MAX:
        problem(rel, f'title is {len(page.title)} characters (at most {TITLE_MAX}): {page.title}')
    elif len(page.title) < TITLE_SHORT and page.indexable:
        warn(rel, f'title is only {len(page.title)} characters: {page.title}')
    if not page.description:
        problem(rel, 'no <meta name="description">')
    elif not DESC_MIN <= len(page.description) <= DESC_MAX:
        problem(rel, f'description is {len(page.description)} characters ({DESC_MIN}–{DESC_MAX})')
    if '<!-- chrome:meta -->' not in page.html:
        problem(rel, 'no <!-- chrome:meta --> block in <head>')
    # One h1.
    h1s = [n for n in root.iter() if n.tag == 'h1']
    if len(h1s) != 1:
        problem(rel, f'{len(h1s)} <h1> elements (want one), lines {[n.line for n in h1s]}')
    # Images.
    for img in root.find(lambda n: n.tag == 'img'):
        if 'alt' not in img.attrs:
            problem(rel, f'line {img.line}: <img src="{img.attrs.get("src", "")}"> has no alt')
        if not ('width' in img.attrs and 'height' in img.attrs):
            warn(rel, f'line {img.line}: <img src="{img.attrs.get("src", "")}"> has no width and height')
    # JSON-LD parses and uses real schema.org types and properties.
    for script in root.find(lambda n: n.tag == 'script' and n.attrs.get('type') == 'application/ld+json'):
        try:
            data = json.loads(script.text())
        except ValueError as e:
            problem(rel, f'line {script.line}: JSON-LD does not parse: {e}')
            continue
        if data.get('@context') != 'https://schema.org':
            problem(rel, f'line {script.line}: JSON-LD @context is not https://schema.org')
        for err in schema_errors(data.get('@graph', data)):
            problem(rel, f'line {script.line}: JSON-LD {err}')
    # Mock-ups stay out of search snippets and AI answers (screen readers still get their aria-label).
    marked = set(SITE.get('nosnippet', []))
    for n in root.iter():
        if marked & set(n.classes()) and 'data-nosnippet' not in n.attrs and \
                not any('data-nosnippet' in a.attrs for a in n.ancestors()):
            problem(rel, f'line {n.line}: illustrative .{" .".join(sorted(marked & set(n.classes())))} without data-nosnippet')
    # Links: no "#" placeholders, and every internal link, asset and fragment resolves.
    own_ids = ids(page.tree)
    for n in root.iter():
        links = [(key, n.attrs[key]) for key in ('href', 'src', 'poster') if key in n.attrs]
        links += [('srcset', c.split()[0]) for c in n.attrs.get('srcset', '').split(',') if c.strip()]
        for key, link in links:
            if n.tag == 'link' and n.attrs.get('rel') in ('preconnect', 'dns-prefetch'):
                continue
            if n.tag == 'a' and link == '#':
                problem(rel, f'line {n.line}: <a href="#"> ({squash(n.text())[:40]})')
                continue
            if not link:
                problem(rel, f'line {n.line}: empty {key} on <{n.tag}>')
                continue
            res = resolve(page, link)
            if res is None:
                continue
            if isinstance(res, str):
                problem(rel, f'line {n.line}: {res}')
                continue
            target, frag = res
            if target == rel:
                if frag and frag not in own_ids:
                    problem(rel, f'line {n.line}: {link} has no target id="{frag}" on this page')
                continue
            if not os.path.exists(os.path.join(ROOT, target)):
                if target.startswith('ar/') and os.path.exists(os.path.join(ROOT, target[3:])):
                    missing.setdefault(target, []).append(rel)   # reported once, in main()
                else:
                    problem(rel, f'line {n.line}: {link} → {target} does not exist')
                continue
            if not deployed(target) and page.deployed:
                problem(rel, f'line {n.line}: {link} → {target} is kept off the site by .assetsignore')
            if frag and target in by_rel and frag not in ids(by_rel[target].tree):
                problem(rel, f'line {n.line}: {link} has no target id="{frag}" in {target}')


def check_site(pages, problem, warn):
    seen_t, seen_d = {}, {}
    for p in pages:
        if not p.indexable:
            continue
        for value, seen, what in ((p.title, seen_t, 'title'), (p.description, seen_d, 'description')):
            if value and value in seen:
                problem(p.rel, f'same {what} as {seen[value]}')
            seen.setdefault(value, p.rel)
    paths = {p.path for p in pages}
    for path in SITE['pages']:
        if path not in paths:
            warn('tools/site.json', f'names a page that does not exist yet: "{path}"')
    words = [SITE['org'].get('description', ''), SITE['org'].get('slogan', ''), *SITE.get('facts', [])]
    alt = SITE['image']['alt']
    words += list(alt.values()) if isinstance(alt, dict) else [alt]
    for text in words:
        if AI_WORDS.search(HARAKAT.sub('', text)):
            problem('tools/site.json', f'mentions AI: {text[:60]}')
    robots = os.path.join(ROOT, 'robots.txt')
    if not os.path.exists(robots):
        problem('robots.txt', 'missing')
    elif f'Sitemap: {BASE}sitemap.xml' not in read(robots):
        problem('robots.txt', f'no "Sitemap: {BASE}sitemap.xml" line')
    for key in ('image', 'logo'):
        if not os.path.exists(os.path.join(ROOT, SITE[key]['path'])):
            problem('tools/site.json', f'{key} {SITE[key]["path"]} does not exist')


# ---------------------------------------------------------------- main

def main():
    args = sys.argv[1:]
    check, report = '--check' in args, '--report' in args
    only = {os.path.relpath(os.path.abspath(a), ROOT).replace(os.sep, '/') for a in args if not a.startswith('--')}
    pages = [Page(rel) for rel in discover()]
    problems, warnings = [], []

    def problem(where, msg):
        problems.append(f'{where}: {msg}')

    def warn(where, msg):
        if f'{where}: {msg}' not in warnings:
            warnings.append(f'{where}: {msg}')

    if report:
        for p in sorted(pages, key=order_key):
            flag = '' if p.indexable else '  [noindex]' if p.deployed else '  [not deployed]'
            print(f'{p.url}{flag}\n  title ({len(p.title)}): {p.title}\n  description ({len(p.description)}): {p.description}')
        return

    lastmods = {p.rel: last_modified(p, fill_page(p.html, p)) for p in pages}
    stale = []
    for p in pages:
        if p.frozen:
            continue
        out = stamp(p, pages, lastmods, warn) if "<!-- chrome:" in p.html else fill_page(p.html, p)
        if out != p.html and (not only or p.rel in only):
            stale.append(p.rel)
            if not check:
                with open(p.file, 'w', encoding='utf-8') as f:
                    f.write(out)
                p.html, p.tree = out, Tree(out)
    for name, text in (('sitemap.xml', sitemap(pages, lastmods)), ('llms.txt', llms(pages))):
        path = os.path.join(ROOT, name)
        if not os.path.exists(path) or read(path) != text:
            stale.append(name)
            if not check:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(text)

    for rel in stale:
        if check:
            problem(rel, 'out of date: run python3 tools/site.py')
        else:
            print('wrote: ' + rel)
    missing = {}
    for p in pages:
        if p.frozen:
            # A legacy page kept for reference: one warning, never a failure.
            broken = []
            check_page(p, pages, lambda where, msg: broken.append(msg), lambda *a: None, {})
            if broken:
                warn(p.rel, f'frozen in site.json: not stamped, and {len(broken)} rule(s) it breaks are not enforced')
            continue
        check_page(p, pages, problem, warn, missing)
    for target, sources in sorted(missing.items()):
        page_url = target[:-len('index.html')] if target.endswith('index.html') else target
        shown = ', '.join(sorted(set(sources))[:4]) + (', …' if len(set(sources)) > 4 else '')
        problem(page_url, f'no Arabic page yet (its English twin exists), but {len(set(sources))} '
                          f'page(s) link to it: {shown}. Add it, or link to the English page with hreflang="en"')
    check_site(pages, problem, warn)
    for w in warnings:
        print('warning: ' + w)
    for msg in problems:
        print('problem: ' + msg)
    if problems:
        sys.exit(1)
    print(f'ok: {len(pages)} pages, {sum(p.indexable for p in pages)} in the sitemap')


if __name__ == '__main__':
    main()
