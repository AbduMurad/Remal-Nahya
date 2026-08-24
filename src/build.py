# -*- coding: utf-8 -*-
"""Static site generator for Remal Nahya.

Emits two things from one content model:
  dist/{en,ar}/*.html   — a real multi-page static site (proper URLs, SEO, srcset)
  dist/remal-nahya.html — a single self-contained file for the hosted demo
"""
import os, json, re, shutil, sys, html as H

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
DIST = os.path.join(ROOT, 'dist')
sys.path.insert(0, HERE)

from content import EN, AR, SERVICES, PAGES, FACTS
from assets_svg import (LOGO_MARK, HERO_SCENE, WELLBORE, DRONE_SCENE, LIBYA_MAP,
                        TOOL_WRENCH, TOOL_SOCKET, TOOL_PIPE, TOOL_HYDRAULIC, TOOL_ATEX, ICONS)

IMGS = json.load(open(os.path.join(ROOT, 'tools', 'imgs.json')))
CSS = open(os.path.join(HERE, 'site.css'), encoding='utf-8').read()
JS = open(os.path.join(HERE, 'site.js'), encoding='utf-8').read()

MODE = 'files'          # 'files' | 'single'
TOOL_ART = dict(wrench=TOOL_WRENCH, socket=TOOL_SOCKET, pipe=TOOL_PIPE,
                hydraulic=TOOL_HYDRAULIC, atex=TOOL_ATEX)

FONTS_JSON = json.load(open(os.path.join(ROOT, 'tools', 'fonts.json')))
# Self-hosted: no third-party request, and the type still renders on a slow Libyan link.
FONTS_FILES = ('<link rel="preload" as="font" type="font/woff2" crossorigin '
               'href="../assets/fonts/ibmplexsans-600-latin.woff2">'
               '<style>%s</style>' % FONTS_JSON['file_css'])
FONTS_INLINE = '<style>%s</style>' % FONTS_JSON['inline_css']

FAVICON = ('<link rel="icon" href="data:image/svg+xml,'
           '%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 104 128\'%3E'
           '%3Cpath d=\'M52 3C52 3 97 52 97 80a45 45 0 0 1-90 0C7 52 52 3 52 3Z\' '
           'fill=\'%231B2A5B\'/%3E'
           '%3Cpath d=\'M38 96 52 38 66 96M43 76h18M40 87h24\' stroke=\'%23C8102E\' '
           'stroke-width=\'7\' fill=\'none\' stroke-linecap=\'round\'/%3E%3C/svg%3E">')

e = H.escape
def ic(n): return ICONS.get(n, ICONS['arrow'])


# Latin / numeric runs inside Arabic prose must be bidi-isolated, or a string like
# "Rompetrol Well Services وSCA-Sichuan" reorders and breaks across lines wrongly.
_L = r'A-Za-zÀ-ɏ'
_RUNC = _L + r'0-9&/+._,@₀-₉\-'
_LATIN_RUN = re.compile(
    r'(?<![' + _L + r'0-9])'
    r'((?:[' + _L + r'0-9][' + _RUNC + r']*)(?:[  ](?:[' + _L + r'0-9][' + _RUNC + r']*))*)')
_HAS_ALPHA = re.compile(r'[' + _L + r']')
_SVG_SPLIT = re.compile(r'(<svg[\s\S]*?</svg>)', re.I)
_TEXT_NODE = re.compile(r'>([^<>]+)<')


def _wrap(m):
    run = m.group(1)
    if not _HAS_ALPHA.search(run):
        return run                       # bare numerals already read correctly in RTL
    tail = ''
    while run and run[-1] in '.,':       # keep sentence punctuation outside the isolate
        tail = run[-1] + tail
        run = run[:-1]
    if not run:
        return m.group(1)
    return '<bdi>%s</bdi>%s' % (run, tail)


def bidi_isolate(html_str):
    """Wrap Latin runs in <bdi>, skipping tags, attributes and inline SVG."""
    svgs = []

    def stash(m):
        svgs.append(m.group(0))
        return '\x00%d\x00' % (len(svgs) - 1)

    tmp = _SVG_SPLIT.sub(stash, html_str)
    tmp = _TEXT_NODE.sub(
        lambda m: '>' + _LATIN_RUN.sub(_wrap, m.group(1)) + '<'
        if m.group(1).strip() else m.group(0), tmp)
    # text that begins a run right after a stashed <svg> placeholder
    tmp = re.sub(r'(\x00\d+\x00)([^<>]+)',
                 lambda m: m.group(1) + _LATIN_RUN.sub(_wrap, m.group(2)), tmp)
    return re.sub(r'\x00(\d+)\x00', lambda m: svgs[int(m.group(1))], tmp)


# ------------------------------------------------------------------ helpers
def href(lang, page, anchor=''):
    a = ('#' + anchor) if anchor else ''
    if MODE == 'single':
        return '#/%s/%s%s' % (lang, page, a)
    if page == 'index':
        return '../%s/index.html%s' % (lang, a) if False else 'index.html' + a
    return page + '.html' + a


def link(lang, page, anchor=''):
    """Cross-page link, correct in both modes."""
    if MODE == 'single':
        return '#/%s/%s%s' % (lang, page, ('#' + anchor) if anchor else '')
    tgt = 'index.html' if page == 'index' else page + '.html'
    return tgt + (('#' + anchor) if anchor else '')


def lang_link(lang, page):
    if MODE == 'single':
        return '#/%s/%s' % (lang, page)
    return '../%s/%s' % (lang, 'index.html' if page == 'index' else page + '.html')


IMG_CLASSES = {}   # name -> css class, for single-file mode


def photo(name, alt, cls='', sizes='100vw', eager=False):
    """A responsive photo. Real <img> in file mode; shared CSS background in single mode."""
    m = IMGS[name]
    if MODE == 'single':
        IMG_CLASSES[name] = 'pi-' + name
        return ('<div class="photo pi-%s %s" role="img" aria-label="%s"></div>'
                % (name, cls, e(alt)))
    srcset = ', '.join('../assets/img/%s %dw' % (s['f'], s['w']) for s in m['srcs'])
    return ('<img class="photo %s" src="../assets/img/%s" srcset="%s" sizes="%s" '
            'width="%d" height="%d" alt="%s" %s decoding="async" '
            'style="background-image:url(%s);background-size:cover">'
            % (cls, m['jpg'], srcset, sizes, m['w'], m['h'], e(alt),
               'fetchpriority="high"' if eager else 'loading="lazy"', m['lqip']))


