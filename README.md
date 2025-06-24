# 🚀 Specter Frontend Challenge – Company Feed with Filters

![WakaTime](https://wakatime.com/badge/user/e5861fa7-60ad-4e2e-8d44-eefbc5ee063e/project/0d455a30-af1c-4181-ac13-04abe0811944.svg)

This project implements a modern, responsive company listing interface built as part of the Specter frontend code test. It features an intuitive filter UI, infinite scrolling, smooth animations, and server-driven search capabilities.

---

## 🌐 Live Demo

🔗 [https://specter-code-test.vercel.app/companies](https://specter-code-test.vercel.app/companies)

---

## ✨ Features

- **Modern Filtering & Sorting**
  - Company name/domain search
  - Rank (range slider)
  - Growth stage filters (`seed`, `growing`, etc.)
  - Customer focus (`b2b`, `b2c`, hybrid)
  - Last funding amount & type
  - Sort by name, rank, or funding (asc/desc)

- **Responsive & Accessible UX**
  - Mobile filter drawer
  - Keyboard navigation & reduced motion support
  - Dark mode with Chakra UI theming

- **Smooth UI/UX**
  - Infinite scrolling with React Query
  - Glassmorphic card design
  - Animated number counters and transitions via Framer Motion

- **Performance & SEO**
  - Server-side rendering (SSR) with data hydration
  - URL-synced filters for shareable views
  - Dynamic meta tags for search engine indexing

---

## 🧪 Quick Start

### 1. Install Dependencies

\`\`\`bash
pnpm install
# or
npm install
\`\`\`

### 2. Add `.env` File

\`\`\`env
DATABASE_URL="your-remote-prisma-db-url"
\`\`\`

> For the code test, use the one provided in the challenge instructions.

### 3. Run Locally

\`\`\`bash
pnpm dev
# or
npm run dev
\`\`\`

---

## 🧩 Tech Stack

- **Frontend:** React, Chakra UI, React Router v7, React Query, Framer Motion
- **Backend:** Next.js API Routes with Prisma ORM
- **Database:** Remote PostgreSQL (Neon)
- **Tooling:** TypeScript, ESLint, Prettier, Vite, GitHub Actions

---

## 📸 Previews

| Desktop | Mobile |
|--------|--------|
| ![Desktop](https://github.com/user-attachments/assets/c93bb510-e390-424e-899d-eac984c8195e) | ![Mobile](https://github.com/user-attachments/assets/9ac472d6-1302-40cd-90d2-c8313bad3f00) |

---

## 📽️ UI Highlights

| Feature | Preview |
|--------|---------|
| ✨ Glowing hover cards | ![Card](https://github.com/user-attachments/assets/8be588d1-c67f-4cc3-964b-d33cc2be268c) |
| 🔢 Animated number count-up | ![CountUp](https://github.com/user-attachments/assets/3ecfbdda-b986-4ffa-a7ac-ee829786f05d) |
| 🌀 Smooth scroll transitions | ![Scroll](https://github.com/user-attachments/assets/6c30384f-dfad-45ad-a34b-d9675f693eea) |

---

## 🙋‍♂️ Author

**Ryan Kwan**  
🔗 [Portfolio](https://ryankwan.vercel.app)  
💼 [GitHub](https://github.com/klhong124)  
📬 [LinkedIn](https://www.linkedin.com/in/ryankwandev)

---

## 📜 License

This project is for evaluation purposes only as part of a coding challenge. Please do not use or distribute without permission.
