# Veritech.AI Landing Page — PRD

## Problem Statement
Build a single-page landing for Veritech.AI — a modern AI-Driven Digital Engineering & Technology Solutions company. Brand tone: premium, enterprise, innovative, dark-futuristic. Positioned NOT as an internship company but as a full digital transformation partner.

## Architecture
- Frontend: React (CRA) + Tailwind + Shadcn + framer-motion + react-icons + react-fast-marquee + sonner
- Backend: FastAPI + Motor (MongoDB)
- Theme: Obsidian black (#050505) with single Ember Orange accent (#F55036); Cabinet Grotesk / Manrope / JetBrains Mono

## What's Implemented (Dec 2025)
- 13 sections: Navbar, Hero, Trust (stats + tech marquee), About, Services bento (6), Industries (8), Projects (4), WhyUs (8), Process (5-step timeline), TechStack (5 groups + marquee), Testimonials (auto-scroll dual marquee), Careers, Contact form, Footer + newsletter
- Backend endpoints: GET /api/, GET /api/health, POST /api/contact, GET /api/contact, POST /api/newsletter
- MongoDB collections: contacts, newsletter
- All interactive elements have data-testid

## Backlog (P1/P2)
- AI Chat Assistant widget (deferred)
- Dark/Light theme toggle (deferred)
- Multi-page routes (Services/Projects/Careers/Blog detail pages)
- Calendly + WhatsApp floating button
- Blog system / CMS
- SEO meta tags + schema markup

## Next Tasks
- Run testing_agent_v3 backend + frontend verification
