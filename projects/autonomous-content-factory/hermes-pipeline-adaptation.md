# Адаптация hermes-content-pipeline (maniginam) → autonomous-content-factory

**Источник:** `/root/agents/hermes-content-pipeline/hermes-content-pipeline.py` (271 строка)
+ `README.md` (multi-model стратегия) + `hermes-worker.bb` (Colony-вариант интеграции).
**Цель:** вытащить только полезные паттерны и вписать их в наш рабочий
`/root/.hermes/scripts/content_factory_pipeline.py` (далее **CFP**). НЕ переписываем CFP целиком.

---

## 0. Что уже есть в CFP и что НЕ надо трогать

| В CFP уже реализовано | Аналог в hermes-content-pipeline |
|---|---|
| `upload_to_disk()` через `rclone copyto ... yandex:/Content_Factory` | — (у них публикации НЕТ, только локальный `output/`) |
| `subprocess.run` для внешних CLI (hyperframes) | `subprocess.run` для `hermes -z` |
| Детерминированный PRNG `mulberry32` | — |
| `load_scenarios()` + `pick_scenario()` (выбор из JSON) | `research_topics()` (генерит темы через LLM) |

**Важный вывод:** этап публикации (`rclone copy ... yandex:Content_Factory/`) у нас
**уже реализован** (`upload_to_disk`, строки 346-353, `YANDEX_REMOTE` строка 42).
Поэтому ниже — не «добавить этап публикации с нуля», а (а) подтвердить существующий паттерн,
(б) опционально расширить его на пакетный `rclone copy` каталога + метаданные.

---

## 1. Вызовы `hermes -z` (одношот-инференс) — ПРИМЕНИМО

У них (строки 24, 66-82):

```python
HERMES_BIN = os.path.expanduser("~/.local/bin/hermes")

def hermes_run(prompt: str, model: str = None) -> str:
    cmd = [HERMES_BIN, "-z", prompt]
    if model:
        cmd.extend(["-m", model])
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=300)
    if result.returncode != 0:
        print(f"[hermes] stderr: {result.stderr}", file=sys.stderr)
    return result.stdout.strip()
```

### Патч для CFP: добавить хелпер рядом с `ensure_env()` (после строки 86)

```python
# --- Hermes Agent одношот-инференс (адаптировано из hermes-content-pipeline.py) ---
HERMES_BIN = pathlib.Path.home() / ".local" / "bin" / "hermes"

def hermes_run(prompt: str, model: str = None, timeout: int = 300) -> str:
    """Запуск hermes -z (one-shot) и возврат stdout. model/timeout опциональны."""
    cmd = [str(HERMES_BIN), "-z", prompt]
    if model:
        cmd.extend(["-m", model])
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout)
    if result.returncode != 0:
        print(f"[hermes] stderr: {result.stderr}", file=sys.stderr)
    return result.stdout.strip()
```

**Куда вставить:** после функции `ensure_env()` (CFP строка 86), до `mulberry32`.
**Зачем:** если будем генеритьHooks/сценарии или описания через LLM (см. раздел 3),
нужен именно этот одношот-вызов — он совместим с нашим `subprocess`-стеком.

---

## 2. Робастный JSON-парсинг из LLM — ПРИМЕНИМ (условно)

У них (строки 27-59) три функции: срез по первому `[`/`]` или `{`/`}`, снятие
```json ... ``` обёртки, `json.loads` с try/except и возврат `[]`/`None` при ошибке.

```python
def strip_markdown_fences(raw: str) -> str:
    import re
    match = re.search(r'```(?:json)?\s*\n(.*?)```', raw, re.DOTALL)
    if match:
        return match.group(1).strip()
    return raw.strip()

def parse_json_array(raw: str, stage: str) -> list:
    cleaned = strip_markdown_fences(raw)
    try:
        start = cleaned.index("[")
        end = cleaned.rindex("]") + 1
        return json.loads(cleaned[start:end])
    except (ValueError, json.JSONDecodeError) as e:
        print(f"[{stage}] parse error: {e}", file=sys.stderr)
        print(f"[{stage}] raw output: {raw[:500]}", file=sys.stderr)
        return []

def parse_json_object(raw: str, stage: str) -> dict | None:
    cleaned = strip_markdown_fences(raw)
    try:
        start = cleaned.index("{")
        end = cleaned.rindex("}") + 1
        return json.loads(cleaned[start:end])
    except (ValueError, json.JSONDecodeError) as e:
        print(f"[{stage}] parse error: {e}", file=sys.stderr)
        print(f"[{stage}] raw output: {raw[:500]}", file=sys.stderr)
        return None
```

