# Impression — storefront (React + Vite)

Customer storefront for the e-commerce backend. Plain React + Vite + React
Router + axios (no Tailwind/UI-kit — one hand-written stylesheet), so it's light
to install and easy to change.

## Run it

```bash
npm install
cp .env.example .env      # optional for dev (see below)
npm run dev               # http://localhost:5173
```

Make sure your **backend is running** (default `http://localhost:3000`).

### How it talks to the backend
In dev, Vite proxies `/api` → your backend (`vite.config.js`), so the frontend
is same-origin with the API and the httpOnly refresh cookie just works — no CORS
setup needed. If your backend runs elsewhere:
```
VITE_PROXY_TARGET=http://localhost:4000   # in .env
```

For production (frontend and backend on different hosts), point straight at it:
```
VITE_API_URL=https://ecommerce-backend-td71.onrender.com/api
```

## What's included
- **Auth** — register, login, logout. Access token kept in memory; on reload the
  session is revived from the refresh cookie (`POST /auth/refresh` → `/auth/me`).
  A 401 auto-refreshes and retries the request once.
- **Shop** — product grid with search, category filter, sort, pagination.
- **Product page** — images, specs, discount pricing, add to cart.
- **Cart** — quantity changes, remove, coupon apply/remove, live totals.
- **Checkout** — shipping address, COD or **Razorpay** (create-order → Checkout
  popup → verify), then the order confirmation.
- **Orders** — list + detail with payment/order status.

## Project layout
```
src/
  api/client.js          axios instance + bearer/refresh interceptor
  context/AuthContext     session state
  context/CartContext     server cart state
  components/             Navbar, ProductCard, ProtectedRoute, Loader, Toast
  pages/                  Home, ProductDetail, Cart, Checkout, Login,
                          Register, Orders, OrderDetail, NotFound
  utils/pricing.js        selling price + ₹ formatting (mirrors backend)
  utils/razorpay.js       Checkout script loader
  index.css               the whole design system
```

## Notes
- **Payments need real Razorpay test keys** set on the backend (`RAZORPAY_KEY_ID`
  / `RAZORPAY_KEY_SECRET`) for the Checkout popup to open with a real order.
- **Cross-site cookies in production:** the backend sets the refresh cookie with
  `sameSite: "strict"`. If you host the frontend and backend on different
  domains, that cookie won't be sent — you'd switch the backend cookie to
  `sameSite: "none"` + `secure: true`, or serve both behind one domain.
- **Admin UI is not included** — this is the customer storefront. Product/order
  admin is done via the API (Postman) or a future admin panel.
```
