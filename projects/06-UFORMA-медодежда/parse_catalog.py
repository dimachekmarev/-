#!/usr/bin/env python3
"""Parse U-FORMA catalog pages to extract product data."""
import re
import json
import os
from html.parser import HTMLParser
from datetime import datetime

BASE_DIR = "/root/obsidian-vault/projects/06-UFORMA-медодежда"
HTML_DIR = os.path.join(BASE_DIR, "html_pages")

CATEGORIES = {
    "zhenskaya": {"file": "zhenskaya.html", "name": "Женская одежда", "url": "/catalog/zhenskaya_odezhda/"},
    "muzhskaya": {"file": "muzhskaya.html", "name": "Мужская одежда", "url": "/catalog/muzhskaya_odezhda/"},
    "povarskaya": {"file": "povarskaya.html", "name": "Поварская одежда", "url": "/catalog/povarskaya_odezhda/"},
    "premium": {"file": "premium.html", "name": "Премиум", "url": "/catalog/premium/"},
    "sale": {"file": "sale.html", "name": "SALE / Распродажа", "url": "/catalog/sale/"},
}

class ProductCardParser(HTMLParser):
    """Extract product cards from Bitrix/Aspro catalog HTML."""
    
    def __init__(self):
        super().__init__()
        self.products = []
        self.current_product = None
        self.in_product = False
        self.in_item_title = False
        self.in_price_wrapper = False
        self.in_price_value = False
        self.product_depth = 0
        self.img_urls = []
        self.in_image_block = False
        self.seen_data_src = set()
        self.capture_name = False
        self.price_data_value = None
        self.product_url = None
        self.product_id = None
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        classes = (attrs_dict.get('class', '')).split()
        
        # Detect product card start
        if tag == 'div' and 'js-notice-block' in classes and 'item_block' in classes:
            self.in_product = True
            self.current_product = {
                "name": "",
                "price": "",
                "image_urls": [],
                "product_url": "",
                "product_id": "",
            }
            self.img_urls = []
            self.seen_data_src = set()
            # Get data-id
            if 'data-id' in attrs_dict:
                self.current_product["product_id"] = attrs_dict['data-id']
        
        if self.in_product:
            # Track nested divs to know when we leave product
            if tag == 'div':
                self.product_depth += 1
            
            # Capture product URL from link in item-title
            if tag == 'a' and 'dark_link' in classes and 'option-font-bold' in classes:
                if 'href' in attrs_dict:
                    self.current_product["product_url"] = "https://u-forma.ru" + attrs_dict['href']
            
            # Capture image data-src
            if tag == 'img' and 'data-src' in attrs_dict:
                src = attrs_dict['data-src']
                if src not in self.seen_data_src and not src.startswith('data:'):
                    self.seen_data_src.add(src)
                    if not src.startswith('http'):
                        src = "https://u-forma.ru" + src
                    self.current_product["image_urls"].append(src)
            
            # Item title
            if tag == 'div' and 'item-title' in classes:
                self.in_item_title = True
            
            # Price wrapper with data-value
            if tag == 'div' and 'price_matrix_wrapper' in classes:
                self.in_price_wrapper = True
            
            if tag == 'div' and 'price' in classes and 'font-bold' in classes:
                if 'data-value' in attrs_dict and not self.current_product["price"]:
                    self.current_product["price"] = attrs_dict['data-value']
            
            if tag == 'span' and 'price_value' in classes:
                self.in_price_value = True
    
    def handle_data(self, data):
        if self.in_product and self.in_item_title:
            name = data.strip()
            if name and not self.current_product["name"]:
                self.current_product["name"] = name
        if self.in_product and self.in_price_value:
            text = data.strip()
            if text and not self.current_product["price"]:
                # Parse price like "5 570"
                price_text = text.replace('\xa0', '').replace(' ', '')
                if price_text.isdigit():
                    self.current_product["price"] = price_text
    
    def handle_endtag(self, tag):
        if self.in_product:
            if tag == 'div':
                self.product_depth -= 1
                if self.product_depth <= 0:
                    # End of product card
                    self.product_depth = 0
                    self.in_product = False
                    if self.current_product and self.current_product["name"]:
                        self.products.append(self.current_product)
                    self.current_product = None
            
            if tag == 'div':
                if self.in_item_title:
                    self.in_item_title = False
                if self.in_price_wrapper and self.product_depth < 7:
                    self.in_price_wrapper = False
                if self.in_price_value:
                    self.in_price_value = False


