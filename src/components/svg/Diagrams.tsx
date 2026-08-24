/* Hand-authored diagrams. Ported verbatim from the original SVG — only
   JSX attribute casing differs. */

export function LogoMark() {
  return (
    <svg className="mark" viewBox="0 0 104 128" role="img" aria-label="Remal Nahya">
      <defs>
        <linearGradient id="dropG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4F6FA"/><stop offset="1" stopColor="#DCE3EF"/>
        </linearGradient>
      </defs>
      <path d="M52 3C52 3 97 52 97 80a45 45 0 0 1-90 0C7 52 52 3 52 3Z" fill="url(#dropG)" stroke="#1B2A5B" strokeWidth="6"/>
      <g transform="translate(52 78)">
        <circle r="19" fill="none" stroke="#16264F" strokeWidth="5"/>
        <g fill="#16264F">
          <rect x="-2.6" y="-25.5" width="5.2" height="7" rx="1"/><rect x="-2.6" y="18.5" width="5.2" height="7" rx="1"/>
          <rect x="-25.5" y="-2.6" width="7" height="5.2" rx="1"/><rect x="18.5" y="-2.6" width="7" height="5.2" rx="1"/>
          <g transform="rotate(45)">
            <rect x="-2.6" y="-25.5" width="5.2" height="7" rx="1"/><rect x="-2.6" y="18.5" width="5.2" height="7" rx="1"/>
            <rect x="-25.5" y="-2.6" width="7" height="5.2" rx="1"/><rect x="18.5" y="-2.6" width="7" height="5.2" rx="1"/>
          </g>
        </g>
      </g>
      <g stroke="#C8102E" strokeWidth="4.6" strokeLinecap="round" fill="none">
        <path d="M38 92 52 40 66 92"/>
        <path d="M43 74h18M40.5 84h23"/>
        <path d="M52 40v52"/>
      </g>
    </svg>
  );
}

export function HeroOverlay() {
  return (
    <svg className="hero__scene" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden>
      <defs>
        <linearGradient id="hFade" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7C8DB5" stopOpacity="0"/>
          <stop offset=".55" stopColor="#7C8DB5" stopOpacity=".55"/>
          <stop offset="1" stopColor="#7C8DB5" stopOpacity=".8"/>
        </linearGradient>
      </defs>
    
      {/* construction grid, fading in from the image side */}
      <g stroke="url(#hFade)" strokeWidth="1" opacity=".22">
        <path d="M900 0v900M1100 0v900M1300 0v900M1500 0v900"/>
        <path d="M860 180h740M860 420h740M860 660h740"/>
      </g>
    
      {/* corner ticks */}
      <g stroke="#B6C1D6" strokeWidth="1.6" opacity=".5" fill="none">
        <path d="M1520 96h44M1564 96v44"/>
        <path d="M1520 804h44M1564 804v-44"/>
      </g>
    
      <g className="hero__tg">
      {/* depth call-out, right */}
      <g className="hero__tech" fill="none" stroke="#B6C1D6" opacity=".55" strokeWidth="1.2">
        <path d="M1352 236v426"/>
        <path d="M1344 236h16M1344 662h16"/>
        <path d="M1352 236l-6 12M1352 236l6 12M1352 662l-6-12M1352 662l6-12"/>
      </g>
      <g fill="#DCE3EF" opacity=".72" fontFamily="'IBM Plex Mono',monospace" fontSize="14" letterSpacing="2">
        <text x="1374" y="444">TD 3,240 m</text>
        <text x="1374" y="468" fontSize="11" fill="#7C8DB5">MEASURED DEPTH</text>
      </g>
    
      {/* pressure call-out, leader line to the rig floor */}
      <g className="hero__tech" fill="none" stroke="#E01235" strokeWidth="1.4" opacity=".85">
        <path d="M986 662h132v-64"/>
        <circle cx="986" cy="662" r="4" fill="#E01235" stroke="none"/>
        <circle cx="986" cy="662" r="11" opacity=".45"/>
      </g>
      <g fill="#fff" fontFamily="'IBM Plex Mono',monospace" fontSize="13" letterSpacing="2">
        <text x="1126" y="592">15,000 psi</text>
      </g>
    
      {/* basin tag */}
      <g className="hero__tech" fill="none" stroke="#B6C1D6" strokeWidth="1.1" opacity=".45">
        <path d="M1180 220h150"/>
        <path d="M1180 214v12"/>
      </g>
      <g fill="#B6C1D6" opacity=".65" fontFamily="'IBM Plex Mono',monospace" fontSize="11.5" letterSpacing="2.4">
        <text x="1180" y="206">SIRTE BASIN · LIBYA</text>
      </g>
      </g>
    </svg>
  );
}

