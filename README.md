Aura-Mosaic 🛍️

Modern MERN e-commerce with AI assistance, reviews, and clean UX.

Overview

Aura-Mosaic is a full-stack store built with React (Vite/CRA) on the frontend and Node.js + Express + MongoDB on the backend. It supports browsing products by category, powerful search & filters, cart and wishlist (gated to signed-in users), order history, ratings & reviews, and an AI assistant (chat, recommendations, gifting bundles, and product comparison). Authentication uses JWT (with logout via blacklist) and optional Google Sign-In.

Features
Storefront

Home page with banners, best sellers, and new products

Category & subcategory browsing, product detail with zoom, related/recommended items

Cart and Wishlist (persisted in localStorage but gated until login)

Ratings & Reviews (add / delete by the owner; live aggregate update)

“Gifting Studio” (AI suggests single/pair/bundle gifts by quick inputs)

Beautiful SweetAlert pop-ups for add-to-cart, wishlist, compare, etc.

Theme toggle (green/pink), animated brand, floating Home button

Search & Listings

Category by name or id

Powerful /search with brands, price range, rating, in-stock filter, sorting, pagination

AI (server-side)

/api/ai/chat – intentful search responses + product blocks

/api/ai/recommend – structured recommendations by taste (categories, brands, min rating, budget)

/api/ai/gift – builds 1–3 item gift bundles

/api/ai/compare – compares current product vs. others (same/other brands) using description + rating and returns a short summary

Auth & Users

Email/JWT auth with /auth/me, /auth/logout

Google Sign-In (frontend sends Google credential to /auth/google)

Logout uses a token blacklist (server rejects blacklisted JWTs)

Orders & History

Create order, view order/transaction history

“Spent” summary in header after purchase

Tech Stack

Frontend: React, React Router, MUI (Rating, Menu), SweetAlert2, Swiper, Bootstrap utilities

Backend: Node.js, Express, Mongoose (MongoDB)

AI: Hugging Face Inference API (Falcon-7B-Instruct)

Media: Cloudinary (image hosting)

Auth: JWT, Google Identity (via /auth/google)

Project Structure
Backend (/backend)
models/                 # Mongoose schemas (Product, Category, Review, User, etc.)
routes/
  products.js           # CRUD, search, related, featured, reviews
  category.js           # Categories & subcategories
  ai.js                 # chat / recommend / gift / compare
  auth.js               # login, Google login, /auth/me, /auth/logout
  users.js              # profile updates
  orders.js             # create/list orders
  transactions.js       # list transactions
cities.js               # demo city list (used by CityDropdown)
utils/
  tokenBlacklist.js     # in-memory blacklist for signed-out JWTs
app.js                  # Express app, CORS, body-parser, route mounting, DB connect

Frontend (/frontend/src)
api/api.js              # Axios clients: API(:4000) + AUTH(:5000), endpoints incl. AI & reviews
components/
  Header/               # Logo, animated brand, search, user menu, icons, Navigation
  Navigation/           # Category menu + quick links
  ProductZoom/, QuantityBox/, ProductItem/, ProductModal/
  HomeBanner/, HomeCat/, ChatBot/
pages/
  Home/, Listing/, ProductListing/, ProductDetails/
  Cart/, Wishlist/, History/, Auth/, SignIn/, CompleteProfile/
  Gifting/, About/, Contact/, OrderConfirmation/
App.js                  # Routes, global context (user, cart, wishlist), guards, FAB Home
App.css                 # Global styles (themes, rails, buttons, animations)

API Summary (selected)
Products

GET /api/products – all (category populated)

GET /api/products/:id – single

GET /api/products/byCategoryName/:name – by category name

GET /api/products/getByCategory/:categoryId – by category id

GET /api/products/get/featured/:count – featured

GET /api/products/related/:categoryId/:excludeId – related

GET /api/products/search – filters: categoryName, brands, minPrice, maxPrice, minRating, inStock, sort, page, limit

Reviews (auth required for write)