def photo_bg(name, cls=''):
    """Full-bleed decorative backdrop."""
    m = IMGS[name]
    if MODE == 'single':
        IMG_CLASSES[name] = 'pi-' + name
        return '<div class="bgphoto pi-%s %s" aria-hidden="true"></div>' % (name, cls)
    srcset = ', '.join('../assets/img/%s %dw' % (s['f'], s['w']) for s in m['srcs'])
    return ('<img class="bgphoto %s" src="../assets/img/%s" srcset="%s" sizes="100vw" '
            'alt="" aria-hidden="true" loading="lazy" decoding="async">' % (cls, m['jpg'], srcset))


def stat_tile(s):
    fmt = ('{:,}'.format(s['n']) if s['group'] else str(s['n'])) + s['post']
    if 1900 < s['n'] < 2100 and not s['group']:          # a year, not a quantity
        return '<div class="stat"><b dir="ltr">%s</b><span>%s</span></div>' % (e(fmt), e(s['label']))
    return ('<div class="stat"><b dir="ltr" data-count="%d" data-post="%s" data-group="%d" '
            'data-fmt="%s">0</b><span>%s</span></div>'
            % (s['n'], e(s['post']), s['group'], e(fmt), e(s['label'])))


def btn(label, url, kind='primary', icon='arrow'):
    return '<a class="btn btn--%s" href="%s">%s%s</a>' % (kind, url, e(label), ic(icon))


def tlink(label, url):
    return '<a class="tlink" href="%s">%s%s</a>' % (url, e(label), ic('arrow'))


def rv(i=0):
    return ' data-rv="%d"' % i


HOME_ONLY_NUM = True


def eyebrow(text, home=False):
    """Shared modules carry a `NN — ` prefix that only makes sense in the homepage
    sequence; strip it everywhere else."""
    t = text
    if not home:
        t = re.sub(r'^\d{2}\s*[—-]\s*', '', t)
    return '<div class="eyebrow">%s</div>' % e(t)


# ------------------------------------------------------------------ chrome
def header(C, page):
    lang = C['lang']
    nav = ''.join(
        '<a href="%s"%s>%s</a>' % (link(lang, p), ' aria-current="page"' if p == page else '', e(C['nav'][p]))
        for p in PAGES)
    dnav = ''.join(
        '<a href="%s">%s%s</a>' % (link(lang, p), e(C['nav'][p]), ic('arrow')) for p in PAGES)
    depots = ''.join('<span><i></i>%s</span>' % e(d) for d in C['depots'])
    wm = ('<span class="logo__wm logo__wm--ar"><b>رمال ناهية</b><i>للخدمات النفطية</i></span>'
          if lang == 'ar' else
          '<span class="logo__wm"><b>REMAL NAHYA</b><i>FOR OIL SERVICES</i></span>')
    logo = '<a class="logo" href="%s">%s%s</a>' % (
        link(lang, 'index'), '<span class="logo__mark">%s</span>' % LOGO_MARK, wm)

    return '''
<a class="skip" href="#main">%(skip)s</a>
<div class="prog" id="prog"></div>
<div class="topbar"><div class="shell shell--wide"><div class="topbar__in">
  <div class="depots">%(depots)s</div>
  <div class="topbar__r">
    <a href="tel:%(tel)s" class="ltr">%(tel_d)s</a>
    <a href="mailto:%(mail)s" class="ltr">%(mail)s</a>
  </div>
</div></div></div>
<header class="hdr"><div class="shell shell--wide"><div class="hdr__in">
  %(logo)s
  <nav class="nav" aria-label="%(navlab)s">%(nav)s</nav>
  <div class="hdr__cta">
    <a class="lang" href="%(other)s" hreflang="%(ol)s" lang="%(ol)s">%(globe)s%(olabel)s</a>
    %(cta)s
    <button class="burger" id="burger" aria-label="%(menu)s" aria-expanded="false" aria-controls="drawer">%(mi)s</button>
  </div>
</div></div></header>
<div class="drawer" id="drawer">
  <div class="drawer__top">%(logo)s
    <button class="burger" id="drawerClose" aria-label="%(close)s">%(ci)s</button></div>
  <nav aria-label="%(navlab)s">%(dnav)s</nav>
  <div class="drawer__foot">
    <a class="btn btn--primary" href="%(contact)s">%(ctal)s%(ai)s</a>
    <a class="btn btn--ghost" href="%(other)s" hreflang="%(ol)s" lang="%(ol)s">%(globe)s%(olabel)s</a>
  </div>
</div>''' % dict(
        skip=e(C['skip']), depots=depots, tel=FACTS['phone1'].replace(' ', ''),
        tel_d=e(FACTS['phone1']), mail=FACTS['email'], logo=logo, nav=nav, dnav=dnav,
        navlab='Main' if lang == 'en' else 'التنقل الرئيسي',
        other=lang_link(C['other'], page), ol=C['other'], olabel=e(C['other_label']),
        globe=ic('globe'), cta=btn(C['cta_nav'], link(lang, 'contact'), 'primary'),
        menu='Menu' if lang == 'en' else 'القائمة',
        close='Close' if lang == 'en' else 'إغلاق', mi=ic('menu'), ci=ic('close'),
        contact=link(lang, 'contact'), ctal=e(C['cta_nav']), ai=ic('arrow'))


def cta_band(C):
    lang = C['lang']; b = C['cta_band']
    return '''
<section class="ctaband grain"><div class="shell"><div class="ctaband__in">
  <div%s><h2>%s</h2><p class="lede">%s</p></div>
  <div class="btn-row" style="margin:0">%s%s</div>
</div></div></section>''' % (rv(), e(b['h']), e(b['p']),
                             btn(b['b1'], link(lang, 'contact'), 'primary'),
                             '<a class="btn btn--ghost" href="tel:%s">%s<span class="ltr">%s</span></a>'
                             % (FACTS['phone1'].replace(' ', ''), ic('phone'), e(FACTS['phone1'])))


