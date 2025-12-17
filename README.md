# 🚀 Robust Node.js SaaS Boilerplate

A production-ready, highly scalable Express.js boilerplate built with TypeScript, Prisma, and Redis. This project follows a **Clean Architecture (Vertical Slicing)** pattern to ensure maintainability as the codebase grows.

---

## 🛠 Tech Stack

| Category | Technology |
|----------|-----------|
| **Runtime** | Node.js (v18+) |
| **Language** | TypeScript |
| **Framework** | Express.js |
| **ORM** | Prisma (with PostgreSQL) |
| **Caching** | Redis (Cache-Aside pattern) |
| **Task Queue** | BullMQ (Redis-backed background jobs) |
| **Logging** | Winston (Structured logging) |
| **Validation** | Joi / Zod |
| **Process Management** | PM2 (for production) |

---

## 🏗 Project Structure

The project uses **Vertical Slicing**. Each feature (e.g., Users) contains its own API, Domain, and Data layers.

```
src/
├── config/              # App configuration & Environment variables
├── core/                # Framework-level logic (Middlewares, Error handling)
├── shared/              # Reusable infrastructure services (Cache, Queue, Hash)
├── features/            # Feature-based vertical slices
│   └── users/
│       ├── api/         # Controllers, Routes, Schemas
│       ├── domain/      # Business logic (Services)
│       ├── data/        # Data access (Repositories)
│       ├── workers/     # Background job processors
│       └── user.types.ts
└── index.ts             # Application entry point & Bootstrap
```

### 📂 Architecture Layers

- **API Layer**: Controllers, routes, request/response schemas
- **Domain Layer**: Business logic and services
- **Data Layer**: Database repositories and data access
- **Workers**: Background job processors for async tasks

---

## 🚦 Getting Started

### 1️⃣ Prerequisites

Ensure you have the following installed:

- ✅ Docker and Docker Compose
- ✅ Node.js (v18 or v20)
- ✅ npm or yarn

### 2️⃣ Environment Setup

Copy the example environment file and update your credentials:

```bash
cp .env.example .env
```

**Important variables to configure:**
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_HOST` - Redis server host
- `REDIS_PORT` - Redis server port
- `JWT_SECRET` - Secret key for authentication

### 3️⃣ Spin up Infrastructure (Database & Redis)

Use Docker to start PostgreSQL and Redis:

```bash
docker-compose up -d
```

### 4️⃣ Database Initialization

Sync your Prisma schema with the local database:

```bash
npx prisma db push
```

**Optional:** Run database migrations

```bash
npx prisma migrate dev
```

### 5️⃣ Start Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

---

## 🔧 Core Services

### 🗄️ Cache Service

Implements the **Cache-Aside pattern** for optimal performance.

**Example Usage:**

```typescript
const user = await cacheService.wrap(
  `user:${id}`, 
  3600, 
  () => userRepository.findById(id)
);
```

**Features:**
- Automatic cache invalidation
- TTL (Time-To-Live) support
- Fallback to database on cache miss

---

### ⚙️ Queue & Workers

Offload heavy tasks (emails, reports) to background workers using **BullMQ**.

**Example: Adding a job to the queue**

```typescript
// Add to queue
await queueService.addJob('email-queue', 'send-welcome', {
  email: 'user@example.com'
});
```

**Use Cases:**
- 📧 Send welcome emails
- 📊 Generate reports
- 🔄 Data synchronization
- 📤 Bulk operations

---

### 🚨 Global Error Handling

All errors are caught by a centralized middleware. Use the `ApiError` class for consistent responses.

**Example:**

```typescript
throw new NotFoundError('User not found');
```

**Available Error Classes:**
- `BadRequestError` - 400 errors
- `UnauthorizedError` - 401 errors
- `ForbiddenError` - 403 errors
- `NotFoundError` - 404 errors
- `ConflictError` - 409 errors
- `ValidationError` - 422 errors

---

## 🧪 Testing

The architecture is designed for **high testability** by using Dependency Injection in the `routes.ts` files.

### Run Tests

```bash
# Run unit tests
npm run test

# Run integration tests
npm run test:integration

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Test Structure

```
tests/
├── unit/           # Unit tests for services and utilities
├── integration/    # API endpoint tests
└── fixtures/       # Test data and mocks
```

---

## 📜 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/v1/users/register` | Create a new account |
| `POST` | `/api/v1/users/login` | Authenticate user |

### User Endpoints

| Method | Endpoint | Description | Cache |
|--------|----------|-------------|-------|
| `GET` | `/api/v1/users/:id` | Fetch user profile | ✅ Cached |
| `PATCH` | `/api/v1/users/:id` | Update user profile | ❌ |
| `DELETE` | `/api/v1/users/:id` | Delete user account | ❌ |

### Example Request

```bash
curl -X GET http://localhost:3000/api/v1/users/123 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Example Response

```json
{
  "success": true,
  "data": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe",
    "createdAt": "2024-01-01T00:00:00Z"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

---

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run test` | Run unit tests |
| `npm run test:integration` | Run integration tests |
| `npm run test:coverage` | Generate test coverage report |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix linting issues |
| `npm run format` | Format code with Prettier |
| `npx prisma studio` | Open Prisma Studio (Database GUI) |
| `npm run docker:up` | Start Docker containers |
| `npm run docker:down` | Stop Docker containers |

---

## 🚀 Deployment

### Using PM2 (Recommended for Production)

```bash
# Build the project
npm run build

# Start with PM2
npm run start:pm2

# View logs
npm run logs:pm2

# Restart
npm run restart:pm2
```

### Using Docker

```bash
# Build Docker image
docker build -t saas-backend .

# Run container
docker run -p 3000:3000 --env-file .env saas-backend
```

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Contribution Steps

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Ensure your code follows the Vertical Slicing pattern**
   - Place all feature code in `src/features/your-feature/`
   - Separate API, Domain, and Data layers

3. **Add unit tests for your Services**
   ```bash
   npm run test
   ```

4. **Submit a PR**
   - Provide a clear description
   - Reference any related issues
   - Ensure all tests pass

### Code Standards

- ✅ Use TypeScript strict mode
- ✅ Follow ESLint rules
- ✅ Format code with Prettier
- ✅ Write tests for new features
- ✅ Update documentation

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Express.js** - Fast, unopinionated web framework
- **Prisma** - Next-generation ORM
- **BullMQ** - Premium message queue
- **Redis** - In-memory data structure store

---

## 📞 Support

- 📧 Email: sayedbazarah@gmail.com
- 🐛 Issues: [GitHub Issues](https://github.com/SayedBazarah/express-boilerplate/issues)

---

<div align="center">

**⭐ Star this repo if you find it helpful!**

Made with ❤️ by Sayed Mohamed

</div>