#!/usr/bin/env python3
"""Parse U-FORMA catalog pages - v3 fixed."""
import re, json, os, glob
from html.parser import HTMLParser
from datetime import datetime

BASE_DIR = "/root/obsidian-vault/projects/06-UFORMA-медодежда"
HTML_DIR = os.path.join(BASE_DIR, "html_pages")

class ProductCardParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.products = []
        self.current = None
        self.in_product = False
        self.in_item_title = False
        self.in_price_value = False
        self.div_depth = 0
        self.product_start_depth = -1
        self.seen_src = set()
        
    def handle_starttag(self, tag, attrs):
        d = dict(attrs)
        cls = (d.get('class', '')).split()
        
        if tag == 'div':
            if self.in_product:
                self.div_depth += 1
            elif 'item_block' in cls and 'js-notice-block' in cls:
                self.in_product = True
                self.product_start_depth = self.div_depth
                self.current = {"name":"","price":"","image_urls":[],"product_url":"","product_id":d.get('data-id','')}
                self.seen_src = set()
                self.div_depth += 1
                return
            else:
                self.div_depth += 1
        
        if not self.in_product:
            return
        
        # Product link
        if tag == 'a' and 'dark_link' in cls and 'option-font-bold' in cls:
            h = d.get('href','')
            if h:
                self.current["product_url"] = "https://u-forma.ru" + h
        
        # Images
        if tag == 'img':
            src = d.get('data-src','')
            if src and not src.startswith('data:') and src not in self.seen_src:
                self.seen_src.add(src)
                if not src.startswith('http'):
                    src = "https://u-forma.ru" + src
                self.current["image_urls"].append(src)
        
        if tag == 'div' and 'item-title' in cls:
            self.in_item_title = True
        
        if tag == 'div' and 'price' in cls and 'font-bold' in cls:
            val = d.get('data-value','')
            if val and not self.current["price"]:
                self.current["price"] = val
        
        if tag == 'span' and 'price_value' in cls:
            self.in_price_value = True
    
    def handle_data(self, data):
        if self.in_product and self.in_item_title:
            n = data.strip()
            if n and not self.current["name"]:
                self.current["name"] = n
        if self.in_product and self.in_price_value:
            t = data.strip().replace('\xa0','').replace(' ','')
            if t.isdigit() and not self.current["price"]:
                self.current["price"] = t
    
    def handle_endtag(self, tag):
        if tag == 'div':
            if self.in_product:
                self.div_depth -= 1
            else:
                self.div_depth -= 1
                return
            
            if self.div_depth <= self.product_start_depth:
                self.in_product = False
                if self.current and self.current["name"]:
                    self.products.append(self.current)
                self.current = None
                return
        
        if tag == 'div' and self.in_product:
            if self.in_item_title:
                self.in_item_title = False
            if self.in_price_value:
                self.in_price_value = False


def extract_meta(html):
    meta = {}
    m = re.search(r'<title>(.*?)</title>', html, re.DOTALL)
    if m: meta['title'] = m.group(1).strip()
    m = re.search(r'<meta\s+name="description"\s+content="(.*?)"', html, re.IGNORECASE)
    if m: meta['description'] = m.group(1).strip()
    m = re.search(r'<link\s+rel="canonical"\s+href="(.*?)"', html)
    if m: meta['canonical'] = m.group(1)
    m = re.search(r'<link\s+rel="next"\s+href="(.*?)"', html)
    if m: meta['next_page'] = m.group(1)
    m = re.search(r'data-count="(\d+)"', html)
    if m: meta['total_count'] = int(m.group(1))
    for prop in ['og:title','og:description','og:image','og:url']:
        m = re.search(rf'<meta\s+property="{re.escape(prop)}"\s+content="(.*?)"', html)
        if m: meta[prop] = m.group(1).strip()
    pages = set()
    for m in re.finditer(r'PAGEN_1=(\d+)', html):
        pages.add(int(m.group(1)))
    if pages: meta['pages_found'] = sorted(pages)
    return meta