def parse_category_page(filepath, category_key, category_name):
    """Parse a single category HTML page."""
    print(f"  Parsing {filepath} ...")
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    parser = ProductCardParser()
    parser.feed(html)
    
    # Add category info
    for p in parser.products:
        p["category"] = category_name
        p["category_key"] = category_key
    
    print(f"    Found {len(parser.products)} products")
    return parser.products


def extract_meta_info(filepath):
    """Extract SEO metadata from a page."""
    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()
    
    meta = {}
    
    # Title
    title_match = re.search(r'<title>(.*?)</title>', html, re.DOTALL)
    if title_match:
        meta['title'] = title_match.group(1).strip()
    
    # Meta description
    desc_match = re.search(r'<meta\s+name="description"\s+content="(.*?)"', html, re.IGNORECASE)
    if desc_match:
        meta['description'] = desc_match.group(1).strip()
    
    # Canonical
    canon_match = re.search(r'<link\s+rel="canonical"\s+href="(.*?)"', html)
    if canon_match:
        meta['canonical'] = canon_match.group(1)
    
    # OG tags
    for og_prop in ['og:title', 'og:description', 'og:image', 'og:url']:
        og_match = re.search(rf'<meta\s+property="{og_prop}"\s+content="(.*?)"', html)
        if og_match:
            meta[og_prop] = og_match.group(1).strip()
    
    # Pagination
    next_match = re.search(r'<link\s+rel="next"\s+href="(.*?)"', html)
    if next_match:
        meta['next_page'] = next_match.group(1)
    
    # Product count from filter
    count_match = re.search(r'data-count="(\d+)"', html)
    if count_match:
        meta['total_count_hint'] = count_match.group(1)
    
    return meta


def main():
    all_products = {}
    all_meta = {}
    total_products = 0
    
    print("=" * 60)
    print("U-FORMA Парсер каталога")
    print("=" * 60)
    
    for key, info in CATEGORIES.items():
        filepath = os.path.join(HTML_DIR, info['file'])
        if not os.path.exists(filepath):
            print(f"  SKIP {key}: file not found")
            continue
        
        print(f"\n📁 Категория: {info['name']}")
        products = parse_category_page(filepath, key, info['name'])
        all_products[key] = products
        total_products += len(products)
        
        # Extract meta
        meta = extract_meta_info(filepath)
        all_meta[key] = meta
        if meta.get('title'):
            print(f"    SEO Title: {meta['title'][:80]}...")
        if meta.get('description'):
            print(f"    SEO Desc: {meta['description'][:80]}...")
    
    # Build final JSON
    result = {
        "scraped_at": datetime.now().isoformat(),
        "source": "https://u-forma.ru/",
        "total_products": total_products,
        "categories": {},
        "category_meta": all_meta,
    }
    
    for key, info in CATEGORIES.items():
        result["categories"][key] = {
            "name": info["name"],
            "url": info["url"],
            "product_count": len(all_products.get(key, [])),
            "products": all_products.get(key, []),
        }
    
    # Save JSON
    output_path = os.path.join(BASE_DIR, "competitor-data.json")
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"\n✅ JSON сохранён: {output_path}")
    print(f"   Всего товаров: {total_products}")
    
    # Print summary stats
    print("\n" + "=" * 60)
    print("Сводка по категориям:")
    for key, info in CATEGORIES.items():
        count = len(all_products.get(key, []))
        products = all_products.get(key, [])
        if products:
            prices = [int(p['price']) for p in products if p.get('price') and p['price'].isdigit()]
            price_range = f"от {min(prices)} ₽ до {max(prices)} ₽" if prices else "цены не найдены"
            print(f"  • {info['name']}: {count} товаров, {price_range}")
            
            # Show first 3 products as sample
            for p in products[:3]:
                print(f"      - {p['name'][:60]} | {p.get('price', '?')} ₽ | {p.get('product_url', '?')}")
    
    return result

if __name__ == "__main__":
    result = main()
