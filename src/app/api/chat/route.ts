import { NextResponse } from 'next/server';

import { openai } from '@/lib/openai';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    const response =
      await openai.responses.create({
        model:
          process.env.OPENAI_MODEL ??
          'gpt-5',
        input: message,
      });

    return NextResponse.json({
      output: response.output_text,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          'Unable to generate response.',
      },
      {
        status: 500,
      },
    );
  }
}