import { addStoreItem } from './store';

export const additionalGames = [
  {
    title: "God of War",
    description: "His vengeance against the Gods of Olympus years behind him, Kratos now lives as a man in the realm of Norse Gods and monsters.",
    price: 49.99,
    originalPrice: 59.99,
    imageUrl: "https://placehold.co/400x300/8B0000/FFFFFF?text=God+of+War",
    category: "action",
    platform: ["PC", "PlayStation"],
    developer: "Santa Monica Studio",
    publisher: "Sony Interactive Entertainment",
    releaseDate: "2018-04-20",
    rating: 4.9,
    tags: ["Action", "Adventure", "Norse Mythology", "Story Rich"],
    screenshots: [
      "https://placehold.co/800x450/8B0000/FFFFFF?text=Screenshot+1",
      "https://placehold.co/800x450/8B0000/FFFFFF?text=Screenshot+2"
    ],
    featured: true,
    inStock: true,
    downloadSize: "45 GB",
    systemRequirements: {
      minimum: "Intel Core i5-2500K / AMD Ryzen 3 1200, 8 GB RAM, GTX 960 / RX 570",
      recommended: "Intel Core i5-6600K / AMD Ryzen 5 2400G, 8 GB RAM, GTX 1060 / RX 570"
    }
  },
  {
    title: "Hades",
    description: "Defy the god of the dead in this award-winning action roguelike. As Zagreus, son of Hades, you'll wage an eternal war for freedom.",
    price: 24.99,
    imageUrl: "https://placehold.co/400x300/4B0082/FFD700?text=Hades",
    category: "action",
    platform: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    developer: "Supergiant Games",
    publisher: "Supergiant Games",
    releaseDate: "2020-09-17",
    rating: 4.8,
    tags: ["Roguelike", "Mythology", "Action", "Indie"],
    screenshots: [
      "https://placehold.co/800x450/4B0082/FFD700?text=Screenshot+1",
      "https://placehold.co/800x450/4B0082/FFD700?text=Screenshot+2"
    ],
    featured: true,
    inStock: true,
    downloadSize: "15 GB",
    systemRequirements: {
      minimum: "Intel Core i5-3570K / AMD FX-8310, 8 GB RAM, GTX 750 Ti / RX 560",
      recommended: "Intel Core i7-6700K / AMD Ryzen 5 1600, 8 GB RAM, GTX 1060 / RX 580"
    }
  },
  {
    title: "Spider-Man Remastered",
    description: "Be Greater. When a new villain threatens New York City, Peter Parker must embrace his role as Spider-Man and save his home.",
    price: 59.99,
    imageUrl: "https://placehold.co/400x300/FF0000/0000FF?text=Spider-Man",
    category: "action",
    platform: ["PC", "PlayStation"],
    developer: "Insomniac Games",
    publisher: "Sony Interactive Entertainment",
    releaseDate: "2018-09-07",
    rating: 4.7,
    tags: ["Superhero", "Open World", "Action", "Adventure"],
    screenshots: [
      "https://placehold.co/800x450/FF0000/0000FF?text=Screenshot+1",
      "https://placehold.co/800x450/FF0000/0000FF?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "75 GB",
    systemRequirements: {
      minimum: "Intel Core i3-4160 / AMD FX-6300, 8 GB RAM, GTX 950 / RX 470",
      recommended: "Intel Core i5-4670 / AMD Ryzen 5 1600, 16 GB RAM, GTX 1060 / RX 580"
    }
  },
  {
    title: "Forza Horizon 5",
    description: "Your greatest Horizon Adventure awaits! Explore the vibrant and ever-evolving open world landscapes of Mexico.",
    price: 59.99,
    imageUrl: "https://placehold.co/400x300/FF8C00/FFFFFF?text=Forza+Horizon+5",
    category: "racing",
    platform: ["PC", "Xbox"],
    developer: "Playground Games",
    publisher: "Microsoft Studios",
    releaseDate: "2021-11-09",
    rating: 4.6,
    tags: ["Racing", "Open World", "Cars", "Arcade"],
    screenshots: [
      "https://placehold.co/800x450/FF8C00/FFFFFF?text=Screenshot+1",
      "https://placehold.co/800x450/FF8C00/FFFFFF?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "110 GB",
    systemRequirements: {
      minimum: "Intel Core i5-4460 / AMD Ryzen 3 1200, 8 GB RAM, GTX 970 / RX 470",
      recommended: "Intel Core i5-8400 / AMD Ryzen 5 1500X, 16 GB RAM, GTX 1070 / RX 590"
    }
  },
  {
    title: "Minecraft",
    description: "Explore infinite worlds and build everything from the simplest of homes to the grandest of castles.",
    price: 26.95,
    imageUrl: "https://placehold.co/400x300/228B22/8B4513?text=Minecraft",
    category: "simulation",
    platform: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
    developer: "Mojang Studios",
    publisher: "Microsoft",
    releaseDate: "2011-11-18",
    rating: 4.5,
    tags: ["Sandbox", "Building", "Survival", "Creative"],
    screenshots: [
      "https://placehold.co/800x450/228B22/8B4513?text=Screenshot+1",
      "https://placehold.co/800x450/228B22/8B4513?text=Screenshot+2"
    ],
    featured: true,
    inStock: true,
    downloadSize: "1 GB",
    systemRequirements: {
      minimum: "Intel Core i3-3210 / AMD A8-7600, 4 GB RAM, Intel HD Graphics 4000 / Radeon R5",
      recommended: "Intel Core i5-4690 / AMD A10-7800, 8 GB RAM, GTX 700 Series / Radeon R9"
    }
  },
  {
    title: "Valorant",
    description: "A 5v5 character-based tactical FPS where precise gunplay meets unique agent abilities.",
    price: 0,
    imageUrl: "https://placehold.co/400x300/FF4655/FFFFFF?text=Valorant",
    category: "shooter",
    platform: ["PC"],
    developer: "Riot Games",
    publisher: "Riot Games",
    releaseDate: "2020-06-02",
    rating: 4.3,
    tags: ["FPS", "Tactical", "Competitive", "Free-to-Play"],
    screenshots: [
      "https://placehold.co/800x450/FF4655/FFFFFF?text=Screenshot+1",
      "https://placehold.co/800x450/FF4655/FFFFFF?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "23 GB",
    systemRequirements: {
      minimum: "Intel Core i3-4150 / AMD FX-6300, 4 GB RAM, Intel HD Graphics 3000 / Radeon R5 200",
      recommended: "Intel Core i5-4460 / AMD Ryzen 3 1200, 4 GB RAM, GTX 1050 Ti / RX 570"
    }
  },
  {
    title: "Call of Duty: Modern Warfare II",
    description: "Experience the ultimate online playground with classic multiplayer, or squad-up and play cooperatively.",
    price: 69.99,
    imageUrl: "https://placehold.co/400x300/556B2F/FFFFFF?text=COD+MW2",
    category: "shooter",
    platform: ["PC", "PlayStation", "Xbox"],
    developer: "Infinity Ward",
    publisher: "Activision",
    releaseDate: "2022-10-28",
    rating: 4.2,
    tags: ["FPS", "Military", "Multiplayer", "Campaign"],
    screenshots: [
      "https://placehold.co/800x450/556B2F/FFFFFF?text=Screenshot+1",
      "https://placehold.co/800x450/556B2F/FFFFFF?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "125 GB",
    systemRequirements: {
      minimum: "Intel Core i5-6600K / AMD Ryzen 5 1400, 8 GB RAM, GTX 960 / RX 470",
      recommended: "Intel Core i7-8700K / AMD Ryzen 7 2700X, 16 GB RAM, GTX 1070 / RX Vega 56"
    }
  },
  {
    title: "Fall Guys",
    description: "Fall Guys is a free, cross-platform massively multiplayer party royale game.",
    price: 0,
    imageUrl: "https://placehold.co/400x300/FF69B4/FFFFFF?text=Fall+Guys",
    category: "party",
    platform: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
    developer: "Mediatonic",
    publisher: "Epic Games",
    releaseDate: "2020-08-04",
    rating: 4.1,
    tags: ["Party Game", "Multiplayer", "Colorful", "Free-to-Play"],
    screenshots: [
      "https://placehold.co/800x450/FF69B4/FFFFFF?text=Screenshot+1",
      "https://placehold.co/800x450/FF69B4/FFFFFF?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "2 GB",
    systemRequirements: {
      minimum: "Intel Core i5 / AMD equivalent, 8 GB RAM, GTX 660 / Radeon HD 7950",
      recommended: "Intel Core i5 / AMD equivalent, 8 GB RAM, GTX 1060 / RX 580"
    }
  },
  {
    title: "Rocket League",
    description: "A high-powered hybrid of arcade-style soccer and vehicular mayhem with easy-to-understand controls.",
    price: 0,
    imageUrl: "https://placehold.co/400x300/FF4500/FFFFFF?text=Rocket+League",
    category: "sports",
    platform: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    developer: "Psyonix",
    publisher: "Epic Games",
    releaseDate: "2015-07-07",
    rating: 4.5,
    tags: ["Sports", "Cars", "Competitive", "Free-to-Play"],
    screenshots: [
      "https://placehold.co/800x450/FF4500/FFFFFF?text=Screenshot+1",
      "https://placehold.co/800x450/FF4500/FFFFFF?text=Screenshot+2"
    ],
    featured: true,
    inStock: true,
    downloadSize: "15 GB",
    systemRequirements: {
      minimum: "Intel Core i3-8100 / AMD Ryzen 3 1200, 4 GB RAM, GTX 660 / RX 460",
      recommended: "Intel Core i5-9600K / AMD Ryzen 5 2600X, 8 GB RAM, GTX 1060 / RX 580"
    }
  },
  {
    title: "Fortnite",
    description: "A free-to-play Battle Royale game and so much more. Drop in, loot-up, and eliminate opponents to become the last one standing.",
    price: 0,
    imageUrl: "https://placehold.co/400x300/8A2BE2/FFFFFF?text=Fortnite",
    category: "shooter",
    platform: ["PC", "PlayStation", "Xbox", "Nintendo Switch", "Mobile"],
    developer: "Epic Games",
    publisher: "Epic Games",
    releaseDate: "2017-09-26",
    rating: 4.2,
    tags: ["Battle Royale", "Building", "Competitive", "Free-to-Play"],
    screenshots: [
      "https://placehold.co/800x450/8A2BE2/FFFFFF?text=Screenshot+1",
      "https://placehold.co/800x450/8A2BE2/FFFFFF?text=Screenshot+2"
    ],
    featured: true,
    inStock: true,
    downloadSize: "26 GB",
    systemRequirements: {
      minimum: "Intel Core i3-3225 / AMD A8-7600, 4 GB RAM, Intel HD 4000 / Radeon R5",
      recommended: "Intel Core i5-7300U / AMD Ryzen 3 1200, 8 GB RAM, GTX 660 / RX 560"
    }
  },
  {
    title: "League of Legends",
    description: "Join over 180 million registered players in the world's most popular online battle arena.",
    price: 0,
    imageUrl: "https://placehold.co/400x300/C89B3C/0F2027?text=League+of+Legends",
    category: "moba",
    platform: ["PC"],
    developer: "Riot Games",
    publisher: "Riot Games",
    releaseDate: "2009-10-27",
    rating: 4.4,
    tags: ["MOBA", "Strategy", "Competitive", "Free-to-Play"],
    screenshots: [
      "https://placehold.co/800x450/C89B3C/0F2027?text=Screenshot+1",
      "https://placehold.co/800x450/C89B3C/0F2027?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "22 GB",
    systemRequirements: {
      minimum: "Intel Core i3-530 / AMD A6-3650, 2 GB RAM, GeForce 9600GT / Radeon HD 6570",
      recommended: "Intel Core i5-3300 / AMD Ryzen 3 1200, 4 GB RAM, GTX 560 / Radeon HD 6950"
    }
  },
  {
    title: "CS2 (Counter-Strike 2)",
    description: "The ultimate competitive FPS experience. Free to play with ranked matchmaking and premium features.",
    price: 0,
    imageUrl: "https://placehold.co/400x300/FF6B35/000000?text=CS2",
    category: "shooter",
    platform: ["PC"],
    developer: "Valve",
    publisher: "Valve",
    releaseDate: "2023-09-27",
    rating: 4.3,
    tags: ["FPS", "Competitive", "Tactical", "Free-to-Play"],
    screenshots: [
      "https://placehold.co/800x450/FF6B35/000000?text=Screenshot+1",
      "https://placehold.co/800x450/FF6B35/000000?text=Screenshot+2"
    ],
    featured: true,
    inStock: true,
    downloadSize: "85 GB",
    systemRequirements: {
      minimum: "Intel Core i5-750 / AMD Phenom II X4 945, 8 GB RAM, GTX 1060 / RX 570",
      recommended: "Intel Core i5-9600K / AMD Ryzen 5 2600X, 16 GB RAM, GTX 1660 Ti / RX 6600"
    }
  },
  {
    title: "Apex Legends",
    description: "Master an ever-growing roster of legendary characters in this free-to-play Hero Shooter.",
    price: 0,
    imageUrl: "https://placehold.co/400x300/FF6600/FFFFFF?text=Apex+Legends",
    category: "shooter",
    platform: ["PC", "PlayStation", "Xbox", "Nintendo Switch"],
    developer: "Respawn Entertainment",
    publisher: "Electronic Arts",
    releaseDate: "2019-02-04",
    rating: 4.1,
    tags: ["Battle Royale", "Hero Shooter", "Team-based", "Free-to-Play"],
    screenshots: [
      "https://placehold.co/800x450/FF6600/FFFFFF?text=Screenshot+1",
      "https://placehold.co/800x450/FF6600/FFFFFF?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "75 GB",
    systemRequirements: {
      minimum: "Intel Core i3-6300 / AMD FX-4350, 6 GB RAM, GTX 960 / RX 470",
      recommended: "Intel Core i5-3570K / AMD Ryzen 5 2600, 8 GB RAM, GTX 970 / RX 580"
    }
  },
  {
    title: "Genshin Impact",
    description: "Step into Teyvat, a vast world teeming with life and flowing with elemental energy.",
    price: 0,
    imageUrl: "https://placehold.co/400x300/4A90E2/FFFFFF?text=Genshin+Impact",
    category: "rpg",
    platform: ["PC", "PlayStation", "Mobile"],
    developer: "miHoYo",
    publisher: "miHoYo",
    releaseDate: "2020-09-28",
    rating: 4.6,
    tags: ["Open World", "Anime", "Adventure", "Free-to-Play"],
    screenshots: [
      "https://placehold.co/800x450/4A90E2/FFFFFF?text=Screenshot+1",
      "https://placehold.co/800x450/4A90E2/FFFFFF?text=Screenshot+2"
    ],
    featured: true,
    inStock: true,
    downloadSize: "72 GB",
    systemRequirements: {
      minimum: "Intel Core i5 / AMD Ryzen 5, 8 GB RAM, GTX 1030 / RX 550",
      recommended: "Intel Core i7 / AMD Ryzen 7, 16 GB RAM, GTX 1060 / RX 580"
    }
  },
  {
    title: "Dota 2",
    description: "Every day, millions of players worldwide enter battle as one of over a hundred legendary heroes.",
    price: 0,
    imageUrl: "https://placehold.co/400x300/B22222/FFFFFF?text=Dota+2",
    category: "moba",
    platform: ["PC"],
    developer: "Valve",
    publisher: "Valve",
    releaseDate: "2013-07-09",
    rating: 4.5,
    tags: ["MOBA", "Strategy", "Competitive", "Free-to-Play"],
    screenshots: [
      "https://placehold.co/800x450/B22222/FFFFFF?text=Screenshot+1",
      "https://placehold.co/800x450/B22222/FFFFFF?text=Screenshot+2"
    ],
    featured: false,
    inStock: true,
    downloadSize: "45 GB",
    systemRequirements: {
      minimum: "Intel Core 2 Duo / AMD Athlon 64 X2, 4 GB RAM, GTX 560 / Radeon HD 6800",
      recommended: "Intel Core i5 / AMD Ryzen 5, 8 GB RAM, GTX 970 / RX 570"
    }
  }
];

export const addMoreGamesToStore = async () => {
  console.log('Adding more games to store...');
  
  for (const game of additionalGames) {
    try {
      const result = await addStoreItem(game);
      if (result.success) {
        console.log(`✓ Added ${game.title}`);
      } else {
        console.log(`- ${game.title} already exists or failed: ${result.message}`);
      }
    } catch (error) {
      console.error(`✗ Error adding ${game.title}:`, error);
    }
  }
  
  console.log('Additional games added to store!');
};
