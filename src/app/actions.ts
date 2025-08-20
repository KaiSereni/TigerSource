'use server';

import { resourceFinder, type ResourceFinderInput } from '@/ai/flows/resource-finder';
import { improveSearch, type ImproveSearchInput } from '@/ai/flows/improve-search';
import { generateClubQuestion, type GenerateClubQuestionInput } from '@/ai/flows/generate-club-question';
import { filterClubs, type FilterClubsInput } from '@/ai/flows/filter-clubs';
import type { Club } from '@/lib/data';

export async function findResourceAction(input: ResourceFinderInput) {
  try {
    const result = await resourceFinder(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in findResourceAction:', error);
    return { success: false, error: 'Failed to find resource. The AI model may be temporarily unavailable. Please try again later.' };
  }
}

export async function submitFeedbackAction(input: ImproveSearchInput) {
  try {
    const result = await improveSearch(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('Error in submitFeedbackAction:', error);
    return { success: false, error: 'Failed to submit feedback. Please try again.' };
  }
}

export async function generateClubQuestionAction(input: GenerateClubQuestionInput) {
    try {
        const result = await generateClubQuestion(input);
        return { success: true, data: result };
    } catch (error) {
        console.error('Error in generateClubQuestionAction:', error);
        return { success: false, error: 'Failed to generate a new question. Please try again.' };
    }
}

export async function filterClubsAction(input: FilterClubsInput) {
    try {
        const result = await filterClubs(input);
        const clubsToRemove = new Set(result.clubsToRemove.map(c => c.name));
        const remainingClubs = input.clubs.filter(club => !clubsToRemove.has(club.name));
        return { success: true, data: remainingClubs };
    } catch (error) {
        console.error('Error in filterClubsAction:', error);
        return { success: false, error: 'Failed to filter clubs. Please try again.' };
    }
}
