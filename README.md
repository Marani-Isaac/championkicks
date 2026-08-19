# Champion Kicks Frontend

React storefront + admin UI for
[`championkicks_backend`](../OneDrive/Desktop/Nuvemite%20Tech%20Company/championkicks_backend)
at `http://localhost:5000/api`.

## Stack

- HTML5 · React (Vite) · JavaScript · Tailwind CSS · Bootstrap / React-Bootstrap · Axios

## Quick start

```bash
# Terminal 1 — backend
cd "C:\Users\HP\OneDrive\Desktop\Nuvemite Tech Company\championkicks_backend"
venv\Scripts\activate
python run.py

# Terminal 2 — frontend
cd C:\Users\HP\Downloads\championkicks_frontend
npm install
npm run dev
```

Frontend: `http://localhost:5173`  
Backend health: `http://localhost:5000/health`

## API mapping (actual backend)

All writes use **multipart/form-data**.

| Frontend action | Backend route |
|-----------------|---------------|
| Sign up | `POST /api/signup` |
| Login | `POST /api/login` |
| List products | `GET /api/get_products` |
| Add product | `POST /api/add_product` |
| Place order | `POST /api/add_order` (`product_id`, `quantity`) |
| List orders | `GET /api/get_orders` |
| Record payment | `POST /api/add_payment` |
| List payments | `GET /api/get_payments` |
| Add testimonial | `POST /api/add_testimonial` |
| List testimonials | `GET /api/get_testimonials` |
| M-Pesa STK | `POST /api/mpesa_payment` |

Product images resolve to `http://localhost:5000/static/images/<filename>`.

## Env

```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Notes

- Backend has **no JWT** — session is stored locally after login (`ck_user`).
- Backend has **no delete-product** route — admin lists products but cannot delete via API.
- Admin panel is available to any signed-in user (no `role` column on users).
