'use server';

import { resourceFinder, type ResourceFinderInput } from '@/ai/flows/resource-finder';
import { improveSearch, type ImproveSearchInput } from '@/ai/flows/improve-search';

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