def footer(C, page):
    lang = C['lang']; f = C['foot']
    comp = ''.join('<li><a href="%s">%s</a></li>' % (link(lang, p), e(C['nav'][p]))
                   for p in ['about', 'services', 'contact'])
    srv = ''.join('<li><a href="%s">%s</a></li>' % (link(lang, p), e(t)) for p, t in C['foot_services'])
    wm = ('<span class="logo__wm logo__wm--ar"><b>رمال ناهية</b><i>للخدمات النفطية</i></span>'
          if lang == 'ar' else
          '<span class="logo__wm"><b>REMAL NAHYA</b><i>FOR OIL SERVICES</i></span>')
    return '''
<footer class="foot"><div class="shell shell--wide">
  <div class="foot__grid">
    <div>
      <div class="logo"><span class="logo__mark">%(mark)s</span>%(wm)s</div>
      <p class="foot__about">%(about)s</p>
    </div>
    <div><h3>%(c1)s</h3><ul>%(comp)s</ul></div>
    <div><h3>%(c2)s</h3><ul>%(srv)s</ul></div>
    <div><h3>%(c3)s</h3><ul>
      <li><a href="tel:%(t1)s" class="ltr">%(t1d)s</a></li>
      <li><a href="tel:%(t2)s" class="ltr">%(t2d)s</a></li>
      <li><a href="mailto:%(mail)s" class="ltr">%(mail)s</a></li>
      <li>%(addr)s</li>
    </ul></div>
  </div>
  <div class="foot__bar">
    <span>%(legal)s</span>
    <span style="color:var(--steel-300)">%(built)s</span>
    <div class="foot__soc">
      <a href="#" aria-label="LinkedIn">%(link)s</a>
      <a href="https://%(site)s" aria-label="Website">%(globe)s</a>
    </div>
  </div>
</div></footer>''' % dict(
        mark=LOGO_MARK, wm=wm, about=e(f['about']), c1=e(f['c1']), c2=e(f['c2']), c3=e(f['c3']),
        comp=comp, srv=srv, t1=FACTS['phone1'].replace(' ', ''), t1d=e(FACTS['phone1']),
        t2=FACTS['phone2'].replace(' ', ''), t2d=e(FACTS['phone2']), mail=FACTS['email'],
        addr=e('Gergarish Main Road, Hay Al-Andalus, Tripoli, Libya' if lang == 'en'
               else 'طريق قرقارش الرئيسي، حي الأندلس، طرابلس، ليبيا'),
        legal=e(f['legal']), built=e(f['built']), link=ic('link'), globe=ic('globe'),
        site=FACTS['site'])


def phead(C, page, img, h, lede):
    lang = C['lang']
    crumb = ('<div class="crumb"><a href="%s">%s</a><i>/</i><span>%s</span></div>'
             % (link(lang, 'index'), e(C['nav']['index']), e(C['nav'][page])))
    return '''<section class="phead">
  %s
  <div class="shell"><div class="phead__in">%s<h1%s>%s</h1><p class="lede"%s>%s</p></div></div>
</section>''' % (photo_bg(img, 'phead__bg'), crumb, rv(), e(h), rv(1), e(lede))


# ------------------------------------------------------------------ shared blocks
def lead_table(C):
    L = C['lead']
    rows = ''.join(
        '<div class="lead__row"%s>'
        '<div class="lead__k">%s</div>'
        '<div class="lead__v num">%s</div>'
        '<div class="lead__d">%s</div>'
        '<div class="lead__t"><span>%s</span></div></div>'
        % (rv(i), e(r['k']), e(r['v']), e(r['d']), e(r['tag']))
        for i, r in enumerate(L['rows']))
    return ('<section class="sec sec--dark"><div class="shell">'
            '<div class="sec-head"%s><div class="eyebrow">%s</div><h2>%s</h2>'
            '<p class="lede">%s</p></div><div class="lead">%s</div></div></section>'
            % (rv(), e(L['eyebrow']), e(L['h']), e(L['lede']), rows))


def ask_tile(C, span=1):
    """Fills the ragged last row of a card grid with a routed call to action."""
    lang = C['lang']
    h = 'Not on this list?' if lang == 'en' else 'غير مدرج في القائمة؟'
    p = ('Send us the specification and we will tell you whether it comes from stock, '
         'from import, or from a partner — and how long it takes.' if lang == 'en' else
         'أرسل لنا المواصفة ونخبرك إن كانت من المخزون أو بالاستيراد أو عبر شريك، وكم تستغرق.')
    return ('<article class="srv srv--cta" style="grid-column:span %d">'
            '<div class="srv__ic">%s</div>'
            '<div><h3>%s</h3><p>%s</p><div style="margin-block-start:1.25rem">%s</div></div>'
            '</article>' % (span, ic('mail'), e(h), e(p),
                            tlink(C['cta_nav'], link(lang, 'contact'))))


def service_card(C, s, idx=0):
    lang = C['lang']; d = s[lang]
    specs = ''.join('<span>%s</span>' % e(x) for x in d['specs'])
    by = ('<div class="srv__by">%s %s</div>'
          % ('Delivered with' if lang == 'en' else 'بالتعاون مع', e(d['by']))) if d['by'] else ''
    search = (d['h'] + ' ' + d['p'] + ' ' + ' '.join(d['specs']) + ' ' + d['by']).lower()
    return ('<article class="srv" data-cat="%s" data-search="%s"%s>'
            '<div class="srv__ic">%s</div>'
            '<div><h3>%s</h3><p>%s</p><div class="srv__specs">%s</div>%s</div></article>'
            % (s['cat'], e(search), rv(idx % 3), ic(s['icon']), e(d['h']), e(d['p']), specs, by))


def filter_bar(C, cats):
    chips = ''.join('<button class="chip" data-filter="%s" aria-pressed="%s">%s</button>'
                    % (c, 'true' if c == 'all' else 'false', e(C['filter_labels'][c])) for c in cats)
    return ('<div class="filters" id="srvfilter">%s'
            '<div class="searchbox">%s<input type="search" placeholder="%s" aria-label="%s"></div>'
            '</div>' % (chips, ic('search'), e(C['search_ph']), e(C['search_ph'])))


def well_scroller(C, with_head=True, home=False):
    lang = C['lang']; w = C['well_sec']
    steps = ''.join(
        '<article class="wstep" data-stage="%s"%s>'
        '<div class="wstep__n"><i></i>%s</div><h3>%s</h3><p>%s</p>'
        '<div><span class="wstep__spec">%s%s</span></div>'
        '<div class="srv__by" style="margin-top:.9rem">%s %s</div></article>'
        % (s['stage'], rv(i), e(s['n']), e(s['h']), e(s['p']), ic('gauge'), e(s['spec']),
           'Delivered with' if lang == 'en' else 'بالتعاون مع', e(s['by']))
        for i, s in enumerate(C['well_steps']))
    head = ('<div class="sec-head"%s>%s<h2>%s</h2>'
            '<p class="lede">%s</p></div>'
            % (rv(), eyebrow(w['eyebrow'], home), e(w['h']), e(w['lede']))) if with_head else ''
    return '''<section class="sec wellsec tgrid" id="lifecycle"><div class="shell">
  %s
  <div class="wellwrap" id="wellwrap">
    <div class="wellstick">%s</div>
    <div class="wellsteps">%s</div>
  </div>
  <div class="btn-row">%s</div>
</div></section>''' % (head, WELLBORE, steps,
                       btn(w['cta'], link(lang, 'well-services'), 'line'))


