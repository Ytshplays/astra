
'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import type { GameRecommendationOutput } from '@/ai/flows/game-recommendation';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { getGameRecommendations } from './actions';
import { Check, Gamepad, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const formSchema = z.object({
  playHistory: z.string().min(20, {
    message: 'Please describe your play history in at least 20 characters.',
  }).default('I enjoy open-world RPGs like The Witcher 3 and Skyrim. I\'ve also spent a lot of time on strategy games such as Civilization VI and XCOM 2. Recently got into indie games like Hades and Stardew Valley.'),
  preferences: z.string().min(20, {
    message: 'Please describe your preferences in at least 20 characters.',
  }).default('I\'m looking for a game with a strong story and deep character progression. I prefer single-player experiences but I\'m open to co-op. Not a fan of competitive multiplayer or sports games.'),
  friendActivity: z.string().optional().default('My friends are currently playing Elden Ring and Baldur\'s Gate 3.'),
});

type FormData = z.infer<typeof formSchema>;

export function DiscoveryForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<GameRecommendationOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      playHistory: formSchema.shape.playHistory.parse(undefined),
      preferences: formSchema.shape.preferences.parse(undefined),
      friendActivity: formSchema.shape.friendActivity.parse(undefined),
    },
  });

  function onSubmit(values: FormData) {
    setError(null);
    setResult(null);
    startTransition(async () => {
      const { data, error } = await getGameRecommendations(values);
      if (error) {
        setError(error);
      } else {
        setResult(data);
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <Card className="lg:col-span-1 h-fit">
        <CardHeader>
          <CardTitle>Your Gaming DNA</CardTitle>
          <CardDescription>Tell our AI about your tastes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="playHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Play History</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., I love RPGs like The Witcher 3, strategy games like XCOM..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      List some games you&apos;ve enjoyed and why.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferences"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., Looking for a single-player story-driven game..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What are you in the mood for right now?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="friendActivity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Friend Activity (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., My friends are playing Baldur's Gate 3..."
                        className="min-h-[60px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Help us find great co-op games.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                {isPending ? (
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-5 w-5" />
                )}
                Find My Next Game
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-8 lg:col-span-2">
        {isPending && (
          <Card className="flex h-full min-h-[500px] items-center justify-center">
            <div className="flex flex-col items-center gap-4 p-8 text-center">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <h3 className="text-xl font-semibold">Crafting Your Recommendations...</h3>
                <p className="max-w-md text-muted-foreground">Our AI is analyzing your tastes to find the perfect games. This might take a moment.</p>
            </div>
          </Card>
        )}
        {error && (
            <Alert variant="destructive">
                <AlertTitle>An Error Occurred</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}
        {result && (
            <div className='flex flex-col gap-8'>
                <Card className='bg-card/80 backdrop-blur-sm'>
                    <CardHeader>
                        <CardTitle>AI Analysis</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="prose prose-invert max-w-none prose-p:text-foreground/90">{result.summary}</p>
                    </CardContent>
                </Card>
                
                <h2 className="text-2xl font-bold">Your Top 3 Recommendations</h2>

                {result.recommendedGames.map((game, index) => (
                    <Card key={index} className="animated-card border-border/60 bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                            <div className='flex justify-between items-start'>
                                <div>
                                    <CardTitle className="text-2xl text-primary">{game.title}</CardTitle>
                                    <CardDescription>{game.platform} - {game.genre}</CardDescription>
                                </div>
                                <div className='text-right'>
                                    <p className='text-sm text-muted-foreground'>Match Score</p>
                                    <p className='text-3xl font-bold text-accent'>{game.matchScore}%</p>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="grid gap-6 md:grid-cols-2">
                            <div>
                                <h4 className='font-semibold mb-2'>Reasoning</h4>
                                <p className='text-sm text-muted-foreground'>{game.reasoning}</p>
                            </div>
                            <div>
                                <h4 className='font-semibold mb-2'>Key Features</h4>
                                <ul className="space-y-2">
                                    {game.keyFeatures.map((feature, i) => (
                                        <li key={i} className='flex items-center gap-2 text-sm'>
                                            <Check className='h-4 w-4 text-accent flex-shrink-0' />
                                            <span>{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter>
                           <Button><Gamepad className='mr-2'/> View Game</Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        )}

        {!isPending && !result && !error && (
             <Card className="flex h-full min-h-[500px] items-center justify-center">
                <div className="flex flex-col items-center gap-4 p-8 text-center">
                    <Wand2 className="h-16 w-16 text-primary" />
                    <h3 className="text-2xl font-semibold">Your Next Adventure Awaits</h3>
                    <p className="max-w-md text-muted-foreground">Fill out the form to let our AI discover games tailored just for you.</p>
                </div>
            </Card>
        )}
      </div>
    </div>
  );
}
