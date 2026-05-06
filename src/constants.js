/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const ROOMS = [
  {
    id: 'kitchen',
    name: 'Kitchen',
    allowedCategories: ['flooring', 'wall-finish', 'benchtop', 'cabinetry', 'lighting'],
  },
  {
    id: 'bathroom',
    name: 'Bathroom',
    allowedCategories: ['flooring', 'wall-finish', 'benchtop', 'cabinetry', 'lighting'],
  },
  {
    id: 'living-room',
    name: 'Living Room',
    allowedCategories: ['flooring', 'wall-finish', 'sofa', 'table', 'chair', 'lighting'],
  },
  {
    id: 'bedroom',
    name: 'Bedroom',
    allowedCategories: ['flooring', 'wall-finish', 'bed', 'lighting'],
  },
  {
    id: 'laundry',
    name: 'Laundry',
    allowedCategories: ['flooring', 'wall-finish', 'benchtop', 'cabinetry', 'lighting'],
  },
];

export const OPTIONS = {
  flooring: [
    { id: 'f-oak', name: 'White Oak Plank', priceLevel: 'medium', tags: ['natural', 'warm', 'bright'], imageUrl: '/assets/material.svg' },
    { id: 'f-marble', name: 'Carrara Marble Tile', priceLevel: 'high', tags: ['luxury', 'cold', 'bright'], imageUrl: '/assets/material.svg' },
    { id: 'f-vinyl', name: 'Luxury Vinyl (Grey)', priceLevel: 'low', tags: ['durable', 'modern', 'neutral'], imageUrl: '/assets/material.svg' },
    { id: 'f-concrete', name: 'Polished Concrete', priceLevel: 'medium', tags: ['industrial', 'cold', 'dark'], imageUrl: '/assets/material.svg' },
  ],
  'wall-finish': [
    { id: 'w-eggshell', name: 'Eggshell White Paint', priceLevel: 'low', tags: ['neutral', 'bright'], imageUrl: '/assets/material.svg' },
    { id: 'w-slate', name: 'Slate Grey Accent', priceLevel: 'medium', tags: ['dark', 'modern'], imageUrl: '/assets/material.svg' },
    { id: 'w-wallpaper', name: 'Floral Textile Wallpaper', priceLevel: 'high', tags: ['pattern', 'warm'], imageUrl: '/assets/material.svg' },
    { id: 'w-brick', name: 'Exposed Red Brick', priceLevel: 'medium', tags: ['industrial', 'warm', 'dark'], imageUrl: '/assets/material.svg' },
  ],
  benchtop: [
    { id: 'b-quartz', name: 'Engineered Quartz', priceLevel: 'medium', tags: ['minimalist', 'clean'], imageUrl: '/assets/material.svg' },
    { id: 'b-granite', name: 'Black Granite', priceLevel: 'high', tags: ['luxury', 'dark'], imageUrl: '/assets/material.svg' },
    { id: 'b-laminate', name: 'Wood Effect Laminate', priceLevel: 'low', tags: ['warm', 'budget'], imageUrl: '/assets/material.svg' },
  ],
  cabinetry: [
    { id: 'c-shaker', name: 'White Shaker', priceLevel: 'medium', tags: ['classic', 'bright'], imageUrl: '/assets/material.svg' },
    { id: 'c-flat', name: 'Matte Navy Flat Panel', priceLevel: 'medium', tags: ['modern', 'dark'], imageUrl: '/assets/material.svg' },
    { id: 'c-oak', name: 'Raw Honey Oak', priceLevel: 'high', tags: ['natural', 'premium'], imageUrl: '/assets/material.svg' },
  ],
  sofa: [
    { id: 's-velvet', name: 'Green Velvet Sectional', priceLevel: 'high', tags: ['luxury', 'soft'], imageUrl: '/assets/material.svg' },
    { id: 's-linen', name: 'Beige Linen 3-Seater', priceLevel: 'medium', tags: ['neutral', 'airy'], imageUrl: '/assets/material.svg' },
    { id: 's-leather', name: 'Tan Leather Chesterfield', priceLevel: 'high', tags: ['classic', 'vintage'], imageUrl: '/assets/material.svg' },
  ],
  table: [
    { id: 't-walnut', name: 'Solid Walnut Coffee Table', priceLevel: 'high', tags: ['rich', 'heavy'], imageUrl: '/assets/material.svg' },
    { id: 't-glass', name: 'Minimalist Glass Table', priceLevel: 'medium', tags: ['modern', 'light'], imageUrl: '/assets/material.svg' },
    { id: 't-metal', name: 'Industrial Steel Table', priceLevel: 'low', tags: ['raw', 'sturdy'], imageUrl: '/assets/material.svg' },
  ],
  chair: [
    { id: 'ch-eames', name: 'Molded Plastic Side Chair', priceLevel: 'medium', tags: ['mid-century', 'iconic'], imageUrl: '/assets/material.svg' },
    { id: 'ch-wicker', name: 'Boho Wicker Armchair', priceLevel: 'low', tags: ['natural', 'relaxed'], imageUrl: '/assets/material.svg' },
  ],
  bed: [
    { id: 'bd-upholstered', name: 'Tufted Velvet Frame', priceLevel: 'high', tags: ['comfort', 'glam'], imageUrl: '/assets/material.svg' },
    { id: 'bd-platform', name: 'Minimalist Pine Platform', priceLevel: 'low', tags: ['scandi', 'simple'], imageUrl: '/assets/material.svg' },
  ],
  lighting: [
    { id: 'l-pendant', name: 'Brass Globe Pendant', priceLevel: 'medium', tags: ['elegant', 'warm'], imageUrl: '/assets/material.svg' },
    { id: 'l-led', name: 'Recessed LED Strip', priceLevel: 'low', tags: ['modern', 'bright'], imageUrl: '/assets/material.svg' },
    { id: 'l-chandelier', name: 'Crystal Modern Chandelier', priceLevel: 'high', tags: ['luxury', 'bright'], imageUrl: '/assets/material.svg' },
  ],
};