def partners_block(C, home=False):
    p = C['partners']
    rows = ''.join(
        '<article class="partner"%s><div class="partner__n">%s</div>'
        '<div class="partner__b"><h3>%s</h3><p>%s</p>'
        '<div class="partner__tags">%s</div></div>'
        '<div class="partner__f">%s</div></article>'
        % (rv(i), e(x['n'] + ' · ' + x['c']), e(x['h']), e(x['p']),
           ''.join('<span>%s</span>' % e(t) for t in x['tags']), ic('link'))
        for i, x in enumerate(C['partner_list']))
    return '''<section class="sec sec--darkest" id="partners" style="position:relative;overflow:hidden">
  %s
  <div class="shell" style="position:relative;z-index:2">
    <div class="sec-head"%s>%s<h2>%s</h2><p class="lede">%s</p></div>
    %s
  </div>
</section>''' % (photo_bg('partners', 'sec__bg'), rv(), eyebrow(p['eyebrow'], home),
                 e(p['h']), e(p['lede']), rows)


def drone_block(C, home=False):
    lang = C['lang']; d = C['drone']
    li = ''.join('<li>%s<span>%s</span></li>' % (ic('check'), e(x)) for x in d['li'])
    return '''<section class="sec sec--dark" id="drone"><div class="shell">
  <div class="split split--40" style="align-items:center">
    <div%s>
      %s<h2>%s</h2>
      <p class="lede" style="margin-top:1.25rem">%s</p>
      <ul class="tick">%s</ul>
      <div class="srv__by" style="margin-top:1.5rem">%s</div>
      <div class="btn-row">%s</div>
    </div>
    <div class="dronewrap"%s>%s</div>
  </div>
</div></section>''' % (rv(), eyebrow(d['eyebrow'], home), e(d['h']), e(d['lede']), li, e(d['by']),
                       btn(d['cta'], link(lang, 'contact'), 'primary'), rv(1), DRONE_SCENE)


def map_block(C, home=False):
    lang = C['lang']; m = C['map']
    li = ''.join('<li>%s<span>%s</span></li>' % (ic('check'), e(x)) for x in m['li'])
    return '''<section class="sec sec--darkest" id="coverage"><div class="shell">
  <div class="split" style="align-items:center">
    <div class="mapwrap"%s>%s</div>
    <div%s>
      %s<h2>%s</h2>
      <p class="lede" style="margin-top:1.25rem">%s</p>
      <ul class="tick">%s</ul>
      <div class="btn-row">%s</div>
    </div>
  </div>
</div></section>''' % (rv(), LIBYA_MAP, rv(1), eyebrow(m['eyebrow'], home), e(m['h']), e(m['lede']), li,
                       btn(m['cta'], link(lang, 'contact'), 'ghost', 'pin'))


# ------------------------------------------------------------------ pages
def page_index(C):
    lang = C['lang']; h = C['hero']
    pillars = ''.join(
        '<article class="tile tile--%s"%s><div class="tile__idx">%s</div>'
        '<div class="tile__ic">%s</div><h3>%s</h3><p>%s</p><ul class="tick">%s</ul>%s</article>'
        % ('dark' if i == 1 else '', rv(i), e(p['idx']), ic(p['icon']), e(p['h']), e(p['p']),
           ''.join('<li>%s<span>%s</span></li>' % (ic('check'), e(x)) for x in p['li']),
           tlink(p['cta'], link(lang, p['link'])))
        for i, p in enumerate(C['pillars']))

    ex = C['excl']
    certs = ''.join('<div>%s</div>' % e(c) for c in ex['certs'])
    meta = ''.join('<div><b class="num">%s</b><span>%s</span></div>' % (e(m['b']), e(m['s']))
                   for m in ex['meta'])
    ticker = ''.join('<span>%s</span>' % e(t) for t in C['ticker'])

    return '''
<section class="hero grain">
  %(bg)s
  %(scene)s
  <div class="shell shell--wide"><div class="hero__in">
    <div class="hero__badge"%(rv0)s><i></i>%(badge)s</div>
    <h1%(rv1)s><span class="hl">%(a)s</span> <span class="hl stop">%(b)s</span> <span class="hl">%(c)s</span></h1>
    <p class="lede"%(rv2)s>%(lede)s</p>
    <div class="btn-row"%(rv3)s>%(cta1)s%(cta2)s</div>
  </div></div>
</section>

<section class="statband"><div class="shell shell--wide"><div class="statband__in">%(stats)s</div></div></section>
<div class="ticker" aria-hidden="true"><div class="ticker__t">%(tick)s%(tick)s</div></div>

<section class="sec sec--paper tgrid" id="what"><div class="shell">
  <div class="sec-head"%(rv0)s><div class="eyebrow">%(peyeb)s</div><h2>%(ph)s</h2>
    <p class="lede">%(plede)s</p></div>
  <div class="bento">%(pillars)s</div>
</div></section>

<section class="sec" id="ega"><div class="shell">
  <div class="excl grain"%(rv0)s>
    <div class="excl__in">
      <div>
        <div class="eyebrow">%(eeyeb)s</div>
        <h2>%(eh)s</h2>
        <blockquote class="excl__quote">%(equote)s</blockquote>
        <p class="body" style="color:var(--steel-200)">%(ep)s</p>
        <div class="excl__meta">%(emeta)s</div>
        <div class="btn-row">%(ecta)s</div>
      </div>
      <div>
        <div style="border-radius:8px;overflow:hidden;margin-bottom:1rem">%(eimg)s</div>
        <div class="certgrid">%(certs)s</div>
      </div>
    </div>
  </div>
</div></section>

%(well)s
%(partners)s
%(drone)s
%(map)s
''' % dict(bg=photo_bg('hero', 'hero__bg'), scene=HERO_SCENE,
           rv0=rv(), rv1=rv(1), rv2=rv(2), rv3=rv(3),
           badge=e(h['badge']), a=e(h['h1_a']), b=e(h['h1_b']), c=e(h['h1_c']),
           lede=e(h['lede']),
           cta1=btn(h['cta1'], link(lang, 'contact'), 'primary'),
           cta2=btn(h['cta2'], link(lang, 'services'), 'ghost'),
           stats=''.join(stat_tile(s) for s in C['stats']), tick=ticker,
           peyeb=e(C['pillars_eyebrow']), ph=e(C['pillars_h']), plede=e(C['pillars_lede']),
           pillars=pillars,
           eeyeb=e(ex['eyebrow']), eh=e(ex['h']), equote=e(ex['quote']), ep=e(ex['p']),
           emeta=meta, certs=certs,
           ecta=btn(ex['cta'], link(lang, 'ega-master'), 'primary'),
           eimg=photo('excl', 'Certified tool stock held on racking in the Tripoli warehouse',
                      'photo--4x3', '(max-width:900px) 90vw, 40vw'),
           well=well_scroller(C, home=True), partners=partners_block(C, home=True),
           drone=drone_block(C, home=True), map=map_block(C, home=True))


