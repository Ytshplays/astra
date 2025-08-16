import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const freeGames = [
  {
    id: 'fortnite',
    title: 'Fortnite',
    description: 'Battle Royale game where 100 players fight to be the last one standing.',
    price: '0',
    imageUrl: 'https://postimg.cc/WtQB44GT',
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
    imageUrl: 'https://postimg.cc/MnYNtbhp',
    platform: 'PC, Console',
    dataAiHint: 'hero shooter battle royale',
    achievements: [
      { name: 'Champion', description: 'Win your first match', unlocked: false },
      { name: 'Legend', description: 'Play 50 matches', unlocked: false }
    ]
  },
  {
    id: 'minecraft',
    title: 'Minecraft',
    description: 'A sandbox game where you can build, explore, and survive in infinite worlds.',
    price: '0',
    imageUrl: 'https://postimg.cc/XXF2Qk56',
    platform: 'PC, Console, Mobile',
    dataAiHint: 'sandbox building survival',
    achievements: [
      { name: 'Getting Wood', description: 'Punch a tree until a block of wood pops out', unlocked: false },
      { name: 'Benchmarking', description: 'Craft a workbench with four blocks of wooden planks', unlocked: false }
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
