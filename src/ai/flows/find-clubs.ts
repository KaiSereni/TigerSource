/**
 * @fileOverview An AI flow for finding university clubs based on a user's query and profile.
 * 
 * - findClubs - A function that returns a list of clubs matching the user's interests.
 * - FindClubsInput - The input type for the function.
 * - FindClubsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { allClubs } from '@/lib/data';

const ClubSchema = z.object({
    name: z.string(),
    description: z.string(),
    id: z.string(),
});

export const FindClubsInputSchema = z.object({
  query: z.string().describe('The user\'s search query describing the types of clubs they are interested in.'),
  degreeProgram: z.string().optional().describe('The user\'s degree program at RIT.'),
  year: z.string().optional().describe('The user\'s year of study (e.g., Freshman, Sophomore, etc.).'),
  interests: z.string().optional().describe('A list of the user\'s general interests.'),
});
export type FindClubsInput = z.infer<typeof FindClubsInputSchema>;


const FindClubsOutputSchema = z.object({
  matchingClubs: z.array(z.object({
      name: z.string().describe("The name of a club that is a good match for the user."),
      reason: z.string().describe("A brief explanation of why this club is a good match.")
  })).describe('A list of clubs that best match the user\'s query and profile.'),
});
export type FindClubsOutput = z.infer<typeof FindClubsOutputSchema>;


export async function findClubs(input: FindClubsInput): Promise<FindClubsOutput> {
  return findClubsFlow(input);
}

const findClubsPrompt = ai.definePrompt({
    name: 'findClubsPrompt',
    input: { schema: FindClubsInputSchema },
    output: { schema: FindClubsOutputSchema },
    prompt: `You are an AI assistant helping a student find a university club at RIT. Your task is to analyze the user's query and profile information to recommend the most relevant clubs from the provided list.

    User's Search Query:
    "{{query}}"

    User's Profile:
    - Degree Program: {{degreeProgram}}
    - Year: {{year}}
    - General Interests: {{interests}}

    Here is the complete list of available clubs:
    {{#each clubs}}
    - Name: {{this.name}}
      Description: {{this.description}}
    {{/each}}

    Based on the user's query and their profile, identify the clubs that are the best fit. \
    Provide a list of matching clubs. Consider how a club's description aligns with the user's explicit query and implicit interests from their profile. \
    If the user lists multiple interests, don't exclude clubs that only align with one of them.
    `
});

const findClubsFlow = ai.defineFlow(
  {
    name: 'findClubsFlow',
    inputSchema: FindClubsInputSchema,
    outputSchema: FindClubsOutputSchema,
  },
  async (input) => {
    const { output } = await findClubsPrompt({
        ...input,
        clubs: allClubs
    } as any);
    return output!;
  }
);
