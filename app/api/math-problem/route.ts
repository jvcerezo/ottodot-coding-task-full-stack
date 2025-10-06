import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabaseClient';
import type { GeneratedProblem } from '@/lib/types';

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Prompt for generating Primary 5 math problems
const PROBLEM_GENERATION_PROMPT = `Generate a math word problem suitable for a Primary 5 student (age 10-11) based on the Singapore Mathematics Curriculum.

Primary 5 Topics (choose ONE randomly):
- Whole numbers: Four operations, order of operations, word problems up to 10 million
- Fractions: Addition, subtraction, multiplication of fractions and mixed numbers
- Decimals: Four operations with decimals up to 3 decimal places
- Percentage: Finding percentage of a whole, discount, GST, simple interest
- Rate: Problems involving rate (e.g., speed, price per unit)
- Ratio: Simple ratio problems (dividing quantities in a given ratio)
- Area: Area of rectangles, squares, triangles, and composite figures
- Volume: Volume of cubes and cuboids
- Money: Real-world money problems with decimals

Requirements:
- Use real-world contexts (shopping, travel, measurements, school scenarios)
- The final answer must be a single numerical value (whole number or decimal)
- Difficulty should match Primary 5 level (age 10-11)
- Problem should require 2-3 steps to solve

Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
{
  "problem_text": "The complete word problem as a string",
  "final_answer": numeric_value_only
}

Example:
{
  "problem_text": "A bakery sold 156 cupcakes in the morning and 234 cupcakes in the afternoon. Each cupcake costs $2.50. How much money did the bakery collect from selling cupcakes that day?",
  "final_answer": 975
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