export function Wellbore() {
  return (
    <svg className="well" viewBox="40 0 528 928" role="img" aria-labelledby="wellTitle">
      <title id="wellTitle">Wellbore cross-section: casing strings, cement sheath, completion, perforations</title>
      <defs>
        <pattern id="cementPat" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke="#4A5F96" strokeWidth="2.6" opacity=".55"/>
        </pattern>
        <linearGradient id="resGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C8102E" stopOpacity=".06"/>
          <stop offset="1" stopColor="#C8102E" stopOpacity=".20"/>
        </linearGradient>
        <linearGradient id="rockGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E3E8F0"/><stop offset="1" stopColor="#D2DAE8"/>
        </linearGradient>
      </defs>
    
      {/* formation */}
      <rect x="110" y="120" width="410" height="796" fill="url(#rockGrad)"/>
      <g stroke="#A9B6CE" strokeWidth="1.3" fill="none">
        <path d="M110 268 C210 256 320 280 420 268 C470 262 500 270 520 266"/>
        <path d="M110 452 C220 442 330 464 430 452 C480 446 505 454 520 450"/>
        <path d="M110 628 C205 620 330 640 435 628 C480 622 505 630 520 626"/>
        <path d="M110 800 C210 792 320 812 425 800 C475 794 505 802 520 798"/>
      </g>
      <rect x="110" y="700" width="410" height="160" fill="url(#resGrad)"/>
      <g stroke="#C8102E" strokeWidth="1.2" opacity=".45" fill="none">
        <path d="M110 700h410M110 860h410"/>
      </g>
      <text x="500" y="866" className="w-cal w-cal--end" fill="#C8102E">RESERVOIR</text>
    
      {/* surface */}
      <path d="M110 120h410" stroke="#0B1533" strokeWidth="3"/>
      <g fill="none" stroke="#0B1533" strokeWidth="4" strokeLinejoin="round" transform="translate(315 22)">
        <path d="M-38 98 L0 0 L38 98"/>
        <path d="M-30 68 H30 M-22 38 H22"/>
        <path d="M-30 68 L22 38 M30 68 L-22 38"/>
      </g>
      <rect x="286" y="104" width="58" height="18" rx="2" fill="#0B1533"/>
      <rect x="306" y="86" width="18" height="20" rx="2" fill="#0B1533"/>
    
      {/* ============ casing strings (drawn on scroll) ============ */}
      <g>
        <rect x="252" y="120" width="18" height="210" fill="url(#cementPat)"/>
        <rect x="360" y="120" width="18" height="210" fill="url(#cementPat)"/>
        <path className="w-draw" d="M270 120v210M360 120v210" stroke="#16264F" strokeWidth="7" fill="none" strokeLinecap="square"/>
        <path d="M244 240h-52" stroke="#7C8DB5" strokeWidth="1.1" strokeDasharray="3 3"/>
        <text x="186" y="244" className="w-cal w-cal--end">CONDUCTOR</text>
      </g>
      <g>
        <rect x="270" y="120" width="15" height="470" fill="url(#cementPat)"/>
        <rect x="345" y="120" width="15" height="470" fill="url(#cementPat)"/>
        <path className="w-draw" d="M285 120v470M345 120v470" stroke="#24376F" strokeWidth="6" fill="none" strokeLinecap="square"/>
        <path d="M388 470h48" stroke="#7C8DB5" strokeWidth="1.1" strokeDasharray="3 3"/>
        <text x="442" y="474" className="w-cal">SURFACE CSG</text>
      </g>
      <g>
        <rect x="285" y="120" width="13" height="760" fill="url(#cementPat)"/>
        <rect x="332" y="120" width="13" height="760" fill="url(#cementPat)"/>
        <path className="w-draw" d="M298 120v760M332 120v760" stroke="#4A5F96" strokeWidth="5.5" fill="none" strokeLinecap="square"/>
        <path d="M278 384h-86" stroke="#7C8DB5" strokeWidth="1.1" strokeDasharray="3 3"/>
        <text x="186" y="388" className="w-cal w-cal--end">PRODUCTION CSG</text>
      </g>
    
      {/* open bore */}
      <rect x="298" y="120" width="34" height="762" fill="#FBFCFE"/>
    
      {/* ============ stage: completion ============ */}
      <g className="w-stage" data-stage="completion">
        <path className="w-draw" d="M305 120v580M325 120v580" stroke="#0B1533" strokeWidth="3.4" fill="none"/>
        <rect x="294" y="696" width="42" height="26" rx="3" fill="#C8102E"/>
        <path d="M340 709h46" stroke="#C8102E" strokeWidth="1.2" strokeDasharray="3 3"/>
        <text x="392" y="713" className="w-cal" fill="#C8102E">PACKER</text>
      </g>
    
      {/* ============ stage: stimulation ============ */}
      <g className="w-stage" data-stage="stimulation">
        <g stroke="#C8102E" strokeWidth="3" strokeLinecap="round">
          <path className="perf" d="M298 752 L252 742"/><path className="perf" d="M332 752 L378 742"/>
          <path className="perf" d="M298 780 L254 790"/><path className="perf" d="M332 780 L376 790"/>
          <path className="perf" d="M298 808 L250 798"/><path className="perf" d="M332 808 L380 798"/>
          <path className="perf" d="M298 836 L256 846"/><path className="perf" d="M332 836 L374 846"/>
        </g>
        <path d="M392 794h34" stroke="#C8102E" strokeWidth="1.2" strokeDasharray="3 3"/>
        <text x="432" y="798" className="w-cal" fill="#C8102E">PERFS</text>
      </g>
    
      {/* ============ stage: cementing ============ */}
      <g className="w-stage" data-stage="cementing">
        <rect x="298" y="540" width="34" height="140" fill="url(#cementPat)"/>
        <rect x="298" y="540" width="34" height="140" fill="none" stroke="#24376F" strokeWidth="1.8"/>
        <path d="M262 610h-70" stroke="#24376F" strokeWidth="1.2" strokeDasharray="3 3"/>
        <text x="186" y="614" className="w-cal w-cal--end" fill="#24376F">CEMENT PLUG</text>
      </g>
    
      {/* ============ stage: intervention ============ */}
      <g className="w-stage" data-stage="intervention">
        <path className="w-draw" d="M315 120v420" stroke="#C8102E" strokeWidth="2.4" fill="none"/>
        <g fill="#C8102E">
          <rect x="307" y="540" width="16" height="40" rx="2"/>
          <rect x="306" y="586" width="18" height="30" rx="2"/>
          <rect x="308" y="622" width="14" height="34" rx="2"/>
          <path d="M308 656h14l-7 14z"/>
        </g>
        <path d="M332 600h54" stroke="#C8102E" strokeWidth="1.2" strokeDasharray="3 3"/>
        <text x="392" y="604" className="w-cal" fill="#C8102E">SLICKLINE</text>
      </g>
    
      {/* depth scale */}
      <g>
        <path d="M96 120v760" stroke="#A9B6CE" strokeWidth="1.2"/>
        <g stroke="#A9B6CE" strokeWidth="1.2">
          <path d="M90 120h12M90 310h12M90 500h12M90 690h12M90 880h12"/>
        </g>
        <g className="w-cal w-cal--end">
          <text x="82" y="124" className="w-nocaps">0 m</text>
          <text x="82" y="314">800</text>
          <text x="82" y="504">1,600</text>
          <text x="82" y="694">2,400</text>
          <text x="82" y="884">3,200</text>
        </g>
        <path d="M90 902h206" stroke="#C8102E" strokeWidth="1.2" strokeDasharray="4 3"/>
        <text x="302" y="906" className="w-cal w-nocaps" fill="#C8102E">TD 3,240 m</text>
      </g>
    </svg>
  );
}

