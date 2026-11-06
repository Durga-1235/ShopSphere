# ShopSphere – Full Stack E-Commerce Application

ShopSphere is a full-stack e-commerce application that allows users to browse products, search products, manage their shopping cart, and explore different categories.

## Features
- Dynamic product listing
- Search and category filtering
- Add and remove cart items
- Update product quantities
- Wishlist functionality
- PostgreSQL database integration
- REST API using FastAPI

## Tech Stack
- **Frontend:** React.js, Vite, Tailwind CSS
- **Backend:** Python, FastAPI
- **Database:** PostgreSQL
- **ORM:** SQLAlchemy

## Project Structure
- `frontend/` – React frontend application
- `backend/` – FastAPI backend application

## Run Locally

### Backend
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install fastapi sqlalchemy psycopg2-binary python-dotenv "uvicorn[standard]"
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Developer
Durga T