def main():
    print("=" * 70)
    print("U-FORMA Парсер каталога v3")
    print("=" * 70)
    
    html_files = sorted(glob.glob(os.path.join(HTML_DIR, "*.html")))
    print(f"\nHTML файлов: {len(html_files)}")
    
    all_products = {}
    all_meta = {}
    
    for fp in html_files:
        bn = os.path.basename(fp)
        print(f"\n📄 {bn} ({os.path.getsize(fp):,} байт)")
        
        with open(fp, 'r', encoding='utf-8', errors='replace') as f:
            html = f.read()
        
        meta = extract_meta(html)
        parser = ProductCardParser()
        parser.feed(html)
        
        print(f"   Товаров: {len(parser.products)}")
        if meta.get('title'): print(f"   Title: {meta['title'][:90]}")
        if meta.get('total_count'): print(f"   Всего в категории: {meta['total_count']}")
        if meta.get('next_page'): print(f"   След.стр: {meta['next_page']}")
        
        # Determine category
        cat = "main"
        for k in ['zhenskaya','muzhskaya','povarskaya','premium','sale']:
            if k in bn: cat = k; break
        
        if cat not in all_products:
            all_products[cat] = []
            all_meta[cat] = {"title":"","description":"","total_count":0,"pages":[]}
        
        all_products[cat].extend(parser.products)
        if meta.get('title'): all_meta[cat]['title'] = meta['title']
        if meta.get('description'): all_meta[cat]['description'] = meta['description']
        if meta.get('total_count'): all_meta[cat]['total_count'] = meta['total_count']
        all_meta[cat]['pages'].append({"file":bn,"count":len(parser.products)})
    
    # Build result
    CAT_NAMES = {
        "zhenskaya":"Женская одежда","muzhskaya":"Мужская одежда",
        "povarskaya":"Поварская одежда","premium":"Премиум",
        "sale":"SALE / Распродажа","main":"Главная"
    }
    CAT_URLS = {
        "zhenskaya":"/catalog/zhenskaya_odezhda/","muzhskaya":"/catalog/muzhskaya_odezhda/",
        "povarskaya":"/catalog/povarskaya_odezhda/","premium":"/catalog/premium/",
        "sale":"/catalog/sale/"
    }
    
    result = {"scraped_at":datetime.now().isoformat(),"source":"https://u-forma.ru/","categories":{},"category_meta":{},"total_products":0}
    
    for key in all_products:
        prods = all_products[key]
        seen = set()
        unique = []
        for p in prods:
            pid = p["product_id"]
            if pid and pid not in seen:
                seen.add(pid)
                p["category_key"] = key
                p["category"] = CAT_NAMES.get(key, key)
                unique.append(p)
            elif not pid:
                unique.append(p)
        
        result["categories"][key] = {
            "name": CAT_NAMES.get(key, key),
            "url": CAT_URLS.get(key, ""),
            "product_count": len(unique),
            "products": unique,
        }
        result["category_meta"][key] = all_meta.get(key, {})
        result["total_products"] += len(unique)
    
    # Save
    jp = os.path.join(BASE_DIR, "competitor-data.json")
    with open(jp, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    print(f"\n✅ JSON: {jp}")
    
    # Summary
    print("\n" + "=" * 70)
    print("СВОДКА:")
    all_prices = []
    for key in ['zhenskaya','muzhskaya','premium','povarskaya','sale']:
        cat = result["categories"].get(key)
        if not cat: continue
        count = cat["product_count"]
        prods = cat["products"]
        prices = [int(p["price"]) for p in prods if p.get("price") and p["price"].isdigit()]
        all_prices.extend(prices)
        pr = f"от {min(prices)} до {max(prices)} ₽" if prices else "—"
        print(f"\n📁 {cat['name']}: {count} товаров | {pr}")
        for p in prods[:4]:
            img_count = len(p.get('image_urls',[]))
            print(f"   • {p['name'][:60]} | {p.get('price','?')} ₽ | {img_count} img | {p.get('product_url','?')}")
        if len(prods) > 4:
            print(f"   ... ещё {len(prods)-4}")
    
    if all_prices:
        print(f"\n💰 Цены: от {min(all_prices)} ₽ до {max(all_prices)} ₽")
        print(f"📦 Всего товаров: {result['total_products']}")
    
    # Image stats
    urls = set()
    for cat in result["categories"].values():
        for p in cat["products"]:
            for u in p.get("image_urls",[]):
                urls.add(u)
    webp = sum(1 for u in urls if '.webp' in u)
    jpg = sum(1 for u in urls if '.jpg' in u)
    png = sum(1 for u in urls if '.png' in u)
    print(f"\n🖼️ Изображения: {len(urls)} уникальных ({webp} webp, {jpg} jpg, {png} png)")
    print(f"   Все на /upload/ (свой сервер, не CDN)")
    
    return result

if __name__ == "__main__":
    result = main()
