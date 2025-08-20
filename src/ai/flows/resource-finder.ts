// ResourceFinder flow
'use server';

/**
 * @fileOverview An AI resource finder for RIT. It leverages user profile information as context to locate relevant RIT resources based on the user's query.
 *
 * - resourceFinder - A function that handles the resource finding process.
 * - ResourceFinderInput - The input type for the resourceFinder function.
 * - ResourceFinderOutput - The return type for the resourceFinder function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResourceFinderInputSchema = z.object({
  query: z.string().describe('The user query to find RIT resources.'),
  degreeProgram: z.string().describe('The user\u0027s degree program at RIT.'),
  year: z.string().describe('The user\u0027s year of study (e.g., Freshman, Sophomore, etc.).'),
  interests: z.string().describe('The user\u0027s specific interests at RIT.'),
});
export type ResourceFinderInput = z.infer<typeof ResourceFinderInputSchema>;

const ResourceFinderOutputSchema = z.object({
  resourceName: z.string().describe('The name of the RIT resource.'),
  resourceLink: z.string().describe('The link to the RIT resource.'),
  description: z.string().describe('A brief description of the RIT resource.'),
});
export type ResourceFinderOutput = z.infer<typeof ResourceFinderOutputSchema>;

export async function resourceFinder(input: ResourceFinderInput): Promise<ResourceFinderOutput> {
  return resourceFinderFlow(input);
}

const resourceFinderPrompt = ai.definePrompt({
  name: 'resourceFinderPrompt',
  input: {schema: ResourceFinderInputSchema},
  output: {schema: ResourceFinderOutputSchema},
  prompt: `You are an AI resource finder for RIT. You will use the user's query and profile information to locate the right RIT resource. You will provide the name of the resource, the link to the resource, and a brief description of the resource.

  User Query: {{{query}}}
  Degree Program: {{{degreeProgram}}}
  Year: {{{year}}}
  Interests: {{{interests}}}

  Consider the following RIT resources:
  - My RIT: https://my.rit.edu, A personalized dashboard for accessing RIT resources.
  - SIS: https://sis.rit.edu, The Student Information System for managing academic records.
  - StarRez: https://starrez.rit.edu, The housing portal for on-campus living.
  - CampusGroups: https://campusgroups.rit.edu, A platform for finding clubs and campus events.

  Based on the user query and profile information, determine the best RIT resource for the user.
  `,
});

const resourceFinderFlow = ai.defineFlow(
  {
    name: 'resourceFinderFlow',
    inputSchema: ResourceFinderInputSchema,
    outputSchema: ResourceFinderOutputSchema,
  },
  async input => {
    const {output} = await resourceFinderPrompt(input);
    return output!;
  }
);