def page_services(C):
    lang = C['lang']; s = C['services_head']
    cards = ''.join(service_card(C, x, i) for i, x in enumerate(SERVICES))
    return phead(C, 'services', 'ph-services', s['h'], s['lede']) + '''
<section class="sec sec--paper"><div class="shell">
  <div class="sec-head"%(rv0)s><div class="eyebrow">%(eyeb)s</div><h2>%(h2)s</h2></div>
  %(filters)s
  <div class="srvgrid">%(cards)s%(asktile)s</div>
  <div class="noresult" id="noresult" style="display:none">%(none)s</div>
</div></section>
%(lead)s
''' % dict(filters=filter_bar(C, ['all', 'tools', 'procurement', 'wells', 'drone']),
           rv0=rv(),
           eyeb=e('The catalogue' if lang == 'en' else 'الدليل'),
           h2=e('Filter by pillar, or search the line card.' if lang == 'en'
                else 'صفِّ حسب المحور، أو ابحث في قائمة الأصناف.'),
           cards=cards, asktile=ask_tile(C), lead=lead_table(C),
           none=e('No services match that search.' if lang == 'en' else 'لا توجد خدمات مطابقة لهذا البحث.'))


def page_ega(C):
    lang = C['lang']; hd = C['ega_head']; r = C['ega_risk']
    tools = ''.join(
        '<article class="toolcard"%s>%s<h3>%s</h3><p>%s</p><span class="toolcard__tag">%s</span></article>'
        % (rv(i % 3), TOOL_ART[c['art']], e(c['h']), e(c['p']), e(c['tag']))
        for i, c in enumerate(C['ega_cats']))
    certs = ''.join('<div>%s</div>' % e(x) for x in C['excl']['certs'])
    li = ''.join('<li>%s<span>%s</span></li>' % (ic('check'), e(x)) for x in r['li'])
    tool_svcs = ''.join(service_card(C, x, i) for i, x in enumerate([s for s in SERVICES if s['cat'] == 'tools']))
    ex = C['excl']
    return phead(C, 'ega-master', 'ph-ega', hd['h'], hd['lede']) + '''
<section class="sec sec--dark"><div class="shell">
  <div class="split split--60" style="align-items:center">
    <div%(rv0)s>
      <div class="eyebrow">%(reyeb)s</div><h2>%(rh)s</h2>
      <p class="lede" style="margin-top:1.25rem">%(rp)s</p>
      <ul class="tick">%(rli)s</ul>
    </div>
    <div%(rv1)s style="border-radius:10px;overflow:hidden">%(rimg)s</div>
  </div>
</div></section>

<section class="statband"><div class="shell shell--wide"><div class="statband__in">%(stats)s</div></div></section>

<section class="sec sec--paper tgrid"><div class="shell">
  <div class="sec-head"%(rv0)s><div class="eyebrow">%(seyeb)s</div><h2>%(sh)s</h2></div>
  <div class="srvgrid">%(tsvc)s%(asktile)s</div>
</div></section>

<section class="sec sec--darkest"><div class="shell">
  <div class="split" style="align-items:center">
    <div%(rv0)s>
      <div class="eyebrow">%(eeyeb)s</div><h2>%(eh)s</h2>
      <blockquote class="excl__quote">%(equote)s</blockquote>
      <p class="body" style="color:var(--steel-200)">%(ep)s</p>
      <div class="btn-row">%(ecta)s</div>
    </div>
    <div%(rv1)s>
      <h3 style="color:#fff;margin-bottom:1.25rem;font-size:var(--step-1)">%(certh)s</h3>
      <div class="certgrid">%(certs)s</div>
    </div>
  </div>
</div></section>
''' % dict(rv0=rv(), rv1=rv(1),
           reyeb=e(r['eyebrow']), rh=e(r['h']), rp=e(r['p']), rli=li,
           rimg=photo('hse', 'A safety helmet hanging in an industrial plant',
                      'photo--4x3', '(max-width:900px) 90vw, 42vw'),
           stats=''.join(stat_tile(x) for x in C['ega_stats']),
           seyeb=e('The range' if lang == 'en' else 'المجموعة'),
           sh=e('What we supply and support.' if lang == 'en' else 'ما نوردّه وندعمه.'),
           tsvc=tool_svcs, asktile=ask_tile(C),
           eeyeb=e(re.sub(r'^\d{2}\s*[—-]\s*', '', ex['eyebrow'])),
           eh=e(C['ega_cta']['h']), equote=e(ex['quote']),
           ep=e(C['ega_cta']['p']),
           ecta=btn(C['ega_cta']['b1'], link(lang, 'contact'), 'primary'),
           certh=e('EGA Master product certification' if lang == 'en'
                   else 'شهادات منتجات EGA Master'), certs=certs)


def page_well(C):
    lang = C['lang']; hd = C['ws_head']
    cards = ''.join(service_card(C, x, i) for i, x in enumerate(
        [s for s in SERVICES if s['cat'] in ('wells', 'drone')]))
    apps = ''.join('<li>%s<span>%s</span></li>' % (ic('check'), e(x)) for x in C['ws_apps'])
    return phead(C, 'well-services', 'ph-well', hd['h'], hd['lede']) + '''
%(well)s
<section class="sec"><div class="shell">
  <div class="sec-head"%(rv0)s><div class="eyebrow">%(eyeb)s</div><h2>%(h)s</h2></div>
  <div class="srvgrid">%(cards)s%(asktile)s</div>
</div></section>

<section class="sec sec--dark"><div class="shell">
  <div class="split" style="align-items:center">
    <div%(rv0)s><div class="eyebrow">%(aeyeb)s</div><h2>%(ah)s</h2>
      <ul class="tick" style="margin-top:1.75rem">%(apps)s</ul></div>
    <div%(rv1)s style="border-radius:10px;overflow:hidden">%(img)s</div>
  </div>
</div></section>

%(partners)s
%(drone)s
''' % dict(well=well_scroller(C), rv0=rv(), rv1=rv(1),
           eyeb=e('Catalogue' if lang == 'en' else 'الدليل'),
           h=e('Ten services, four partners.' if lang == 'en' else 'عشر خدمات، وأربعة شركاء.'),
           cards=cards, asktile=ask_tile(C, 2),
           aeyeb=e('Applications' if lang == 'en' else 'التطبيقات'),
           ah=e(C['ws_apps_h']), apps=apps,
           img=photo('plant', 'Refinery process plant', 'photo--16x9', '(max-width:900px) 90vw, 45vw'),
           partners=partners_block(C), drone=drone_block(C))


