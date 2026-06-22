---
type: watchdog-status
project: Smart Agent AI
status: red
---
# Site speed watchdog status

Обновлено UTC: 2026-06-22T08:15:27.121786+00:00

## Red flags
- https://smart-agent-ai.ru/: публичная страница отдаётся без кеша (no-store, no-cache, must-revalidate)
- https://smart-agent-ai.ru/: ставит PHPSESSID анонимному посетителю
- https://smart-agent-ai.ru/: найден mixed content http:// (2)
- https://smart-agent-ai.ru/articles/: публичная страница отдаётся без кеша (no-store, no-cache, must-revalidate)
- https://smart-agent-ai.ru/articles/: ставит PHPSESSID анонимному посетителю
- https://smart-agent-ai.ru/articles/: найден mixed content http:// (1)

## Raw results
```json
[
  {
    "url": "https://smart-agent-ai.ru/",
    "status": 200,
    "final_url": "https://smart-agent-ai.ru/",
    "total_seconds": 1.449,
    "bytes": 156200,
    "cache_control": "no-store, no-cache, must-revalidate",
    "set_cookie": "PHPSESSID=c45186110706b4f0530f6c5e1a1e62f5; path=/",
    "assets_count": 77,
    "http_assets": [
      "http://smart-agent-ai.ru/wp-content/uploads/2026/04/picture.png",
      "http://smart-agent-ai.ru/wp-content/uploads/2026/04/picture-1.png"
    ]
  },
  {
    "url": "https://smart-agent-ai.ru/articles/",
    "status": 200,
    "final_url": "https://smart-agent-ai.ru/articles/",
    "total_seconds": 0.42,
    "bytes": 129220,
    "cache_control": "no-store, no-cache, must-revalidate",
    "set_cookie": "PHPSESSID=98e6dda42d4288c34deadc58ab2f5b0a; path=/",
    "assets_count": 68,
    "http_assets": [
      "http://smart-agent-ai.ru/wp-content/uploads/2025/12/robot-working-as-librarian-instead-humans-1024x574.jpg"
    ]
  }
]
```