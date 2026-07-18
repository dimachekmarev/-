#!/usr/bin/env bash
# =============================================================================
# generate_ads_avatars.sh
# Генерация паков faceless-аватаров для рекламы (проект «Деньги онлайн без лица»)
#
# Приоритет (fallback-цепочка):
#   1. FAL_KEY  задан  -> генерация через fal.ai (Flux/настройки аспекта)
#   2. SORA_KEY задан  -> генерация через OpenAI Sora API (text-to-image/video)
#   3. иначе          -> сообщает, что облако недоступно, и предлагает
#                        локальный SDXL (generate_local.py) или HTML/CSS (index.html)
# =============================================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT_DIR="$SCRIPT_DIR/shared/output"
REF_DIR="$SCRIPT_DIR/shared/references"
mkdir -p "$OUT_DIR"

# ---------------------------------------------------------------------------
# Сбор промптов из трёх паков: style|aspect|prompt|negative
# (каждый блок синхронизирован с PROMPT_PACK_*.md)
# ---------------------------------------------------------------------------
declare -a STYLES=(
  "business-trust"
  "expert-authority"
  "lifestyle-wealth"
)

# prompt[index]  aspect[index]  negative[index]  style[index]
declare -a PROMPTS=(
"Faceless business avatar, confident entrepreneur seen from behind wearing premium dark navy blazer, modern glass office background with soft city bokeh, cinematic studio key light, golden rim light outlining shoulder, shallow depth of field, smooth grey gradient, minimalist editorial photography, no face visible, 8k, sharp details."
"Faceless personal brand avatar, top-down crop to shoulders, entrepreneur in charcoal suit at sleek desk with laptop and coffee, warm studio lighting, soft shadow under chin, blurred luxury office behind, premium corporate aesthetic, no face shown, cinematic color grade, ultra detailed, 8k."
"Faceless business silhouette standing at floor-to-ceiling window, sunrise city skyline behind, backlit golden hour glow, dark tailored suit outline, long elegant shadow on floor, atmospheric haze, high-end fintech brand style, no facial details, 8k render."
"Faceless avatar, man in black blazer reflected in polished office mirror, only back and shoulder visible, dramatic side key light, moody dark background with subtle bokeh, elegant shadow, premium minimal composition, no face shown, crisp edges, 8k portrait."
"Faceless abstract business avatar icon, stylized silhouette of person in suit against glowing studio gradient, golden hour rim light, geometric minimal composition, premium fintech brand style, no facial details, clean negative space, 8k render, crisp vector-like edges."
"Faceless expert avatar, person seen from behind in navy blazer standing before wall of business books, warm library studio light, soft rim light on shoulder, shallow depth of field, intellectual premium atmosphere, no face visible, 8k, sharp details, editorial photography."
"Faceless authority avatar, top-down crop, hands in shirt sleeves resting on open strategy book, blurred bookshelf studio background, warm key light, elegant shadow, premium coaching brand aesthetic, no face shown, cinematic grade, ultra detailed, 8k."
"Faceless podcast expert avatar, person in dark suit seated facing away from camera at professional mic, soft studio spotlight, bokeh of sound panels behind, confident posture, premium audio brand style, no facial details, atmospheric haze, 8k render."
"Faceless thought-leader silhouette at studio window, side profile turned away, bookshelves and plants softly blurred, golden hour glow through blinds, dark tailored outfit, long shadow, minimal editorial composition, no face shown, crisp edges, 8k portrait."
"Faceless abstract expert icon, stylized silhouette of person reading against glowing gradient, open book light motif, geometric minimal composition, premium education brand style, no facial details, clean negative space, 8k render, vector-like edges."
"Faceless wealth avatar, person in premium casual blazer leaning against luxury sports car, backlit golden sunset, long silhouette shadow on asphalt, bokeh of coastal road, cinematic color grade, no face visible, 8k, sharp details, aspirational editorial."
"Faceless lifestyle avatar, entrepreneur seen from behind on rooftop terrace, glass railing, glittering night city skyline below, warm ambient light, dark elegant outfit, shallow depth of field, premium real-estate aesthetic, no face shown, 8k portrait."
"Faceless wealth detail shot, hand in tailored cuff resting on luxury car steering wheel, blurred scenic drive behind window, golden hour glow, premium watch visible, cinematic macro, no person face, ultra detailed, 8k."
"Faceless lifestyle silhouette standing at infinity pool edge, turquoise sea and yacht bokeh behind, backlit midday glow, flowing linen shirt, elegant long shadow, tropical premium vibe, no facial details, atmospheric, 8k render."
"Faceless abstract wealth icon, stylized silhouette of person with luxury car and skyline, golden gradient glow, geometric minimal composition, premium fintech lifestyle brand style, no facial details, clean negative space, 8k render, vector-like edges."
)

declare -a ASPECTS=(
portrait square landscape portrait square
portrait square landscape portrait square
landscape portrait square landscape square
)

