<div align="center">
  <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=800&auto=format&fit=crop" alt="Traveloop Banner" style="width: 100%; max-height: 250px; object-fit: cover; border-radius: 16px; margin-bottom: 20px;" />
  
  <h1>🌍 Traveloop</h1>
  <p><strong>A Next-Generation Travel OS & Itinerary Planner</strong></p>

  <p>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" /></a>
    <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" /></a>
    <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" /></a>
    <a href="https://vercel.com/"><img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" /></a>
  </p>
  
  <p>
    <b>Built exclusively for the Odoo x Parul University Hackathon</b>
  </p>
  
  <h3>🚀 <a href="https://traveloop-three.vercel.app/">View Live Demo</a> 🚀</h3>
</div>

<br />

## ✨ About Traveloop

**Traveloop** is a full-stack, intelligent travel planning application built from scratch to provide a seamless, premium, "glassmorphism" user experience. It empowers users to map out their dream vacations, track budgets dynamically, organize packing lists, and share their itineraries with a global community of travelers.

## 🏆 Hackathon Architectural Decisions

To align with professional, production-grade engineering standards and Odoo's technical philosophy:

1. **Custom Backend Architecture:** Instead of relying on Backend-as-a-Service (BaaS) platforms like Firebase, the backend is a custom **Node.js/Express** server, ensuring complete control over data flow and business logic.
2. **Relational Database Model:** All data is strictly typed and modeled relationally using **Prisma ORM** connected to a Database—reflecting the powerful database engines that drive enterprise software like Odoo.
3. **Pure Vanilla CSS:** The frontend avoids heavy CSS frameworks (like Tailwind or Bootstrap), relying entirely on clean, modern **Vanilla CSS variables** and grid/flex layouts to achieve a highly customized, robust premium UI.
4. **Resilient Authentication:** Implements a hybrid authentication model with seamless Google OAuth and custom JWT strategies, ensuring zero-downtime access even during high-traffic hackathon judging.

## 🌟 Key Features

*   🗺️ **Interactive Itinerary Builder:** Drag-and-drop daily schedules with integrated mapping.
*   💰 **Dynamic Budget Tracker:** Visual cost breakdowns (flights, lodging, food) with real-time total calculations.
*   🎒 **Smart Packing Checklist:** Categorized packing lists (Documents, Electronics, Clothing) with progress bars.
*   👥 **Community Feed:** Browse, like, and get inspired by itineraries published by other "neighbours" on the platform.
*   📱 **100% Mobile Responsive:** A flawless UI on desktops, tablets, and smartphones.

## 💻 Tech Stack

*   **Frontend:** React (Vite), JavaScript, Vanilla CSS, Lucide React (Icons).
*   **Backend:** Node.js, Express.js.
*   **Database ORM:** Prisma.
*   **Deployment:** Vercel (Frontend & SPA Routing Configured).

## 🚀 Getting Started Locally

### 1. Database Setup
You will need a database connection string. Create a `.env` file inside the `/server` directory:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/traveloop?schema=public"
```

### 2. Start the Backend
Open a terminal and navigate to the `server` directory:
```bash
cd server
npm install

# Push the Prisma schema to your database
npx prisma db push

# Start the Express server
npm run dev
```

### 3. Start the Frontend
Open a new terminal and navigate to the root directory:
```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to view the application!

## 📂 Project Structure

*   `/src`: Contains all React components, context providers, state management, and page layouts.
*   `/server`: Contains the Express server logic, API routes, authentication controllers, and Prisma schema.

<br />
<div align="center">
  <i>Designed & Developed for the Odoo x Parul Hackathon.</i>
</div>
