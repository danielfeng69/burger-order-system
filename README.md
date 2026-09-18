# Buns Out - Burger Ordering Interface

## Overview

Buns Out is a React burger-ordering interface. Customers can browse and filter a menu, customize menu items with upgrades, manage a cart, apply a promotional code, and place a pickup or delivery order. An admin dashboard lets a shop owner review local order data and manage products, categories, promotions, payment settings, and shop content.

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

Before submitting, replace this paragraph with an accurate description of what you personally built or changed. You can refer to the customer ordering flow, reusable menu and customization components, cart and checkout state, category filtering, promotion-code validation, localStorage persistence, or admin dashboard only if those are your own contributions.

## What I learned

Before submitting, replace this paragraph with one real challenge you encountered and how you approached it. For example, if it reflects your work, you might discuss keeping shared data consistent across customer and admin views by lifting state into the main React component, passing data and update functions through props, and persisting changes with `localStorage`.

## References

- Built with [React](https://react.dev/) and [Vite](https://vite.dev/).
- Icons are from [Lucide](https://lucide.dev/).
- Menu photography uses links from [Unsplash](https://unsplash.com/).

If you used a starter project, tutorial, or other resources while extending this project, add them to this list before submitting.
