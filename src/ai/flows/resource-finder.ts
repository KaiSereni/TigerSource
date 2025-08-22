'use server';

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { allResources, type Resource } from '@/lib/data';

const ResourceFinderInputSchema = z.object({
  query: z.string().describe('The user query to find RIT resources.'),
  degreeProgram: z.string().describe('The user\u0027s degree program at RIT.'),
  year: z.string().describe('The user\u0027s year of study (e.g., Freshman, Sophomore, etc.).'),
  interests: z.string().describe('The user\u0027s specific interests at RIT.'),
});
export type ResourceFinderInput = z.infer<typeof ResourceFinderInputSchema>;

const ResourceFinderOutputSchema = z.object({
  includedResources: z.array(z.string()).describe('A list of resource names that are relevant to the user\'s query and should be included in the results.'),
});
export type ResourceFinderOutput = z.infer<typeof ResourceFinderOutputSchema>;

export async function resourceFinder(input: ResourceFinderInput): Promise<ResourceFinderOutput> {
  return resourceFinderFlow(input);
}

const resourceFinderPrompt = ai.definePrompt({
  name: 'resourceFinderPrompt',
  input: {schema: z.object({ ...ResourceFinderInputSchema.shape, resources: z.array(z.object({name: z.string(), description: z.string()})) })},
  output: {schema: ResourceFinderOutputSchema},
  prompt: `You are an AI resource filter for Rochester Institute of Technology (RIT). Your task is to analyze a user's query and profile information to determine which resources from a provided list are relevant to them.

  User Profile:
  - Query: {{{query}}}
  - Degree Program: {{{degreeProgram}}}
  - Year: {{{year}}}
  - Interests: {{{interests}}}

  Here is the complete list of available resources:
  {{#each resources}}
  - Name: {{this.name}}
    Description: {{this.description}}
  {{/each}}

  Based on the user's query and profile, identify all the resources that ARE a good fit. Return a list of the names of these relevant resources to be included. If no resources seem relevant, return an empty list.
  `,
});

const resourceFinderFlow = ai.defineFlow(
  {
    name: 'resourceFinderFlow',
    inputSchema: ResourceFinderInputSchema,
    outputSchema: ResourceFinderOutputSchema,
  },
  async input => {
    const {output} = await resourceFinderPrompt({
        ...input,
        resources: allResources.map(({name, description}) => ({name, description})),
    });
    return output!;
  }
);