export function DroneScene() {
  return (
    <svg className="drone-svg" viewBox="0 0 900 460" role="img" aria-labelledby="droneTitle">
      <title id="droneTitle">Drone surveying a pipeline and detecting a hydrocarbon gas plume</title>
      <defs>
        <linearGradient id="dSky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0B1533"/><stop offset="1" stopColor="#1B2A5B"/>
        </linearGradient>
        <radialGradient id="plumeG" cx="0.5" cy="1" r="0.72">
          <stop offset="0"   stopColor="#E01235" stopOpacity=".65"/>
          <stop offset="0.5" stopColor="#F2A900" stopOpacity=".30"/>
          <stop offset="1"   stopColor="#F2A900" stopOpacity="0"/>
        </radialGradient>
        <linearGradient id="coneG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#B6C1D6" stopOpacity=".34"/>
          <stop offset="1" stopColor="#B6C1D6" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <rect width="900" height="460" fill="url(#dSky)"/>
      <rect width="900" height="460" fill="#16264F" opacity=".35"/>
      <g stroke="#4A5F96" strokeWidth="1" opacity=".45">
        <path d="M0 60h900M0 120h900M0 180h900M0 240h900M0 300h900"/>
        <path d="M100 0v460M250 0v460M400 0v460M550 0v460M700 0v460M850 0v460"/>
      </g>
    
      {/* desert plane */}
      <path d="M0 372 C160 362 300 380 460 370 C620 360 760 380 900 368 L900 460 L0 460Z" fill="#080F26"/>
    
      {/* pipeline */}
      <g>
        <rect x="0" y="392" width="900" height="26" rx="13" fill="#4A5F96"/>
        <rect x="0" y="392" width="900" height="9" rx="4" fill="#B6C1D6" opacity=".45"/>
        <g fill="#16264F">
          <rect x="118" y="386" width="12" height="38" rx="3"/><rect x="352" y="386" width="12" height="38" rx="3"/>
          <rect x="586" y="386" width="12" height="38" rx="3"/><rect x="820" y="386" width="12" height="38" rx="3"/>
        </g>
        {/* valve at leak point */}
        <g transform="translate(470 405)">
          <rect x="-16" y="-26" width="32" height="18" rx="3" fill="#4A5F96"/>
          <rect x="-4" y="-10" width="8" height="12" fill="#4A5F96"/>
        </g>
      </g>
    
      {/* gas plume */}
      <g className="plume">
        <ellipse cx="470" cy="380" rx="86" ry="150" fill="url(#plumeG)"/>
        <g fill="#F2A900">
          <circle className="p1" cx="452" cy="330" r="4" opacity=".7"/>
          <circle className="p2" cx="480" cy="300" r="3" opacity=".6"/>
          <circle className="p3" cx="466" cy="264" r="5" opacity=".5"/>
          <circle className="p4" cx="492" cy="236" r="3.4" opacity=".45"/>
          <circle className="p5" cx="448" cy="212" r="4" opacity=".35"/>
        </g>
      </g>
    
      {/* sensor cone */}
      <path className="cone" d="M470 118 L340 372 L600 372 Z" fill="url(#coneG)"/>
      <path className="scan" d="M470 118 L470 372" stroke="#B6C1D6" strokeWidth="1.2" opacity=".7"/>
    
      {/* drone */}
      <g className="drone" transform="translate(470 106)">
        <rect x="-26" y="-9" width="52" height="19" rx="7" fill="#DCE3EF"/>
        <rect x="-9" y="8" width="18" height="12" rx="3" fill="#C8102E"/>
        <g stroke="#B6C1D6" strokeWidth="3.4" strokeLinecap="round">
          <path d="M-24 -6 L-52 -18 M24 -6 L52 -18"/>
        </g>
        <g stroke="#7C8DB5" strokeWidth="2.2" fill="none" className="rotors">
          <path d="M-70 -18h36M34 -18h36"/>
          <path d="M-64 -22 a16 5 0 0 1 24 0M40 -22 a16 5 0 0 1 24 0" opacity=".55"/>
        </g>
        <circle cx="0" cy="-14" r="2.6" fill="#C8102E" className="beacon"/>
      </g>
    
      {/* readout */}
      <g className="d-hud">
        <rect x="620" y="60" width="238" height="128" rx="6" fill="#0B1533" fillOpacity=".78" stroke="#24376F"/>
        <text x="638" y="86" className="d-lab">GAS DETECTION · LIVE</text>
        <g className="d-row">
          <text x="638" y="116" className="d-key">VOC</text>
          <rect x="700" y="106" width="140" height="6" rx="3" fill="#24376F"/>
          <rect x="700" y="106" width="104" height="6" rx="3" fill="#C8102E" className="bar1"/>
          <text x="822" y="100" className="d-key d-key--end">HIGH</text>
        </g>
        <g className="d-row">
          <text x="638" y="146" className="d-key">H2S</text>
          <rect x="700" y="136" width="140" height="6" rx="3" fill="#24376F"/>
          <rect x="700" y="136" width="46" height="6" rx="3" fill="#F2A900" className="bar2"/>
        </g>
        <g className="d-row">
          <text x="638" y="176" className="d-key">SO2</text>
          <rect x="700" y="166" width="140" height="6" rx="3" fill="#24376F"/>
          <rect x="700" y="166" width="24" height="6" rx="3" fill="#4A5F96" className="bar3"/>
        </g>
      </g>
      <g className="d-lab" fill="#7C8DB5">
        <text x="42" y="450">PIPELINE INSPECTION · NO SHUTDOWN REQUIRED</text>
      </g>
    </svg>
  );
}

