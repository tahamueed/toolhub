import { NextResponse } from 'next/server';
import { naturalizeText, NaturalizerOptions } from '@/lib/ai-naturalizer';

export async function POST(request: Request) {
  try {
    const { input, options } = (await request.json()) as {
      input?: string;
      options?: NaturalizerOptions;
    };
    if (!input) return NextResponse.json({ error: 'Input text is required.' }, { status: 400 });
    
    // Fallback options
    const opts = options || {
      mode: 'academic',
      academicLevel: 'general',
      complexity: 'moderate',
      formality: 50,
      sentenceVariation: 50,
      vocabulary: 'standard',
      targetAudience: 'general',
      strength: 'balanced',
      preserveCitations: true
    };
    
    const result = await naturalizeText(input, opts as NaturalizerOptions);
    return NextResponse.json({ rewrittenText: result.rewrittenText, isLocal: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