def page_about(C):
    lang = C['lang']; hd = C['about_head']; w = C['about_who']
    mv = ''.join(
        '<article class="tile tile--6 tile--%s"%s><div class="tile__ic">%s</div>'
        '<h3>%s</h3><p>%s</p></article>'
        % ('dark' if i == 0 else 'crimson', rv(i), ic('globe' if i == 0 else 'spark'),
           e(x['k']), e(x['v']))
        for i, x in enumerate(C['about_mv']))
    vals = ''.join('<article class="val"%s><div class="val__n">%s</div><h3>%s</h3><p>%s</p></article>'
                   % (rv(i), e(x['n']), e(x['h']), e(x['p'])) for i, x in enumerate(C['about_vals']))
    tl = ''.join('<li%s><b>%s</b><h3>%s</h3><p>%s</p></li>' % (rv(i), e(x['b']), e(x['h']), e(x['p']))
                 for i, x in enumerate(C['about_tl']))
    return phead(C, 'about', 'ph-about', hd['h'], hd['lede']) + '''
<section class="sec"><div class="shell">
  <div class="split split--60" style="align-items:center">
    <div%(rv0)s>
      <div class="eyebrow">%(weyeb)s</div><h2>%(wh)s</h2>
      <p class="lede" style="margin-top:1.25rem">%(p1)s</p>
      <p class="body" style="margin-top:1.1rem">%(p2)s</p>
      <p class="body" style="margin-top:1.1rem">%(p3)s</p>
    </div>
    <div%(rv1)s style="border-radius:10px;overflow:hidden">%(img)s</div>
  </div>
</div></section>

<section class="sec sec--paper tgrid"><div class="shell">
  <div class="bento">%(mv)s</div>
</div></section>

<section class="sec sec--dark"><div class="shell">
  <div class="sec-head"%(rv0)s><div class="eyebrow">%(veyeb)s</div><h2>%(vh)s</h2></div>
  <div class="vals">%(vals)s</div>
</div></section>

<section class="sec sec--paper"><div class="shell">
  <div class="split" style="align-items:start">
    <div%(rv0)s>
      <div class="eyebrow">%(teyeb)s</div><h2>%(th)s</h2>
      <p class="lede" style="margin-top:1.25rem">%(tlede)s</p>
      <div style="border-radius:10px;overflow:hidden;margin-top:2rem">%(timg)s</div>
    </div>
    <ul class="tl"%(rv1)s>%(tl)s</ul>
  </div>
</div></section>
''' % dict(rv0=rv(), rv1=rv(1), weyeb=e(w['eyebrow']), wh=e(w['h']),
           p1=e(w['p1']), p2=e(w['p2']), p3=e(w['p3']),
           img=photo('field', 'A pumping unit on a Libyan field at dusk',
                     'photo--4x3', '(max-width:900px) 90vw, 42vw'),
           mv=mv, veyeb=e('Values' if lang == 'en' else 'قيمنا'), vh=e(C['about_vals_h']), vals=vals,
           teyeb=e('Process' if lang == 'en' else 'آلية العمل'), th=e(C['about_tl_h']),
           tlede=e('From your specification to the tool in the hand of the technician, and everything in between.'
                   if lang == 'en' else
                   'من مواصفتك حتى الأداة في يد الفني، وكل ما بينهما.'),
           timg=photo('stock', 'Warehouse racking at the Tripoli order desk',
                      'photo--4x3', '(max-width:900px) 90vw, 42vw'),
           tl=tl)


