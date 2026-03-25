## Тестовое задание для стажёра Frontend (весенняя волна 2026)
## AI‑ассистент для улучшения объявлений

Веб‑приложение “личного кабинета продавца” с AI‑ассистентом: список объявлений → просмотр карточки → редактирование с генерацией описания и подсказкой рыночной цены через LLM.

## Технологии

- React + TypeScript
- Vite
- Redux Toolkit
- TanStack Query
- React Router
- Mantine UI
- Axios
- LLM: Ollama (локальный запуск, REST API)

## Требования

- Node.js v20+
- (опционально) [Ollama](https://ollama.com) — для AI‑функций

## Установка и запуск

### 1) Backend

```bash
cd server
npm install
PORT=8080 npm start
```

Backend будет доступен на `http://localhost:8080`.

### 2) LLM (Ollama)

Установите Ollama с сайта [ollama.com](https://ollama.com), затем:

```bash
ollama serve
ollama pull llama3.2
```

Клиент обращается к Ollama по `POST /api/generate` (по умолчанию `http://localhost:11434`).

### 3) Переменные окружения (client)

```bash
cp client/.env.example client/.env
```

Переменные:

- `VITE_API_URL` — URL backend API (по умолчанию `http://localhost:8080`)
- `VITE_OLLAMA_URL` — URL Ollama (по умолчанию `http://localhost:11434`)
- `VITE_OLLAMA_MODEL` — модель Ollama (по умолчанию `llama3.2`)

### 4) Client

```bash
cd client
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`.

## Реализованный функционал (по ТЗ)

### `/ads` — список объявлений

- Заголовок и общее количество
- Поиск по названию
- Сортировка
- Фильтры: категории, “только требующие доработок”, сброс
- Пагинация (10 объявлений на страницу)
- Переход к карточке объявления по клику

### `/ads/:id` — просмотр объявления

- Название, цена, даты
- Изображения (placeholder)
- Характеристики в зависимости от категории
- Описание
- Блок “Требуются доработки” со списком незаполненных полей (если применимо)
- Кнопка “Редактировать”

### `/ads/:id/edit` — редактирование объявления

- Форма: категория, название, цена, характеристики, описание
- AI‑функции:
  - “Придумать/Улучшить описание”
  - “Узнать рыночную цену”
- Сохранение изменений через `PUT /items/:id`
- Сохранение черновика формы в `localStorage` (восстановление после обновления страницы)

## Backend API (кратко)

### `GET /items`

Параметры:

| Параметр | Тип | Описание |
|---|---|---|
| `q` | string | Поиск по названию |
| `limit` | number | Лимит |
| `skip` | number | Смещение |
| `needsRevision` | boolean | Только требующие доработок |
| `categories` | string | Категории через запятую: `auto`, `real_estate`, `electronics` |
| `sortColumn` | string | `title` или `createdAt` |
| `sortDirection` | string | `asc` или `desc` |

### `GET /items/:id`

Получить одно объявление по id.

### `PUT /items/:id`

Полная замена объявления по id.

## Принятые решения / заметки
- Архитектура: Feature‑Sliced Design (FSD)
- В `server/server.ts` в эндпоинте `GET /items` добавлено поле `id` в `.map()` — без него невозможно 
построить навигацию на страницу объявления из списка
- В `server/server.ts` добавлена сортировка по цене (`sortColumn=price`) — в оригинальном API поддерживались 
только `title` и `createdAt`
- Интеграция с LLM: `client/src/shared/api/ollama.ts` (Ollama REST API)