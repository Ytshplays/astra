import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const freeGames = [
  {
    id: 'valorant',
    title: 'Valorant',
    description: 'A 5v5 character-based tactical FPS where precise gunplay meets unique agent abilities.',
    price: '0',
    imageUrl: 'https://placehold.co/400x300/FF4655/FFFFFF?text=Valorant',
    platform: 'PC',
    dataAiHint: 'tactical shooter',
    achievements: [
      { name: 'First Blood', description: 'Get your first kill', unlocked: false },
      { name: 'Ace', description: 'Kill all 5 enemies in a round', unlocked: false }
    ]
  },
  {
    id: 'fortnite',
    title: 'Fortnite',
    description: 'Battle Royale game where 100 players fight to be the last one standing.',
    price: '0',
    imageUrl: 'https://placehold.co/400x300/9146FF/FFFFFF?text=Fortnite',
    platform: 'PC, Console, Mobile',
    dataAiHint: 'battle royale',
    achievements: [
      { name: 'Victory Royale', description: 'Win your first match', unlocked: false },
      { name: 'Builder', description: 'Build 100 structures', unlocked: false }
    ]
  },
  {
    id: 'apex-legends',
    title: 'Apex Legends',
    description: 'A hero shooter battle royale with unique characters and abilities.',
    price: '0',
    imageUrl: 'https://placehold.co/400x300/FF6600/FFFFFF?text=Apex+Legends',
    platform: 'PC, Console',
    dataAiHint: 'hero shooter battle royale',
    achievements: [
      { name: 'Champion', description: 'Win your first match', unlocked: false },
      { name: 'Legend', description: 'Play 50 matches', unlocked: false }
    ]
  },
  {
    id: 'league-of-legends',
    title: 'League of Legends',
    description: 'The world\'s most popular MOBA with over 160 champions to master.',
    price: '0',
    imageUrl: 'https://placehold.co/400x300/0596AA/FFD700?text=League+of+Legends',
    platform: 'PC',
    dataAiHint: 'moba strategy',
    achievements: [
      { name: 'First Victory', description: 'Win your first match', unlocked: false },
      { name: 'Pentakill', description: 'Kill all 5 enemies in a teamfight', unlocked: false }
    ]
  },
  {
    id: 'rocket-league',
    title: 'Rocket League',
    description: 'Soccer meets driving in this physics-based multiplayer game.',
    price: '0',
    imageUrl: 'https://placehold.co/400x300/FF8C00/0000FF?text=Rocket+League',
    platform: 'PC, Console',
    dataAiHint: 'car soccer sports',
    achievements: [
      { name: 'First Goal', description: 'Score your first goal', unlocked: false },
      { name: 'Hat Trick', description: 'Score 3 goals in one match', unlocked: false }
    ]
  },
  {
    id: 'fall-guys',
    title: 'Fall Guys',
    description: 'A massively multiplayer party royale game with colorful chaos.',
    price: '0',
    imageUrl: 'https://placehold.co/400x300/FF69B4/FFFFFF?text=Fall+Guys',
    platform: 'PC, Console, Mobile',
    dataAiHint: 'party game multiplayer',
    achievements: [
      { name: 'Crown Collector', description: 'Win your first crown', unlocked: false },
      { name: 'Survivor', description: 'Reach the final round', unlocked: false }
    ]
  },
  {
    id: 'genshin-impact',
    title: 'Genshin Impact',
    description: 'An open-world action RPG with anime-style graphics and elemental combat.',
    price: '0',
    imageUrl: 'https://placehold.co/400x300/4682B4/FFD700?text=Genshin+Impact',
    platform: 'PC, Console, Mobile',
    dataAiHint: 'anime rpg open world',
    achievements: [
      { name: 'Traveler', description: 'Complete the tutorial', unlocked: false },
      { name: 'Explorer', description: 'Discover 50 waypoints', unlocked: false }
    ]
  },
  {
    id: 'destiny-2',
    title: 'Destiny 2',
    description: 'A free-to-play online FPS with RPG elements and cooperative gameplay.',
    price: '0',
    imageUrl: 'https://placehold.co/400x300/2F4F4F/FFFFFF?text=Destiny+2',
    platform: 'PC, Console',
    dataAiHint: 'sci-fi fps rpg',
    achievements: [
      { name: 'Guardian', description: 'Complete your first mission', unlocked: false },
      { name: 'Legend', description: 'Reach max level', unlocked: false }
    ]
  }
];

export const addFreeGamesToStore = async () => {
  console.log('Adding free games to store...');
  
  for (const game of freeGames) {
    try {
      const gameRef = doc(db, 'games', game.id);
      await setDoc(gameRef, game, { merge: true });
      console.log(`✓ Added ${game.title}`);
    } catch (error) {
      console.error(`✗ Error adding ${game.title}:`, error);
    }
  }
  
  console.log('Free games added to store!');
};