def page_contact(C):
    lang = C['lang']; hd = C['contact_head']; f = C['form']
    desks = ''.join('<div class="desk"%s><b>%s</b><span class="ltr">%s</span></div>'
                    % (rv(i), e(d['b']), e(d['s'])) for i, d in enumerate(C['desks']))
    opts = ''.join('<option>%s</option>' % e(o) for o in C['form_depts'])
    rows = '''
    <div class="crow"><div class="crow__ic">%s</div><div><b>%s</b>
      <span>%s</span></div></div>
    <div class="crow"><div class="crow__ic">%s</div><div><b>%s</b>
      <a href="tel:%s" class="ltr">%s</a><a href="tel:%s" class="ltr">%s</a></div></div>
    <div class="crow"><div class="crow__ic">%s</div><div><b>%s</b>
      <a href="mailto:%s" class="ltr">%s</a></div></div>
    <div class="crow"><div class="crow__ic">%s</div><div><b>%s</b>
      <a href="https://%s">%s</a></div></div>
    <div class="crow"><div class="crow__ic">%s</div><div><b>%s</b>
      <span>%s</span></div></div>''' % (
        ic('pin'), e('Address' if lang == 'en' else 'العنوان'),
        e('Gergarish Main Road, Hay Al-Andalus, Tripoli, Libya' if lang == 'en'
          else 'طريق قرقارش الرئيسي، حي الأندلس، طرابلس، ليبيا'),
        ic('phone'), e('Telephone' if lang == 'en' else 'الهاتف'),
        FACTS['phone1'].replace(' ', ''), e(FACTS['phone1']),
        FACTS['phone2'].replace(' ', ''), e(FACTS['phone2']),
        ic('mail'), e('Email' if lang == 'en' else 'البريد الإلكتروني'),
        FACTS['email'], FACTS['email'],
        ic('globe'), e('Website' if lang == 'en' else 'الموقع'), FACTS['site'], FACTS['site'],
        ic('clock'), e('Opening hours' if lang == 'en' else 'ساعات العمل'),
        e('Sunday – Thursday, 08:00 – 16:00 (GMT+2)' if lang == 'en'
          else 'الأحد – الخميس، 08:00 – 16:00 (توقيت ليبيا)'))

    return phead(C, 'contact', 'ph-contact', hd['h'], hd['lede']) + '''
<section class="sec sec--darkest"><div class="shell">
  <div class="split split--40" style="align-items:start">
    <div>
      <div%(rv0)s><div class="eyebrow">%(deyeb)s</div>
        <h2 style="font-size:var(--step-3)">%(dh)s</h2></div>
      <div class="desks" style="margin-top:2rem">%(desks)s</div>
      <p class="formnote">%(dnote)s</p>
      <h3 style="color:#fff;margin:2.75rem 0 .5rem;font-size:var(--step-1)">%(rh)s</h3>
      %(rows)s
    </div>
    <div%(rv1)s>
      <div class="eyebrow">%(feyeb)s</div>
      <h2 style="font-size:var(--step-3)">%(fh)s</h2>
      <p class="lede" style="margin:1rem 0 2rem">%(flede)s</p>
      <form class="form" id="rfq" novalidate>
        <div class="field"><label for="f-name">%(l_name)s</label><input id="f-name" name="name" placeholder="%(ph_name)s" required></div>
        <div class="field"><label for="f-co">%(l_co)s</label><input id="f-co" name="company" placeholder="%(ph_co)s"></div>
        <div class="field"><label for="f-em">%(l_em)s</label><input id="f-em" type="email" name="email" placeholder="name@company.ly" required dir="ltr"></div>
        <div class="field"><label for="f-ph">%(l_ph)s</label><input id="f-ph" type="tel" name="phone" placeholder="+218 …" dir="ltr"></div>
        <div class="field field--full"><label for="f-dept">%(l_dept)s</label>
          <select id="f-dept" name="dept">%(opts)s</select></div>
        <div class="field field--full"><label for="f-msg">%(l_msg)s</label>
          <textarea id="f-msg" name="message" placeholder="%(ph_msg)s" required></textarea></div>
        <div class="field field--full"><label for="f-file">%(l_file)s</label>
          <input id="f-file" type="file" name="spec" accept=".pdf,.xlsx,.xls,.csv,.dwg,.doc,.docx">
          <span class="field__hint">%(h_file)s</span></div>
        <div class="field--full"><button class="btn btn--primary" type="submit">%(submit)s%(ai)s</button></div>
      </form>
      <div class="formok" id="rfqok" role="status">%(ok)s</div>
      <p class="formnote">%(fnote)s</p>
    </div>
  </div>
</div></section>
%(map)s
''' % dict(rv0=rv(), rv1=rv(1), deyeb=e('Routing' if lang == 'en' else 'التوجيه'),
           dh=e(C['desks_h']), desks=desks, dnote=e(C['desks_note']),
           rh=e(C['contact_rows_h']), rows=rows,
           feyeb=e('Enquiry' if lang == 'en' else 'استفسار'), fh=e(C['form_h']),
           flede=e(C['form_lede']),
           l_name=e(f['name']), l_co=e(f['company']), l_em=e(f['email']), l_ph=e(f['phone']),
           ph_name=e(f['ph_name']), ph_co=e(f['ph_co']),
           l_dept=e(f['dept']), l_msg=e(f['msg']), ph_msg=e(f['msg_ph']), opts=opts,
           l_file=e(f['file']), h_file=e(f['file_hint']),
           submit=e(f['submit']), ai=ic('arrow'), ok=e(f['ok']), fnote=e(f['note']),
           map=map_block(C))


BUILDERS = dict(index=page_index, services=page_services, **{
    'ega-master': page_ega, 'well-services': page_well}, about=page_about, contact=page_contact)


def body_for(C, page):
    return ('<main id="main">' + BUILDERS[page](C) + cta_band(C) + '</main>')


# ------------------------------------------------------------------ extra CSS
EXTRA_CSS = '''
.hero h1 .hl{display:inline-block;white-space:nowrap}
@media (max-width:420px){.hero h1 .hl{white-space:normal}}

/* hero annotation overlay sits above the scrim */
.hero__scene{position:absolute;inset:0;inline-size:100%;block-size:100%;z-index:1;pointer-events:none;opacity:.9}
html[dir="rtl"] .hero__bg{transform:scaleX(-1)}
html[dir="rtl"] .hero__scene{transform:scaleX(-1)}
html[dir="rtl"] .hero__scene text{transform:scaleX(-1);transform-origin:center;transform-box:fill-box}
@media (max-width:900px){.hero__scene{display:none}}

/* photography */
.photo{inline-size:100%;block-size:auto;object-fit:cover;display:block}
.photo--4x3{aspect-ratio:4/3}
.photo--16x9{aspect-ratio:16/9}
.photo--sq{aspect-ratio:1/1;border-radius:6px}
.toolcard .photo{max-inline-size:none;margin-block-end:1.4rem;border-radius:6px}
.bgphoto{position:absolute;inset:0;inline-size:100%;block-size:100%;object-fit:cover;z-index:0}
.hero__bg{z-index:-3;opacity:.9}
.hero__scene{opacity:.34;mix-blend-mode:screen}
.phead{isolation:isolate}
.phead__bg{opacity:.42;z-index:-1}
.phead::after{content:'';position:absolute;inset:0;z-index:0;
  background:linear-gradient(to right,rgba(16,30,66,.97) 0%,rgba(16,30,66,.84) 42%,rgba(16,30,66,.42) 100%)}
html[dir="rtl"] .phead::after{background:linear-gradient(to left,rgba(16,30,66,.97) 0%,rgba(16,30,66,.84) 42%,rgba(16,30,66,.42) 100%)}
.sec__bg{opacity:.16;z-index:0}
.sec--darkest .sec__bg{opacity:.13}
#partners::after{content:'';position:absolute;inset:0;z-index:1;pointer-events:none;
  background:linear-gradient(to bottom,rgba(11,21,51,.9),rgba(11,21,51,.72) 40%,rgba(11,21,51,.95))}
.excl{isolation:isolate}
'''

# single-file mode: image backgrounds declared once, referenced by class
def inline_img_css():
    out = []
    for name in sorted(IMG_CLASSES):
        m = IMGS[name]
        out.append('.pi-%s{background-image:url(%s);background-size:cover;background-position:center;'
                   'aspect-ratio:%s}' % (name, m['inline'], m['ratio']))
    out.append('.photo.pi-hero,.bgphoto{aspect-ratio:auto}')
    return '\n'.join(out)


