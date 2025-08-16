import { addStoreItem } from './store';

export const sampleStoreItems = [
  {
    title: "Cyberpunk 2077",
    description: "An open-world, action-adventure story set in Night City, a megalopolis obsessed with power, glamour and body modification.",
    price: 59.99,
    originalPrice: 79.99,
    imageUrl: "https://placehold.co/400x300/0a0a0a/00ff00?text=Cyberpunk+2077",
    category: "action",
    platform: ["PC", "PlayStation", "Xbox"],
    developer: "CD Projekt RED",
    publisher: "CD Projekt",
    releaseDate: "2020-12-10",
    rating: 4.2,
    tags: ["Open World", "Futuristic", "RPG", "Action"],
    screenshots: [
      "https://placehold.co/800x450/0a0a0a/00ff00?text=Screenshot+1",
      "https://placehold.co/800x450/0a0a0a/00ff00?text=Screenshot+2"
    ],
    featured: true,
    inStock: true,
    downloadSize: "70 GB",
    systemRequirements: {
      minimum: "Intel Core i5-3570K / AMD FX-8310, 8 GB RAM, GTX 780 / Radeon RX 470",
      recommended: "Intel Core i7-4790 / AMD Ryzen 3 3200G, 12 GB RAM, GTX 1060 / RX 580"
    }
  },
  {
    title: "The Witcher 3: Wild Hunt",
    description: "A story-driven, open world adventure set in a dark fantasy universe where choices matter.",
    price: 39.99,
    imageUrl: "https://placehold.co/400x300/2d1810/ffd700?text=The+Witcher+3",
    category: "rpg",
    platform: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    developer: "CD Projekt RED",
    publisher: "CD Projekt",
    releaseDate: "2015-05-19",
    rating: 4.8,
    tags: ["Fantasy", "Open World", "Story Rich", "RPG"],
    screenshots: [
      "https://placehold.co/800x450/2d1810/ffd700?text=Screenshot+1",
      "https://placehold.co/800x450/2d1810/ffd700?text=Screenshot+2"
    ],
    featured: true,
    inStock: true,
    downloadSize: "50 GB",
    systemRequirements: {
      minimum: "Intel Core i5-2500K / AMD Phenom II X4 940, 6 GB RAM, GTX 660 / Radeon HD 7870",
      recommended: "Intel Core i7-3770 / AMD FX-8350, 8 GB RAM, GTX 770 / Radeon R9 290"
    }
  },
  {
    title: "Red Dead Redemption 2",
    description: "An epic tale of life in America's unforgiving heartland. The game's vast and atmospheric world provides the foundation for a brand new online multiplayer experience.",
    price: 49.99,
    originalPrice: 59.99,
    imageUrl: "https://placehold.co/400x300/8B4513/FF6347?text=Red+Dead+2",
    category: "action",
    platform: ["PC", "PlayStation", "Xbox"],
    developer: "Rockstar Games",
    publisher: "Rockstar Games",
    releaseDate: "2018-10-26",
    rating: 4.7,
    tags: ["Western", "Open World", "Story Rich", "Adventure"],
    screenshots: [
      "https://placehold.co/800x450/8B4513/FF6347?text=Screenshot+1",
      "https://placehold.co/800x450/8B4513/FF6347?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "120 GB",
    systemRequirements: {
      minimum: "Intel Core i5-2500K / AMD FX-6300, 8 GB RAM, GTX 770 / Radeon R9 280",
      recommended: "Intel Core i7-4770K / AMD Ryzen 5 1500X, 12 GB RAM, GTX 1060 / RX 480"
    }
  },
  {
    title: "Elden Ring",
    description: "A fantasy action-RPG adventure set within a world created by Hidetaka Miyazaki and George R.R. Martin.",
    price: 59.99,
    imageUrl: "https://placehold.co/400x300/1a1a2e/DAA520?text=Elden+Ring",
    category: "rpg",
    platform: ["PC", "PlayStation", "Xbox"],
    developer: "FromSoftware",
    publisher: "Bandai Namco",
    releaseDate: "2022-02-25",
    rating: 4.6,
    tags: ["Dark Fantasy", "Difficult", "Open World", "Souls-like"],
    screenshots: [
      "https://placehold.co/800x450/1a1a2e/DAA520?text=Screenshot+1",
      "https://placehold.co/800x450/1a1a2e/DAA520?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "60 GB",
    systemRequirements: {
      minimum: "Intel Core i5-8400 / AMD Ryzen 3 3300X, 12 GB RAM, GTX 1060 / RX 580",
      recommended: "Intel Core i7-8700K / AMD Ryzen 5 3600X, 16 GB RAM, GTX 1070 / RX Vega 56"
    }
  },
  {
    title: "FIFA 24",
    description: "EA SPORTS FC 24 welcomes you to The World's Game – the most true-to-football experience ever with HyperMotionV technology.",
    price: 69.99,
    imageUrl: "https://placehold.co/400x300/006400/FFFFFF?text=FIFA+24",
    category: "sports",
    platform: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    developer: "EA Sports",
    publisher: "Electronic Arts",
    releaseDate: "2023-09-29",
    rating: 4.1,
    tags: ["Football", "Sports", "Multiplayer", "Simulation"],
    screenshots: [
      "https://placehold.co/800x450/006400/FFFFFF?text=Screenshot+1",
      "https://placehold.co/800x450/006400/FFFFFF?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "100 GB",
    systemRequirements: {
      minimum: "Intel Core i5-6600K / AMD Ryzen 5 1600, 8 GB RAM, GTX 1050 Ti / RX 570",
      recommended: "Intel Core i7-9700K / AMD Ryzen 7 2700X, 12 GB RAM, GTX 1660 / RX 5600 XT"
    }
  },
  {
    title: "Cities: Skylines",
    description: "Build the city of your dreams and create the perfect skyline with the most realistic city builder ever.",
    price: 29.99,
    imageUrl: "https://placehold.co/400x300/4682B4/F0F8FF?text=Cities+Skylines",
    category: "simulation",
    platform: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    developer: "Colossal Order",
    publisher: "Paradox Interactive",
    releaseDate: "2015-03-10",
    rating: 4.5,
    tags: ["City Builder", "Management", "Simulation", "Strategy"],
    screenshots: [
      "https://placehold.co/800x450/4682B4/F0F8FF?text=Screenshot+1",
      "https://placehold.co/800x450/4682B4/F0F8FF?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "4 GB",
    systemRequirements: {
      minimum: "Intel Core i5-3470 / AMD FX-6300, 4 GB RAM, GTX 260 / Radeon HD 5670",
      recommended: "Intel Core i5-4690K / AMD FX-8350, 6 GB RAM, GTX 660 / Radeon HD 7870"
    }
  },
  {
    title: "Assassin's Creed Valhalla",
    description: "Become Eivor, a legendary Viking raider on a quest for glory. Explore England's Dark Ages as you raid your enemies, grow your settlement, and build your political power.",
    price: 39.99,
    originalPrice: 59.99,
    imageUrl: "https://placehold.co/400x300/2F4F4F/B22222?text=AC+Valhalla",
    category: "adventure",
    platform: ["PC", "PlayStation", "Xbox"],
    developer: "Ubisoft Montreal",
    publisher: "Ubisoft",
    releaseDate: "2020-11-10",
    rating: 4.3,
    tags: ["Historical", "Open World", "Action", "Adventure"],
    screenshots: [
      "https://placehold.co/800x450/2F4F4F/B22222?text=Screenshot+1",
      "https://placehold.co/800x450/2F4F4F/B22222?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "50 GB",
    systemRequirements: {
      minimum: "Intel Core i5-4460 / AMD Ryzen 3 1200, 8 GB RAM, GTX 960 / RX 570",
      recommended: "Intel Core i7-6700 / AMD Ryzen 7 1700, 8 GB RAM, GTX 1080 / RX Vega 64"
    }
  },
  {
    title: "Gran Turismo 7",
    description: "From classic cars to the latest supercars, discover your perfect drive in Gran Turismo 7.",
    price: 69.99,
    imageUrl: "https://placehold.co/400x300/DC143C/FFFFFF?text=Gran+Turismo+7",
    category: "racing",
    platform: ["PlayStation"],
    developer: "Polyphony Digital",
    publisher: "Sony Interactive Entertainment",
    releaseDate: "2022-03-04",
    rating: 4.4,
    tags: ["Racing", "Simulation", "Cars", "Driving"],
    screenshots: [
      "https://placehold.co/800x450/DC143C/FFFFFF?text=Screenshot+1",
      "https://placehold.co/800x450/DC143C/FFFFFF?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "90 GB",
    systemRequirements: {
      minimum: "PlayStation 4 / PlayStation 5",
      recommended: "PlayStation 5 for best experience"
    }
  },
  {
    title: "Civilization VI",
    description: "Originally created by legendary game designer Sid Meier, Civilization is a turn-based strategy game in which you attempt to build an empire to stand the test of time.",
    price: 29.99,
    imageUrl: "https://placehold.co/400x300/8B4513/FFD700?text=Civilization+VI",
    category: "strategy",
    platform: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    developer: "Firaxis Games",
    publisher: "2K Games",
    releaseDate: "2016-10-21",
    rating: 4.6,
    tags: ["Turn-Based", "Strategy", "Empire Building", "Historical"],
    screenshots: [
      "https://placehold.co/800x450/8B4513/FFD700?text=Screenshot+1",
      "https://placehold.co/800x450/8B4513/FFD700?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "12 GB",
    systemRequirements: {
      minimum: "Intel Core i3-530 / AMD A8-3870, 4 GB RAM, GTX 450 / Radeon HD 5570",
      recommended: "Intel Core i5-4300U / AMD A10-5800K, 8 GB RAM, GTX 770 / Radeon HD 7970"
    }
  },
  {
    title: "Valorant",
    description: "Valorant is a team-based first-person tactical shooter set in the near future. Players play as one of a set of Agents, characters designed based on several countries and cultures around the world.",
    price: 0, // Free to play
    imageUrl: "https://placehold.co/400x300/FF4655/FFFFFF?text=Valorant",
    category: "action",
    platform: ["PC"],
    developer: "Riot Games",
    publisher: "Riot Games",
    releaseDate: "2020-06-02",
    rating: 4.2,
    tags: ["FPS", "Tactical", "Competitive", "Free to Play"],
    screenshots: [
      "https://placehold.co/800x450/FF4655/FFFFFF?text=Screenshot+1",
      "https://placehold.co/800x450/FF4655/FFFFFF?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "8 GB",
    systemRequirements: {
      minimum: "Intel Core i3-370M / AMD A8-3425, 4 GB RAM, Intel HD 3000 / Radeon R5 200",
      recommended: "Intel Core i5-4460 / AMD FX-6300, 4 GB RAM, GTX 1050 Ti / Radeon R7 370"
    }
  },
  {
    title: "Call of Duty: Modern Warfare III",
    description: "The direct sequel to the record-breaking Call of Duty: Modern Warfare II. Captain Price and Task Force 141 face off against the ultimate threat.",
    price: 69.99,
    imageUrl: "https://placehold.co/400x300/1a1a1a/FF6B35?text=Call+of+Duty+MW3",
    category: "action",
    platform: ["PC", "PlayStation", "Xbox"],
    developer: "Sledgehammer Games",
    publisher: "Activision",
    releaseDate: "2023-11-10",
    rating: 4.1,
    tags: ["FPS", "Military", "Multiplayer", "Campaign"],
    screenshots: [
      "https://placehold.co/800x450/1a1a1a/FF6B35?text=Screenshot+1",
      "https://placehold.co/800x450/1a1a1a/FF6B35?text=Screenshot+2"
    ],
    featured: true,
    inStock: true,
    downloadSize: "149 GB",
    systemRequirements: {
      minimum: "Intel Core i5-6600 / AMD Ryzen 5 1400, 8 GB RAM, GTX 960 / RX 470",
      recommended: "Intel Core i7-6700K / AMD Ryzen 5 1600X, 16 GB RAM, GTX 1080 Ti / RX 6600 XT"
    }
  },
  {
    title: "Baldur's Gate 3",
    description: "Gather your party and return to the Forgotten Realms in a tale of fellowship and betrayal, sacrifice and survival, and the lure of absolute power.",
    price: 59.99,
    imageUrl: "https://placehold.co/400x300/4A0E4E/FFD700?text=Baldurs+Gate+3",
    category: "rpg",
    platform: ["PC", "PlayStation", "Xbox"],
    developer: "Larian Studios",
    publisher: "Larian Studios",
    releaseDate: "2023-08-03",
    rating: 4.9,
    tags: ["RPG", "Turn-Based", "Fantasy", "Story Rich"],
    screenshots: [
      "https://placehold.co/800x450/4A0E4E/FFD700?text=Screenshot+1",
      "https://placehold.co/800x450/4A0E4E/FFD700?text=Screenshot+2"
    ],
    featured: true,
    inStock: true,
    downloadSize: "122 GB",
    systemRequirements: {
      minimum: "Intel Core i5-4690 / AMD FX 4350, 8 GB RAM, GTX 970 / RX 480",
      recommended: "Intel Core i7-8700K / AMD Ryzen 5 3600, 16 GB RAM, GTX 2060 Super / RX 6700 XT"
    }
  },
  {
    title: "Spider-Man Remastered",
    description: "In Spider-Man Remastered, the worlds of Peter Parker and Spider-Man collide in an original action-packed story.",
    price: 49.99,
    originalPrice: 59.99,
    imageUrl: "https://placehold.co/400x300/DC143C/FFFFFF?text=Spider-Man",
    category: "action",
    platform: ["PC", "PlayStation"],
    developer: "Insomniac Games",
    publisher: "Sony Interactive Entertainment",
    releaseDate: "2022-08-12",
    rating: 4.6,
    tags: ["Action", "Adventure", "Superhero", "Open World"],
    screenshots: [
      "https://placehold.co/800x450/DC143C/FFFFFF?text=Screenshot+1",
      "https://placehold.co/800x450/DC143C/FFFFFF?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "75 GB",
    systemRequirements: {
      minimum: "Intel Core i3-4160 / AMD FX-6300, 8 GB RAM, GTX 950 / RX 470",
      recommended: "Intel Core i5-4670 / AMD Ryzen 5 1600, 16 GB RAM, GTX 1060 6GB / RX 580"
    }
  },
  {
    title: "Starfield",
    description: "Starfield is the first new universe in 25 years from Bethesda Game Studios, the award-winning creators of The Elder Scrolls V: Skyrim and Fallout 4.",
    price: 69.99,
    imageUrl: "https://placehold.co/400x300/191970/FFF8DC?text=Starfield",
    category: "rpg",
    platform: ["PC", "Xbox"],
    developer: "Bethesda Game Studios",
    publisher: "Bethesda Softworks",
    releaseDate: "2023-09-06",
    rating: 4.0,
    tags: ["Space", "RPG", "Exploration", "Sci-Fi"],
    screenshots: [
      "https://placehold.co/800x450/191970/FFF8DC?text=Screenshot+1",
      "https://placehold.co/800x450/191970/FFF8DC?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "125 GB",
    systemRequirements: {
      minimum: "Intel Core i7-6800K / AMD Ryzen 5 2600X, 16 GB RAM, GTX 1070 Ti / RX 5700",
      recommended: "Intel Core i5-10600K / AMD Ryzen 5 3600X, 16 GB RAM, GTX 2080 / RX 6800 XT"
    }
  },
  {
    title: "Hogwarts Legacy",
    description: "Hogwarts Legacy is an immersive, open-world action RPG set in the world first introduced in the Harry Potter books.",
    price: 59.99,
    imageUrl: "https://placehold.co/400x300/8B4513/FFD700?text=Hogwarts+Legacy",
    category: "rpg",
    platform: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    developer: "Avalanche Software",
    publisher: "Warner Bros. Games",
    releaseDate: "2023-02-10",
    rating: 4.4,
    tags: ["Magic", "Adventure", "Open World", "Fantasy"],
    screenshots: [
      "https://placehold.co/800x450/8B4513/FFD700?text=Screenshot+1",
      "https://placehold.co/800x450/8B4513/FFD700?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "85 GB",
    systemRequirements: {
      minimum: "Intel Core i5-6600 / AMD Ryzen 5 1400, 16 GB RAM, GTX 960 / RX 470",
      recommended: "Intel Core i7-8700 / AMD Ryzen 5 3600, 16 GB RAM, GTX 1080 Ti / RX 6700 XT"
    }
  }
];

export const populateStore = async () => {
  console.log('Starting store population...');
  
  for (const item of sampleStoreItems) {
    try {
      const result = await addStoreItem(item);
      if (result.success) {
        console.log(`✓ Added ${item.title}`);
      } else {
        console.error(`✗ Failed to add ${item.title}: ${result.message}`);
      }
    } catch (error) {
      console.error(`✗ Error adding ${item.title}:`, error);
    }
  }
  
  console.log('Store population completed!');
};
