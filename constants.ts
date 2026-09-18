
import { MenuItem, BurgerOption } from './types';

export const OPTIONS: BurgerOption[] = [
  { id: 'opt1', name: 'Wagyu Upgrade', price: 6.00 },
  { id: 'opt2', name: 'Triple Cheese', price: 2.50 },
  { id: 'opt3', name: 'Candied Bacon', price: 3.00 },
  { id: 'opt4', name: 'Sliced Avocado', price: 2.50 },
  { id: 'opt5', name: 'GF Almond Bun', price: 2.00 },
  { id: 'opt6', name: 'Fried Egg', price: 1.50 }
];

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'b1',
    name: 'The King Pin',
    description: 'Aged wagyu beef patty, double melted gruyère, truffle aioli, and wild arugula on a toasted brioche bun.',
    basePrice: 16.99,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800&h=600',
    category: 'burger',
    addons: [...OPTIONS]
  },
  {
    id: 'b2',
    name: 'Smokehouse BBQ',
    description: 'Prime beef, crispy onion straws, hickory smoked bacon, and our signature bourbon BBQ sauce.',
    basePrice: 15.50,
    image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800&h=600',
    category: 'burger',
    addons: [...OPTIONS]
  },
  {
    id: 'b3',
    name: 'Midnight Blaze',
    description: 'Spicy chorizo-beef blend, pepper jack, charred jalapeños, and ghost pepper mayo for the brave.',
    basePrice: 14.99,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&q=80&w=800&h=600',
    category: 'burger',
    addons: [...OPTIONS]
  },
  {
    id: 'b4',
    name: 'Green Goddess (V)',
    description: 'House-made chickpea & spinach patty, pickled onions, cucumber ribbons, and vegan tahini lemon zest.',
    basePrice: 13.50,
    image: 'https://images.unsplash.com/photo-1512152272829-e3139592d56f?auto=format&fit=crop&q=80&w=800&h=600',
    category: 'burger',
    addons: [...OPTIONS]
  },
  {
    id: 's1',
    name: 'Gold Dust Fries',
    description: 'Triple-cooked hand-cut fries seasoned with smoked paprika and nutritional yeast.',
    basePrice: 6.50,
    image: 'https://images.unsplash.com/photo-1573082833947-300148c67fe3?auto=format&fit=crop&q=80&w=800&h=600',
    category: 'side',
    addons: [
      { id: 's1opt1', name: 'Truffle Mayo', price: 1.50 },
      { id: 's1opt2', name: 'Extra Gold Dust', price: 0.50 }
    ]
  },
  {
    id: 's2',
    name: 'Onion Petals',
    description: 'Sweet Vidalia onions lightly battered and served with a zesty horseradish bloom sauce.',
    basePrice: 7.99,
    image: 'https://images.unsplash.com/photo-1639149888206-3b541c466bc5?auto=format&fit=crop&q=80&w=800&h=600',
    category: 'side',
    addons: [
      { id: 's2opt1', name: 'Extra Sauce', price: 0.75 }
    ]
  }
];
