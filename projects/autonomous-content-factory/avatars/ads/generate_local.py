#!/usr/bin/env python3
# =============================================================================
# generate_local.py  —  Fallback #2: локальная генерация SDXL (нужен GPU)
# Проект: «Деньги онлайн без лица» (Д. Чекмарев)
#
# ЗАГЛУШКА / ИНСТРУКЦИЯ. Реальный запуск требует:
#   - NVIDIA GPU с CUDA (или ROCm/Apple Silicon через соответствующий бэкенд)
#   - установленных зависимостей:
#       pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121
#       pip install diffusers transformers accelerate controlnet-annotator
#   - референсов-силуэтов в ads/shared/references/ (уже скопированы)
#
# Скрипт использует ControlNet (canny/depth) на базе референса, чтобы
# сохранить faceless-силуэт, и SDXL с негативными промптами из паков.
# =============================================================================
import argparse
import os
import sys

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REF_DIR = os.path.join(SCRIPT_DIR, "shared", "references")
OUT_DIR = os.path.join(SCRIPT_DIR, "shared", "output")

# Те же промпты, что в generate_ads_avatars.sh (синхронизированы с PROMPT_PACK_*.md)
PROMPTS = {
    "business-trust": [
        ("Faceless business avatar, confident entrepreneur seen from behind wearing premium dark navy blazer, modern glass office background with soft city bokeh, cinematic studio key light, golden rim light outlining shoulder, shallow depth of field, smooth grey gradient, minimalist editorial photography, no face visible, 8k, sharp details.", "portrait", "face, facial features, eyes, glasses glare, text, watermark, logo, low-res, blurry"),
        ("Faceless personal brand avatar, top-down crop to shoulders, entrepreneur in charcoal suit at sleek desk with laptop and coffee, warm studio lighting, soft shadow under chin, blurred luxury office behind, premium corporate aesthetic, no face shown, cinematic color grade, ultra detailed, 8k.", "square", "face, front view, hands covering, text, UI overlay, cartoon, distorted"),
        ("Faceless business silhouette standing at floor-to-ceiling window, sunrise city skyline behind, backlit golden hour glow, dark tailored suit outline, long elegant shadow on floor, atmospheric haze, high-end fintech brand style, no facial details, 8k render.", "landscape", "face, realistic skin texture, text, watermark, oversaturated, noise"),
        ("Faceless avatar, man in black blazer reflected in polished office mirror, only back and shoulder visible, dramatic side key light, moody dark background with subtle bokeh, elegant shadow, premium minimal composition, no face shown, crisp edges, 8k portrait.", "portrait", "face, front reflection, text, logo, double chin, blur, artifacts"),
        ("Faceless abstract business avatar icon, stylized silhouette of person in suit against glowing studio gradient, golden hour rim light, geometric minimal composition, premium fintech brand style, no facial details, clean negative space, 8k render, crisp vector-like edges.", "square", "face, realistic skin, text, cluttered background, low contrast"),
    ],
    "expert-authority": [
        ("Faceless expert avatar, person seen from behind in navy blazer standing before wall of business books, warm library studio light, soft rim light on shoulder, shallow depth of field, intellectual premium atmosphere, no face visible, 8k, sharp details, editorial photography.", "portrait", "face, facial features, eyes, text on spine readable, watermark, clutter"),
        ("Faceless authority avatar, top-down crop, hands in shirt sleeves resting on open strategy book, blurred bookshelf studio background, warm key light, elegant shadow, premium coaching brand aesthetic, no face shown, cinematic grade, ultra detailed, 8k.", "square", "face, head visible, text overlay, cartoon, distorted hands, blur"),
        ("Faceless podcast expert avatar, person in dark suit seated facing away from camera at professional mic, soft studio spotlight, bokeh of sound panels behind, confident posture, premium audio brand style, no facial details, atmospheric haze, 8k render.", "landscape", "face, front view, text, logo, low-res, noise, artifacts"),
        ("Faceless thought-leader silhouette at studio window, side profile turned away, bookshelves and plants softly blurred, golden hour glow through blinds, dark tailored outfit, long shadow, minimal editorial composition, no face shown, crisp edges, 8k portrait.", "portrait", "face, realistic skin, text, watermark, oversaturated, vignette heavy"),
        ("Faceless abstract expert icon, stylized silhouette of person reading against glowing gradient, open book light motif, geometric minimal composition, premium education brand style, no facial details, clean negative space, 8k render, vector-like edges.", "square", "face, realistic skin, text, cluttered, low contrast, blurry"),
    ],
    "lifestyle-wealth": [
        ("Faceless wealth avatar, person in premium casual blazer leaning against luxury sports car, backlit golden sunset, long silhouette shadow on asphalt, bokeh of coastal road, cinematic color grade, no face visible, 8k, sharp details, aspirational editorial.", "landscape", "face, facial features, license plate text, watermark, logo, blur, noise"),
        ("Faceless lifestyle avatar, entrepreneur seen from behind on rooftop terrace, glass railing, glittering night city skyline below, warm ambient light, dark elegant outfit, shallow depth of field, premium real-estate aesthetic, no face shown, 8k portrait.", "portrait", "face, front view, text, UI overlay, cartoon, distorted, low-res"),
        ("Faceless wealth detail shot, hand in tailored cuff resting on luxury car steering wheel, blurred scenic drive behind window, golden hour glow, premium watch visible, cinematic macro, no person face, ultra detailed, 8k.", "square", "face, driver visible, text, logo, blur on subject, artifacts"),
        ("Faceless lifestyle silhouette standing at infinity pool edge, turquoise sea and yacht bokeh behind, backlit midday glow, flowing linen shirt, elegant long shadow, tropical premium vibe, no facial details, atmospheric, 8k render.", "landscape", "face, realistic skin, text, watermark, oversaturated, noise"),
        ("Faceless abstract wealth icon, stylized silhouette of person with luxury car and skyline, golden gradient glow, geometric minimal composition, premium fintech lifestyle brand style, no facial details, clean negative space, 8k render, vector-like edges.", "square", "face, realistic skin, text, cluttered, low contrast, blurry"),
    ],
}

