# -*- coding: utf-8 -*-
"""Hand-authored SVG asset library for the Remal Nahya site.
Every visual on the site is vector: no photography, no external requests.
"""

# ---------------------------------------------------------------- LOGO
LOGO_MARK = '''<svg class="mark" viewBox="0 0 104 128" role="img" aria-label="Remal Nahya">
  <defs>
    <linearGradient id="dropG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#F4F6FA"/><stop offset="1" stop-color="#DCE3EF"/>
    </linearGradient>
  </defs>
  <path d="M52 3C52 3 97 52 97 80a45 45 0 0 1-90 0C7 52 52 3 52 3Z" fill="url(#dropG)" stroke="#1B2A5B" stroke-width="6"/>
  <g transform="translate(52 78)">
    <circle r="19" fill="none" stroke="#16264F" stroke-width="5"/>
    <g fill="#16264F">
      <rect x="-2.6" y="-25.5" width="5.2" height="7" rx="1"/><rect x="-2.6" y="18.5" width="5.2" height="7" rx="1"/>
      <rect x="-25.5" y="-2.6" width="7" height="5.2" rx="1"/><rect x="18.5" y="-2.6" width="7" height="5.2" rx="1"/>
      <g transform="rotate(45)">
        <rect x="-2.6" y="-25.5" width="5.2" height="7" rx="1"/><rect x="-2.6" y="18.5" width="5.2" height="7" rx="1"/>
        <rect x="-25.5" y="-2.6" width="7" height="5.2" rx="1"/><rect x="18.5" y="-2.6" width="7" height="5.2" rx="1"/>
      </g>
    </g>
  </g>
  <g stroke="#C8102E" stroke-width="4.6" stroke-linecap="round" fill="none">
    <path d="M38 92 52 40 66 92"/>
    <path d="M43 74h18M40.5 84h23"/>
    <path d="M52 40v52"/>
  </g>
</svg>'''

LOGO_LOCKUP_EN = '''<span class="logo__mark">%s</span>
<span class="logo__wm"><b>REMAL NAHYA</b><i>FOR OIL SERVICES</i></span>''' % LOGO_MARK

LOGO_LOCKUP_AR = '''<span class="logo__mark">%s</span>
<span class="logo__wm logo__wm--ar"><b>رمال ناهية</b><i>للخدمات النفطية</i></span>''' % LOGO_MARK


# ---------------------------------------------------------------- HERO SCENE
# Graded dusk industrial horizon: refinery + derricks in silhouette, flare glow,
# technical dimension overlay. viewBox 1600x900, sliced to fill.
HERO_SCENE = '''<svg class="hero__scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
  <defs>
    <linearGradient id="hFade" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#7C8DB5" stop-opacity="0"/>
      <stop offset=".55" stop-color="#7C8DB5" stop-opacity=".55"/>
      <stop offset="1" stop-color="#7C8DB5" stop-opacity=".8"/>
    </linearGradient>
  </defs>

  <!-- construction grid, fading in from the image side -->
  <g stroke="url(#hFade)" stroke-width="1" opacity=".22">
    <path d="M900 0v900M1100 0v900M1300 0v900M1500 0v900"/>
    <path d="M860 180h740M860 420h740M860 660h740"/>
  </g>

  <!-- corner ticks -->
  <g stroke="#B6C1D6" stroke-width="1.6" opacity=".5" fill="none">
    <path d="M1520 96h44M1564 96v44"/>
    <path d="M1520 804h44M1564 804v-44"/>
  </g>

  <g class="hero__tg">
  <!-- depth call-out, right -->
  <g class="hero__tech" fill="none" stroke="#B6C1D6" opacity=".55" stroke-width="1.2">
    <path d="M1352 236v426"/>
    <path d="M1344 236h16M1344 662h16"/>
    <path d="M1352 236l-6 12M1352 236l6 12M1352 662l-6-12M1352 662l6-12"/>
  </g>
  <g fill="#DCE3EF" opacity=".72" font-family="'IBM Plex Mono',monospace" font-size="14" letter-spacing="2">
    <text x="1374" y="444">TD 3,240 m</text>
    <text x="1374" y="468" font-size="11" fill="#7C8DB5">MEASURED DEPTH</text>
  </g>

  <!-- pressure call-out, leader line to the rig floor -->
  <g class="hero__tech" fill="none" stroke="#E01235" stroke-width="1.4" opacity=".85">
    <path d="M986 662h132v-64"/>
    <circle cx="986" cy="662" r="4" fill="#E01235" stroke="none"/>
    <circle cx="986" cy="662" r="11" opacity=".45"/>
  </g>
  <g fill="#fff" font-family="'IBM Plex Mono',monospace" font-size="13" letter-spacing="2">
    <text x="1126" y="592">15,000 psi</text>
  </g>

  <!-- basin tag -->
  <g class="hero__tech" fill="none" stroke="#B6C1D6" stroke-width="1.1" opacity=".45">
    <path d="M1180 220h150"/>
    <path d="M1180 214v12"/>
  </g>
  <g fill="#B6C1D6" opacity=".65" font-family="'IBM Plex Mono',monospace" font-size="11.5" letter-spacing="2.4">
    <text x="1180" y="206">SIRTE BASIN · LIBYA</text>
  </g>
  </g>
</svg>'''


