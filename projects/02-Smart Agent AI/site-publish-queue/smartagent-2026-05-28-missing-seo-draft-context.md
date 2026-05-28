title: "[DRAFT MISSING] SEO draft context not found"
slug: "missing-seo-draft-context"
meta:
  meta_title: "SEO draft context not found — Smart Agent AI"
  meta_description: "Автопубликация не выполнена: отсутствует входной SEO draft контекст и не заданы WP ENV переменные."
  keywords:
    - smart agent ai
    - seo draft
    - wordpress publish
    - fallback queue
excerpt: "Публикация в WordPress не выполнена: входной SEO draft от предыдущего job не найден, а WP_SITE_URL/WP_USER/WP_APP_PASSWORD отсутствуют в окружении. Пакет сохранён в очередь."
timestamp: "2026-05-28T19:07:02Z"

# Publication Package (Fallback)

## reason
- Missing previous SEO draft context (no accessible output for `smartagent-site-agent-1-seo-draft` in cron output storage).
- Missing required WordPress environment variables: `WP_SITE_URL`, `WP_USER`, `WP_APP_PASSWORD`.

## source_context
- Expected context job: `smartagent-site-agent-1-seo-draft` (id: `e0ff5d9d863a`, from cron config).
- Search result: no prior output file found for this job id/name.

## content_markdown
> Контент статьи отсутствует, так как предыдущий SEO draft не был найден в доступном контексте текущего запуска.

## wp_attempt
- Skipped: insufficient data for `title/content/excerpt/slug` + no WP credentials in ENV.