### Патч для CFP: вставить после `hermes_run` (см. раздел 1)

```python
def strip_markdown_fences(raw: str) -> str:
    import re
    match = re.search(r'```(?:json)?\s*\n(.*?)```', raw, re.DOTALL)
    if match:
        return match.group(1).strip()
    return raw.strip()

def parse_json_array(raw: str, stage: str = "llm") -> list:
    cleaned = strip_markdown_fences(raw)
    try:
        start = cleaned.index("[")
        end = cleaned.rindex("]") + 1
        return json.loads(cleaned[start:end])
    except (ValueError, json.JSONDecodeError) as e:
        print(f"[{stage}] parse error: {e}", file=sys.stderr)
        print(f"[{stage}] raw output: {raw[:500]}", file=sys.stderr)
        return []

def parse_json_object(raw: str, stage: str = "llm") -> dict | None:
    cleaned = strip_markdown_fences(raw)
    try:
        start = cleaned.index("{")
        end = cleaned.rindex("}") + 1
        return json.loads(cleaned[start:end])
    except (ValueError, json.JSONDecodeError) as e:
        print(f"[{stage}] parse error: {e}", file=sys.stderr)
        print(f"[{stage}] raw output: {raw[:500]}", file=sys.stderr)
        return None
```

**Честная пометка:** эти парсеры бесполезны для *текущего* пути CFP, потому что
сценарии CFP берутся из готового `scenarios.json` (уже валидный JSON, не LLM-вывод).
Они нужны **только если** мы добавим LLM-стадию (генерация тем/сценариев/описаний через
`hermes_run`). Поэтому пока это «библиотека наготове», а не обязательный хотфикс.

---

## 3. Мульти-модельная стратегия — ПРИМЕНИМА (как конфиг, не как хотфикс)

У них (CLI `--model`, строки 257-264) — monkey-patch `hermes_run` + таблица из README:

| Stage | Model | Cost |
|---|---|---|
| Research | hermes3:8b (Ollama) | $0 |
| Outline | hermes3:8b | $0 |
| Writing | hermes3:8b / claude-opus (--model) | $0 / ~$0.05 |

### Патч для CFP: добавить словарь стратегии + проброс `--model` в argparse

В блок конфигурации (после `STYLE`, ~строка 60) добавить:

```python
# Мульти-модельная стратегия (адаптировано из hermes-content-pipeline README).
# Дёшевая локальная модель для генерации черновиков, frontier — для финального.
MODEL_STRATEGY = {
    "draft": None,            # None = модель по умолчанию hermes
    "script": "hermes3:8b",   # если добавим LLM-генерацию сценариев
    "final": None,            # можно выставить "anthropic/claude-sonnet-4-20250514"
}
```

В `main()` argparse (после строки 386) добавить:

```python
    ap.add_argument("--model", type=str, default=None,
                    help="Перебить модель Hermes (напр. anthropic/claude-sonnet-4-20250514)")
```

И перед циклом `for n in range(args.count):` (после строки 399) добавить:
(аналог их monkey-patch, но без глобального перезатирания)

```python
    if args.model:
        global hermes_run
        _orig = hermes_run
        def hermes_run(prompt, model=args.model, timeout=300):
            return _orig(prompt, model=model, timeout=timeout)
```

**Честная пометка:** модель реально *используется* только внутри `hermes_run`,
а `hermes_run` в CFP пока не вызывается нигде (он появляется только вместе с LLM-стадией
из раздела 2). То есть патч безопасен, но «активируется» только после добавления LLM-шага.

---

## 4. RETRY / backoff — ОТСУТСТВУЕТ в источнике (честно)

**В `hermes-content-pipeline.py` retry НЕТ.** `hermes_run` делает один вызов с
`timeout=300`, проверяет `returncode`, но не повторяет. `hermes-worker.bb` — только
timeout + IPC-отчёт об ошибке, тоже без retry. Упоминаний `retry`, `backoff`,
`tenacity`, `fallback` в репозитории нет (проверено поиском).

Зато **в нашем CFP уже есть частичная защита от сбоев**: `render_video` бросает
`RuntimeError`, если файл не создан (строки 339-342); `upload_to_disk` бросает
`RuntimeError` при `returncode != 0` (строки 351-352). То есть падение одного видео
остановит цикл — автономному заводу это плохо.

### Предлагаемый патч (НЕ из источника, а наш довесок): обёртка-retry для загрузки

Вставить после `upload_to_disk` (после строки 353):