# ---------------------------------------------------------------- WELLBORE
# Animated cross-section. Each stage group is toggled by the sticky scroller.
WELLBORE = '''<svg class="well" viewBox="40 0 528 928" role="img" aria-labelledby="wellTitle">
  <title id="wellTitle">Wellbore cross-section: casing strings, cement sheath, completion, perforations</title>
  <defs>
    <pattern id="cementPat" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
      <line x1="0" y1="0" x2="0" y2="7" stroke="#4A5F96" stroke-width="2.6" opacity=".55"/>
    </pattern>
    <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#C8102E" stop-opacity=".06"/>
      <stop offset="1" stop-color="#C8102E" stop-opacity=".20"/>
    </linearGradient>
    <linearGradient id="rockGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#E3E8F0"/><stop offset="1" stop-color="#D2DAE8"/>
    </linearGradient>
  </defs>

  <!-- formation -->
  <rect x="110" y="120" width="410" height="796" fill="url(#rockGrad)"/>
  <g stroke="#A9B6CE" stroke-width="1.3" fill="none">
    <path d="M110 268 C210 256 320 280 420 268 C470 262 500 270 520 266"/>
    <path d="M110 452 C220 442 330 464 430 452 C480 446 505 454 520 450"/>
    <path d="M110 628 C205 620 330 640 435 628 C480 622 505 630 520 626"/>
    <path d="M110 800 C210 792 320 812 425 800 C475 794 505 802 520 798"/>
  </g>
  <rect x="110" y="700" width="410" height="160" fill="url(#resGrad)"/>
  <g stroke="#C8102E" stroke-width="1.2" opacity=".45" fill="none">
    <path d="M110 700h410M110 860h410"/>
  </g>
  <text x="500" y="866" class="w-cal w-cal--end" fill="#C8102E">RESERVOIR</text>

  <!-- surface -->
  <path d="M110 120h410" stroke="#0B1533" stroke-width="3"/>
  <g fill="none" stroke="#0B1533" stroke-width="4" stroke-linejoin="round" transform="translate(315 22)">
    <path d="M-38 98 L0 0 L38 98"/>
    <path d="M-30 68 H30 M-22 38 H22"/>
    <path d="M-30 68 L22 38 M30 68 L-22 38"/>
  </g>
  <rect x="286" y="104" width="58" height="18" rx="2" fill="#0B1533"/>
  <rect x="306" y="86" width="18" height="20" rx="2" fill="#0B1533"/>

  <!-- ============ casing strings (drawn on scroll) ============ -->
  <g>
    <rect x="252" y="120" width="18" height="210" fill="url(#cementPat)"/>
    <rect x="360" y="120" width="18" height="210" fill="url(#cementPat)"/>
    <path class="w-draw" d="M270 120v210M360 120v210" stroke="#16264F" stroke-width="7" fill="none" stroke-linecap="square"/>
    <path d="M244 240h-52" stroke="#7C8DB5" stroke-width="1.1" stroke-dasharray="3 3"/>
    <text x="186" y="244" class="w-cal w-cal--end">CONDUCTOR</text>
  </g>
  <g>
    <rect x="270" y="120" width="15" height="470" fill="url(#cementPat)"/>
    <rect x="345" y="120" width="15" height="470" fill="url(#cementPat)"/>
    <path class="w-draw" d="M285 120v470M345 120v470" stroke="#24376F" stroke-width="6" fill="none" stroke-linecap="square"/>
    <path d="M388 470h48" stroke="#7C8DB5" stroke-width="1.1" stroke-dasharray="3 3"/>
    <text x="442" y="474" class="w-cal">SURFACE CSG</text>
  </g>
  <g>
    <rect x="285" y="120" width="13" height="760" fill="url(#cementPat)"/>
    <rect x="332" y="120" width="13" height="760" fill="url(#cementPat)"/>
    <path class="w-draw" d="M298 120v760M332 120v760" stroke="#4A5F96" stroke-width="5.5" fill="none" stroke-linecap="square"/>
    <path d="M278 384h-86" stroke="#7C8DB5" stroke-width="1.1" stroke-dasharray="3 3"/>
    <text x="186" y="388" class="w-cal w-cal--end">PRODUCTION CSG</text>
  </g>

  <!-- open bore -->
  <rect x="298" y="120" width="34" height="762" fill="#FBFCFE"/>

  <!-- ============ stage: completion ============ -->
  <g class="w-stage" data-stage="completion">
    <path class="w-draw" d="M305 120v580M325 120v580" stroke="#0B1533" stroke-width="3.4" fill="none"/>
    <rect x="294" y="696" width="42" height="26" rx="3" fill="#C8102E"/>
    <path d="M340 709h46" stroke="#C8102E" stroke-width="1.2" stroke-dasharray="3 3"/>
    <text x="392" y="713" class="w-cal" fill="#C8102E">PACKER</text>
  </g>

  <!-- ============ stage: stimulation ============ -->
  <g class="w-stage" data-stage="stimulation">
    <g stroke="#C8102E" stroke-width="3" stroke-linecap="round">
      <path class="perf" d="M298 752 L252 742"/><path class="perf" d="M332 752 L378 742"/>
      <path class="perf" d="M298 780 L254 790"/><path class="perf" d="M332 780 L376 790"/>
      <path class="perf" d="M298 808 L250 798"/><path class="perf" d="M332 808 L380 798"/>
      <path class="perf" d="M298 836 L256 846"/><path class="perf" d="M332 836 L374 846"/>
    </g>
    <path d="M392 794h34" stroke="#C8102E" stroke-width="1.2" stroke-dasharray="3 3"/>
    <text x="432" y="798" class="w-cal" fill="#C8102E">PERFS</text>
  </g>

  <!-- ============ stage: cementing ============ -->
  <g class="w-stage" data-stage="cementing">
    <rect x="298" y="540" width="34" height="140" fill="url(#cementPat)"/>
    <rect x="298" y="540" width="34" height="140" fill="none" stroke="#24376F" stroke-width="1.8"/>
    <path d="M262 610h-70" stroke="#24376F" stroke-width="1.2" stroke-dasharray="3 3"/>
    <text x="186" y="614" class="w-cal w-cal--end" fill="#24376F">CEMENT PLUG</text>
  </g>

  <!-- ============ stage: intervention ============ -->
  <g class="w-stage" data-stage="intervention">
    <path class="w-draw" d="M315 120v420" stroke="#C8102E" stroke-width="2.4" fill="none"/>
    <g fill="#C8102E">
      <rect x="307" y="540" width="16" height="40" rx="2"/>
      <rect x="306" y="586" width="18" height="30" rx="2"/>
      <rect x="308" y="622" width="14" height="34" rx="2"/>
      <path d="M308 656h14l-7 14z"/>
    </g>
    <path d="M332 600h54" stroke="#C8102E" stroke-width="1.2" stroke-dasharray="3 3"/>
    <text x="392" y="604" class="w-cal" fill="#C8102E">SLICKLINE</text>
  </g>

  <!-- depth scale -->
  <g>
    <path d="M96 120v760" stroke="#A9B6CE" stroke-width="1.2"/>
    <g stroke="#A9B6CE" stroke-width="1.2">
      <path d="M90 120h12M90 310h12M90 500h12M90 690h12M90 880h12"/>
    </g>
    <g class="w-cal w-cal--end">
      <text x="82" y="124" class="w-nocaps">0 m</text>
      <text x="82" y="314">800</text>
      <text x="82" y="504">1,600</text>
      <text x="82" y="694">2,400</text>
      <text x="82" y="884">3,200</text>
    </g>
    <path d="M90 902h206" stroke="#C8102E" stroke-width="1.2" stroke-dasharray="4 3"/>
    <text x="302" y="906" class="w-cal w-nocaps" fill="#C8102E">TD 3,240 m</text>
  </g>
</svg>'''


