/**
 * @fileOverview An AI flow for finding university clubs based on a user's query and profile.
 * 
 * - findClubs - A function that returns a list of clubs matching the user's interests.
 * - FindClubsInput - The input type for the function.
 * - FindClubsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { allClubs } from '@/lib/data';

export const FindClubsInputSchema = z.object({
  query: z.string().describe('The user\'s search query describing the types of clubs they are interested in.'),
  degreeProgram: z.string().optional().describe('The user\'s degree program at RIT.'),
  year: z.string().optional().describe('The user\'s year of study (e.g., Freshman, Sophomore, etc.).'),
  interests: z.string().optional().describe('A list of the user\'s general interests.'),
});
export type FindClubsInput = z.infer<typeof FindClubsInputSchema>;


const FindClubsOutputSchema = z.object({
  excludedClubs: z.array(z.string()).describe('A list of club names that are not relevant to the user\'s query and should be excluded from the results.'),
});
export type FindClubsOutput = z.infer<typeof FindClubsOutputSchema>;


export async function findClubs(input: FindClubsInput): Promise<FindClubsOutput> {
  return findClubsFlow(input);
}

const findClubsPrompt = ai.definePrompt({
    name: 'findClubsPrompt',
    input: { schema: z.object({ ...FindClubsInputSchema.shape, clubs: z.array(z.object({name: z.string(), description: z.string()})) })},
    output: { schema: FindClubsOutputSchema },
    prompt: `You are an AI assistant helping a student find a university club at RIT. Your task is to analyze the user's query and profile information to determine which clubs from a provided list are NOT relevant to them.

    User's Search Query:
    "{{query}}"

    {{#if degreeProgram}}
    User's Profile:
    - Degree Program: {{degreeProgram}}
    - Year: {{year}}
    - General Interests: {{interests}}
    {{/if}}

    Here is the complete list of available clubs:
    {{#each clubs}}
    - Name: {{this.name}}
      Description: {{this.description}}
    {{/each}}

    Based on the user's query and their profile, identify the clubs that are NOT a good fit. Return a list of the names of these irrelevant clubs to be excluded. If a club aligns with even one of the user's interests, it should not be excluded.
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
        clubs: allClubs.map(({name, description}) => ({name, description})),
    });
    return output!;
  }
);

    