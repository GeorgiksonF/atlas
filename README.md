# Atlas

Монорепозиторий для управления портфелями инвестиций.

## Структура проекта

```
atlas/
├── apps/
│   ├── frontend/     # Vue 3 + Vite фронтенд приложение
│   └── backend/      # NestJS бэкенд приложение
├── libs/
│   ├── database/     # Prisma схема и клиент
│   └── types/        # Общие типы TypeScript
└── docker/           # Docker Compose конфигурация
```

## Требования

- Node.js 18+ 
- npm 9+
- Docker и Docker Compose (для базы данных)

## Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd atlas
```

2. Установите зависимости:
```bash
npm install
```

После установки зависимостей автоматически выполнится генерация Prisma Client (`postinstall` скрипт).

3. Настройте переменные окружения:
Создайте файл `.env` в корне проекта (если его еще нет) и настройте `DATABASE_URL`:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/atlas"
```

4. Запустите миграции базы данных (если нужно):
```bash
npm run db:migrate
```

## Запуск проекта

### Запуск всего проекта одной командой

Запускает базу данных, фронтенд и бэкенд одновременно:

```bash
npm run dev
```

### Запуск отдельных компонентов

```bash
# Только база данных
npm run dev:db

# Только фронтенд
npm run dev:frontend

# Только бэкенд
npm run dev:backend
```

## Полезные команды

### База данных

```bash
# Генерация Prisma Client
npm run db:generate

# Применение миграций
npm run db:migrate

# Открыть Prisma Studio (GUI для базы данных)
npm run db:studio

# Форматирование Prisma схемы
npm run db:format
```

### Разработка

```bash
# Линтинг всех проектов
npm run lint

# Сборка всех проектов
npm run build
```

## Технологии

- **Frontend**: Vue 3, Vite, TypeScript, PrimeVue, TailwindCSS
- **Backend**: NestJS, TypeScript, Passport JWT
- **Database**: PostgreSQL, Prisma ORM
- **Infrastructure**: Docker, Docker Compose

## Примечания

- Prisma Client генерируется автоматически при `npm install` благодаря `postinstall` скрипту
- Сгенерированные файлы в `libs/database/generated/` не коммитятся в git
- База данных запускается на порту `5433` (внешний) / `5432` (внутри контейнера)
