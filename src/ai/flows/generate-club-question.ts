'use server';

/**
 * @fileOverview An AI flow for generating a quiz question to help narrow down a list of university clubs.
 * 
 * - generateClubQuestion - A function that creates a new quiz question.
 * - GenerateClubQuestionInput - The input type for the function.
 * - GenerateClubQuestionOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import type { Club } from '@/lib/data';

const HistoryItemSchema = z.object({
    question: z.string().describe('A previously asked question.'),
    answers: z.array(z.string()).describe('The user\'s answers to that question.'),
});

const ClubSchema = z.object({
    name: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
});

const GenerateClubQuestionInputSchema = z.object({
  clubs: z.array(ClubSchema).describe('The current, filtered list of clubs.'),
  history: z.array(HistoryItemSchema).describe('The history of questions asked and answers given so far.'),
});
export type GenerateClubQuestionInput = z.infer<typeof GenerateClubQuestionInputSchema>;

const GenerateClubQuestionOutputSchema = z.object({
  questionText: z.string().describe('The text of the generated multiple-choice question.'),
  options: z.array(z.object({
    value: z.string().describe('A concise value for the option, suitable for an HTML value attribute.'),
    label: z.string().describe('The user-facing label for the option.'),
  })).describe('An array of 2 to 4 options for the question.'),
});
export type GenerateClubQuestionOutput = z.infer<typeof GenerateClubQuestionOutputSchema>;


export async function generateClubQuestion(input: GenerateClubQuestionInput): Promise<GenerateClubQuestionOutput> {
  return generateClubQuestionFlow(input);
}

const generateClubQuestionPrompt = ai.definePrompt({
  name: 'generateClubQuestionPrompt',
  input: { schema: GenerateClubQuestionInputSchema },
  output: { schema: GenerateClubQuestionOutputSchema },
  prompt: `You are an expert at helping university students find the right club for them. Your task is to generate a single, insightful, multiple-choice question to narrow down the provided list of clubs.

  RULES:
  - The question must be designed to eliminate a significant portion of the remaining clubs.
  - The question should be engaging and easy to understand for a university student.
  - Do NOT repeat questions or topics that are evident from the provided history.
  - Provide between 2 and 4 distinct multiple-choice options.
  - The options should be based on the characteristics of the remaining clubs (e.g., their tags, descriptions, or names).

  Here is the history of the quiz so far:
  {{#if history.length}}
    {{#each history}}
      - Question: "{{this.question}}"
      - User answered: {{#each this.answers}}"{{this}}"{{/each}}
    {{/each}}
  {{else}}
    No questions have been asked yet.
  {{/if}}

  Here is the current list of available clubs:
  {{#each clubs}}
  - {{this.name}}: {{this.description}} (Tags: {{#each this.tags}}{{this}}{{#unless @last}}, {{/unless}}{{/each}})
  {{/each}}

  Based on the remaining clubs and the quiz history, generate the next question.
  `,
});


const generateClubQuestionFlow = ai.defineFlow(
  {
    name: 'generateClubQuestionFlow',
    inputSchema: GenerateClubQuestionInputSchema,
    outputSchema: GenerateClubQuestionOutputSchema,
  },
  async (input) => {
    const { output } = await generateClubQuestionPrompt(input);
    return output!;
  }
);