SIZE_MAP = {"portrait": (832, 1216), "square": (1024, 1024), "landscape": (1216, 832)}


def check_gpu():
    try:
        import torch
        if not torch.cuda.is_available():
            return False, "CUDA недоступна (torch.cuda.is_available() == False)"
        return True, f"GPU: {torch.cuda.get_device_name(0)}"
    except ImportError:
        return False, "torch не установлен"


def generate(style, ref_image=None):
    ok, msg = check_gpu()
    if not ok:
        print(f"[БЛОКЕР] {msg}", file=sys.stderr)
        print("Установите: pip install torch torchvision --index-url https://download.pytorch.org/whl/cu121", file=sys.stderr)
        print("Затем: pip install diffusers transformers accelerate controlnet-annotator", file=sys.stderr)
        sys.exit(3)

    # --- реальный код (закомментирован: требует скачивания весов ~6-12 GB) ---
    # from diffusers import StableDiffusionXLControlNetPipeline, ControlNetModel
    # import torch
    # controlnet = ControlNetModel.from_pretrained("diffusers/controlnet-canny-sdxl-1.0", torch_dtype=torch.float16)
    # pipe = StableDiffusionXLControlNetPipeline.from_pretrained(
    #     "stabilityai/stable-diffusion-xl-base-1.0", controlnet=controlnet, torch_dtype=torch.float16
    # ).to("cuda")
    # for i, (prompt, aspect, neg) in enumerate(PROMPTS[style], 1):
    #     w, h = SIZE_MAP[aspect]
    #     out = os.path.join(OUT_DIR, f"{style}_v{i}.jpg")
    #     # image = pipe(prompt, negative_prompt=neg, image=ref_cond, width=w, height=h).images[0]
    #     # image.save(out)
    #     print(f"  [fake] {out}")
    print("[ЗАГЛУШКА] Реальная генерация отключена — требуется GPU + веса SDXL.")
    print(f"  Стиль: {style}, вариантов: {len(PROMPTS[style])}")
    print(f"  Референсы: {REF_DIR}")
    print(f"  Вывод:     {OUT_DIR}")
    print("Раскомментируйте блок 'реальный код' после установки зависимостей.")


def main():
    ap = argparse.ArgumentParser(description="Локальная генерация faceless-аватаров (SDXL + ControlNet)")
    ap.add_argument("--style", choices=list(PROMPTS.keys()), default="business-trust",
                    help="какой пак генерировать")
    ap.add_argument("--ref", default=None, help="путь к референсу-силуэту (опц.)")
    args = ap.parse_args()
    os.makedirs(OUT_DIR, exist_ok=True)
    generate(args.style, args.ref)


if __name__ == "__main__":
    main()
