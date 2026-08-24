# -*- coding: utf-8 -*-
"""One-shot port: read the Python content model and emit typed TypeScript.

Kept in the repo because it documents exactly how the two models line up, not
because it needs to run again. src/content/en.ts and ar.ts are the source of
truth from here on.
"""
import json, sys, os

sys.path.insert(0, '/home/claude/remal/repo/src')
from content import EN, AR, SERVICES  # noqa: E402

OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'src', 'content')

KEYMAP = {
    'other_label': 'otherLabel', 'brand_full': 'brandFull', 'cta_nav': 'ctaNav',
    'pillars_eyebrow': 'pillarsEyebrow', 'pillars_h': 'pillarsH', 'pillars_lede': 'pillarsLede',
    'well_sec': 'wellSec', 'well_steps': 'wellSteps', 'partner_list': 'partnerList',
    'cta_band': 'ctaBand', 'services_head': 'servicesHead', 'filter_labels': 'filterLabels',
    'search_ph': 'searchPh', 'ega_head': 'egaHead', 'ega_risk': 'egaRisk', 'ega_cats': 'egaCats',
    'ega_stats_h': 'egaStatsH', 'ega_stats': 'egaStats', 'ega_cta': 'egaCta',
    'ws_head': 'wsHead', 'ws_apps_h': 'wsAppsH', 'ws_apps': 'wsApps',
    'about_head': 'aboutHead', 'about_who': 'aboutWho', 'about_mv': 'aboutMv',
    'about_vals_h': 'aboutValsH', 'about_vals': 'aboutVals', 'about_tl_h': 'aboutTlH',
    'about_tl': 'aboutTl', 'contact_head': 'contactHead', 'desks_h': 'desksH',
    'desks_note': 'desksNote', 'contact_rows_h': 'contactRowsH', 'form_h': 'formH',
    'form_lede': 'formLede', 'form_depts': 'formDepts', 'foot_services': 'footServices',
    'h1_a': 'h1a', 'h1_b': 'h1b', 'h1_c': 'h1c', 'msg_ph': 'msgPh',
}

# strings that lived as inline conditionals in the Python generator
EXTRA = {
    'en': dict(
        noResult='No services match that search.',
        aboutTlLede='From your specification to the tool in the hand of the technician, '
                    'and everything in between.',
        ui=dict(deliveredWith='Delivered with', address='Address', telephone='Telephone',
                email='Email', website='Website', menu='Menu', close='Close',
                mainNav='Main', primaryNav='Primary',
                toolCats='Tool categories', supplyServices='Supply services',
                supplyServicesH='What we supply and support', certifiedTo='Certified to',
                catalogue='Catalogue', catalogueH='Ten services, four partners.',
                applications='Applications', values='Values', process='Process',
                whoWeAre='Who we are', routing='Routing', enquiry='Enquiry')),
    'ar': dict(
        noResult='لا توجد خدمات مطابقة لهذا البحث.',
        aboutTlLede='من مواصفتك حتى الأداة في يد الفني، وكل ما بينهما.',
        ui=dict(deliveredWith='بالتعاون مع', address='العنوان', telephone='الهاتف',
                email='البريد الإلكتروني', website='الموقع', menu='القائمة', close='إغلاق',
                mainNav='التنقل الرئيسي', primaryNav='التنقل الأساسي',
                toolCats='فئات الأدوات', supplyServices='خدمات التوريد',
                supplyServicesH='ما نوردّه وندعمه', certifiedTo='معتمدة من',
                catalogue='الدليل', catalogueH='عشر خدمات، وأربعة شركاء.',
                applications='التطبيقات', values='قيمنا', process='آلية العمل',
                whoWeAre='من نحن', routing='التوجيه', enquiry='استفسار')),
}

DROP_IN_TOOLCAT = {'art'}


def conv(v):
    if isinstance(v, dict):
        return {KEYMAP.get(k, k): conv(x) for k, x in v.items() if k not in DROP_IN_TOOLCAT}
    if isinstance(v, (list, tuple)):
        return [conv(x) for x in v]
    return v


def build(src, lang):
    d = {KEYMAP.get(k, k): conv(v) for k, v in src.items()}
    d['stats'] = [dict(s, group=bool(s['group'])) for s in d['stats']]
    d['egaStats'] = [dict(s, group=bool(s['group'])) for s in d['egaStats']]
    d['footServices'] = [list(t) for t in d['footServices']]
    d.update(EXTRA[lang])
    return d


def ts(obj, name):
    body = json.dumps(obj, ensure_ascii=False, indent=2)
    return ("import type { Copy } from './types';\n\n"
            "export const %s: Copy = %s;\n" % (name, body))


os.makedirs(OUT, exist_ok=True)
open(os.path.join(OUT, 'en.ts'), 'w', encoding='utf-8').write(ts(build(EN, 'en'), 'EN'))
open(os.path.join(OUT, 'ar.ts'), 'w', encoding='utf-8').write(ts(build(AR, 'ar'), 'AR'))

services = [dict(cat=s['cat'], icon=s['icon'], en=s['en'], ar=s['ar']) for s in SERVICES]
open(os.path.join(OUT, 'services.ts'), 'w', encoding='utf-8').write(
    "import type { Service } from './types';\n\n"
    "export const SERVICES: Service[] = %s;\n"
    % json.dumps(services, ensure_ascii=False, indent=2))

print('en.ts   %6d bytes' % os.path.getsize(os.path.join(OUT, 'en.ts')))
print('ar.ts   %6d bytes' % os.path.getsize(os.path.join(OUT, 'ar.ts')))
print('services.ts %d entries' % len(services))
