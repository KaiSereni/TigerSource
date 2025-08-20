'use server';

/**
 * @fileOverview This flow allows users to provide feedback on the accuracy and usefulness of search results.
 *
 * - improveSearch - A function that handles the feedback submission process.
 * - ImproveSearchInput - The input type for the improveSearch function.
 * - ImproveSearchOutput - The return type for the improveSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ImproveSearchInputSchema = z.object({
  query: z.string().describe('The original search query.'),
  results: z.string().describe('The search results that were returned.'),
  feedback: z.string().describe('The user feedback on the search results.'),
  rating: z.number().min(1).max(5).describe('The user rating of the search results (1-5).'),
});
export type ImproveSearchInput = z.infer<typeof ImproveSearchInputSchema>;

const ImproveSearchOutputSchema = z.object({
  success: z.boolean().describe('Indicates whether the feedback was successfully submitted.'),
  message: z.string().describe('A message indicating the status of the feedback submission.'),
});
export type ImproveSearchOutput = z.infer<typeof ImproveSearchOutputSchema>;

export async function improveSearch(input: ImproveSearchInput): Promise<ImproveSearchOutput> {
  return improveSearchFlow(input);
}

const improveSearchFlow = ai.defineFlow(
  {
    name: 'improveSearchFlow',
    inputSchema: ImproveSearchInputSchema,
    outputSchema: ImproveSearchOutputSchema,
  },
  async input => {
    // In a real-world application, this is where you would save the feedback
    // to a database or other storage mechanism.
    // For this example, we'll just log the feedback to the console.
    console.log('Feedback received:', input);

    return {
      success: true,
      message: 'Thank you for your feedback!',
    };
  }
);
