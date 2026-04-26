<h1 align="center">
  <img src="client/public/logo.png" alt="GreenCart Logo" width="40"/> 
  GreenCart 🛒
</h1>

<h4 align="center">A full-stack multi-vendor grocery e-commerce platform built with the MERN stack.</h4>

<p align="center">
  <a href="https://greencart-six-pi.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Site-4CAF50?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"/>
  </a>
  &nbsp;
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white"/>
  &nbsp;
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=for-the-badge&logo=stripe&logoColor=white"/>
</p>

---

## 📸 Screenshots

### 🛍️ Customer Experience

| Home & Hero | All Products |
|:---:|:---:|
| ![Home Page](screenshots/home.png) | ![All Products](screenshots/all-products.png) |

| Product Detail | Shopping Cart & Checkout |
|:---:|:---:|
| ![Product Detail](screenshots/product-detail.png) | ![Cart](screenshots/cart.png) |

| My Orders | User Login |
|:---:|:---:|
| ![My Orders](screenshots/my-orders.png) | ![Login](screenshots/login.png) |

### 🏪 Seller Dashboard

| Add Product | Product List | Orders Management |
|:---:|:---:|:---:|
| ![Add Product](screenshots/seller-add.png) | ![Product List](screenshots/seller-products.png) | ![Orders](screenshots/seller-orders.png) |

> 📁 Add your screenshots to a `screenshots/` folder in the root directory and rename them to match the paths above.

---

## ✨ Features

### For Customers 👤
- 🏠 **Home Page** — Hero banner, category filters, best sellers, and newsletter subscription
- 🔍 **Product Discovery** — Browse all products with category-based filtering and real-time search
- 📦 **Product Details** — Multi-image gallery, pricing with offer prices, and related products
- 🛒 **Smart Cart** — Add/remove items, adjust quantities, and view live order summary
- 💳 **Checkout** — Choose between **Cash on Delivery** or **Online Payment via Stripe**
- 📬 **Address Management** — Save and manage multiple delivery addresses
- 📋 **Order Tracking** — View all past orders with status, payment method, and date via `My Orders`
- 📧 **Contact Support** — Reach out via an integrated contact form powered by **EmailJS**

### For Sellers 🏪
- 📊 **Seller Dashboard** — Dedicated protected portal with sidebar navigation
- ➕ **Add Products** — Upload up to 4 product images via **Cloudinary**, set category, price, and offer price
- 📃 **Product List** — View all live listings with real-time **In Stock toggle** management
- 📦 **Order Management** — View all incoming customer orders with buyer details, quantities, and payment status

---

## 💻 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router DOM v7 |
| **State & Data** | React Context API, Axios |
| **Backend** | Node.js, Express.js, RESTful API |
| **Database** | MongoDB, Mongoose ORM |
| **Authentication** | JWT (JSON Web Tokens), bcryptjs |
| **Payments** | Stripe API |
| **Image Storage** | Cloudinary, Multer |
| **Email** | EmailJS |
| **Notifications** | React Hot Toast |
| **Security** | CORS, Cookie-Parser, Dotenv |

---

## 📂 Project Structure

```
GREENCART/
│
├── client/                         # React 19 Frontend (Vite)
│   ├── public/                     # Static assets
│   └── src/
│       ├── components/             # Reusable UI components (Navbar, Footer, ProductCard...)
│       ├── context/                # React Context — global auth & cart state
│       ├── pages/                  # Customer pages
│       │   ├── Home.jsx
│       │   ├── AllProducts.jsx
│       │   ├── ProductDetail.jsx
│       │   ├── Cart.jsx
│       │   ├── MyOrders.jsx
│       │   ├── Contact.jsx
│       │   └── seller/             # Seller Portal pages
│       │       ├── AddProduct.jsx
│       │       ├── ProductList.jsx
│       │       └── Orders.jsx
│       ├── App.jsx
│       └── main.jsx
│
└── server/                         # Express RESTful API
    ├── configs/                    # DB & Cloudinary config
    ├── controllers/                # Business logic (users, products, orders, cart, address)
    ├── middlewares/                # Auth guard, error handler, Multer upload
    ├── models/                     # Mongoose schemas (User, Product, Order, Address)
    ├── routes/                     # API route definitions
    └── server.js                   # Entry point
```

---

## 🗺️ API Reference

### 👤 User / Auth
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| POST | `/api/user/register` | Register new user | ❌ |
| POST | `/api/user/login` | User login | ❌ |
| GET | `/api/user/is-auth` | Verify auth token | ✅ |
| POST | `/api/user/logout` | Logout user | ✅ |

### 🛍️ Products
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| GET | `/api/product/list` | Get all products | ❌ |
| GET | `/api/product/:id` | Get single product | ❌ |
| POST | `/api/product/add` | Add new product | ✅ Seller |
| POST | `/api/product/stock` | Toggle in-stock status | ✅ Seller |

### 🛒 Cart & Orders
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| GET | `/api/cart/get` | Get user cart | ✅ |
| POST | `/api/cart/update` | Update cart items | ✅ |
| POST | `/api/order/cod` | Place COD order | ✅ |
| POST | `/api/order/stripe` | Place Stripe order | ✅ |
| GET | `/api/order/user` | Get user orders | ✅ |
| GET | `/api/order/seller` | Get all orders (seller) | ✅ Seller |

### 📬 Address
| Method | Endpoint | Description | Auth |
|---|---|---|:---:|
| POST | `/api/address/add` | Add delivery address | ✅ |
| GET | `/api/address/get` | Get saved addresses | ✅ |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) URI (local or Atlas)
- [Cloudinary](https://cloudinary.com/) account
- [Stripe](https://stripe.com/) account
- [EmailJS](https://www.emailjs.com/) account

### 1. Clone the Repository
```bash
git clone https://github.com/9140ayush/GreenCart.git
cd GreenCart
```

### 2. Backend Setup
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
```

Start the backend:
```bash
npm run server
```

### 3. Frontend Setup
```bash
cd client
npm install
```

Create a `.env` file inside `client/`:
```env
VITE_BACKEND_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key

VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

Start the frontend:
```bash
npm run dev
```

Open your browser at **[http://localhost:5173](http://localhost:5173)** 🎉

---

## 🌐 Live Demo

> 🔗 **[https://greencart-six-pi.vercel.app](https://greencart-six-pi.vercel.app)**

| Role | Email | Password |
|---|---|---|
| Customer | `demo@greencart.com` | `demo1234` |
| Seller | Use seller login portal | — |

> *(Update credentials above if you set up demo accounts)*

---

## 🔮 Future Improvements

- [ ] Add product reviews & ratings by customers
- [ ] Admin analytics dashboard with charts
- [ ] Real-time order status updates via WebSockets
- [ ] PWA support for mobile app-like experience
- [ ] Coupon code & discount system

---

## 📄 License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

---

<p align="center">
  <b>Crafted with ❤️ by <a href="https://github.com/9140ayush">Ayush Lohiya</a></b><br/>
  <a href="mailto:ayushlohiya722@gmail.com">ayushlohiya722@gmail.com</a> • 
  <a href="https://github.com/9140ayush">GitHub</a> • 
  Mathura, Uttar Pradesh, India
</p>

<p align="center">Copyright 2025 © Ayush.dev — All Rights Reserved</p>