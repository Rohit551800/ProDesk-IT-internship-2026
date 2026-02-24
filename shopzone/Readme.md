# 🛍️ ShopZone

> A multi-page E-Commerce SPA built with React, React Router & Context API — no page reloads, no prop drilling.

**🔗 Live Demo → [rsgshopzone.netlify.app](https://rsgshopzone.netlify.app/)**

---

## 📸 Preview

| Home | Shop | Product Detail |
|------|------|----------------|
| Welcome banner with CTA | Product grid from API | Image, title, price, rating |

| Cart | Orders | Checkout |
|------|--------|----------|
| Items, qty controls, total | Full order history | Protected — login required |

---

## ✨ Features

- 🔀 **Client-side routing** — seamless navigation with React Router v6, zero full-page reloads
- 🛒 **Global cart state** — Context API powers the cart across every page
- 🔴 **Live cart badge** — Navbar badge updates instantly when items are added
- 📦 **Order history** — placed orders saved and viewable at `/orders`
- 🔐 **Protected routes** — `/checkout` redirects to `/login` if not authenticated
- 💾 **Persistent data** — cart, orders, and login state survive page refresh via `localStorage`
- 🌐 **Real API data** — products fetched live from [dummyjson.com/products](https://dummyjson.com/products)

---

## 🗺️ Pages & Routes

| Route | Page | Access |
|-------|------|--------|
| `/` | Home | Public |
| `/shop` | Shop — product grid | Public |
| `/product/:id` | Product Detail | Public |
| `/cart` | Shopping Cart | Public |
| `/orders` | Order History | Public |
| `/contact` | Contact Form | Public |
| `/login` | Login | Public |
| `/checkout` | Checkout | 🔐 Protected |

---

## 🏗️ Project Structure

```
shopzone/
├── public/
│   └── index.html
└── src/
    ├── index.js              # Entry point
    ├── index.css             # Global CSS variables & reset
    ├── App.js                # BrowserRouter + all Routes
    │
    ├── context/
    │   └── CartContext.js    # Global state — cart, orders, auth
    │
    ├── components/
    │   ├── Navbar.js         # Sticky nav with live cart badge
    │   ├── Navbar.css
    │   └── ProtectedRoute.js # Redirects to /login if unauthenticated
    │
    └── pages/
        ├── Home.js / .css
        ├── Shop.js / .css
        ├── ProductDetail.js / .css
        ├── Cart.js / .css
        ├── Orders.js / .css
        ├── Checkout.js / .css
        ├── Login.js / .css
        └── Contact.js / .css
```

---

## ⚙️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI library |
| **React Router v6** | Client-side routing & dynamic routes |
| **Context API** | Global state management (cart, auth, orders) |
| **localStorage** | Persistent cart, orders & session |
| **dummyjson.com** | Free products REST API |
| **Netlify** | Deployment & hosting |

---

## 🚀 Getting Started

### Prerequisites
- Node.js ≥ 16
- npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/shopzone.git

# 2. Navigate into the project
cd shopzone

# 3. Install dependencies
npm install

# 4. Start the development server
npm start
```

App runs at **http://localhost:3000**

### Build for Production

```bash
npm run build
```

---

## 🧠 Key Concepts Demonstrated

### 1. React Router — Dynamic Routing
```jsx
// App.js
<Route path="/product/:id" element={<ProductDetail />} />

// ProductDetail.js
const { id } = useParams();
fetch(`https://dummyjson.com/products/${id}`)
```

### 2. Context API — Global State
```jsx
// CartContext.js
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // ...
}

// Any component
const { cart, addToCart, cartCount } = useCart();
```

### 3. Protected Routes
```jsx
// ProtectedRoute.js
export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useCart();
  return isLoggedIn ? children : <Navigate to="/login" replace />;
}

// App.js
<Route path="/checkout" element={
  <ProtectedRoute><Checkout /></ProtectedRoute>
} />
```

### 4. localStorage Persistence
```jsx
// Sync cart to localStorage on every change
useEffect(() => {
  localStorage.setItem('shopzone_cart', JSON.stringify(cart));
}, [cart]);
```

---

## 📋 User Flow

```
Home
 └── /shop  →  Browse products grid
       └── /product/:id  →  View details, Add to Cart
             └── /cart  →  Review items, adjust qty
                   └── /checkout  ← 🔐 Protected
                         |
                   Not logged in?
                         └── /login  →  "Continue as Guest"
                               └── /checkout  →  Place Order
                                     └── /orders  →  View history
```

---

## 🌐 Deployment

This project is deployed on **Netlify**.

> ⚠️ For React Router to work on Netlify with client-side routing, add a `_redirects` file inside `/public`:

```
/* /index.html 200
```

This tells Netlify to serve `index.html` for all routes instead of returning a 404.

---

## 📡 API Reference

**Base URL:** `https://dummyjson.com`

| Endpoint | Description |
|----------|-------------|
| `GET /products?limit=30` | Fetch product list |
| `GET /products/:id` | Fetch single product by ID |

---

## 🙌 Acknowledgements

- [DummyJSON](https://dummyjson.com) — free fake product API
- [React Router](https://reactrouter.com) — routing library
- [Netlify](https://netlify.com) — free hosting & deployment

---

<div align="center">
  <a href="https://rsgshopzone.netlify.app/">Live Demo</a>
</div>