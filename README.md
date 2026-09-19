# Online Ordering Platform Interface

## Overview

This is a React online ordering platform interface that could also be used as a template for any online store. Customers can browse and filter a menu, customize menu items with upgrades, manage a cart, apply a promotional code, and place a pickup or delivery order. An admin dashboard lets a shop owner review local order data and manage products, categories, promotions, payment settings, and shop content. 

This version is a frontend prototype with browser-local persistence. A production version would add a backend API, authentication, and a database such as Firebase Firestore, as well as integrate payment methods such as Stripe. As such, certain features shown are simply demos and not functional (i.e. user login, user profile, protected routes such as for the admin dashboard, etc) 

The project stores demo data in the browser's `localStorage`, so it works without a backend or an API key. Clearing browser site data resets the demo.

## How to run

Prerequisite: Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open the URL printed by Vite. This project uses `http://localhost:3000` by default.

To create a production build, run:

```bash
npm run build
```

## My contribution

This was originally a project for my not-exactly-legal burger business I started in my high school dorm kitchen. While I was running the business, we were utilizing Whatsapp's online store website take.app. However, the store requires a monthly payment, and as I am no longer able to manage the business but my underclassmen are still running it, I wanted to build a free online website for them to use. As I am not a CS student with 10 years of coding experience ever since they were able to walk, I followed Youtube videos such as Corbin's AI app building tutorial to build the this frontend prototype using google ai studio and cursor. I later started to integrate Firebase as well to actually complete the website, however, due to Firebase's need for a subscription as well as my underclassmen ending the business to prepare for their exams, the backend and database remained unfinished.

## What I learned

Even though I used AI tools to help build this project, I learned a lot about the development process and how projects are structured at a broader, systems-level scale. I learned that a website is often built by combining existing libraries, services, and open-source tools—such as Lucide for icons, online libraries for photos, or Stripe for payment - to achieve the specific goals of a project, and not needing to code everything from scratch.

## References

- Built with [React](https://react.dev/) and [Vite](https://vite.dev/).
- Icons are from [Lucide](https://lucide.dev/).
- Menu photography uses links from [Unsplash](https://unsplash.com/).
