# Avito AI Assistant — Frontend Trainee Assignment

Веб-приложение личного кабинета продавца с AI-ассистентом для улучшения объявлений.

## Стек

- React 19 + TypeScript
- Vite
- Redux Toolkit
- TanStack Query
- Mantine UI v8
- React Router v7
- Axios
- Ollama (локальная LLM)

## Требования

- Node.js v20+
- [Ollama](https://ollama.com) — для AI-функций

## Установка и запуск

### 1. Запуск бэкенда

```bash
cd server
npm install
PORT=8080 npm start
```

Сервер запустится на `http://localhost:8080`

### 2. Настройка LLM (Ollama)

Установите Ollama с [ollama.com](https://ollama.com), затем:

```bash
ollama pull llama3.2
ollama serve
```

### 3. Настройка переменных окружения

```bash
cp client/.env.example client/.env
```

Отредактируйте `client/.env` при необходимости.

### 4. Запуск клиента

```bash
cd client
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`

## API сервера

`GET /items` — список объявлений

| Параметр | Тип | Описание |
|---|---|---|
| `q` | string | Поиск по названию |
| `limit` | number | Количество на странице (по умолчанию 10) |
| `skip` | number | Смещение для пагинации |
| `categories` | string | Категории через запятую: `auto`, `real_estate`, `electronics` |
| `needsRevision` | boolean | Только требующие доработок |
| `sortColumn` | string | Поле сортировки: `title`, `createdAt`, `price` |
| `sortDirection` | string | Направление: `asc`, `desc` |

`GET /items/:id` — одно объявление

`PUT /items/:id` — обновление объявления

## Принятые решения

- Архитектура: Feature-Sliced Design (FSD)
- В `server/server.ts` в эндпоинте `GET /items` добавлено поле `id` в `.map()` — без него невозможно построить навигацию на страницу объявления из списка
- В `server/server.ts` добавлена сортировка по цене (`sortColumn=price`) — в оригинальном API поддерживались только `title` и `createdAt`
- LLM-интеграция реализована через локальный Ollama REST API (`POST http://localhost:11434/api/generate`)