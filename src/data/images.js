// Image gallery data - with rich metadata from CSV
export const galleryImages = [
  {
    id: 1,
    src: '/images/001.png',
    name: 'Cotton Knitted Throw Blanket',
    color: 'Mustard, Yellow',
    howAcquired: 'Bought',
    from: 'India',
    usedFor: 'Home',
    story: '',
    price: 'Rs.3699',
    link: 'https://pluchi.com/products/kelly-knit-cotton-knitted-all-season-ac-throw-blanket-mustard'
  },
  {
    id: 2,
    src: '/images/002.png',
    name: 'Golden Gate Bridge tower model',
    color: 'Orange',
    howAcquired: 'Bought',
    from: 'USA',
    usedFor: '',
    story: 'Rode across the ggb on bicycles with my partner. had the best day ever in perfect weather. bought it after.',
    price: '$16',
    link: 'https://www.goldengatebridgestore.org/mobile/Product.aspx?ProductCode=O-OTOWR'
  },
  {
    id: 3,
    src: '/images/003.png',
    name: 'Illustrated Everywhere Mug',
    color: 'Multicolor',
    howAcquired: 'Bought',
    from: 'USA',
    usedFor: '',
    story: '',
    price: '$42',
    link: 'https://museumstore.sfmoma.org/products/kristina-micotti-everywhere-mug?variant=42706607472818'
  },
  {
    id: 4,
    src: '/images/004.png',
    name: 'Japanese Pilot Brush Pen',
    color: 'White, Black',
    howAcquired: 'Bought',
    from: 'Japan',
    usedFor: '',
    story: 'Overspent overjoyed in Japan stationery store',
    price: '2000 yen',
    link: ''
  },
  {
    id: 5,
    src: '/images/005.png',
    name: 'Crinkle Stripe Tote',
    color: 'Brown',
    howAcquired: 'Bought',
    from: 'India',
    usedFor: '',
    story: '',
    price: 'Rs. 1999',
    link: 'https://akiiko.com/collections/most-loved/products/crinkle-stripe-tote-espresso'
  },
  {
    id: 6,
    src: '/images/006.png',
    name: 'Faces – Hair Claw Clip',
    color: 'Orange, Multicolor',
    howAcquired: 'Gifted',
    from: 'USA',
    usedFor: '',
    story: 'Walked in SF Moma Design Store with best friend. We both got cute claw clips.',
    price: '$22',
    link: 'https://www.citybirddetroit.com/products/carolyn-suzuki-hair-claw'
  },
  {
    id: 7,
    src: '/images/007.png',
    name: 'DIY Japan Architecture Models',
    color: 'Brown',
    howAcquired: 'Bought',
    from: 'Japan',
    usedFor: '',
    story: 'Time in Nara',
    price: '3000 yen',
    link: 'https://shibuya-stationery.com/collections/diy-models/products/pusu-pusu-kyoto-diy-models'
  },
  {
    id: 8,
    src: '/images/008.png',
    name: 'Matcha cap',
    color: 'Green',
    howAcquired: 'Bought',
    from: 'USA',
    usedFor: '',
    story: '',
    price: '$34',
    link: 'https://museumstore.sfmoma.org/products/hat-matcha-baseball-cap?variant=45672870707378'
  },
  {
    id: 9,
    src: '/images/009.png',
    name: 'Concrete tabletop fire burner',
    color: 'Grey',
    howAcquired: 'Gifted',
    from: 'India',
    usedFor: 'Home',
    story: '',
    price: 'Rs.2499',
    link: 'https://www.calmbyfire.com/products/kronos-rectangular-fireplace'
  },
  {
    id: 10,
    src: '/images/010.png',
    name: 'Floral cotton socks',
    color: 'Green',
    howAcquired: '',
    from: 'India',
    usedFor: '',
    story: '',
    price: 'Rs.799',
    link: 'https://urbansocks.in/products/cute-flower-edition-women-socks'
  },
  {
    id: 11,
    src: '/images/11.png',
    name: 'Brass decorative boat',
    color: 'Gold',
    howAcquired: 'Gifted',
    from: 'India',
    usedFor: '',
    story: 'Got it as a farewell gift from a close colleague and friend. Was accompanied with a cute note. sits on my tv cabinet now.',
    price: 'Rs.1350',
    link: 'https://www.nicobar.com/products/boat-origami'
  },
  {
    id: 12,
    src: '/images/12.png',
    name: 'Lollia Elegance shea butter hand cream',
    color: 'Grey, White',
    howAcquired: 'Bought',
    from: 'USA',
    usedFor: '',
    story: 'Actually was buying a few for family. Ended up liking the fragrance and kept one of them for myself.',
    price: '$9',
    link: 'https://margotelena.com/products/elegance-shea-butter-handcreme'
  },
  {
    id: 13,
    src: '/images/13.png',
    name: 'Indigo ceramic bud vase',
    color: 'Blue',
    howAcquired: 'Bought',
    from: 'India',
    usedFor: '',
    story: 'Find it hard to keep plants alive. thought a mini one-stem flower is doable. mini test to learn',
    price: 'Rs.280',
    link: 'https://www.fabindia.com/indigo-guldan-ceramic-cut-bud-vase-20105136'
  },
  {
    id: 14,
    src: '/images/14.png',
    name: 'Adidas Gazelle sneakers',
    color: 'Green',
    howAcquired: 'Gifted',
    from: 'France',
    usedFor: '',
    story: 'Gifted by my brother from his Paris trip',
    price: '€72',
    link: 'https://www.adidas.fr/chaussure-gazelle-indoor/JS1396.html'
  },
  {
    id: 15,
    src: '/images/15.png',
    name: 'Kulhar glasses set',
    color: 'Green, Beige',
    howAcquired: 'Gifted',
    from: 'India',
    usedFor: '',
    story: 'Friend gifted me just like that. she knows i love chai. no special occasion also.',
    price: 'Rs.2100',
    link: 'https://www.nicobar.com/products/galle-kulhar-set-of-4-1'
  },
  // Remaining images without metadata yet
  ...Array.from({ length: 35 }, (_, i) => {
    const id = i + 16;
    return {
      id,
      src: `/images/${id}.png`,
      name: '',
      color: '',
      howAcquired: '',
      from: '',
      usedFor: '',
      story: '',
      price: '',
      link: ''
    };
  })
];

export const categories = [
  'All',
  'Bought',
  'Gifted'
];