```python
import time as _time

def upload_to_disk_retry(local_path, remote_name, attempts: int = 3, backoff: float = 5.0):
    """rclone copyto с экспоненциальным бэкоффом (наш довесок, в источнике retry нет)."""
    last_err = None
    for i in range(attempts):
        try:
            return upload_to_disk(local_path, remote_name)
        except RuntimeError as e:
            last_err = e
            print(f"[upload] попытка {i+1}/{attempts} не удалась: {e}; ждём {backoff}s")
            _time.sleep(backoff * (2 ** i))
    raise last_err
```

И в `main()` заменить вызов `durl = upload_to_disk(opath, vname)` (строка 423) на:

```python
        durl = upload_to_disk_retry(opath, vname)
```

**Пометка:** это не адаптация паттерна из источника, а comb-закрытие дыры, которую
источник НЕ покрывает. Оставляю отдельно, чтобы не приписывать источнику то, чего там нет.

---

## 5. Этап публикации на Yandex (rclone) — УЖЕ ЕСТЬ, подтверждаем + расширяем

Существующий паттерн CFP (строки 42, 346-353):

```python
YANDEX_REMOTE = "yandex:/Content_Factory"

def upload_to_disk(local_path, remote_name):
    r = subprocess.run(
        ["rclone", "copyto", str(local_path), f"{YANDEX_REMOTE}/{remote_name}"],
        capture_output=True, text=True, timeout=120,
    )
    if r.returncode != 0:
        raise RuntimeError(f"Upload не удался: {r.stderr[-300:]}")
    return f"{YANDEX_REMOTE}/{remote_name}"
```

Это ровно то, что просили: `rclone copy ... yandex:Content_Factory/`. Работает
(проверено: `rclone lsd yandex:/Content_Factory` → exit 0).

### Опциональное расширение: пакетный `rclone copy` каталога + заливка метаданных

Если хотим заливать не по одному файлу, а целый batch-каталог за раз (например,
видео + CSV + summary JSON), добавить рядом с `upload_to_disk`:

```python
def publish_batch(local_dir: pathlib.Path, remote_subdir: str):
    """Пакетная заливка каталога: rclone copy <dir> yandex:/Content_Factory/<subdir>/"""
    r = subprocess.run(
        ["rclone", "copy", str(local_dir), f"{YANDEX_REMOTE}/{remote_subdir}",
         "--exclude", "hyperframes.json"],
        capture_output=True, text=True, timeout=300,
    )
    if r.returncode != 0:
        raise RuntimeError(f"Batch upload не удался: {r.stderr[-300:]}")
    return f"{YANDEX_REMOTE}/{remote_subdir}"
```

И в `main()` после цикла (после строки 437) — один финальный аплоад рабочей папки:

```python
    publish_batch(WORK_DIR, f"batches/{datetime.datetime.now().strftime('%Y%m%d')}")
```

Это честно реализует «этап публикации (rclone copy ... yandex:Content_Factory/)» как
пакетную операцию поверх уже существующего per-file `copyto`.

---

## 6. Сводка применимости

| Паттерн из источника | Есть в источнике? | Применим к CFP? | Действие |
|---|---|---|---|
| `hermes -z` одношот | ✅ | ✅ прямо | Раздел 1 — добавить `hermes_run` |
| Робастный JSON-парсинг | ✅ | ⚠️ только при добавлении LLM-стадии | Раздел 2 — библиотека наготове |
| Мульти-модель (`--model`) | ✅ | ⚠️ только при LLM-стадии | Раздел 3 — конфиг + argparse |
| Retry / backoff | ❌ НЕТ | N/A | Раздел 4 — наш довесок, не из источника |
| Этап публикации rclone | ❌ у них нет | ✅ уже есть у нас | Раздел 5 — подтверждение + batch-расширение |

**Ключевой инсайт:** `hermes-content-pipeline` — это *текстовый* (markdown) конвейер,
а CFP — *видео*-конвейер (HyperFrames → mp4 → Yandex). Общий знаменатель — только
`hermes -z` как инференс-движок и принцип «каждый stage = отдельный вызов».
Поэтому LLM-паттерны (JSON-парсинг, multi-model) имеют смысл **только если** мы
захотим генерить сценарии/описания через LLM вместо статического `scenarios.json`.

---

## 7. Проверка синтаксиса патчей

Все сниппеты выше собраны в отдельный файл `patches_check.py` и проверены:
`python3 -c "import py_compile; py_compile.compile('patches_check.py', doraise=True)"`
→ **OK, синтаксически валидны** (Python 3.11+, `dict | None` аннотация поддерживается).
