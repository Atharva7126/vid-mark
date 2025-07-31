'use server';

/**
 * @fileOverview Summarizes the transcript of a YouTube video.
 *
 * - summarizeYouTubeVideo - A function that summarizes a YouTube video.
 * - SummarizeYouTubeVideoInput - The input type for the summarizeYouTubeVideo function.
 * - SummarizeYouTubeVideoOutput - The return type for the summarizeYouTubeVideo function.
 */

import { ai } from '../genkit';
import { z } from 'genkit';

const SummarizeYouTubeVideoInputSchema = z.object({
  transcript: z.string().describe('The transcript text of the YouTube video.'),
});
export type SummarizeYouTubeVideoInput = z.infer<typeof SummarizeYouTubeVideoInputSchema>;

// Output schema: summarized result
const SummarizeYouTubeVideoOutputSchema = z.object({
  summary: z.string().describe('A summary of the YouTube video transcript.'),
});
export type SummarizeYouTubeVideoOutput = z.infer<typeof SummarizeYouTubeVideoOutputSchema>;

// Main function to call externally
export async function summarizeYouTubeVideo(
  input: SummarizeYouTubeVideoInput
): Promise<SummarizeYouTubeVideoOutput> {
  return summarizeYouTubeVideoFlow(input);
}

// Prompt template
const prompt = ai.definePrompt({
  name: 'summarizeYouTubeVideoPrompt',
  input: { schema: SummarizeYouTubeVideoInputSchema },
  output: { schema: SummarizeYouTubeVideoOutputSchema },
  prompt: `Summarize the following transcript. Focus on the key points and be concise.\n\nTranscript:\n{{{transcript}}}`,
});

// Flow definition
const summarizeYouTubeVideoFlow = ai.defineFlow(
  {
    name: 'summarizeYouTubeVideoFlow',
    inputSchema: SummarizeYouTubeVideoInputSchema,
    outputSchema: SummarizeYouTubeVideoOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