# ---------------------------------------------------------------- DRONE / GAS
DRONE_SCENE = '''<svg class="drone-svg" viewBox="0 0 900 460" role="img" aria-labelledby="droneTitle">
  <title id="droneTitle">Drone surveying a pipeline and detecting a hydrocarbon gas plume</title>
  <defs>
    <linearGradient id="dSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0B1533"/><stop offset="1" stop-color="#1B2A5B"/>
    </linearGradient>
    <radialGradient id="plumeG" cx="0.5" cy="1" r="0.72">
      <stop offset="0"   stop-color="#E01235" stop-opacity=".65"/>
      <stop offset="0.5" stop-color="#F2A900" stop-opacity=".30"/>
      <stop offset="1"   stop-color="#F2A900" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="coneG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#B6C1D6" stop-opacity=".34"/>
      <stop offset="1" stop-color="#B6C1D6" stop-opacity="0"/>
    </linearGradient>
  </defs>
  <rect width="900" height="460" fill="url(#dSky)"/>\n  <rect width="900" height="460" fill="#16264F" opacity=".35"/>
  <g stroke="#4A5F96" stroke-width="1" opacity=".45">
    <path d="M0 60h900M0 120h900M0 180h900M0 240h900M0 300h900"/>
    <path d="M100 0v460M250 0v460M400 0v460M550 0v460M700 0v460M850 0v460"/>
  </g>

  <!-- desert plane -->
  <path d="M0 372 C160 362 300 380 460 370 C620 360 760 380 900 368 L900 460 L0 460Z" fill="#080F26"/>

  <!-- pipeline -->
  <g>
    <rect x="0" y="392" width="900" height="26" rx="13" fill="#4A5F96"/>
    <rect x="0" y="392" width="900" height="9" rx="4" fill="#B6C1D6" opacity=".45"/>
    <g fill="#16264F">
      <rect x="118" y="386" width="12" height="38" rx="3"/><rect x="352" y="386" width="12" height="38" rx="3"/>
      <rect x="586" y="386" width="12" height="38" rx="3"/><rect x="820" y="386" width="12" height="38" rx="3"/>
    </g>
    <!-- valve at leak point -->
    <g transform="translate(470 405)">
      <rect x="-16" y="-26" width="32" height="18" rx="3" fill="#4A5F96"/>
      <rect x="-4" y="-10" width="8" height="12" fill="#4A5F96"/>
    </g>
  </g>

  <!-- gas plume -->
  <g class="plume">
    <ellipse cx="470" cy="380" rx="86" ry="150" fill="url(#plumeG)"/>
    <g fill="#F2A900">
      <circle class="p1" cx="452" cy="330" r="4" opacity=".7"/>
      <circle class="p2" cx="480" cy="300" r="3" opacity=".6"/>
      <circle class="p3" cx="466" cy="264" r="5" opacity=".5"/>
      <circle class="p4" cx="492" cy="236" r="3.4" opacity=".45"/>
      <circle class="p5" cx="448" cy="212" r="4" opacity=".35"/>
    </g>
  </g>

  <!-- sensor cone -->
  <path class="cone" d="M470 118 L340 372 L600 372 Z" fill="url(#coneG)"/>
  <path class="scan" d="M470 118 L470 372" stroke="#B6C1D6" stroke-width="1.2" opacity=".7"/>

  <!-- drone -->
  <g class="drone" transform="translate(470 106)">
    <rect x="-26" y="-9" width="52" height="19" rx="7" fill="#DCE3EF"/>
    <rect x="-9" y="8" width="18" height="12" rx="3" fill="#C8102E"/>
    <g stroke="#B6C1D6" stroke-width="3.4" stroke-linecap="round">
      <path d="M-24 -6 L-52 -18 M24 -6 L52 -18"/>
    </g>
    <g stroke="#7C8DB5" stroke-width="2.2" fill="none" class="rotors">
      <path d="M-70 -18h36M34 -18h36"/>
      <path d="M-64 -22 a16 5 0 0 1 24 0M40 -22 a16 5 0 0 1 24 0" opacity=".55"/>
    </g>
    <circle cx="0" cy="-14" r="2.6" fill="#C8102E" class="beacon"/>
  </g>

  <!-- readout -->
  <g class="d-hud">
    <rect x="620" y="60" width="238" height="128" rx="6" fill="#0B1533" fill-opacity=".78" stroke="#24376F"/>
    <text x="638" y="86" class="d-lab">GAS DETECTION · LIVE</text>
    <g class="d-row">
      <text x="638" y="116" class="d-key">VOC</text>
      <rect x="700" y="106" width="140" height="6" rx="3" fill="#24376F"/>
      <rect x="700" y="106" width="104" height="6" rx="3" fill="#C8102E" class="bar1"/>
      <text x="822" y="100" class="d-key d-key--end">HIGH</text>
    </g>
    <g class="d-row">
      <text x="638" y="146" class="d-key">H2S</text>
      <rect x="700" y="136" width="140" height="6" rx="3" fill="#24376F"/>
      <rect x="700" y="136" width="46" height="6" rx="3" fill="#F2A900" class="bar2"/>
    </g>
    <g class="d-row">
      <text x="638" y="176" class="d-key">SO2</text>
      <rect x="700" y="166" width="140" height="6" rx="3" fill="#24376F"/>
      <rect x="700" y="166" width="24" height="6" rx="3" fill="#4A5F96" class="bar3"/>
    </g>
  </g>
  <g class="d-lab" fill="#7C8DB5">
    <text x="42" y="450">PIPELINE INSPECTION · NO SHUTDOWN REQUIRED</text>
  </g>
</svg>'''


