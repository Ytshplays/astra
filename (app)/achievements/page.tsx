
'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { CheckCircle, Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
};

type GameWithAchievements = {
  gameId: string;
  gameTitle: string;
  platform: string;
  achievements: Achievement[];
};

export default function AchievementsPage() {
  const [user] = useAuthState(auth);
  const [achievementsByGame, setAchievementsByGame] = useState<GameWithAchievements[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
        setLoading(false);
        return;
    };

    const q = query(collection(db, 'users', user.uid, 'games'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const gamesData: GameWithAchievements[] = [];
      querySnapshot.forEach((doc) => {
        const game = doc.data();
        gamesData.push({
          gameId: doc.id,
          gameTitle: game.title,
          platform: game.platform,
          achievements: game.achievements || [],
        });
      });
      setAchievementsByGame(gamesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
      return <div>Loading achievements...</div>
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
        <p className="text-muted-foreground">
          Track your progress and celebrate your victories.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progress by Game</CardTitle>
        </CardHeader>
        <CardContent>
          {achievementsByGame.length > 0 ? (
            <Accordion type="single" collapsible className="w-full">
              {achievementsByGame.map((gameData) => {
                  const total = gameData.achievements.length;
                  const unlocked = gameData.achievements.filter(a => a.unlocked).length;
                  const completion = total > 0 ? (unlocked / total) * 100 : 0;
                return (
                <AccordionItem value={`game-${gameData.gameId}`} key={gameData.gameId}>
                  <AccordionTrigger>
                    <div className="flex w-full items-center justify-between pr-4">
                      <div className="flex flex-col items-start">
                          <span className='font-semibold'>{gameData.gameTitle}</span>
                          <Badge variant="secondary" className="mt-1">{gameData.platform}</Badge>
                      </div>
                      <div className='flex items-center gap-4'>
                          <span className='text-sm text-muted-foreground'>{unlocked} / {total} unlocked</span>
                          <Progress value={completion} className="w-32" />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-3 pl-4 pt-2">
                      {gameData.achievements.map((ach: any) => (
                        <li key={ach.id} className="flex items-center gap-4">
                          {ach.unlocked ? (
                            <CheckCircle className="h-6 w-6 text-accent" />
                          ) : (
                            <Trophy className="h-6 w-6 text-muted-foreground" />
                          )}
                          <div className='flex-1'>
                            <p className="font-medium">{ach.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {ach.description}
                            </p>
                          </div>
                          {ach.progress < 100 && !ach.unlocked && (
                               <div className='flex items-center gap-2 w-1/4'>
                                  <Progress value={ach.progress} className="h-2 w-full" />
                                  <span className='text-xs text-muted-foreground'>{ach.progress}%</span>
                               </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              )})}
            </Accordion>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 rounded-lg border-2 border-dashed border-muted-foreground/30">
              <p className="text-muted-foreground">You haven't unlocked any achievements yet.</p>
              <p className="text-sm text-muted-foreground">Play some games to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