GET /api/products/:id/reviews – list + aggregates

POST /api/products/:id/reviews – body: { rating, comment }

DELETE /api/products/:id/reviews/:reviewId

Categories

GET /api/category – list

GET /api/category/:id – single

AI

POST /api/ai/chat – { message } → blocks (text/products/chips)

POST /api/ai/recommend – { taste: { categories, brands, minRating, budget } }

POST /api/ai/gift – { gender, relation, bundleSize, budgetMax }

POST /api/ai/compare – { productId } → { summary, betterPick, runnersUp }

Auth / Users (AUTH server)

POST /api/auth/google – { credential } (ID token)

GET /api/auth/me – bearer JWT

POST /api/auth/logout – blacklist current token

PATCH /api/users/me – update profile

Orders / Transactions (AUTH server)

POST /api/orders

GET /api/orders/my

GET /api/transactions/my

Environment Variables

Create /backend/.env:

# Server
PORT=4000
AUTH_PORT=5000

# Mongo
CONNECTION_STRING=mongodb://localhost:27017/aura

# JWT
JWT_SECRET=super-secret-string

# Cloudinary
cloudinary_Config_Cloud_Name=your_cloud_name
cloudinary_Config_api_key=your_api_key
cloudinary_Config_api_secret=your_api_secret

# Hugging Face (AI)
HF_API_KEY=hf_xxx_your_token


If you enabled Google login in the backend:

GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret


Frontend uses the base URLs http://localhost:4000/api and http://localhost:5000/api.
The backend (app.js) intentionally listens on both ports so /auth/* can be called at 5000.

Getting Started
1) Clone & Install
git clone https://github.com/yourname/aura-mosaic.git
cd aura-mosaic

# Backend
cd backend
npm install
# Start server(s) on :4000 (plus mirror :5000 per app.js)
npm start   # or: npm run dev   (if you added nodemon)

# Frontend
cd ../frontend
npm install
npm start   # or: npm run dev (Vite)

2) Seed Data (optional)

Insert a few Categories and Products in MongoDB (via Compass or a small seed script) so the home & listings have content.

3) (Optional) Google Sign-In

Create an OAuth Client in Google Cloud → Web, add http://localhost:3000 (or Vite port) as origin. Put client ID/secret in backend .env. Frontend posts Google credential to /api/auth/google.

How the AI Works (short)

Frontend calls our Express AI routes.

The server reads products/categories from MongoDB, ranks/filters them based on your query (budget, category/brand hints, rating).

For comparison (/ai/compare) it compiles short facts (price, rating, key words from description) and uses a light LLM call (Hugging Face Falcon-7B-Instruct) to write a brief, friendly summary and clear pick.

That summary is returned to the frontend and shown in a SweetAlert with a polished layout.

Auth Flow (short)

On login/Google login the server issues a JWT saved in localStorage.

Protected actions (wishlist, reviews, orders) send Authorization: Bearer <token>.

Logout adds the token to a server-side blacklist (utils/tokenBlacklist.js). Subsequent requests with that token are rejected.

Common Pitfalls / Troubleshooting

Mongo not running → Start mongod.

CORS → Server enables CORS; ensure front/back URLs match.

Ports busy → Change PORT/AUTH_PORT in .env.

Gifting page “keeps refreshing” → Usually caused by a useEffect re-render loop or navigation on missing user. Ensure its effects have correct dependency arrays and you’re signed in.

Cloudinary upload fails → Verify cloud name/key/secret.

Contributing

PRs welcome! Please open an issue first for major changes. Keep codelinting consistent and prefer small, focused commits.

License

Choose your license (e.g., MIT). Add a LICENSE file if you plan to open-source.

Screenshots (optional)

Add images to /frontend/src/assets/screens/ and reference them here:

![Home](screens/home.png)
![Product Details](screens/product.png)
![Gifting](screens/gifting.png)

Credits

Built with ❤️ using React, Express, MongoDB, and a sprinkle of AI.