# ---------------------------------------------------------------- LIBYA MAP
LIBYA_MAP = '''<svg class="map-svg" viewBox="140 34 692 664" role="img" aria-labelledby="mapTitle">
  <title id="mapTitle">Libya, showing the Sirte, Murzuq, Ghadames and Cyrenaica basins and Remal Nahya's Tripoli base</title>
  <defs>
    <linearGradient id="landG" x1=".1" y1="0" x2=".9" y2="1">
      <stop offset="0" stop-color="#1B2A5B"/><stop offset="1" stop-color="#101E42"/>
    </linearGradient>
    <pattern id="mapGrid" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M44 0H0V44" fill="none" stroke="#24376F" stroke-width="1" opacity=".45"/>
    </pattern>
    <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#122443"/><stop offset="1" stop-color="#0E1A3E"/>
    </linearGradient>
  </defs>
  <rect width="880" height="720" fill="#070E22"/>
  <rect width="880" height="720" fill="url(#mapGrid)"/>

  <!-- Mediterranean -->
  <path d="M0 0h880v226 L766 219 C740 210 700 196 670 176 C640 172 606 178 572 200
           C548 216 528 246 514 259 C486 250 460 240 440 234 C412 224 396 206 382 191
           C350 178 300 168 247 162 C180 158 90 160 0 164Z" fill="#0C1730"/>
  <g stroke="#24376F" stroke-width="1" fill="none" opacity=".55">
    <path d="M0 108 C160 100 320 112 470 132 C600 150 720 140 880 122"/>
  </g>
  <text x="196" y="80" class="m-sea">MEDITERRANEAN SEA</text>
  <text x="486" y="300" class="m-sea" text-anchor="middle">GULF OF SIRTE</text>

  <!-- Libya -->
  <g class="map-land">
    <path d="M247 162 C300 168 350 178 382 191 C396 206 412 224 440 234
             C460 240 486 250 514 259 C528 246 548 216 572 200
             C606 178 640 172 670 176 C700 196 740 210 766 219
             L760 569 L760 606 L722 642
             L379 533 L270 522 L218 380 L169 274 Z"
          fill="url(#landG)" stroke="#4A5F96" stroke-width="2.4" stroke-linejoin="round"/>
  </g>

  <!-- basins -->
  <g class="basin"><ellipse cx="493" cy="332" rx="100" ry="84" transform="rotate(-16 493 332)"
      fill="#C8102E" fill-opacity=".15" stroke="#E01235" stroke-opacity=".6" stroke-width="1.6" stroke-dasharray="7 5"/>
    <text x="493" y="338" class="m-basin">SIRTE BASIN</text></g>
  <g class="basin"><ellipse cx="336" cy="452" rx="86" ry="66"
      fill="#C8102E" fill-opacity=".10" stroke="#E01235" stroke-opacity=".42" stroke-width="1.6" stroke-dasharray="7 5"/>
    <text x="336" y="458" class="m-basin">MURZUQ</text></g>
  <g class="basin"><ellipse cx="254" cy="306" rx="45" ry="72"
      fill="#C8102E" fill-opacity=".10" stroke="#E01235" stroke-opacity=".42" stroke-width="1.6" stroke-dasharray="7 5"/>
    <text x="254" y="312" class="m-basin" font-size="12">GHADAMES</text></g>
  <g class="basin"><ellipse cx="657" cy="270" rx="66" ry="54"
      fill="#C8102E" fill-opacity=".08" stroke="#E01235" stroke-opacity=".34" stroke-width="1.6" stroke-dasharray="7 5"/>
    <text x="657" y="276" class="m-basin" font-size="12">CYRENAICA</text></g>

  <!-- HQ -->
  <g class="hq" transform="translate(310 174)">
    <circle r="26" fill="#E01235" fill-opacity=".18" class="ping"/>
    <circle r="13" fill="#C8102E" fill-opacity=".3"/>
    <circle r="6" fill="#E01235"/>
    <path d="M0 -12 v-34" stroke="#E01235" stroke-width="1.4"/>
  </g>
  <text x="310" y="122" class="m-hq-lab">TRIPOLI — HQ</text>

  <!-- cities -->
  <g class="m-city">
    <g><circle cx="382" cy="191" r="4"/><text x="393" y="187">Misrata</text></g>
    <g><circle cx="440" cy="234" r="4"/><text x="451" y="230">Sirte</text></g>
    <g><circle cx="572" cy="200" r="4"/><text x="583" y="196">Benghazi</text></g>
    <g><circle cx="721" cy="202" r="4"/><text x="700" y="226" text-anchor="middle">Tobruk</text></g>
    <g><circle cx="357" cy="386" r="4"/><text x="368" y="378">Sabha</text></g>
  </g>

  <!-- scale bar -->
  <g stroke="#4A5F96" stroke-width="1.2" fill="none">
    <path d="M170 640h114M170 634v12M284 634v12"/>
  </g>
  <text x="170" y="664" class="m-sea">300 KM</text>
</svg>'''