export function LibyaMap() {
  return (
    <svg className="map-svg" viewBox="140 34 692 664" role="img" aria-labelledby="mapTitle">
      <title id="mapTitle">Libya, showing the Sirte, Murzuq, Ghadames and Cyrenaica basins and Remal Nahya's Tripoli base</title>
      <defs>
        <linearGradient id="landG" x1=".1" y1="0" x2=".9" y2="1">
          <stop offset="0" stopColor="#1B2A5B"/><stop offset="1" stopColor="#101E42"/>
        </linearGradient>
        <pattern id="mapGrid" width="44" height="44" patternUnits="userSpaceOnUse">
          <path d="M44 0H0V44" fill="none" stroke="#24376F" strokeWidth="1" opacity=".45"/>
        </pattern>
        <linearGradient id="seaG" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#122443"/><stop offset="1" stopColor="#0E1A3E"/>
        </linearGradient>
      </defs>
      <rect width="880" height="720" fill="#070E22"/>
      <rect width="880" height="720" fill="url(#mapGrid)"/>
    
      {/* Mediterranean */}
      <path d="M0 0h880v226 L766 219 C740 210 700 196 670 176 C640 172 606 178 572 200
               C548 216 528 246 514 259 C486 250 460 240 440 234 C412 224 396 206 382 191
               C350 178 300 168 247 162 C180 158 90 160 0 164Z" fill="#0C1730"/>
      <g stroke="#24376F" strokeWidth="1" fill="none" opacity=".55">
        <path d="M0 108 C160 100 320 112 470 132 C600 150 720 140 880 122"/>
      </g>
      <text x="196" y="80" className="m-sea">MEDITERRANEAN SEA</text>
      <text x="486" y="300" className="m-sea" textAnchor="middle">GULF OF SIRTE</text>
    
      {/* Libya */}
      <g className="map-land">
        <path d="M247 162 C300 168 350 178 382 191 C396 206 412 224 440 234
                 C460 240 486 250 514 259 C528 246 548 216 572 200
                 C606 178 640 172 670 176 C700 196 740 210 766 219
                 L760 569 L760 606 L722 642
                 L379 533 L270 522 L218 380 L169 274 Z"
              fill="url(#landG)" stroke="#4A5F96" strokeWidth="2.4" strokeLinejoin="round"/>
      </g>
    
      {/* basins */}
      <g className="basin"><ellipse cx="493" cy="332" rx="100" ry="84" transform="rotate(-16 493 332)"
          fill="#C8102E" fillOpacity=".15" stroke="#E01235" strokeOpacity=".6" strokeWidth="1.6" strokeDasharray="7 5"/>
        <text x="493" y="338" className="m-basin">SIRTE BASIN</text></g>
      <g className="basin"><ellipse cx="336" cy="452" rx="86" ry="66"
          fill="#C8102E" fillOpacity=".10" stroke="#E01235" strokeOpacity=".42" strokeWidth="1.6" strokeDasharray="7 5"/>
        <text x="336" y="458" className="m-basin">MURZUQ</text></g>
      <g className="basin"><ellipse cx="254" cy="306" rx="45" ry="72"
          fill="#C8102E" fillOpacity=".10" stroke="#E01235" strokeOpacity=".42" strokeWidth="1.6" strokeDasharray="7 5"/>
        <text x="254" y="312" className="m-basin" fontSize="12">GHADAMES</text></g>
      <g className="basin"><ellipse cx="657" cy="270" rx="66" ry="54"
          fill="#C8102E" fillOpacity=".08" stroke="#E01235" strokeOpacity=".34" strokeWidth="1.6" strokeDasharray="7 5"/>
        <text x="657" y="276" className="m-basin" fontSize="12">CYRENAICA</text></g>
    
      {/* HQ */}
      <g className="hq" transform="translate(310 174)">
        <circle r="26" fill="#E01235" fillOpacity=".18" className="ping"/>
        <circle r="13" fill="#C8102E" fillOpacity=".3"/>
        <circle r="6" fill="#E01235"/>
        <path d="M0 -12 v-34" stroke="#E01235" strokeWidth="1.4"/>
      </g>
      <text x="310" y="122" className="m-hq-lab">TRIPOLI — HQ</text>
    
      {/* cities */}
      <g className="m-city">
        <g><circle cx="382" cy="191" r="4"/><text x="393" y="187">Misrata</text></g>
        <g><circle cx="440" cy="234" r="4"/><text x="451" y="230">Sirte</text></g>
        <g><circle cx="572" cy="200" r="4"/><text x="583" y="196">Benghazi</text></g>
        <g><circle cx="721" cy="202" r="4"/><text x="700" y="226" textAnchor="middle">Tobruk</text></g>
        <g><circle cx="357" cy="386" r="4"/><text x="368" y="378">Sabha</text></g>
      </g>
    
      {/* scale bar */}
      <g stroke="#4A5F96" strokeWidth="1.2" fill="none">
        <path d="M170 640h114M170 634v12M284 634v12"/>
      </g>
      <text x="170" y="664" className="m-sea">300 KM</text>
    </svg>
  );
}
