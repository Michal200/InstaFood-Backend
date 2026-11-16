# 🍳 InstaFood Backend API

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/JWT-Authentication-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Cloudinary-Media%20CDN-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white" alt="Cloudinary" />
  <img src="https://img.shields.io/badge/SendGrid-Email%20Service-0085FF?style=for-the-badge&logo=sendgrid&logoColor=white" alt="SendGrid" />
</p>

---

## 📌 Overview

**InstaFood Backend** is a production-grade, RESTful API powering **InstaFood** — a dynamic social network and recipe-sharing platform tailored for foodies, home cooks, and professional chefs.

The service provides secure authentication, comprehensive recipe lifecycle management, rich multimedia asset handling, threaded interactive discussions, and personalized recommendation algorithms.

---

## ✨ Key Features

- **🔐 Robust Authentication & Security:**
  - Token-based authentication using **JSON Web Tokens (JWT)**.
  - Secure credential hashing with **bcryptjs**.
  - Account email verification and transactional password reset flows via **SendGrid**.
  - Google OAuth single sign-on integration.
- **📖 Recipe Management & Publishing:**
  - Full CRUD operations with detailed metadata: ingredients, instructions, tags, cooking time, difficulty level, servings, and geographical location tagging.
  - Multi-criteria search and personalized *"For You"* algorithm tailored to user browsing history.
- **💬 Social Interactions & Community:**
  - Real-time like/unlike toggle mechanism.
  - Nested, multi-level threaded comments with comment-level like tracking.
  - View counts and engagement metrics.
- **☁️ Cloud Multimedia Pipeline:**
  - Cloudinary CDN integration with automatic image resizing, optimization, and responsive cropping.
  - Multer multipart form-data handling with local and cloud storage providers.
- **👤 User Management:**
  - Comprehensive user profiles, custom avatars, bios, and search query persistence.
  - Dedicated endpoints for tracking saved and liked culinary content.

---

## 🏗️ Architecture & Tech Stack

```
├── server.js              # Application entry point, Express app & MongoDB connection
├── models/                # Mongoose Schemas & Data Models
│   ├── User.js            # User profile, credentials & preferences
│   ├── Recipe.js          # Recipe data, ingredients, steps & tags
│   ├── Comment.js         # Threaded comments & replies
│   └── Like.js            # Recipe like associations
├── routes/                # Modular Express Route Controllers
│   ├── authRoutes.js      # Register, login, verification, password recovery
│   ├── userRoutes.js      # Profile editing, avatar upload, password changes
│   ├── recipeRoutes.js    # Recipe CRUD, feed queries, search
│   ├── commentRoutes.js   # Comment creation, nested replies, deletion
│   ├── likeRoutes.js      # Like status and toggle operations
│   └── uploadProfileImage.js
├── middlewares/           # Custom Express Middlewares
│   └── authMiddleware.js  # JWT validation & user context injection
└── utils/                 # Utility services & external API clients
    ├── cloudinary.js      # Cloudinary storage engine configuration
    └── sendEmail.js       # SendGrid mail dispatch service
```

### Core Technologies
- **Runtime:** Node.js (v14+)
- **Framework:** Express.js
- **Database:** MongoDB via Mongoose ODM
- **Media CDN:** Cloudinary & Multer Storage Cloudinary
- **Email Delivery:** SendGrid Mail API (`@sendgrid/mail`)
- **Security:** JWT, bcryptjs, CORS

---

## 📊 Database Models

| Model | Description | Key Attributes |
| :--- | :--- | :--- |
| **`User`** | Platform user entity | `firstName`, `lastName`, `username`, `email`, `password`, `profileImage`, `bio`, `searchHistory`, `emailVerified` |
| **`Recipe`** | Culinary post | `title`, `description`, `imageUrl`, `cookingTime`, `servings`, `difficulty`, `category`, `location`, `ingredients`, `instructions`, `tags`, `likes`, `views`, `user` |
| **`Comment`** | Threaded commentary | `recipe`, `user`, `text`, `parentComment` (self-referential for replies), `likes`, `createdAt` |
| **`Like`** | Social interaction | `recipe`, `user` |