# ---------------------------------------------------------------- TOOL LINE ART
TOOL_WRENCH = '''<svg viewBox="0 0 200 200" class="tool-art" aria-hidden="true">
  <g fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round">
    <path d="M64 44a30 30 0 1 0 30 30l58 58a12 12 0 0 0 17-17L111 57a30 30 0 0 0-47-13Z"/>
    <path d="M64 44 88 68 74 82 50 58"/>
  </g>
  <circle cx="150" cy="150" r="16" fill="none" stroke="#C8102E" stroke-width="3" stroke-dasharray="4 4"/>
</svg>'''

TOOL_SOCKET = '''<svg viewBox="0 0 200 200" class="tool-art" aria-hidden="true">
  <g fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round">
    <path d="M100 30 148 58v56L100 142 52 114V58Z"/>
    <path d="M100 62 124 76v28L100 118 76 104V76Z"/>
    <path d="M100 30v32M148 58l-24 18M148 114l-24-10M100 142v-24M52 114l24-10M52 58l24 18"/>
  </g>
  <path d="M100 152v22" stroke="#C8102E" stroke-width="4" stroke-linecap="round"/>
</svg>'''

TOOL_PIPE = '''<svg viewBox="0 0 200 200" class="tool-art" aria-hidden="true">
  <g fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round">
    <rect x="26" y="86" width="148" height="30" rx="15"/>
    <path d="M62 86V64a16 16 0 0 1 32 0v22M106 116v22a16 16 0 0 0 32 0v-22"/>
    <path d="M26 96h148M26 106h148" opacity=".45"/>
  </g>
  <circle cx="100" cy="101" r="7" fill="#C8102E"/>
</svg>'''

