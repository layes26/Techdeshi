// Mock product database for TechDeshi
const PRODUCTS_DATABASE = [
  {
    id: 'ssd-980-pro-1tb',
    name: 'Samsung 980 Pro 1TB NVMe SSD',
    category: 'Storage',
    brand: 'Samsung',
    image: 'https://via.placeholder.com/300x300/1e293b/818cf8?text=Samsung+980+Pro',
    specs: ['PCIe 4.0', '7000 MB/s Read', '5000 MB/s Write', '1TB Capacity'],
    sellers: [
      { name: 'Ryans Computers', price: 12500, shipping: 0, inStock: true, rating: 4.8, url: '#' },
      { name: 'Star Tech', price: 12800, shipping: 60, inStock: true, rating: 4.7, url: '#' },
      { name: 'Tech Land BD', price: 12350, shipping: 100, inStock: true, rating: 4.6, url: '#' },
      { name: 'Pickaboo', price: 13200, shipping: 0, inStock: false, rating: 4.5, url: '#' },
      { name: 'Computer Village', price: 12650, shipping: 80, inStock: true, rating: 4.7, url: '#' }
    ]
  },
  {
    id: 'ram-corsair-16gb',
    name: 'Corsair Vengeance RGB Pro 16GB (8GBx2) DDR4 RAM',
    category: 'RAM',
    brand: 'Corsair',
    image: 'https://via.placeholder.com/300x300/1e293b/10b981?text=Corsair+RAM',
    specs: ['DDR4', '3200MHz', 'RGB Lighting', '16GB (8GBx2)'],
    sellers: [
      { name: 'Ryans Computers', price: 8500, shipping: 0, inStock: true, rating: 4.8, url: '#' },
      { name: 'Star Tech', price: 8800, shipping: 60, inStock: true, rating: 4.7, url: '#' },
      { name: 'Ultra Technology', price: 8350, shipping: 50, inStock: true, rating: 4.6, url: '#' },
      { name: 'Global Brand', price: 8900, shipping: 0, inStock: true, rating: 4.5, url: '#' }
    ]
  },
  {
    id: 'gpu-rtx-4060',
    name: 'ASUS Dual GeForce RTX 4060 OC Edition 8GB',
    category: 'Graphics Card',
    brand: 'ASUS',
    image: 'https://via.placeholder.com/300x300/1e293b/f59e0b?text=RTX+4060',
    specs: ['8GB GDDR6', 'DLSS 3', 'Ray Tracing', 'Boost 2535MHz'],
    sellers: [
      { name: 'Ryans Computers', price: 42500, shipping: 0, inStock: true, rating: 4.8, url: '#' },
      { name: 'Star Tech', price: 43000, shipping: 100, inStock: true, rating: 4.7, url: '#' },
      { name: 'Tech Land BD', price: 42200, shipping: 120, inStock: false, rating: 4.6, url: '#' },
      { name: 'IT Mania', price: 43500, shipping: 0, inStock: true, rating: 4.4, url: '#' }
    ]
  },
  {
    id: 'ssd-crucial-p5-1tb',
    name: 'Crucial P5 Plus 1TB Gen4 NVMe SSD',
    category: 'Storage',
    brand: 'Crucial',
    image: 'https://via.placeholder.com/300x300/1e293b/818cf8?text=Crucial+P5',
    specs: ['PCIe 4.0', '6600 MB/s Read', '5000 MB/s Write', '1TB Capacity'],
    sellers: [
      { name: 'Ryans Computers', price: 10500, shipping: 0, inStock: true, rating: 4.8, url: '#' },
      { name: 'Star Tech', price: 10800, shipping: 60, inStock: true, rating: 4.7, url: '#' },
      { name: 'Computer Village', price: 10350, shipping: 80, inStock: true, rating: 4.7, url: '#' },
      { name: 'Laptop BD', price: 11000, shipping: 0, inStock: true, rating: 4.3, url: '#' }
    ]
  },
  {
    id: 'ram-gskill-32gb',
    name: 'G.Skill Trident Z RGB 32GB (16GBx2) DDR4 RAM',
    category: 'RAM',
    brand: 'G.Skill',
    image: 'https://via.placeholder.com/300x300/1e293b/10b981?text=G.Skill+RAM',
    specs: ['DDR4', '3600MHz', 'RGB Lighting', '32GB (16GBx2)'],
    sellers: [
      { name: 'Ryans Computers', price: 15500, shipping: 0, inStock: true, rating: 4.8, url: '#' },
      { name: 'Star Tech', price: 15900, shipping: 60, inStock: true, rating: 4.7, url: '#' },
      { name: 'Ultra Technology', price: 15300, shipping: 50, inStock: true, rating: 4.6, url: '#' }
    ]
  },
  {
    id: 'monitor-lg-27',
    name: 'LG UltraGear 27GN750-B 27" 240Hz Gaming Monitor',
    category: 'Monitor',
    brand: 'LG',
    image: 'https://via.placeholder.com/300x300/1e293b/06b6d4?text=LG+Monitor',
    specs: ['27 inch', '1080p', '240Hz', 'IPS Panel', '1ms Response'],
    sellers: [
      { name: 'Ryans Computers', price: 35500, shipping: 150, inStock: true, rating: 4.8, url: '#' },
      { name: 'Pickaboo', price: 36000, shipping: 0, inStock: true, rating: 4.5, url: '#' },
      { name: 'Star Tech', price: 35200, shipping: 200, inStock: true, rating: 4.7, url: '#' }
    ]
  },
  {
    id: 'laptop-asus-tuf',
    name: 'ASUS TUF Gaming A15 Ryzen 7 RTX 4060',
    category: 'Laptop',
    brand: 'ASUS',
    image: 'https://via.placeholder.com/300x300/1e293b/f59e0b?text=ASUS+TUF',
    specs: ['Ryzen 7 7735HS', 'RTX 4060', '16GB RAM', '512GB SSD', '15.6" 144Hz'],
    sellers: [
      { name: 'Ryans Computers', price: 125000, shipping: 0, inStock: true, rating: 4.8, url: '#' },
      { name: 'Star Tech', price: 127000, shipping: 0, inStock: true, rating: 4.7, url: '#' },
      { name: 'Laptop BD', price: 124500, shipping: 200, inStock: true, rating: 4.3, url: '#' },
      { name: 'Pickaboo', price: 129000, shipping: 0, inStock: false, rating: 4.5, url: '#' }
    ]
  },
  {
    id: 'gpu-rx-7600',
    name: 'MSI Radeon RX 7600 MECH 2X 8GB Graphics Card',
    category: 'Graphics Card',
    brand: 'MSI',
    image: 'https://via.placeholder.com/300x300/1e293b/ef4444?text=RX+7600',
    specs: ['8GB GDDR6', 'FSR 3', 'Ray Tracing', 'Boost 2655MHz'],
    sellers: [
      { name: 'Ryans Computers', price: 38500, shipping: 0, inStock: true, rating: 4.8, url: '#' },
      { name: 'Star Tech', price: 39000, shipping: 100, inStock: true, rating: 4.7, url: '#' },
      { name: 'Tech Land BD', price: 38200, shipping: 120, inStock: true, rating: 4.6, url: '#' }
    ]
  },
  {
    id: 'ram-kingston-8gb',
    name: 'Kingston Fury Beast 8GB DDR4 RAM',
    category: 'RAM',
    brand: 'Kingston',
    image: 'https://via.placeholder.com/300x300/1e293b/10b981?text=Kingston+RAM',
    specs: ['DDR4', '3200MHz', 'Single Stick', '8GB'],
    sellers: [
      { name: 'Ryans Computers', price: 2800, shipping: 0, inStock: true, rating: 4.8, url: '#' },
      { name: 'Star Tech', price: 2900, shipping: 60, inStock: true, rating: 4.7, url: '#' },
      { name: 'Computer Village', price: 2750, shipping: 50, inStock: true, rating: 4.7, url: '#' },
      { name: 'Ultra Technology', price: 2850, shipping: 40, inStock: true, rating: 4.6, url: '#' }
    ]
  },
  {
    id: 'ssd-wd-black-2tb',
    name: 'WD Black SN850X 2TB Gen4 NVMe SSD',
    category: 'Storage',
    brand: 'WD',
    image: 'https://via.placeholder.com/300x300/1e293b/818cf8?text=WD+Black',
    specs: ['PCIe 4.0', '7300 MB/s Read', '6600 MB/s Write', '2TB Capacity'],
    sellers: [
      { name: 'Ryans Computers', price: 22500, shipping: 0, inStock: true, rating: 4.8, url: '#' },
      { name: 'Star Tech', price: 23000, shipping: 60, inStock: true, rating: 4.7, url: '#' },
      { name: 'Tech Land BD', price: 22200, shipping: 100, inStock: false, rating: 4.6, url: '#' }
    ]
  },
  {
    id: 'monitor-asus-rog',
    name: 'ASUS ROG Strix 24" 165Hz Gaming Monitor',
    category: 'Monitor',
    brand: 'ASUS',
    image: 'https://via.placeholder.com/300x300/1e293b/06b6d4?text=ASUS+ROG',
    specs: ['24 inch', '1080p', '165Hz', 'IPS Panel', '1ms Response'],
    sellers: [
      { name: 'Ryans Computers', price: 28500, shipping: 150, inStock: true, rating: 4.8, url: '#' },
      { name: 'Star Tech', price: 29000, shipping: 200, inStock: true, rating: 4.7, url: '#' },
      { name: 'IT Mania', price: 28200, shipping: 100, inStock: true, rating: 4.4, url: '#' }
    ]
  },
  {
    id: 'laptop-lenovo-legion',
    name: 'Lenovo Legion 5 Pro Ryzen 7 RTX 4070',
    category: 'Laptop',
    brand: 'Lenovo',
    image: 'https://via.placeholder.com/300x300/1e293b/f59e0b?text=Legion+5',
    specs: ['Ryzen 7 7745HX', 'RTX 4070', '16GB RAM', '1TB SSD', '16" 165Hz'],
    sellers: [
      { name: 'Ryans Computers', price: 185000, shipping: 0, inStock: true, rating: 4.8, url: '#' },
      { name: 'Star Tech', price: 188000, shipping: 0, inStock: true, rating: 4.7, url: '#' },
      { name: 'Laptop BD', price: 183500, shipping: 300, inStock: false, rating: 4.3, url: '#' }
    ]
  }
];

