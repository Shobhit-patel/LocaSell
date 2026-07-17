# 🛍️ LocaSell

> **Sell your second-hand products locally within a 20 KM radius.**
> Your unused products can be valuable to someone nearby.

---

## 📌 Overview

**LocaSell** is a local second-hand marketplace where users can buy and sell unused products within a **20 KM radius** of their location.

The platform helps users discover nearby products, connect with sellers, and complete transactions easily. Instead of keeping unused items, users can list them and find buyers in their local area.

LocaSell provides features like product listings, location-based search, wishlist, cart management, and real-time messaging between buyers and sellers.


---

# ⚙️ Setup

## Clone Repository

```bash
git clone <repository-url>
```

```bash
cd LocaSell
```

---

## Backend Setup

```bash
cd backend
```

```bash
npm install
```

Create a `.env` file inside the backend folder.

```env
PORT=

MONGO_URI=

JWT_SECRET_KEY=

CLOUDINARY_NAME=

CLOUDINARY_KEY=

CLOUDINARY_SECRET=
```


```bash
npm run server
```

---

## Frontend Setup

```bash
cd frontend
```

```bash
npm install
```

Create a `.env` file inside the frontend folder.

```env
VITE_API_URL=
```

```bash
npm run dev
```

The application will start on the local development server.

---


# ✨ Features

### 👤 Authentication

* Secure JWT Authentication
* User Registration & Login
* Protected Routes

### 🛒 Marketplace

* Create Product Listings
* Product Details Page
* Search Products
* Advanced Filters
* Reset Filters
* Location-Based Listings (20 KM Radius)
* Wishlist
* Add to Cart
* Direct Messaging with Sellers

### 💬 Real-Time Chat

* One-to-One Messaging
* Instant Chat using Socket.IO
* Notifications

### 📍 Maps & Location

* Interactive Maps with React Leaflet
* Location-Based Search

### 👤 User Profile

* User Profile
* My Listings
* Wishlist
* Cart
* Message History

### 🎨 UI/UX

* Responsive Design
* Dark / Light Theme
* Fast Navigation

---

# 📱 Pages

* 🏠 Home
* 💬 Messages
* ➕ Post Listing
* 📦 Product Details
* 👤 Profile

---

# 🚀 Usage

1. Register a new account or login.
2. Set location to get nearby products.
3. Browse products available within a 20 KM radius. 
4. Search and filter products according to requirements.
5. View product details and contact sellers through chat.
6. Add products to wishlist or cart.
7. Create your own listings and sell unused products locally.

---

# 🛠️ Tech Stack

## Frontend

* React 19
* Vite
* Tailwind CSS
* Redux Toolkit
* React Router DOM
* Axios
* React Leaflet
* Socket.IO Client
* React Hot Toast
* Date-fns

---

## Backend

* Node.js
* Express.js
* MongoDB Atlas
* Mongoose
* JWT Authentication
* Socket.IO
* Cloudinary
* Multer
* Bcrypt

---


# 📂 Project Structure

LocaSell/
│
├── frontend/                         # React + Vite Frontend
│   ├── public/
│   │   └── favicon.png
│   │
│   ├── src/
│   │   ├── assets/                   # Images, icons, static files
│   │   ├── components/               # Reusable UI components
│   │   ├── pages/                    # Application pages
│   │   ├── reducers/                 # Redux reducers
│   │   ├── sampleData/               # Dummy/test data
│   │   ├── socket/                   # Socket.io client setup
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── index.html
│   └── README.md
│
├── backend/                          # Node.js + Express Backend
│   ├── config/                       # Database & external services
│   │   ├── cloudinary.js
│   │   └── db.js
│   │
│   ├── controllers/                  # Business logic
│   │   ├── authController/
│   │   ├── listing/
│   │   ├── addToCart/
│   │   ├── wishlist/
│   │   ├── rating/
│   │   ├── notification/
│   │   └── chatController/
│   │
│   ├── middleware/                   # Authentication & file handling
│   │   ├── verify.js
│   │   └── upload.js
│   │
│   ├── models/                       # MongoDB schemas
│   │   ├── User.js
│   │   ├── Listing.js
│   │   ├── Chat.js
│   │   ├── Message.js
│   │   ├── Rating.js
│   │   └── Notification.js
│   │
│   ├── routes/                       # API routes
│   │   ├── userRoutes.js
│   │   ├── listingRoutes.js
│   │   ├── cartRoute.js
│   │   ├── wishListRoutes.js
│   │   ├── ratingRoute.js
│   │   ├── chatRoutes.js
│   │   └── notificationRoutes.js
│   │
│   ├── socket/                       # Real-time communication
│   │   └── socket.js
│   │
│   ├── server.js                     # Backend entry point
│   ├── package.json
│   └── package-lock.json
│
└── README.md                         # Project documentation

---

# 🚀 Future Improvements

* 📞 Voice & Video Calling between Buyers and Sellers
* 💳 Online Payments

---


# 🌐 Live Demo

Frontend: live demo link
///// i will deploy backned on render  and frontend in vercel but icon are not soing so i deploy in netfily but so blank

---

# 👨‍💻 Author

**Shobhit Patel**

GitHub: https://github.com/Shobhit-patel

LinkedIn: https://www.linkedin.com/in/shobhit-patel-98ba53263

---

# ⭐ Support

If you like this project, consider giving it a **⭐ Star** on GitHub.

It helps others discover the project and motivates future development.
