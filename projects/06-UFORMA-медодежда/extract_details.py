#!/usr/bin/env python3
"""Add product detail samples to the competitor-data.json and build final summary."""
import re, json, os, glob
from datetime import datetime

BASE_DIR = "/root/obsidian-vault/projects/06-UFORMA-медодежда"

def extract_detail_data(filepath):
    """Extract structured data from a product detail page."""
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    detail = {}
    
    # Schema.org meta tags
    for field in ['name', 'description', 'sku', 'category']:
        m = re.search(rf'<meta\s+itemprop="{field}"\s+content="(.*?)"', html)
        if m: detail[field] = m.group(1).strip()
    
    # Price
    m = re.search(r'<meta\s+itemprop="price"\s+content="(.*?)"', html)
    if m: detail['price'] = int(m.group(1))
    
    # Schema images
    schema_imgs = re.findall(r'<link\s+href="(/upload/[^"]+)"\s+itemprop="image"', html)
    detail['schema_images'] = ["https://u-forma.ru" + img for img in schema_imgs]
    
    # Gallery images (all data-src)
    gallery = re.findall(r'data-src="(/upload/[^"]+)"', html)
    detail['gallery_images'] = ["https://u-forma.ru" + img for img in set(gallery) if not img.startswith('data:')]
    detail['total_gallery_images'] = len(detail['gallery_images'])
    
    # Page title
    m = re.search(r'<title>(.*?)</title>', html, re.DOTALL)
    if m: detail['page_title'] = m.group(1).strip()
    
    # Meta description
    m = re.search(r'<meta\s+name="description"\s+content="(.*?)"', html)
    if m: detail['meta_description'] = m.group(1).strip()
    
    # OG tags
    for prop in ['og:title', 'og:description', 'og:image']:
        m = re.search(rf'<meta\s+property="{prop}"\s+content="(.*?)"', html)
        if m: detail[prop] = m.group(1).strip()
    
    # Description text
    m = re.search(r'<div\s+itemprop="description">\s*(.*?)\s*</div>', html, re.DOTALL)
    if m:
        desc = re.sub(r'<[^>]+>', ' ', m.group(1)).strip()
        desc = re.sub(r'\s+', ' ', desc)
        detail['description_text'] = desc
    
    # Composition and care
    comp_m = re.search(r'Состав и уход.*?<div class="accordion-body">(.*?)</div>', html, re.DOTALL)
    if comp_m:
        comp = re.sub(r'<[^>]+>', '\n', comp_m.group(1)).strip()
        comp = re.sub(r'\n\s*\n', '\n', comp)
        detail['composition_and_care'] = comp
    
    # Size options
    sizes = re.findall(r'<option[^>]*value="\d+"[^>]*>([^<]+)</option>', html)
    size_filtered = [s for s in sizes if s.replace('.','').replace('-','').replace(' ','').isdigit() or s in ['S','M','L','XL','XXL','XS']]
    detail['size_options_count'] = len(sizes)
    detail['size_options_sample'] = size_filtered[:20]
    
    # Color variants
    colors = re.findall(r'data-lbl="([^"]+)"', html)
    detail['color_variants'] = list(set(colors))[:10]
    
    # Accordion sections
    accordions = re.findall(r'<span>([^<]+)</span>\s*</div>\s*<div[^>]*id="accordion\d+"', html)
    detail['info_sections'] = accordions
    
    # AggregateOffer
    offer_count = re.search(r'<meta\s+itemprop="offerCount"\s+content="(\d+)"', html)
    if offer_count: detail['offer_count'] = int(offer_count.group(1))
    low_price = re.search(r'<meta\s+itemprop="lowPrice"\s+content="(\d+)"', html)
    if low_price: detail['low_price'] = int(low_price.group(1))
    high_price = re.search(r'<meta\s+itemprop="highPrice"\s+content="(\d+)"', html)
    if high_price: detail['high_price'] = int(high_price.group(1))
    
    return detail


def main():
    # Load existing JSON
    with open(os.path.join(BASE_DIR, "competitor-data.json"), 'r') as f:
        data = json.load(f)
    
    # Extract detail page data
    detail_files = sorted(glob.glob(os.path.join(BASE_DIR, "html_pages/detail_*.html")))
    
    sample_details = []
    print("Извлечение данных со страниц товаров:")
    for fp in detail_files:
        bn = os.path.basename(fp)
        detail = extract_detail_data(fp)
        print(f"  {bn}: '{detail.get('name','?')}' | {detail.get('price','?')} ₽ | {detail.get('total_gallery_images',0)} фото | описание: {len(detail.get('description_text',''))} симв.")
        sample_details.append({
            "source_file": bn,
            **detail
        })
    
    data["sample_product_details"] = sample_details
    
    # Save updated JSON
    with open(os.path.join(BASE_DIR, "competitor-data.json"), 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"\n✅ JSON обновлён с {len(sample_details)} страницами товаров")
    
    # Also save detail data separately
    with open(os.path.join(BASE_DIR, "product-detail-samples.json"), 'w', encoding='utf-8') as f:
        json.dump(sample_details, f, ensure_ascii=False, indent=2)
    print(f"✅ Детальные данные сохранены в product-detail-samples.json")

if __name__ == "__main__":
    main()
