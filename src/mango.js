/* Mad Mango — the app's mascot, drawn in code (sticker style: dark outline, cel shading).
   madMango(mood, size, anim) returns an <svg>. Moods:
   chat emotions: angel, evil (knife), smug (sunglasses), cry, shock, love, think, demon
   app states:    happy, wave, cheer, sad */
let MM_N = 0;
const MAD_MOODS = ["angel","evil","smug","cry","shock","love","think","demon"];
function madMango(mood = "happy", size = 96, anim = "bob") {
  const id = "mm" + (++MM_N);
  const O = "#2E1609";               // outline
  const W = 5;                       // outline width
  const ARM = "#F59A1A";
  const demon = mood === "demon";
  const BODY = `M100 46 C142 42 170 80 168 120 C166 160 136 184 99 182 C60 180 32 154 34 116 C36 78 60 50 100 46 Z`;

  /* ---- layers behind the body ---- */
  let back = "";
  if (mood === "angel") back += `
    <g opacity=".98"><g class="wing-l"><path d="M44 112 C10 96 6 62 20 52 C26 74 36 82 52 92 Z" fill="#fff" stroke="${O}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M22 70 C30 80 38 86 48 90 M18 84 C28 92 38 96 46 100" stroke="#C9D6F2" stroke-width="3" fill="none" stroke-linecap="round"/></g><g class="wing-r">
    <path d="M156 112 C190 96 194 62 180 52 C174 74 164 82 148 92 Z" fill="#fff" stroke="${O}" stroke-width="4" stroke-linejoin="round"/>
    <path d="M178 70 C170 80 162 86 152 90 M182 84 C172 92 162 96 154 100" stroke="#C9D6F2" stroke-width="3" fill="none" stroke-linecap="round"/></g></g>`;
  if (demon) back += `
    <circle class="aura" cx="100" cy="112" r="88" fill="url(#${id}aura)"/>
    <path d="M150 164 C178 172 186 150 176 136" stroke="${O}" stroke-width="10" fill="none" stroke-linecap="round"/>
    <path d="M150 164 C178 172 186 150 176 136" stroke="#C81E3A" stroke-width="5" fill="none" stroke-linecap="round"/>
    <path d="M176 136 L166 126 L186 124 Z" fill="#C81E3A" stroke="${O}" stroke-width="3.5" stroke-linejoin="round"/>`;
  if (mood === "shock") back += `<g stroke="${O}" stroke-width="4" stroke-linecap="round"><path d="M18 60 L32 70M12 92 L28 94M182 60 L168 70M188 92 L172 94M100 8 L100 22M60 16 L66 30M140 16 L134 30"/></g>`;

  /* ---- arms (drawn under the body edge) ---- */
  const arm = (d) => `<path d="${d}" stroke="${O}" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" stroke="${ARM}" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  const hand = (x, y) => `<circle cx="${x}" cy="${y}" r="9" fill="${ARM}" stroke="${O}" stroke-width="4"/>`;
  let arms = "", front = "";
  switch (mood) {
    case "angel": arms = arm("M44 140 C52 162 76 172 92 170") + arm("M156 140 C148 162 124 172 108 170"); front += hand(93, 170) + hand(107, 170); break;
    case "evil": arms = arm("M42 136 C30 148 30 160 36 168") + arm("M158 128 C176 118 182 100 178 86"); front += hand(36, 168); break;
    case "smug": arms = arm("M40 124 C18 130 16 150 40 156") + arm("M160 124 C182 130 184 150 160 156"); front += hand(40, 156) + hand(160, 156); break;
    case "cry": arms = arm("M42 138 C30 150 28 164 34 172") + arm("M158 138 C170 150 172 164 166 172"); front += hand(34, 172) + hand(166, 172); break;
    case "shock": arms = arm("M40 120 C22 104 22 84 30 72") + arm("M160 120 C178 104 178 84 170 72"); front += hand(30, 72) + hand(170, 72); break;
    case "love": arms = arm("M44 140 C52 162 76 172 92 170") + arm("M156 140 C148 162 124 172 108 170"); front += hand(93, 170) + hand(107, 170); break;
    case "think": arms = arm("M42 136 C30 148 30 160 36 168") + arm("M158 140 C156 162 142 170 128 164"); front += hand(36, 168) + hand(128, 163); break;
    case "demon": arms = arm("M42 136 C30 148 30 160 36 168") + arm("M158 130 C172 122 176 110 174 100"); front += hand(36, 168); break;
    case "cheer": arms = arm("M42 116 C24 98 22 74 30 58") + arm("M158 116 C176 98 178 74 170 58"); front += hand(30, 58) + hand(170, 58); break;
    case "wave": arms = arm("M42 136 C30 148 30 160 36 168") + `<g class="wv">${arm("M158 116 C176 100 180 80 174 62")}${hand(174, 62)}</g>`; front += hand(36, 168); break;
    case "sad": arms = arm("M42 138 C34 154 34 166 40 174") + arm("M158 138 C166 154 166 166 160 174"); front += hand(40, 174) + hand(160, 174); break;
    default: arms = arm("M42 136 C30 148 30 160 36 168") + arm("M158 136 C170 148 170 160 164 168"); front += hand(36, 168) + hand(164, 168);
  }

  /* ---- face parts ---- */
  const EYE = (cx, cy, px = 0, py = 0, rx = 13, ry = 15) =>
    `<g class="eye"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="#fff" stroke="${O}" stroke-width="4"/>
     <circle cx="${cx + px}" cy="${cy + py + 2}" r="7" fill="${O}"/><circle cx="${cx + px + 2.5}" cy="${cy + py - 1}" r="2.6" fill="#fff"/></g>`;
  const brow = (d, w = 7) => `<path d="${d}" stroke="${O}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`;
  const cheeks = (o = .5) => `<ellipse cx="58" cy="134" rx="11" ry="7" fill="#FF4F6E" opacity="${o}"/><ellipse cx="142" cy="134" rx="11" ry="7" fill="#FF4F6E" opacity="${o}"/>`;
  const heart = (x, y, s = 1, c = "#FF3B5C") => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 6 C0 -2 -12 -4 -12 4 C-12 11 0 17 0 20 C0 17 12 11 12 4 C12 -4 0 -2 0 6 Z" fill="${c}" stroke="${O}" stroke-width="${3 / s}" stroke-linejoin="round"/>`;
  let face = "", props = "";
  switch (mood) {
    case "angel":
      face = brow("M66 86 Q78 80 90 86", 5) + brow("M110 86 Q122 80 134 86", 5)
        + `<path d="M68 104 Q79 94 90 104 M110 104 Q121 94 132 104" stroke="${O}" stroke-width="5" fill="none" stroke-linecap="round"/>`
        + cheeks(.65) + `<path d="M88 128 Q100 140 112 128" stroke="${O}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      props = `<ellipse cx="100" cy="22" rx="34" ry="9" fill="none" stroke="#FFF3A6" stroke-width="12" opacity=".55" class="glow"/>
        <ellipse cx="100" cy="22" rx="34" ry="9" fill="none" stroke="${O}" stroke-width="10"/>
        <ellipse cx="100" cy="22" rx="34" ry="9" fill="none" stroke="#FFD23F" stroke-width="5"/>
        <path d="M170 40 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z M28 150 l2 6 6 2 -6 2 -2 6 -2 -6 -6 -2 6 -2z" fill="#FFE27A" stroke="${O}" stroke-width="2" class="twinkle"/>`;
      break;
    case "evil":
      face = EYE(80, 106, 3, 3, 13, 11) + EYE(122, 106, -3, 3, 13, 11)
        + brow("M64 82 L92 96") + brow("M136 82 L108 96")
        + `<path d="M72 132 Q100 158 128 132 Z" fill="#fff" stroke="${O}" stroke-width="4.5" stroke-linejoin="round"/>
           <path d="M82 136 L84 146 M94 138 L95 150 M106 138 L105 150 M118 136 L116 146" stroke="${O}" stroke-width="2.5"/>
           <g transform="translate(140 66)"><g class="vein" stroke="#E0263F" stroke-width="5" stroke-linecap="round"><path d="M-8 -3 Q-2 -2 -3 -8 M8 -3 Q2 -2 3 -8 M-8 3 Q-2 2 -3 8 M8 3 Q2 2 3 8"/></g></g>`;
      props = `<g class="knife"><g transform="rotate(-28 178 86)">
          <rect x="171" y="84" width="14" height="30" rx="5" fill="#7A3E1C" stroke="${O}" stroke-width="4"/>
          <rect x="166" y="78" width="24" height="8" rx="3" fill="#9AA3AE" stroke="${O}" stroke-width="3.5"/>
          <path d="M170 78 L170 30 Q170 18 182 14 L186 14 L186 78 Z" fill="url(#${id}blade)" stroke="${O}" stroke-width="4" stroke-linejoin="round"/>
          <path d="M176 70 L176 32" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>
          <path d="M190 24 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" fill="#fff" class="glint"/></g>` + hand(178, 92) + `</g>`;
      break;
    case "smug":
      face = brow("M66 82 Q78 74 92 80", 6) + brow("M110 84 Q122 82 134 86", 6)
        + `<path d="M58 100 Q60 90 72 92 L94 94 Q98 96 100 100 Q102 96 106 94 L128 92 Q140 90 142 100 Q142 116 126 118 Q110 120 106 106 L94 106 Q90 120 74 118 Q58 116 58 100 Z" fill="#141018" stroke="${O}" stroke-width="4"/>
           <path d="M66 98 L80 98 M114 98 L128 98" stroke="#7FD3FF" stroke-width="4" stroke-linecap="round" opacity=".85"/>
           <path d="M88 136 Q104 142 120 128" stroke="${O}" stroke-width="5.5" fill="none" stroke-linecap="round"/>` + cheeks(.35);
      props = `<path d="M30 40 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill="#FFE27A" stroke="${O}" stroke-width="2" class="twinkle"/>`;
      break;
    case "cry":
      face = EYE(80, 108, 0, 2, 14, 15) + EYE(122, 108, 0, 2, 14, 15)
        + brow("M66 90 Q76 82 90 88", 6) + brow("M134 90 Q124 82 110 88", 6)
        + `<path d="M70 122 C66 140 66 160 72 176 L82 176 C80 160 80 140 82 122 Z M130 122 C134 140 134 160 128 176 L118 176 C120 160 120 140 118 122 Z" fill="#6EC8FF" stroke="${O}" stroke-width="3.5" stroke-linejoin="round" opacity=".95"/>
           <path d="M86 146 Q93 138 100 146 Q107 154 114 146" stroke="${O}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      props = `<path class="drop" d="M48 88 q-6 10 0 14 q6 -4 0 -14z" fill="#6EC8FF" stroke="${O}" stroke-width="2.5"/><path class="drop d2" d="M152 82 q-6 10 0 14 q6 -4 0 -14z" fill="#6EC8FF" stroke="${O}" stroke-width="2.5"/>`;
      break;
    case "shock":
      face = EYE(80, 104, 0, 0, 17, 19).replace(/r="7"/g, 'r="4.5"') + EYE(122, 104, 0, 0, 17, 19).replace(/r="7"/g, 'r="4.5"')
        + brow("M62 72 Q78 62 94 72", 6) + brow("M106 72 Q122 62 138 72", 6)
        + `<ellipse cx="100" cy="146" rx="13" ry="17" fill="#5A1A14" stroke="${O}" stroke-width="4.5"/><ellipse cx="100" cy="154" rx="7" ry="5" fill="#FF6F7D"/>`;
      props = `<path class="drop" d="M150 58 q8 14 0 20 q-8 -6 0 -20z" fill="#7FD3FF" stroke="${O}" stroke-width="3"/>`;
      break;
    case "love":
      face = heart(80, 94, 1.15) + heart(122, 94, 1.15) + cheeks(.7)
        + `<path d="M84 130 Q100 152 116 130 Z" fill="#5A1A14" stroke="${O}" stroke-width="4.5" stroke-linejoin="round"/><path d="M92 140 Q100 147 108 140" fill="#FF6F7D"/>`;
      props = `<g class="float">${heart(36, 46, .8)}${heart(166, 34, 1)}${heart(176, 84, .6, "#FF7FA0")}</g>`;
      break;
    case "think":
      face = `<path d="M67 106 Q80 100 93 106" stroke="${O}" stroke-width="5" fill="none" stroke-linecap="round"/>` + EYE(122, 104, 4, -6, 13, 15)
        + brow("M66 92 L92 96", 6) + brow("M110 80 Q122 68 136 78", 6)
        + `<path d="M90 136 Q102 130 112 138" stroke="${O}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      props = `<g class="bubble"><circle cx="160" cy="44" r="5" fill="#fff" stroke="${O}" stroke-width="3"/><circle cx="172" cy="28" r="8" fill="#fff" stroke="${O}" stroke-width="3"/>
        <text x="172" y="33" text-anchor="middle" font-family="Nunito,system-ui,sans-serif" font-weight="900" font-size="13" fill="${O}">?</text></g>`;
      break;
    case "demon":
      face = `<path d="M66 100 L94 110 L90 116 Q78 118 68 110 Z M134 100 L106 110 L110 116 Q122 118 132 110 Z" fill="#FFE14D" stroke="${O}" stroke-width="4" stroke-linejoin="round"/>
           <path d="M80 108 l3 6 M120 108 l-3 6" stroke="${O}" stroke-width="3.5" stroke-linecap="round"/>`
        + brow("M62 88 L96 102", 8) + brow("M138 88 L104 102", 8)
        + `<path d="M70 130 Q100 162 130 130 Q100 146 70 130 Z" fill="#3A0A0A" stroke="${O}" stroke-width="4.5" stroke-linejoin="round"/>
           <path d="M80 135 L84 144 L88 137 M120 135 L116 144 L112 137" fill="#fff" stroke="${O}" stroke-width="2"/>`;
      props = `<path d="M66 58 C58 40 60 24 70 14 C72 30 78 42 86 50 Z M134 58 C142 40 140 24 130 14 C128 30 122 42 114 50 Z" fill="#C81E3A" stroke="${O}" stroke-width="4.5" stroke-linejoin="round"/>
        <g class="fork"><g transform="rotate(14 174 110)"><path d="M174 168 L174 66" stroke="${O}" stroke-width="10" stroke-linecap="round"/><path d="M174 168 L174 66" stroke="#5B5F6B" stroke-width="5" stroke-linecap="round"/>
        <path d="M160 74 L160 54 L166 64 L174 44 L182 64 L188 54 L188 74 Z" fill="#9AA3AE" stroke="${O}" stroke-width="4" stroke-linejoin="round"/></g>` + hand(174, 100) + `</g>`;
      break;
    case "cheer":
      face = `<path d="M66 104 Q79 92 92 104 M108 104 Q121 92 134 104" stroke="${O}" stroke-width="5.5" fill="none" stroke-linecap="round"/>` + cheeks(.6)
        + `<path d="M78 126 Q100 160 122 126 Z" fill="#5A1A14" stroke="${O}" stroke-width="4.5" stroke-linejoin="round"/><path d="M88 140 Q100 150 112 140" fill="#FF6F7D"/>`;
      props = `<path d="M20 30 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z M178 26 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill="#FFE27A" stroke="${O}" stroke-width="2" class="twinkle"/>`;
      break;
    case "sad":
      face = EYE(80, 110, 0, 3) + EYE(122, 110, 0, 3) + brow("M66 92 Q76 84 92 90", 6) + brow("M134 92 Q124 84 108 90", 6)
        + `<path d="M86 146 Q100 134 114 146" stroke="${O}" stroke-width="5" fill="none" stroke-linecap="round"/>`;
      break;
    default: /* happy / wave: confident smirk — he's mad, not cute */
      face = EYE(80, 104, 2, 0) + EYE(122, 104, 2, 0) + brow("M66 84 Q78 76 92 82", 6) + brow("M108 80 Q122 72 136 80", 6) + cheeks(.5)
        + `<path d="M84 130 Q102 146 120 128" stroke="${O}" stroke-width="5.5" fill="none" stroke-linecap="round"/>`;
  }

  const red = demon ? `<path d="${BODY}" fill="#D9152F" opacity=".38"/>` : "";
  return `<svg class="mascot mad ${anim} m-${mood}" width="${size}" height="${size}" viewBox="0 0 200 200" aria-hidden="true">
  <defs>
   <radialGradient id="${id}g" cx="36%" cy="28%" r="85%"><stop offset="0" stop-color="#FFE868"/><stop offset=".45" stop-color="#FFB21E"/><stop offset=".8" stop-color="#FF7A1A"/><stop offset="1" stop-color="#EE4A2C"/></radialGradient>
   <linearGradient id="${id}leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5BE08A"/><stop offset="1" stop-color="#1F9E57"/></linearGradient>
   <linearGradient id="${id}blade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F4F7FA"/><stop offset=".6" stop-color="#C3CBD4"/><stop offset="1" stop-color="#8E98A4"/></linearGradient>
   <radialGradient id="${id}aura"><stop offset=".55" stop-color="#FF2D4B" stop-opacity=".35"/><stop offset="1" stop-color="#FF2D4B" stop-opacity="0"/></radialGradient>
   <clipPath id="${id}c"><path d="${BODY}"/></clipPath>
  </defs>
  <ellipse class="shadow" cx="100" cy="194" rx="50" ry="6" fill="#000" opacity=".14"/>
  <g class="mm-b">
  ${back}
  <ellipse cx="80" cy="184" rx="15" ry="8" fill="#F07A18" stroke="${O}" stroke-width="4"/><ellipse cx="120" cy="184" rx="15" ry="8" fill="#F07A18" stroke="${O}" stroke-width="4"/>
  ${arms}
  <path d="${BODY}" fill="url(#${id}g)"/>
  <g clip-path="url(#${id}c)">
    <path d="M168 70 C150 120 120 168 60 186 L180 196 Z" fill="#D9452A" opacity=".28"/>
    <ellipse cx="68" cy="74" rx="22" ry="12" fill="#fff" opacity=".42" transform="rotate(-28 68 74)"/>
    <circle cx="96" cy="62" r="4.5" fill="#fff" opacity=".6"/>
  </g>
  ${red}
  <path d="${BODY}" fill="none" stroke="${O}" stroke-width="${W}" stroke-linejoin="round"/>
  <path d="M102 48 Q100 34 108 24" stroke="${O}" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M102 48 Q100 34 108 24" stroke="#8A5226" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M108 30 C122 12 146 10 158 18 C150 36 126 44 108 30 Z" fill="url(#${id}leaf)" stroke="${O}" stroke-width="4" stroke-linejoin="round"/>
  <path d="M112 30 Q132 26 152 18" stroke="#16803F" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  ${face}
  ${front}
  ${props}
  </g>
</svg>`;
}
