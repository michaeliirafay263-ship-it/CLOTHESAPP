import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'Classic Linen Short Sleeve Shirt',
    nameSw: 'Shati la Kitani (Linen) Mikono Mifupi',
    category: 'men',
    subcategory: 'Shirts',
    subcategorySw: 'Mashati',
    price: 38000,
    originalPrice: 45000,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1620012253295-c15c429f60bc?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Breathable pure linen shirt engineered for the Dar es Salaam coastal climate. Clean tailored collar with natural mother-of-pearl buttons. Ideal for casual weekends, office wear, or dinner in Masaki.',
    descriptionSw: 'Shati la kitani safi linalopitisha hewa vizuri, linalofaa sana hali ya hewa ya joto ya Dar es Salaam. Kola nadhifu na vifungo imara. Linapendeza kwa wikendi au ofisini.',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Pure White', nameSw: 'Nyeupe Safi', hex: '#ffffff' },
      { name: 'Sky Blue', nameSw: 'Bluu ya Anga', hex: '#93c5fd' },
      { name: 'Sand Beige', nameSw: 'Rangi ya Mchanga', hex: '#d6c7a1' }
    ],
    stock: {
      'S': 5,
      'M': 8,
      'L': 12,
      'XL': 6,
      'XXL': 3
    },
    isFeatured: true,
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 24,
    reviews: [
      {
        id: 'rev-1',
        author: 'Juma Mwamburi',
        location: 'Sinza, Dar es Salaam',
        rating: 5,
        date: '2026-09-10',
        comment: 'Very light material, perfect for Dar humidity. Delivery to Sinza took only 2 hours!',
        commentSw: 'Nguo nyepesi sana, inafaa joto la Dar. Usafirishaji hadi Sinza ulichukua masaa 2 tu!'
      },
      {
        id: 'rev-2',
        author: 'Amani M.',
        location: 'Mikocheni',
        rating: 5,
        date: '2026-09-04',
        comment: 'Exact fit according to the size guide. Great quality linen.',
        commentSw: 'Ilinikaa vizuri kabisa kulingana na vipimo vya size guide.'
      }
    ],
    material: '100% Organic Washed Linen',
    materialSw: '100% Kitani Asilia',
    careInstructions: 'Machine wash cold on gentle cycle. Hang to dry in shade.',
    careInstructionsSw: 'Fua kwa maji ya baridi. Anika kivulini.'
  },
  {
    id: 'prod-002',
    name: 'Floral Bohemian Wrap Maxi Dress',
    nameSw: 'Gauni Refu la Maua (Boho Wrap Dress)',
    category: 'women',
    subcategory: 'Dresses',
    subcategorySw: 'Magauni',
    price: 52000,
    originalPrice: 65000,
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Elegant wrap-around silhouette made from airy chiffon. Features an adjustable waist tie, flattering V-neckline, and flutter sleeves. Perfect for beach brunches, weddings, and Sunday outings.',
    descriptionSw: 'Gauni la kuvutia sana lililotengenezwa kwa kitambaa chepesi cha chiffon. Lina mshipi wa kufunga kulingana na kiuno chako na mikono mizuri ya kipepeo. Linapendeza sana kwenye sherehe au matembezi.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Emerald Floral', nameSw: 'Maua ya Kijani', hex: '#0f766e' },
      { name: 'Terracotta Rust', nameSw: 'Rangi ya Udongo', hex: '#b45309' },
      { name: 'Midnight Navy', nameSw: 'Bluu Nzito', hex: '#1e293b' }
    ],
    stock: {
      'S': 4,
      'M': 9,
      'L': 5,
      'XL': 2
    },
    isFeatured: true,
    isBestSeller: true,
    rating: 4.9,
    reviewCount: 38,
    reviews: [
      {
        id: 'rev-3',
        author: 'Neema Kipande',
        location: 'Masaki, Dar es Salaam',
        rating: 5,
        date: '2026-09-12',
        comment: 'Stunning dress! Wore it to a wedding in Oysterbay and got countless compliments.',
        commentSw: 'Gauni zuri sana! Nilivaa kwenye harusi Oysterbay kila mtu alisifia.'
      }
    ],
    material: 'Premium Breathable Rayon / Chiffon Blend',
    materialSw: 'Mchanganyiko wa Rayon na Chiffon',
    careInstructions: 'Hand wash recommended or gentle machine cycle. Cool iron.',
    careInstructionsSw: 'Osha kwa mikono au mashine taratibu. Pasi ya moto wa wastani.'
  },
  {
    id: 'prod-003',
    name: 'Slim-Fit Chino Pants',
    nameSw: 'Suruali ya Chino (Slim-Fit)',
    category: 'men',
    subcategory: 'Trousers',
    subcategorySw: 'Suruali',
    price: 42000,
    originalPrice: 48000,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Versatile stretch-cotton chinos designed for modern comfort. Structured waistband, reinforced stitching, and a clean tapered leg that pairs seamlessly with sneakers or loafers.',
    descriptionSw: 'Suruali maridadi ya pamba inayovutika kidogo kwa ajili ya urahisi wa kutembea na starehe. Inafaa kuvaa na viatu vya wazi au viatu vya ofisi.',
    sizes: ['30', '32', '34', '36', '38'],
    colors: [
      { name: 'Khaki Stone', nameSw: 'Khaki', hex: '#b0a390' },
      { name: 'Deep Navy', nameSw: 'Bluu ya Bahari', hex: '#1e3a5f' },
      { name: 'Charcoal Grey', nameSw: 'Kijivu Kizito', hex: '#374151' }
    ],
    stock: {
      '30': 6,
      '32': 10,
      '34': 8,
      '36': 4,
      '38': 2
    },
    isFeatured: false,
    isNewArrival: false,
    rating: 4.7,
    reviewCount: 19,
    reviews: [
      {
        id: 'rev-4',
        author: 'Kelvin Mushi',
        location: 'Ubungo, Dar es Salaam',
        rating: 5,
        date: '2026-08-28',
        comment: 'The stretch makes it very comfortable during long work days.',
        commentSw: 'Inavuta kidogo hivyo inanipa uhuru nikiwa kazini kutwa nzima.'
      }
    ],
    material: '98% Combed Cotton, 2% Elastane',
    materialSw: '98% Pamba, 2% Elastane',
    careInstructions: 'Machine wash warm with like colors. Do not bleach.',
    careInstructionsSw: 'Fua na rangi zinazofanana. Usitumie jiki.'
  },
  {
    id: 'prod-004',
    name: 'Modern African Kitenge Print Blazer',
    nameSw: 'Blazer ya Kisasa Yenye Nakshi za Kitenge',
    category: 'women',
    subcategory: 'Jackets & Blazers',
    subcategorySw: 'Makoti na Blazers',
    price: 68000,
    originalPrice: 80000,
    images: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1551803091-e20673f15770?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Statement tailored blazer blending contemporary power-dressing with rich Swahili geometric wax prints. Fully lined with single button front closure and sleek pocket accents.',
    descriptionSw: 'Koti la kisasa la kike lenye mchanganyiko wa vitambaa vya kitenge chenye mvuto wa Kitanzania. Lina kitambaa cha ndani na kifungo kimoja cha mbele. Linakupa muonekano wa kipekee.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Golden Ochre & Black', nameSw: 'Dhahabu na Nyeusi', hex: '#d97706' },
      { name: 'Indigo Wax Pattern', nameSw: 'Indigo na Kijani', hex: '#1d4ed8' }
    ],
    stock: {
      'S': 3,
      'M': 5,
      'L': 4,
      'XL': 1
    },
    isFeatured: true,
    isBestSeller: true,
    rating: 5.0,
    reviewCount: 15,
    reviews: [
      {
        id: 'rev-5',
        author: 'Fatma Al-Harthy',
        location: 'Kariakoo, Dar es Salaam',
        rating: 5,
        date: '2026-09-14',
        comment: 'The tailoring is exceptional! Proudly wearing local modern style.',
        commentSw: 'Mshono ni mzuri sana na wa heshima!'
      }
    ],
    material: 'Structured Cotton Jacquard with African Wax Print Trim',
    materialSw: 'Pamba Imara na Nakshi za Kitenge',
    careInstructions: 'Dry clean or cold gentle hand wash.',
    careInstructionsSw: 'Peleka dry clean au fua kwa mkono taratibu.'
  },
  {
    id: 'prod-005',
    name: 'Kids Safari Adventure Cotton Set',
    nameSw: 'Seti ya Watoto ya Pamba (Safari Adventure)',
    category: 'kids',
    subcategory: 'Kids Wear',
    subcategorySw: 'Nguo za Watoto',
    price: 29000,
    originalPrice: 35000,
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Two-piece matching short-sleeve shirt and elastic-waist shorts for boys and girls. Made of ultra-soft, hypoallergenic cotton that resists tears during active playground play.',
    descriptionSw: 'Seti ya nguo za watoto zenye shati na kaptula yenye mpira laini kiunoni. Pamba laini sana isiyowasha ngozi ya mtoto hata akicheza juani.',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Olive Green', nameSw: 'Kijani ya Mzeituni', hex: '#65a30d' },
      { name: 'Warm Mustard', nameSw: 'Manjano Iliyokoza', hex: '#ca8a04' }
    ],
    stock: {
      'S': 8,
      'M': 10,
      'L': 7
    },
    isFeatured: false,
    isNewArrival: true,
    rating: 4.9,
    reviewCount: 12,
    reviews: [
      {
        id: 'rev-6',
        author: 'Mama Brian',
        location: 'Tegeta, Dar es Salaam',
        rating: 5,
        date: '2026-09-08',
        comment: 'My son loves this set! Easy to wash and doesn’t fade.',
        commentSw: 'Mtoto wangu ameipenda sana! Haifubai hata ukifua mara nyingi.'
      }
    ],
    material: '100% Breathable Soft Organic Cotton',
    materialSw: '100% Pamba Laini ya Asili',
    careInstructions: 'Machine washable, tumble dry low.',
    careInstructionsSw: 'Inafuliwa kwenye mashine, kavusha kwa joto la kawaida.'
  },
  {
    id: 'prod-006',
    name: 'Everyday Minimalist Cotton Polo',
    nameSw: 'Polo Shirt ya Kila Siku ya Pamba',
    category: 'men',
    subcategory: 'Polo Shirts',
    subcategorySw: 'Mashati ya Polo',
    price: 32000,
    images: [
      'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Pique cotton knit polo featuring a rib-knit collar, two-button placket, and subtle split hems. An understated wardrobe staple for work, campus, or casual meetings.',
    descriptionSw: 'Shati la polo la kitambaa kizito cha pique lenye kola imara na vifungo viwili. Linafaa kwa kazi, chuo au mtoko wa kawaida.',
    sizes: ['M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Jet Black', nameSw: 'Nyeusi Ti', hex: '#09090b' },
      { name: 'Olive Green', nameSw: 'Kijani Kijeshi', hex: '#3f6212' },
      { name: 'Maroon Burgundy', nameSw: 'Damu ya Mzee', hex: '#881337' }
    ],
    stock: {
      'M': 7,
      'L': 14,
      'XL': 9,
      'XXL': 4
    },
    isFeatured: false,
    isNewArrival: false,
    rating: 4.6,
    reviewCount: 29,
    reviews: [
      {
        id: 'rev-7',
        author: 'Rashid Selemani',
        location: 'Ilala Boma',
        rating: 5,
        date: '2026-08-30',
        comment: 'Great collar structure, stays firm after washing.',
        commentSw: 'Kola yake imesimama vizuri hailegei baada ya kufuliwa.'
      }
    ],
    material: '100% Ringspun Cotton Pique',
    materialSw: '100% Pamba ya Pique',
    careInstructions: 'Machine wash 30°C. Do not tumble dry.',
    careInstructionsSw: 'Fua kwa maji ya nyuzi 30. Usikavushe kwa joto kali.'
  },
  {
    id: 'prod-007',
    name: 'High-Waist Wide Leg Linen Trousers',
    nameSw: 'Suruali ya Kike ya Kitani (Wide Leg)',
    category: 'women',
    subcategory: 'Trousers',
    subcategorySw: 'Suruali',
    price: 46000,
    originalPrice: 55000,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Chic high-rise trousers with a relaxed wide-leg drape. Elastic back waistband ensures all-day comfort without sacrificing a polished, tailored front profile.',
    descriptionSw: 'Suruali maridadi ya kitani yenye kiuno kirefu na miguu mipana inayoshuka kwa mtindo wa kisasa. Ina mpira laini kwa nyuma unaokupa uhuru wa kukaa na kusimama.',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Cream Ivory', nameSw: 'Rangi ya Maziwa', hex: '#fdfbf7' },
      { name: 'Mocha Tan', nameSw: 'Kahawia Nyepesi', hex: '#a27b5c' },
      { name: 'Sage Green', nameSw: 'Kijani Chenye Utulivu', hex: '#84a98c' }
    ],
    stock: {
      'S': 5,
      'M': 8,
      'L': 6,
      'XL': 2
    },
    isFeatured: true,
    isNewArrival: true,
    rating: 4.8,
    reviewCount: 18,
    reviews: [
      {
        id: 'rev-8',
        author: 'Zainab Ally',
        location: 'Kijitonyama',
        rating: 5,
        date: '2026-09-15',
        comment: 'So flattering and breathable for Dar sunny days!',
        commentSw: 'Inapendeza sana na ni nyepesi kwa jua la Dar!'
      }
    ],
    material: 'Linen-Viscose Blend',
    materialSw: 'Kitani na Viscose',
    careInstructions: 'Gentle hand wash. Iron while slightly damp.',
    careInstructionsSw: 'Osha kwa mikono. Piga pasi ikiwa na unyevu kidogo.'
  },
  {
    id: 'prod-008',
    name: 'Woven Straw Sun Hat & Canvas Tote',
    nameSw: 'Kofia ya Jua ya Asili na Begi la Nguo',
    category: 'accessories',
    subcategory: 'Accessories',
    subcategorySw: 'Vifaa na Urembo',
    price: 25000,
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80'
    ],
    description: 'Handcrafted wide-brim sun hat paired with an organic canvas tote. UV protective and effortlessly stylish for Dar es Salaam coastal lifestyle, Coco Beach walks, and weekend markets.',
    descriptionSw: 'Kofia pana ya kuzuia jua na begi la kitambaa cha pamba lililotengenezwa kwa ufundi safi. Linakinga jua na linapendeza kwa mtoko wa Coco Beach au Kariakoo.',
    sizes: ['Free Size'],
    colors: [
      { name: 'Natural Straw', nameSw: 'Rangi ya Nyasi Asilia', hex: '#e2cb9b' },
      { name: 'Dark Honey', nameSw: 'Asali', hex: '#b38241' }
    ],
    stock: {
      'Free Size': 15
    },
    isFeatured: false,
    isNewArrival: false,
    rating: 4.7,
    reviewCount: 9,
    reviews: [
      {
        id: 'rev-9',
        author: 'Esther Kimaro',
        location: 'Msasani',
        rating: 5,
        date: '2026-08-20',
        comment: 'Great quality, keeps the Dar sun away nicely.',
        commentSw: 'Kofia nzuri inayozuia jua vizuri sana.'
      }
    ],
    material: 'Natural Palm Straw & Heavy Cotton Canvas',
    materialSw: 'Nyasi za Ukindu Asilia na Pamba',
    careInstructions: 'Wipe clean with a damp cloth.',
    careInstructionsSw: 'Futa kwa kitambaa chenye unyevu.'
  }
];

export const INITIAL_PROMO_CODES = [
  {
    code: 'KARIBU10',
    discountPercent: 10,
    description: '10% discount for first-time shoppers in Dar es Salaam',
    isActive: true
  },
  {
    code: 'DARFREE',
    discountAmount: 3000,
    description: 'TZS 3,000 off delivery fee on orders above TZS 50,000',
    minOrderAmount: 50000,
    isActive: true
  }
];