// Popular search keywords
const POPULAR_SEARCHES = [
  '980 Pro SSD',
  'RTX 4060',
  'Corsair RAM 16GB',
  'Gaming Monitor',
  'ASUS TUF Laptop',
  'RX 7600',
  'DDR4 RAM 8GB'
];

// Get all unique brands
function getAllBrands() {
  const brands = new Set();
  PRODUCTS_DATABASE.forEach(product => {
    brands.add(product.brand);
  });
  return Array.from(brands).sort();
}

// Get all unique categories
function getAllCategories() {
  const categories = new Set();
  PRODUCTS_DATABASE.forEach(product => {
    categories.add(product.category);
  });
  return Array.from(categories).sort();
}

// Get price range
function getPriceRange() {
  let min = Infinity;
  let max = 0;
  
  PRODUCTS_DATABASE.forEach(product => {
    product.sellers.forEach(seller => {
      if (seller.price < min) min = seller.price;
      if (seller.price > max) max = seller.price;
    });
  });
  
  return { min: Math.floor(min / 1000) * 1000, max: Math.ceil(max / 1000) * 1000 };
}

// Export data
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PRODUCTS_DATABASE,
    POPULAR_SEARCHES,
    getAllBrands,
    getAllCategories,
    getPriceRange
  };
}