---

## 📡 REST API Reference

### 1. Authentication (`/api/auth`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/auth/register` | No | Register a new user with optional profile image upload |
| `POST` | `/api/auth/login` | No | Authenticate user credentials and return JWT token |
| `POST` | `/api/auth/google-login` | No | Single sign-on using Google OAuth |
| `GET` | `/api/auth/verify-email/:token` | No | Verify registered user email address |
| `POST` | `/api/auth/forgot-password` | No | Send password recovery email |
| `POST` | `/api/auth/reset-password/:token` | No | Reset user password using verification token |

### 2. User Profiles (`/api/users`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/users/me` | **Yes** | Retrieve authenticated user profile |
| `PUT` | `/api/users/edit` | **Yes** | Update personal profile details |
| `POST` | `/api/users/upload-profile` | **Yes** | Upload user profile picture to Cloudinary |
| `POST` | `/api/users/verify-password` | **Yes** | Verify current user password |
| `PUT` | `/api/users/change-password` | **Yes** | Update account password |
| `GET` | `/api/users/liked` | **Yes** | Retrieve recipes liked by current user |
| `GET` | `/api/users/:userId` | **Yes** | Fetch public profile for a specific user |

### 3. Recipes (`/api/recipes`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/recipes` | No | Get all public recipes (paginated feed) |
| `GET` | `/api/recipes/for-you` | **Yes** | Get personalized feed based on user tastes |
| `GET` | `/api/recipes/my-recipes` | **Yes** | Retrieve recipes published by authenticated user |
| `GET` | `/api/recipes/search/:query` | No | Search recipes by title, tags, or ingredients |
| `POST` | `/api/recipes/search-history` | **Yes** | Save query to user's recent search history |
| `POST` | `/api/recipes` | **Yes** | Create and publish a new recipe with image |
| `GET` | `/api/recipes/:id` | No | Fetch detailed recipe information by ID |
| `PUT` | `/api/recipes/:id` | **Yes** | Update an existing recipe |
| `DELETE`| `/api/recipes/:id` | **Yes** | Delete a recipe |

### 4. Comments (`/api/comments`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/comments/:recipeId` | No | Get all comments and nested replies for a recipe |
| `POST` | `/api/comments/:recipeId/:parentId?` | **Yes** | Post a new comment or a reply to an existing one |
| `POST` | `/api/comments/like/:commentId` | **Yes** | Toggle like on a comment |
| `DELETE`| `/api/comments/:commentId` | **Yes** | Remove an existing comment |

### 5. Likes (`/api/likes`)
| Method | Endpoint | Auth | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/api/likes` | **Yes** | Toggle like/unlike status for a recipe |
| `GET` | `/api/likes/:recipeId/:userId` | No | Check if a specific user liked a recipe |
| `GET` | `/api/likes/users/:recipeId` | No | List all users who liked a recipe |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 14.x or higher)
- [MongoDB](https://www.mongodb.com/) (local daemon or MongoDB Atlas URI)
- Cloudinary account credentials
- SendGrid API key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Michal200/InstaFood-Backend.git
   cd InstaFood-Backend
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Populate the values:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/instafood
   JWT_SECRET=your_secure_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   SENDGRID_API_KEY=your_sendgrid_key
   EMAIL_SENDER_ADDRESS=no-reply@instafood.com
   ```

4. **Run the server:**
   - **Development mode (with nodemon):**
     ```bash
     npm run dev
     ```
   - **Production mode:**
     ```bash
     npm start
     ```

The API will be available at `http://localhost:5000`.

---

## 👩‍💻 Author

**Michal**  
- GitHub: [@Michal200](https://github.com/Michal200)