TOOL_HYDRAULIC = '''<svg viewBox="0 0 200 200" class="tool-art" aria-hidden="true">
  <g fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round">
    <rect x="30" y="70" width="76" height="60" rx="8"/>
    <path d="M106 88h34a12 12 0 0 1 12 12v0a12 12 0 0 1-12 12h-34"/>
    <path d="M152 100h22"/>
    <path d="M46 70V52h44v18"/>
  </g>
  <path d="M62 92l-10 18h16l-10 18" stroke="#C8102E" stroke-width="4" fill="none" stroke-linecap="round"/>
</svg>'''

TOOL_ATEX = '''<svg viewBox="0 0 200 200" class="tool-art" aria-hidden="true">
  <g fill="none" stroke="currentColor" stroke-width="4" stroke-linejoin="round">
    <path d="M100 26 166 52v50c0 40-28 62-66 72-38-10-66-32-66-72V52Z"/>
  </g>
  <path d="M100 62c-16 20-8 38 2 48 4-16 12-14 15-4 10-16 12-32-2-46Z" fill="#C8102E" opacity=".9"/>
  <path d="M70 132h60" stroke="#C8102E" stroke-width="4" stroke-linecap="round"/>
</svg>'''


# ---------------------------------------------------------------- ICONS (24px stroke)
def _icon(body, extra=''):
    return ('<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            'stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" '
            'aria-hidden="true"%s>%s</svg>' % (extra, body))

