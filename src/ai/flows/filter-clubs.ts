'use server';
/**
 * @fileOverview An AI flow for filtering a list of university clubs based on a user's answer to a question.
 * 
 * - filterClubs - A function that decides which clubs to remove from a list.
 * - FilterClubsInput - The input type for the function.
 * - FilterClubsOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ClubSchema = z.object({
    name: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
});

const FilterClubsInputSchema = z.object({
  clubs: z.array(ClubSchema).describe('The current list of clubs to be filtered.'),
  question: z.string().describe('The question that was asked to the user.'),
  answers: z.array(z.string()).describe('The user\'s selected answers to the question.'),
});
export type FilterClubsInput = z.infer<typeof FilterClubsInputSchema>;


const FilterClubsOutputSchema = z.object({
  clubsToRemove: z.array(z.object({
      name: z.string().describe("The name of a club that should be removed from the list.")
  })).describe('A list of clubs to remove based on the user\'s answer.'),
});
export type FilterClubsOutput = z.infer<typeof FilterClubsOutputSchema>;


export async function filterClubs(input: FilterClubsInput): Promise<FilterClubsOutput> {
  return filterClubsFlow(input);
}

const filterClubsPrompt = ai.definePrompt({
    name: 'filterClubsPrompt',
    input: { schema: FilterClubsInputSchema },
    output: { schema: FilterClubsOutputSchema },
    prompt: `You are an AI assistant helping a student find a university club. Your task is to analyze the user's answers to a question and decide which clubs from the list are no longer a good fit.

    The user was asked the following question:
    "{{question}}"

    The user selected the following answer(s):
    {{#each answers}}
    - "{{this}}"
    {{/each}}

    Here is the list of clubs to filter:
    {{#each clubs}}
    - {{this.name}}: {{this.description}} (Tags: {{#each this.tags}}{{this}}{{#unless @last}}, {{/unless}}{{/each}})
    {{/each}}

    Based on the user's answer(s), identify the clubs that should be REMOVED from the list. Only list clubs that clearly do not match the user's expressed preferences.
    `
});

const filterClubsFlow = ai.defineFlow(
  {
    name: 'filterClubsFlow',
    inputSchema: FilterClubsInputSchema,
    outputSchema: FilterClubsOutputSchema,
  },
  async (input) => {
    const { output } = await filterClubsPrompt(input);
    return output!;
  }
);
