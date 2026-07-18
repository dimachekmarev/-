#!/usr/bin/env bash
# Генерация AI-аватаров для проекта «Деньги онлайн без лица»
# Требует: FAL_KEY в окружении (https://fal.ai) ИЛИ активного Nous Portal логина.
set -euo pipefail

OUT_DIR="$(dirname "$0")/output"
mkdir -p "$OUT_DIR"

if [[ -z "${FAL_KEY:-}" ]]; then
  echo "ОШИБКА: FAL_KEY не задан. Получите ключ на https://fal.ai и выполните: export FAL_KEY=ваш_ключ" >&2
  echo "Или залогиньтесь в Nous Portal: hermes model" >&2
  exit 1
fi

# Промпты (варианты 1-3 из PROMPT_PACK.md)
declare -a PROMPTS=(
"Faceless business avatar, close-up studio portrait, confident entrepreneur seen from behind wearing premium dark navy blazer, soft cinematic studio key light, rim light highlighting shoulder outline, shallow depth of field, smooth grey gradient backdrop, minimalist editorial photography, no face visible, 8k, sharp details, professional color grading."
"Faceless personal brand avatar, three-quarter back view, entrepreneur in charcoal suit turning away from camera, dramatic studio lighting with strong side key, long elegant shadow, dark moody background with subtle bokeh, high-end corporate aesthetic, no face shown, cinematic color grade, ultra detailed, 8k portrait."
"Faceless abstract business avatar icon, stylized silhouette of a person in suit against glowing studio gradient, golden hour rim light, geometric minimal composition, premium fintech brand style, no facial details, clean negative space, 8k render, crisp vector-like edges."
)

ASPECTS=(portrait portrait square)

for i in "${!PROMPTS[@]}"; do
  n=$((i+1))
  echo "== Генерация варианта $n =="
  # Пример вызова через fal CLI (установите: pip install fal-client)
  fal-cli run "$FAL_KEY" \
    --prompt "${PROMPTS[$i]}" \
    --aspect-ratio "${ASPECTS[$i]}" \
    --output "$OUT_DIR/avatar_v$n.jpg" || echo "Вариант $n не удался"
done

echo "Готово. Результаты в $OUT_DIR"
