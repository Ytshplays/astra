
'use server';

/**
 * @fileOverview AI-powered game recommendation flow.
 *
 * - gameRecommendation - A function that provides game recommendations based on user preferences and play history.
 * - GameRecommendationInput - The input type for the gameRecommendation function.
 * - GameRecommendationOutput - The return type for the gameRecommendation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GameRecommendationInputSchema = z.object({
  playHistory: z
    .string()
    .describe("A summary of the user's game play history, including genres, titles, and platforms."),
  preferences: z
    .string()
    .describe('A description of the user preferences.'),
  friendActivity: z
    .string()
    .describe("A summary of what the user's friends are currently playing."),
});
export type GameRecommendationInput = z.infer<typeof GameRecommendationInputSchema>;

const RecommendedGameSchema = z.object({
    title: z.string().describe('The title of the recommended game.'),
    platform: z.string().describe('The platform(s) the game is available on (e.g., PC, PlayStation 5, Xbox Series X).'),
    genre: z.string().describe('The primary genre of the game.'),
    keyFeatures: z.array(z.string()).describe('A list of 3-4 key features that make this game stand out.'),
    matchScore: z.number().min(0).max(100).describe('A score from 0-100 indicating how good of a match this game is for the user.'),
    reasoning: z.string().describe('A brief explanation for why this game is being recommended to the user.')
});

const GameRecommendationOutputSchema = z.object({
  recommendedGames: z.array(RecommendedGameSchema).describe('A list of 3 recommended games.'),
  summary: z.string().describe('A summary of the reasoning behind the collective recommendations.')
});
export type GameRecommendationOutput = z.infer<typeof GameRecommendationOutputSchema>;

export async function gameRecommendation(input: GameRecommendationInput): Promise<GameRecommendationOutput> {
  return gameRecommendationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gameRecommendationPrompt',
  input: {schema: GameRecommendationInputSchema},
  output: {schema: GameRecommendationOutputSchema},
  prompt: `You are an expert game recommendation system. Your goal is to provide three highly relevant and compelling game recommendations based on the user's play history, preferences, and friend activity.

For each recommendation, provide the game's title, platform, genre, 3-4 key features, a "match score" from 0-100 indicating how well it fits the user's profile, and a brief reasoning for the recommendation. Finally, provide a summary of your overall reasoning.

User's Play History:
{{{playHistory}}}

User's Preferences:
{{{preferences}}}

User's Friend Activity:
{{{friendActivity}}}

Generate the recommendations.`,
});

const gameRecommendationFlow = ai.defineFlow(
  {
    name: 'gameRecommendationFlow',
    inputSchema: GameRecommendationInputSchema,
    outputSchema: GameRecommendationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