declare -a STYLE_OF=(
business-trust business-trust business-trust business-trust business-trust
expert-authority expert-authority expert-authority expert-authority expert-authority
lifestyle-wealth lifestyle-wealth lifestyle-wealth lifestyle-wealth lifestyle-wealth
)

declare -a NEGATIVES=(
"face, facial features, eyes, glasses glare, text, watermark, logo, low-res, blurry"
"face, front view, hands covering, text, UI overlay, cartoon, distorted"
"face, realistic skin texture, text, watermark, oversaturated, noise"
"face, front reflection, text, logo, double chin, blur, artifacts"
"face, realistic skin, text, cluttered background, low contrast"
"face, facial features, eyes, text on spine readable, watermark, clutter"
"face, head visible, text overlay, cartoon, distorted hands, blur"
"face, front view, text, logo, low-res, noise, artifacts"
"face, realistic skin, text, watermark, oversaturated, vignette heavy"
"face, realistic skin, text, cluttered, low contrast, blurry"
"face, facial features, license plate text, watermark, logo, blur, noise"
"face, front view, text, UI overlay, cartoon, distorted, low-res"
"face, driver visible, text, logo, blur on subject, artifacts"
"face, realistic skin, text, watermark, oversaturated, noise"
"face, realistic skin, text, cluttered, low contrast, blurry"
)

# ---------------------------------------------------------------------------
# Генерация через fal.ai
# ---------------------------------------------------------------------------
generate_fal() {
  echo "== Режим: FAL (fal.ai) =="
  if ! command -v fal-cli >/dev/null 2>&1; then
    echo "Установка fal-client..." >&2
    pip install -q fal-client || { echo "pip install fal-client не удался" >&2; return 1; }
  fi
  local i n style aspect out
  for i in "${!PROMPTS[@]}"; do
    n=$((i+1)); style="${STYLE_OF[$i]}"; aspect="${ASPECTS[$i]}"
    out="$OUT_DIR/${style}_v${n}.jpg"
    echo "[$n/$(( ${#PROMPTS[@]} ))] $style -> $out"
    fal-cli run "$FAL_KEY" \
      --model "fal-ai/flux/dev" \
      --prompt "${PROMPTS[$i]}" \
      --negative-prompt "${NEGATIVES[$i]}" \
      --aspect-ratio "$aspect" \
      --output "$out" \
      || echo "  ! вариант $n не удался (fal)" >&2
  done
  return 0
}

# ---------------------------------------------------------------------------
# Генерация через OpenAI Sora API
# ---------------------------------------------------------------------------
generate_sora() {
  echo "== Режим: SORA (OpenAI Sora API) =="
  echo "Примечание: Sora image endpoint ещё может быть ограничен; используем images.generate как fallback."
  local i n style aspect out
  for i in "${!PROMPTS[@]}"; do
    n=$((i+1)); style="${STYLE_OF[$i]}"; aspect="${ASPECTS[$i]}"
    out="$OUT_DIR/${style}_v${n}.jpg"
    echo "[$n/$(( ${#PROMPTS[@]} ))] $style -> $out"
    # Через curl к OpenAI-совместимому endpoint (SORA_KEY = OPENAI_API_KEY)
    curl -sS -X POST "https://api.openai.com/v1/images/generations" \
      -H "Authorization: Bearer ${SORA_KEY}" \
      -H "Content-Type: application/json" \
      -d "$(printf '{"model":"gpt-image-1","prompt":"%s. Avoid: %s","size":"%s","n":1}' \
            "${PROMPTS[$i]}" "${NEGATIVES[$i]}" "$aspect")" \
      -o "$out.json" \
      && python3 -c "import sys,json,base64;d=json.load(open('$out.json'));b=d['data'][0].get('b64_json');open('$out','wb').write(base64.b64decode(b)) if b else print('no b64',file=sys.stderr)" \
      || echo "  ! вариант $n не удался (sora)" >&2
  done
  return 0
}

# ---------------------------------------------------------------------------
# Точка входа
# ---------------------------------------------------------------------------
if [[ -n "${FAL_KEY:-}" ]]; then
  generate_fal
  echo "Готово (FAL). Результаты: $OUT_DIR"
elif [[ -n "${SORA_KEY:-}" ]]; then
  generate_sora
  echo "Готово (SORA). Результаты: $OUT_DIR"
else
  echo "=============================================================" >&2
  echo "БЛОКЕР: облачная генерация недоступна." >&2
  echo "  FAL_KEY  не задан." >&2
  echo "  SORA_KEY не задан." >&2
  echo "-------------------------------------------------------------" >&2
  echo "Fallback-цепочка:" >&2
  echo "  1) Локальный SDXL (нужен GPU):" >&2
  echo "       python $SCRIPT_DIR/generate_local.py --style business-trust" >&2
  echo "  2) Без GPU — HTML/CSS дизайн по референсу:" >&2
  echo "       открой $SCRIPT_DIR/index.html в браузере" >&2
  echo "=============================================================" >&2
  echo "Скопированные референсы-силуэты лежат в: $REF_DIR" >&2
  exit 2
fi
