import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabaseClient';
import type { GeneratedProblem } from '@/lib/types';

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

// Prompt for generating Primary 5 math problems
const PROBLEM_GENERATION_PROMPT = `Generate a math word problem suitable for a Primary 5 student (age 10-11).

Requirements:
- The problem should involve basic operations: addition, subtraction, multiplication, or division
- Include real-world context (money, measurement, time, distance, etc.)
- The final answer must be a single numerical value (not a fraction or expression)
- Difficulty level should be appropriate for Primary 5

Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
{
  "problem_text": "The complete word problem as a string",
  "final_answer": numeric_value_only
}

Example:
{
  "problem_text": "Sarah has 45 stickers. She gives 12 stickers to her friend and buys 23 more. How many stickers does Sarah have now?",
  "final_answer": 56
}`;

// Function to generate problem using Gemini AI
async function generateProblemWithAI(): Promise<GeneratedProblem> {
  const result = await model.generateContent(PROBLEM_GENERATION_PROMPT);
  const response = result.response;
  const text = response.text();

  // Parse JSON response
  const cleanedText = text.trim().replace(/```json\n?|\n?```/g, '');
  const parsed = JSON.parse(cleanedText);

  return {
    problem_text: parsed.problem_text,
    final_answer: Number(parsed.final_answer),
  };
}

// POST /api/math-problem - Generate new problem
export async function POST() {
  try {
    // Generate problem using AI
    const generatedProblem = await generateProblemWithAI();

    // Save to database
    const { data, error } = await supabase
      .from('math_problem_sessions')
      .insert({
        problem_text: generatedProblem.problem_text,
        correct_answer: generatedProblem.final_answer,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      session_id: data.id,
      problem_text: data.problem_text,
    });
  } catch (error) {
    console.error('Error generating problem:', error);
    return NextResponse.json(
      { error: 'Failed to generate problem' },
      { status: 500 }
    );
  }
}
