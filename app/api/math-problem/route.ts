import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabaseClient';
import type { GeneratedProblem } from '@/lib/types';

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Function to generate difficulty-specific prompt
function getProblemGenerationPrompt(
  difficulty: 'easy' | 'medium' | 'hard',
  problemType: 'mixed' | 'addition' | 'subtraction' | 'multiplication' | 'division'
): string {
  const difficultyInstructions = {
    easy: `
EASY Level Requirements:
- Use simple, straightforward language
- Problems should require 1-2 steps to solve
- Use smaller, round numbers (under 100 for most operations)
- Focus on: Basic addition/subtraction, simple fractions (halves, quarters), simple decimals (1-2 decimal places), basic money problems
- Example: "Sarah has 3 bags of apples. Each bag has 8 apples. How many apples does she have in total?"`,
    medium: `
MEDIUM Level Requirements:
- Use age-appropriate language with some complexity
- Problems should require 2-3 steps to solve
- Use moderate numbers and mixed operations
- Focus on: Multi-step operations, fractions with mixed numbers, decimals up to 3 places, percentage basics, simple ratio
- Example: "A shop sold 2 1/2 kg of rice at $3.60 per kg and 1 1/4 kg of beans at $2.80 per kg. What was the total cost?"`,
    hard: `
HARD Level Requirements:
- Use complex scenarios with multiple steps
- Problems should require 3-4 steps to solve
- Use larger numbers and multiple operations
- Focus on: Complex word problems, advanced fractions, percentage with GST/discount/interest, rate problems, ratio, area/volume
- Example: "A machine produces 360 toys in 6 hours. If the factory runs for 8 hours and packages the toys in boxes of 12, how many boxes can be filled?"`
  };

  const problemTypeInstructions = {
    mixed: '- Use ANY mathematical operation (addition, subtraction, multiplication, division, or combinations)',
    addition: '- Focus PRIMARILY on addition operations (may include some subtraction for context)',
    subtraction: '- Focus PRIMARILY on subtraction operations (may include some addition for context)',
    multiplication: '- Focus PRIMARILY on multiplication operations (may include division for context)',
    division: '- Focus PRIMARILY on division operations (may include multiplication for context)'
  };

  return `Generate a math word problem suitable for a Primary 5 student (age 10-11) based on the Singapore Mathematics Curriculum.

${difficultyInstructions[difficulty]}

Problem Type Requirement:
${problemTypeInstructions[problemType]}

Primary 5 Topics (choose ONE randomly):
- Whole numbers: Four operations, order of operations, word problems
- Fractions: Addition, subtraction, multiplication of fractions and mixed numbers
- Decimals: Four operations with decimals
- Percentage: Finding percentage of a whole, discount, GST, simple interest
- Rate: Problems involving rate (e.g., speed, price per unit)
- Ratio: Simple ratio problems (dividing quantities in a given ratio)
- Area: Area of rectangles, squares, triangles, and composite figures
- Volume: Volume of cubes and cuboids
- Money: Real-world money problems with decimals

Requirements:
- Use real-world contexts (shopping, travel, measurements, school scenarios)
- The final answer must be a single numerical value (whole number or decimal)

Return ONLY a JSON object with this exact structure (no markdown, no code blocks):
{
  "problem_text": "The complete word problem as a string",
  "final_answer": numeric_value_only,
  "hint": "A helpful hint that guides without giving away the answer",
  "solution_steps": ["Step 1: ...", "Step 2: ...", "Step 3: ..."]
}

Example:
{
  "problem_text": "A bakery sold 156 cupcakes in the morning and 234 cupcakes in the afternoon. Each cupcake costs $2.50. How much money did the bakery collect from selling cupcakes that day?",
  "final_answer": 975,
  "hint": "First find the total number of cupcakes sold, then multiply by the price per cupcake.",
  "solution_steps": [
    "Step 1: Add the cupcakes sold: 156 + 234 = 390 cupcakes",
    "Step 2: Multiply by the price: 390 × $2.50 = $975"
  ]
}`;
}

// Function to generate problem using Gemini AI
async function generateProblemWithAI(
  difficulty: 'easy' | 'medium' | 'hard',
  problemType: 'mixed' | 'addition' | 'subtraction' | 'multiplication' | 'division'
): Promise<GeneratedProblem> {
  const prompt = getProblemGenerationPrompt(difficulty, problemType);
  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  // Parse JSON response
  const cleanedText = text.trim().replace(/```json\n?|\n?```/g, '');
  const parsed = JSON.parse(cleanedText);

  return {
    problem_text: parsed.problem_text,
    final_answer: Number(parsed.final_answer),
    hint: parsed.hint,
    solution_steps: parsed.solution_steps || [],
  };
}

// POST /api/math-problem - Generate new problem
export async function POST(request: NextRequest) {
  try {
    // Get difficulty and problemType from request body
    const body = await request.json().catch(() => ({}));
    const difficulty = body.difficulty || 'medium';
    const problemType = body.problemType || 'mixed';

    // Validate difficulty
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return NextResponse.json(
        { error: 'Invalid difficulty level' },
        { status: 400 }
      );
    }

    // Validate problem type
    if (!['mixed', 'addition', 'subtraction', 'multiplication', 'division'].includes(problemType)) {
      return NextResponse.json(
        { error: 'Invalid problem type' },
        { status: 400 }
      );
    }

    // Generate problem using AI
    const generatedProblem = await generateProblemWithAI(difficulty, problemType);

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
      hint: generatedProblem.hint,
      solution_steps: generatedProblem.solution_steps,
    });
  } catch (error) {
    console.error('Error generating problem:', error);
    return NextResponse.json(
      { error: 'Failed to generate problem' },
      { status: 500 }
    );
  }
}