ROUTER_JS = '''
(function(){
  var sites=[].slice.call(document.querySelectorAll('.site'));
  function apply(){
    var m=(location.hash||'#/en/index').replace(/^#\\/?/,'').split('#')[0].split('/');
    var lang=(m[0]==='ar')?'ar':'en';
    var page=m[1]||'index';
    var html=document.documentElement;
    html.setAttribute('lang',lang);
    html.setAttribute('dir',lang==='ar'?'rtl':'ltr');
    sites.forEach(function(s){
      var on=s.getAttribute('data-lang')===lang;
      s.hidden=!on; s.style.display=on?'':'none';
    });
    var site=sites.filter(function(s){return s.getAttribute('data-lang')===lang;})[0];
    if(!site) return;
    var found=false;
    [].forEach.call(site.querySelectorAll('[data-page]'),function(p){
      var on=p.getAttribute('data-page')===page;
      p.hidden=!on; p.style.display=on?'':'none';
      if(on) found=true;
    });
    if(!found){
      var f=site.querySelector('[data-page="index"]');
      if(f){f.hidden=false;f.style.display='';}
    }
    var other=(lang==='ar')?'en':'ar';
    [].forEach.call(site.querySelectorAll('a.lang'),function(a){
      a.setAttribute('href','#/'+other+'/'+page);
    });
    [].forEach.call(site.querySelectorAll('.nav a,.drawer nav a'),function(a){
      var h=a.getAttribute('href')||'';
      if(h.indexOf('/'+page)>-1&&h.indexOf('/'+lang+'/')>-1)a.setAttribute('aria-current','page');
      else a.removeAttribute('aria-current');
    });
    document.title=site.querySelector('[data-page="'+page+'"]')
      ? site.querySelector('[data-page="'+page+'"]').getAttribute('data-title')||document.title
      : document.title;
    window.scrollTo(0,0);
    if(window.__remalBoot) window.__remalBoot();
  }
  window.__remalRoute=function(){};
  window.addEventListener('hashchange',apply);
  if(!location.hash){ try{location.replace('#/en/index');}catch(e){location.hash='#/en/index';} }
  apply();
})();
'''


def doc(C, page, body, single=False, extra_head='', extra_css='', extra_js=''):
    lang = C['lang']
    base = '' if single else ''
    return '''<!doctype html>
<html lang="%(lang)s" dir="%(dir)s">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>%(title)s</title>
<meta name="description" content="%(desc)s">
<meta name="theme-color" content="#0B1533">
%(favicon)s
<meta property="og:title" content="%(title)s">
<meta property="og:description" content="%(desc)s">
<meta property="og:type" content="website">
<meta property="og:locale" content="%(loc)s">
<meta property="og:locale:alternate" content="%(oloc)s">
%(hreflang)s
%(fonts)s
<style>%(css)s
%(extracss)s</style>
%(head)s
</head>
<body>
%(body)s
<script>%(js)s</script>
%(extrajs)s
</body>
</html>''' % dict(
        lang=lang, dir=C['dir'], title=e(C['titles'][page]), desc=e(C['descs'][page]),
        favicon=FAVICON,
        loc='ar_LY' if lang == 'ar' else 'en_US', oloc='en_US' if lang == 'ar' else 'ar_LY',
        hreflang='' if single else
        ('<link rel="alternate" hreflang="en" href="../en/%s">'
         '<link rel="alternate" hreflang="ar" href="../ar/%s">'
         '<link rel="alternate" hreflang="x-default" href="../en/%s">'
         % tuple(['index.html' if page == 'index' else page + '.html'] * 3)),
        fonts=(FONTS_INLINE if single else FONTS_FILES), css=CSS + EXTRA_CSS, extracss=extra_css, head=extra_head,
        body=body, js=JS, extrajs=extra_js)


# ------------------------------------------------------------------ run
def build():
    global MODE
    # ---------- multi-page
    MODE = 'files'
    for C in (EN, AR):
        d = os.path.join(DIST, C['lang'])
        os.makedirs(d, exist_ok=True)
        for p in PAGES:
            html = (header(C, p) + body_for(C, p) + footer(C, p))
            if C['lang'] == 'ar':
                html = bidi_isolate(html)
            fn = 'index.html' if p == 'index' else p + '.html'
            open(os.path.join(d, fn), 'w', encoding='utf-8').write(doc(C, p, html))
    # root redirect
    open(os.path.join(DIST, 'index.html'), 'w', encoding='utf-8').write(
        '<!doctype html><meta charset="utf-8"><title>Remal Nahya for Oil Services</title>'
        '<meta http-equiv="refresh" content="0; url=en/index.html">'
        '<link rel="canonical" href="en/index.html">'
        '<p style="font-family:system-ui;padding:2rem">'
        '<a href="en/index.html">English</a> &nbsp;·&nbsp; <a href="ar/index.html">العربية</a></p>')
    # standalone css/js for reference
    os.makedirs(os.path.join(DIST, 'assets', 'css'), exist_ok=True)
    os.makedirs(os.path.join(DIST, 'assets', 'js'), exist_ok=True)
    open(os.path.join(DIST, 'assets', 'css', 'site.css'), 'w', encoding='utf-8').write(CSS + EXTRA_CSS)
    open(os.path.join(DIST, 'assets', 'js', 'site.js'), 'w', encoding='utf-8').write(JS)

    # ---------- single file
    MODE = 'single'
    IMG_CLASSES.clear()
    sites = []
    for C in (EN, AR):
        pages = []
        for p in PAGES:
            pages.append('<section data-page="%s" data-title="%s" hidden>%s</section>'
                         % (p, e(C['titles'][p]), body_for(C, p)))
        chunk = header(C, 'index') + ''.join(pages) + footer(C, 'index')
        if C['lang'] == 'ar':
            chunk = bidi_isolate(chunk)
        sites.append('<div class="site" data-lang="%s" hidden>%s</div>' % (C['lang'], chunk))
    body = '\n'.join(sites)
    single = doc(EN, 'index', body, single=True,
                 extra_css=inline_img_css() + '\n.site[hidden]{display:none}\n[data-page][hidden]{display:none}',
                 extra_js='<script>%s</script>' % ROUTER_JS)
    out = os.path.join(DIST, 'remal-nahya.html')
    open(out, 'w', encoding='utf-8').write(single)

    # ---------- artifact fragment (the host supplies doctype/html/head/body) ----------
    art = ('<title>Remal Nahya Oil Services</title>\n'
           + FONTS_INLINE + '\n'
           + '<style>%s\n%s</style>\n' % (
               CSS + EXTRA_CSS,
               inline_img_css() + '\n.site[hidden]{display:none}\n[data-page][hidden]{display:none}')
           + body
           + '\n<script>%s</script>\n<script>%s</script>' % (JS, ROUTER_JS))
    aout = os.path.join(DIST, 'remal-nahya-artifact.html')
    open(aout, 'w', encoding='utf-8').write(art)

    print('multi-page:  %s' % DIST)
    print('single-file: %s  (%.2f MB)' % (out, os.path.getsize(out) / 1048576))
    print('artifact:    %s  (%.2f MB)' % (aout, os.path.getsize(aout) / 1048576))


if __name__ == '__main__':
    build()
