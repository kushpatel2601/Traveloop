# Traveloop 🌍✈️

**Traveloop** is a full-stack, intelligent travel planning application built from scratch. 

It was specifically engineered for the **Odoo Hackathon** with a strict adherence to robust software architecture, avoiding "Backend-as-a-Service" (BaaS) shortcuts like Firebase or Supabase in favor of a true, custom-built relational backend.

## 🏆 Hackathon Architectural Decisions

To align with professional, production-grade engineering standards (and Odoo's technical philosophy):

1. **Custom Backend Architecture:** Instead of using Firebase/Mongo Atlas, the backend is a custom **Node.js/Express** server built from the ground up to ensure complete control over routing, middleware, and business logic.
2. **Relational Database (PostgreSQL):** All data is strictly typed and modeled relationally using **Prisma ORM** connected to a **PostgreSQL** database—the same powerful database engine that powers Odoo's core ERP. 
3. **Vanilla CSS Styling:** The frontend avoids heavy CSS frameworks (like Tailwind or Bootstrap) and instead relies on clean, modern Vanilla CSS variables and flex/grid layouts to demonstrate core frontend proficiency and maintain a highly customized, premium UI.

## 💻 Tech Stack

*   **Frontend:** React (Vite), JavaScript, Vanilla CSS.
*   **Backend:** Node.js, Express.js.
*   **Database:** PostgreSQL (Cloud/Local).
*   **ORM:** Prisma.

## 🚀 Getting Started Locally

### 1. Database Setup
You will need a PostgreSQL connection string. Create a `.env` file inside the `/server` directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/traveloop?schema=public"
```

### 2. Start the Backend
Open a terminal and navigate to the `server` directory:
```bash
cd server
npm install

# Push the Prisma schema to your PostgreSQL database
npx prisma db push

# Start the Express server
npm run dev
# (or `node index.js` depending on your package.json scripts)
```

### 3. Start the Frontend
Open a new terminal and navigate to the root directory:
```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to view the application!

## 📂 Project Structure

*   `/src`: Contains all React components, context providers, and page layouts.
*   `/server`: Contains the Express server logic, API routes, and Prisma schema.
