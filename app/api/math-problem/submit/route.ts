import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { supabase } from '@/lib/supabaseClient';

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Function to generate personalized feedback
async function generateFeedback(
  problemText: string,
  correctAnswer: number,
  userAnswer: number,
  isCorrect: boolean
): Promise<string> {
  const prompt = `You are a friendly and encouraging math tutor for Primary 5 students (age 10-11).

Problem: ${problemText}
Correct Answer: ${correctAnswer}
Student's Answer: ${userAnswer}
Result: ${isCorrect ? 'CORRECT' : 'INCORRECT'}

Generate personalized, encouraging feedback for the student.

If CORRECT:
- Praise their work
- Briefly explain why their answer is right
- Keep it positive and motivating

If INCORRECT:
- Be encouraging and supportive
- Gently explain what went wrong
- Show the correct approach or calculation
- Motivate them to try again

Keep the feedback concise (2-4 sentences), age-appropriate, and helpful.`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

// POST /api/math-problem/submit - Submit answer
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { session_id, user_answer } = body;

    if (!session_id || user_answer === undefined) {
      return NextResponse.json(
        { error: 'Missing session_id or user_answer' },
        { status: 400 }
      );
    }

    // Get the problem session from database
    const { data: session, error: sessionError } = await supabase
      .from('math_problem_sessions')
      .select('*')
      .eq('id', session_id)
      .single();

    if (sessionError || !session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }

    // Check if answer is correct
    const isCorrect = Number(user_answer) === Number(session.correct_answer);

    // Generate AI feedback
    const feedbackText = await generateFeedback(
      session.problem_text,
      session.correct_answer,
      Number(user_answer),
      isCorrect
    );

    // Save submission to database
    const { error: submissionError } = await supabase
      .from('math_problem_submissions')
      .insert({
        session_id,
        user_answer: Number(user_answer),
        is_correct: isCorrect,
        feedback_text: feedbackText,
      });

    if (submissionError) throw submissionError;

    return NextResponse.json({
      is_correct: isCorrect,
      feedback_text: feedbackText,
    });
  } catch (error) {
    console.error('Error submitting answer:', error);
    return NextResponse.json(
      { error: 'Failed to submit answer' },
      { status: 500 }
    );
  }
}
