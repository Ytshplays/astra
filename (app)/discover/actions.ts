
'use server';

import {
  gameRecommendation,
  type GameRecommendationInput,
  type GameRecommendationOutput,
} from '@/ai/flows/game-recommendation';
import { z } from 'zod';

const GameRecommendationInputSchema = z.object({
  playHistory: z.string().min(10, 'Please provide more details about your play history.'),
  preferences: z.string().min(10, 'Please provide more details about your preferences.'),
  friendActivity: z.string(),
});

export async function getGameRecommendations(
  input: GameRecommendationInput
): Promise<{ data: GameRecommendationOutput | null; error: string | null }> {
  const validatedInput = GameRecommendationInputSchema.safeParse(input);

  if (!validatedInput.success) {
    return { data: null, error: validatedInput.error.errors.map(e => e.message).join(' ') };
  }

  try {
    const result = await gameRecommendation(validatedInput.data);
    
    // Sort recommendations by match score descending
    if (result?.recommendedGames) {
      result.recommendedGames.sort((a, b) => b.matchScore - a.matchScore);
    }

    return { data: result, error: null };
  } catch (e) {
    console.error(e);
    const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
    return { data: null, error: `Failed to get recommendations: ${errorMessage}` };
  }
}
