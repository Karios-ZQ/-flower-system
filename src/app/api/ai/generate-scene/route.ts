import { NextRequest, NextResponse } from 'next/server';
import { ImageGenerationClient, Config, HeaderUtils } from 'coze-coding-dev-sdk';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, customPrompt } = body;

    // Extract forward headers for proper tracing and authentication
    const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);

    // Initialize the image generation client
    const config = new Config();
    const client = new ImageGenerationClient(config, customHeaders);

    // Use custom prompt if provided, otherwise use default flower prompt
    const finalPrompt = customPrompt || prompt || 'beautiful fresh flowers bouquet, professional product photography, high quality, 8K detail';

    // Generate the image using the provided prompt
    const response = await client.generate({
      prompt: finalPrompt,
      size: '2K',
      watermark: false, // Disable watermark for cleaner product images
    });

    const helper = client.getResponseHelper(response);

    if (helper.success && helper.imageUrls.length > 0) {
      return NextResponse.json({
        success: true,
        imageUrls: helper.imageUrls,
        prompt: finalPrompt,
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          errors: helper.errorMessages || ['Image generation failed'],
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Image generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Image generation failed',
      },
      { status: 500 }
    );
  }
}
