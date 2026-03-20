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
npm start
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

## Принятые решения

- Архитектура: Feature-Sliced Design (FSD)
- Серверные данные управляются через TanStack Query, UI-состояние (фильтры, тема) — через Redux Toolkit
- LLM-интеграция реализована через локальный Ollama REST API
