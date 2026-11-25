# Blog API Backend

A RESTful blog API built with TypeScript, Express, MongoDB, and Mongoose. It provides authentication, role-based authorization, blog management, comments, likes, profile management, refresh-token handling, and Cloudinary banner uploads.

**Repository:** https://github.com/vignesh1973-creator/Blog-API-Backend

## Features

- User registration and login
- Admin and user roles
- Access and refresh JWT authentication
- HTTP-only refresh-token cookies
- Password hashing with bcrypt
- Role-based route authorization
- Blog creation, updates, deletion, and retrieval
- Draft and published blog statuses
- Blog slugs, pagination, author filtering, and view metadata
- Cloudinary banner uploads with a 2 MB size limit
- Blog comments and comment pagination
- Unique blog likes per user
- HTML sanitization for blog content and comments
- Request validation with `express-validator`
- CORS, Helmet security headers, response compression, and rate limiting
- Graceful MongoDB and server shutdown

## Tech Stack

| Technology | Purpose |
| --- | --- |
| Node.js | Runtime |
| TypeScript | Type-safe application code |
| Express 5 | HTTP server and routing |
| MongoDB | Database |
| Mongoose | MongoDB object modeling |
| JSON Web Tokens | Access and refresh authentication |
| bcrypt | Password hashing |
| Cloudinary | Blog banner storage |
| Multer | Multipart file handling |
| express-validator | Request validation |
| DOMPurify + JSDOM | HTML sanitization |
| Helmet | HTTP security headers |
| express-rate-limit | API rate limiting |

## Project Structure

```text
src/
├── config/              # Environment configuration
├── controllers/         # Route business logic
│   ├── auth/
│   ├── blog/
│   ├── comment/
│   ├── Likes/
│   └── user/
├── lib/                 # Database, JWT, Cloudinary, and rate-limit helpers
├── middleware/          # Authentication, authorization, uploads, validation
├── models/              # Mongoose schemas
├── routes/              # Express route definitions
├── utils/               # Password, slug, username, and token helpers
└── server.ts            # Application entry point
```

## Requirements

- Node.js 18 or newer
- npm
- MongoDB Atlas or a local MongoDB instance
- A Cloudinary account

## Installation

1. Clone the repository:

```bash
git clone https://github.com/vignesh1973-creator/Blog-API-Backend.git
cd Blog-API-Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the project root:

```env
PORT=3000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017

JWT_ACCESS_SECRET=replace-with-a-long-random-access-secret
JWT_REFRESH_SECRET=replace-with-a-long-random-refresh-secret
JWT_ACCESS_EXPIRY=15m
JWT_REFRESH_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

Use strong, independent values for the access and refresh secrets in production.

## Running the Project

Start in development mode with Nodemon:

```bash
npm run dev
```

Build the TypeScript project:

```bash
npm run build
```

Run the compiled application:

```bash
npm start
```

The server starts at `http://localhost:3000` by default. The API is available under `/api/v1`.

## API Overview

### Authentication

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/api/v1/auth/register` | Register a user | Public |
| `POST` | `/api/v1/auth/login` | Login and receive an access token | Public |
| `POST` | `/api/v1/auth/refresh-token` | Rotate refresh token and return a new access token | Public |
| `POST` | `/api/v1/auth/logout` | Revoke the refresh token | Authenticated |

Protected routes expect an access token in the Authorization header:

```http
Authorization: Bearer <access-token>
```

### Users

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `GET` | `/api/v1/users/current` | Get the current user | Admin/User |
| `PATCH` | `/api/v1/users/current` | Update the current user | Admin/User |
| `DELETE` | `/api/v1/users/current` | Delete the current user | Admin/User |
| `GET` | `/api/v1/users` | Get all users | Admin |
| `GET` | `/api/v1/users/:userId` | Get a user by ID | Admin |
| `DELETE` | `/api/v1/users/:userId` | Delete a user by ID | Admin |

### Blogs

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/api/v1/blogs` | Create a blog with a `banner_image` upload | Admin |
| `GET` | `/api/v1/blogs` | Get paginated blogs | Admin/User |
| `GET` | `/api/v1/blogs/user/:userId` | Get blogs by author | Admin/User |
| `GET` | `/api/v1/blogs/:slug` | Get a blog by slug | Admin/User |
| `PATCH` | `/api/v1/blogs/:blogId` | Update a blog | Admin |
| `DELETE` | `/api/v1/blogs/:blogId` | Delete a blog | Admin |

Blog list requests support `limit` and `offset` query parameters:

```text
GET /api/v1/blogs?limit=10&offset=0
```

### Comments

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/api/v1/comments/blog/:blogId` | Add a comment | Admin/User |
| `GET` | `/api/v1/comments/blog/:blogId` | Get paginated comments | Admin/User |
| `DELETE` | `/api/v1/comments/:commentId` | Delete a comment | Owner/Admin |

Comment list requests support `page` and `limit` query parameters:

```text
GET /api/v1/comments/blog/:blogId?page=1&limit=10
```

### Likes

| Method | Endpoint | Description | Access |
| --- | --- | --- | --- |
| `POST` | `/api/v1/likes/blog/:blogId` | Like a blog | Admin/User |
| `DELETE` | `/api/v1/likes/blog/:blogId` | Unlike a blog | Admin/User |

### Health Check

```http
GET /api/v1
```

Returns server status, API version, and the current timestamp.

## Authentication and Cookies

The login and registration endpoints set an HTTP-only `refreshToken` cookie. The refresh-token endpoint reads this cookie, verifies the token, and replaces the stored refresh-token hash.

For browser clients:

- Use the frontend origin defined in [src/config/index.ts](src/config/index.ts).
- Send cookies when making cross-origin requests.
- Keep access tokens in application memory or another secure client-side storage.
- In production, use HTTPS and configure `NODE_ENV=production`.

## Data Models

- **User:** username, email, hashed password, role, profile details, and social links
- **Blog:** title, unique slug, sanitized content, author, banner, status, and counts
- **Comment:** blog reference, user reference, and sanitized content
- **Like:** unique user and blog/comment relationship
- **Token:** hashed refresh token and user reference

## Security

- Passwords are hashed with bcrypt using 12 salt rounds.
- Refresh tokens are stored as SHA-256 hashes rather than plain text.
- Refresh tokens are HTTP-only and use strict same-site cookies.
- Access tokens are required by protected routes.
- Input values are validated and MongoDB ObjectIds are checked.
- Blog and comment HTML content is sanitized.
- Helmet adds security-focused HTTP headers.
- The API limits requests to 60 per minute per client.
- Admin registration is restricted to the whitelist in the configuration.

## NPM Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Run with Nodemon and TypeScript |
| `npm run build` | Compile TypeScript and resolve aliases |
| `npm start` | Run `dist/server.js` |



## License

This project is licensed under the [MIT License](LICENSE).