ICONS = {
 'tools':   _icon('<path d="M15.5 3.5a4.5 4.5 0 0 0-1.1 4.6L5.6 16.8a2 2 0 1 0 2.8 2.8l8.7-8.8a4.5 4.5 0 0 0 5.4-5.9l-2.6 2.6-2.5-.7-.7-2.5Z"/><path d="M6.8 18.2h.01"/>'),
 'cart':    _icon('<circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/><path d="M2 3h3l2.4 12.2a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21 7H6"/>'),
 'well':    _icon('<path d="m5.5 21 6.5-18 6.5 18"/><path d="M8 13h8M9.2 9.5h5.6M12 3v18"/>'),
 'shield':  _icon('<path d="M12 2 20 5.5v6C20 17 16.5 20.5 12 22 7.5 20.5 4 17 4 11.5v-6Z"/><path d="m9 12 2 2 4-4"/>'),
 'drone':   _icon('<rect x="9" y="9" width="6" height="6" rx="1.5"/><path d="M9 9 5.5 5.5M15 9l3.5-3.5M9 15l-3.5 3.5M15 15l3.5 3.5"/><circle cx="4" cy="4" r="2"/><circle cx="20" cy="4" r="2"/><circle cx="4" cy="20" r="2"/><circle cx="20" cy="20" r="2"/>'),
 'gauge':   _icon('<path d="M12 14 16 9"/><circle cx="12" cy="14" r="1"/><path d="M4 18a9 9 0 1 1 16 0"/>'),
 'truck':   _icon('<path d="M2 6h11v11H2Z"/><path d="M13 9h4l4 4v4h-8Z"/><circle cx="6.5" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/>'),
 'flask':   _icon('<path d="M9 2v6.6L4.2 18A2 2 0 0 0 6 21h12a2 2 0 0 0 1.8-3L15 8.6V2"/><path d="M8 2h8M7.5 14h9"/>'),
 'drill':   _icon('<rect x="3" y="5" width="10" height="7" rx="1.5"/><path d="M13 7h4.5L21 9.5 17.5 12H13"/><path d="M6.5 12v4.5M6.5 19.5v.01M10 12v2.5"/>'),
 'layers':  _icon('<path d="m12 3 9 5-9 5-9-5Z"/><path d="m3 13 9 5 9-5"/>'),
 'cert':    _icon('<path d="M6 3h12v13l-6 3-6-3Z"/><path d="m9 9 2 2 4-4"/><path d="M9 21h6"/>'),
 'clock':   _icon('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/>'),
 'phone':   _icon('<path d="M5 3h4l2 5-2.5 1.5a12 12 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/>'),
 'mail':    _icon('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>'),
 'pin':     _icon('<path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Z"/><circle cx="12" cy="10" r="2.6"/>'),
 'globe':   _icon('<circle cx="12" cy="12" r="9"/><path d="M3.5 9h17M3.5 15h17"/><path d="M12 3a15 15 0 0 1 0 18a15 15 0 0 1 0-18Z"/>'),
 'arrow':   _icon('<path d="M5 12h14M13 6l6 6-6 6"/>', ' data-flip'),
 'spark':   _icon('<path d="M13 2 4 14h7l-1 8 9-12h-7Z"/>'),
 'link':    _icon('<path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1"/>'),
 'download':_icon('<path d="M12 3v12"/><path d="m7 11 5 5 5-5"/><path d="M4 20h16"/>'),
 'search':  _icon('<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>'),
 'check':   _icon('<path d="m4 12 5 5L20 6"/>'),
 'ruler':   _icon('<path d="M2.5 16.5 16.5 2.5l5 5-14 14Z"/><path d="m6 13 2 2M9 10l2 2M12 7l2 2"/>'),
 'bolt':    _icon('<path d="M12 2a5 5 0 0 0-5 5v3H5v9a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-9h-2V7a5 5 0 0 0-5-5Z"/><path d="M9.5 10V7a2.5 2.5 0 0 1 5 0v3"/><path d="M12 14v3"/>'),
 'caliper': _icon('<path d="M4 3h5v18H4z"/><path d="M15 3h5v13l-2.5 5-2.5-5Z"/><path d="M9 7h6M9 11h6M9 15h6"/>'),
 'torque':  _icon('<circle cx="12" cy="12" r="4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2.2 2.2M16.8 16.8 19 19M19 5l-2.2 2.2M7.2 16.8 5 19"/>'),
 'box':     _icon('<path d="m12 3 8 4.2v9.6L12 21l-8-4.2V7.2Z"/><path d="m4 7.2 8 4.2 8-4.2M12 11.4V21"/>'),
 'menu':    _icon('<path d="M3 6h18M3 12h18M3 18h18"/>'),
 'close':   _icon('<path d="M6 6l12 12M18 6 6 18"/>'),
}
