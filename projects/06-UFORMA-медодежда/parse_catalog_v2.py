#!/usr/bin/env python3
"""Parse U-FORMA catalog pages - extended version with pagination support."""
import re
import json
import os
import glob
from html.parser import HTMLParser
from datetime import datetime

BASE_DIR = "/root/obsidian-vault/projects/06-UFORMA-медодежда"
HTML_DIR = os.path.join(BASE_DIR, "html_pages")

class ProductCardParser(HTMLParser):
    """Extract product cards from Bitrix/Aspro catalog HTML."""
    
    def __init__(self):
        super().__init__()
        self.products = []
        self.current_product = None
        self.in_product = False
        self.in_item_title = False
        self.in_price_value = False
        self.product_depth = 0
        self.seen_data_src = set()
        self.tag_stack = []
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        classes = (attrs_dict.get('class', '')).split()
        
        self.tag_stack.append(tag)
        
        # Detect product card start: item-custom + item_block + js-notice-block
        if tag == 'div' and 'item_block' in classes and 'js-notice-block' in classes:
            self.in_product = True
            self.product_depth = 0
            self.current_product = {
                "name": "",
                "price": "",
                "image_urls": [],
                "product_url": "",
                "product_id": attrs_dict.get('data-id', ''),
            }
            self.seen_data_src = set()
            return
        
        if not self.in_product:
            return
        
        self.product_depth += 1
        
        # Product link in item-title
        if tag == 'a' and 'dark_link' in classes and 'option-font-bold' in classes:
            href = attrs_dict.get('href', '')
            if href:
                self.current_product["product_url"] = "https://u-forma.ru" + href
        
        # Images - capture data-src
        if tag == 'img':
            src = attrs_dict.get('data-src', '')
            if src and not src.startswith('data:') and src not in self.seen_data_src:
                self.seen_data_src.add(src)
                if not src.startswith('http'):
                    src = "https://u-forma.ru" + src
                self.current_product["image_urls"].append(src)
        
        # Item title
        if tag == 'div' and 'item-title' in classes:
            self.in_item_title = True
        
        # Price data-value
        if tag == 'div' and 'price' in classes and 'font-bold' in classes:
            val = attrs_dict.get('data-value', '')
            if val and not self.current_product["price"]:
                self.current_product["price"] = val
        
        # Price text
        if tag == 'span' and 'price_value' in classes:
            self.in_price_value = True
    
    def handle_data(self, data):
        if self.in_product and self.in_item_title:
            name = data.strip()
            if name and not self.current_product["name"]:
                self.current_product["name"] = name
        
        if self.in_product and self.in_price_value:
            text = data.strip().replace('\xa0', '').replace(' ', '')
            if text.isdigit() and not self.current_product["price"]:
                self.current_product["price"] = text
    
    def handle_endtag(self, tag):
        if tag in self.tag_stack:
            self.tag_stack.pop()
        
        if not self.in_product:
            return
        
        self.product_depth -= 1
        if self.product_depth <= 0 and tag == 'div':
            self.product_depth = 0
            self.in_product = False
            if self.current_product and self.current_product["name"]:
                self.products.append(self.current_product)
            self.current_product = None
        
        if tag == 'div':
            if self.in_item_title:
                self.in_item_title = False
            if self.in_price_value:
                self.in_price_value = False


def extract_meta(html):
    """Extract SEO metadata and product count."""
    meta = {}
    
    # Title
    m = re.search(r'<title>(.*?)</title>', html, re.DOTALL)
    if m: meta['title'] = m.group(1).strip()
    
    # Description
    m = re.search(r'<meta\s+name="description"\s+content="(.*?)"', html, re.IGNORECASE)
    if m: meta['description'] = m.group(1).strip()
    
    # Canonical
    m = re.search(r'<link\s+rel="canonical"\s+href="(.*?)"', html)
    if m: meta['canonical'] = m.group(1)
    
    # Next page
    m = re.search(r'<link\s+rel="next"\s+href="(.*?)"', html)
    if m: meta['next_page'] = m.group(1)
    
    # OG tags
    for prop in ['og:title', 'og:description', 'og:image', 'og:url']:
        m = re.search(rf'<meta\s+property="{re.escape(prop)}"\s+content="(.*?)"', html)
        if m: meta[prop] = m.group(1).strip()
    
    # Product count from Bitrix
    m = re.search(r'data-count="(\d+)"', html)
    if m: meta['total_count'] = int(m.group(1))
    
    # Pagination info
    m = re.search(r'PAGEN_1=(\d+)', html)
    pages = set()
    for match in re.finditer(r'PAGEN_1=(\d+)', html):
        pages.add(int(match.group(1)))
    if pages:
        meta['pages_found'] = sorted(pages)
    
    return meta


def main():
    print("=" * 70)
    print("U-FORMA Парсер каталога (с пагинацией)")
    print("=" * 70)
    
    # Find all HTML files
    html_files = glob.glob(os.path.join(HTML_DIR, "*.html"))
    print(f"\nНайдено HTML файлов: {len(html_files)}")
    
    all_products = {}
    all_meta = {}
    
    for filepath in sorted(html_files):
        basename = os.path.basename(filepath)
        print(f"\n📄 Файл: {basename} ({os.path.getsize(filepath):,} байт)")
        
        with open(filepath, 'r', encoding='utf-8') as f:
            html = f.read()
        
        # Parse meta
        meta = extract_meta(html)
        
        # Parse products
        parser = ProductCardParser()
        parser.feed(html)
        
        print(f"   Товаров: {len(parser.products)}")
        print(f"   SEO Title: {meta.get('title', 'N/A')[:90]}")
        if meta.get('total_count'):
            print(f"   Data-count: {meta['total_count']}")
        if meta.get('next_page'):
            print(f"   След. страница: {meta['next_page']}")
        
        # Determine category key
        cat_key = "unknown"
        for key in ['zhenskaya', 'muzhskaya', 'povarskaya', 'premium', 'sale']:
            if key in basename:
                cat_key = key
                break
        
        if cat_key not in all_products:
            all_products[cat_key] = []
            all_meta[cat_key] = {"title": "", "description": "", "total_count": 0, "pages": []}
        
        all_products[cat_key].extend(parser.products)
        if meta:
            all_meta[cat_key]["title"] = all_meta[cat_key]["title"] or meta.get("title", "")
            all_meta[cat_key]["description"] = all_meta[cat_key]["description"] or meta.get("description", "")
            if meta.get("total_count"):
                all_meta[cat_key]["total_count"] = meta["total_count"]
            all_meta[cat_key]["pages"].append({"file": basename, "count": len(parser.products), **meta})
    
    # Build result
    cat_names = {
        "zhenskaya": "Женская одежда",
        "muzhskaya": "Мужская одежда", 
        "povarskaya": "Поварская одежда",
        "premium": "Премиум",
        "sale": "SALE / Распродажа",
    }
    cat_urls = {
        "zhenskaya": "/catalog/zhenskaya_odezhda/",
        "muzhskaya": "/catalog/muzhskaya_odezhda/",
        "povarskaya": "/catalog/povarskaya_odezhda/",
        "premium": "/catalog/premium/",
        "sale": "/catalog/sale/",
    }
    
    result = {
        "scraped_at": datetime.now().isoformat(),
        "source": "https://u-forma.ru/",
        "categories": {},
        "category_meta": {},
        "total_products": 0,
    }
    
    for key in all_products:
        products = all_products[key]
        # Deduplicate by product_id
        seen_ids = set()
        unique_products = []
        for p in products:
            if p["product_id"] and p["product_id"] not in seen_ids:
                seen_ids.add(p["product_id"])
                p["category_key"] = key
                p["category"] = cat_names.get(key, key)
                unique_products.append(p)
            elif not p["product_id"]:
                unique_products.append(p)
        
        result["categories"][key] = {
            "name": cat_names.get(key, key),
            "url": cat_urls.get(key, ""),
            "product_count": len(unique_products),
            "products": unique_products,
        }
        result["category_meta"][key] = all_meta.get(key, {})
        result["total_products"] += len(unique_products)
    
    # Save JSON
    json_path = os.path.join(BASE_DIR, "competitor-data.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"\n✅ JSON сохранён: {json_path}")
    
    # Summary
    print("\n" + "=" * 70)
    print("СВОДКА ПО КАТАЛОГУ:")
    print("=" * 70)
    
    total_products = result["total_products"]
    all_prices = []
    for key, cat in result["categories"].items():
        count = cat["product_count"]
        products = cat["products"]
        prices = [int(p["price"]) for p in products if p.get("price") and p["price"].isdigit()]
        all_prices.extend(prices)
        
        price_range = f"от {min(prices)} ₽ до {max(prices)} ₽" if prices else "цены не найдены"
        seo_title = (result["category_meta"].get(key, {}).get("title") or "")[:80]
        
        print(f"\n📁 {cat['name']}: {count} товаров | {price_range}")
        print(f"   SEO: {seo_title}")
        for p in products[:5]:
            imgs = len(p.get('image_urls', []))
            print(f"   • {p['name'][:65]} | {p.get('price', '?')} ₽ | {imgs} фото | {p.get('product_url', '?')}")
        if len(products) > 5:
            print(f"   ... и ещё {len(products) - 5} товаров")
    
    if all_prices:
        print(f"\n💰 Общий диапазон цен: от {min(all_prices)} ₽ до {max(all_prices)} ₽")
        print(f"📦 Всего уникальных товаров: {total_products}")
    
    # Image analysis
    print("\n🖼️ Анализ изображений:")
    image_urls = set()
    for key, cat in result["categories"].items():
        for p in cat["products"]:
            for img in p.get("image_urls", []):
                image_urls.add(img)
    
    print(f"   Всего уникальных URL изображений: {len(image_urls)}")
    
    # Find patterns
    webp = sum(1 for u in image_urls if '.webp' in u)
    jpg = sum(1 for u in image_urls if '.jpg' in u or '.jpeg' in u)
    png = sum(1 for u in image_urls if '.png' in u)
    upload = sum(1 for u in image_urls if '/upload/' in u)
    cdn = sum(1 for u in image_urls if 'cdn' in u.lower())
    
    print(f"   WebP: {webp}, JPG: {jpg}, PNG: {png}")
    print(f"   На /upload/: {upload}, CDN: {cdn}")
    print(f"   Хранятся на том же сервере (не CDN)")
    
    return result

if __name__ == "__main__":
    result = main()
