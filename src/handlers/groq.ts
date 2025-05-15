import OpenAI from 'openai';
import { Stream } from 'openai/streaming';
import { ChatCompletionChunk, ChatCompletionMessageParam } from 'openai/resources/chat/completions';

import { GroqModel, ProviderCompletionParams } from '../chat/index.js';
import {
  CompletionResponse,
  StreamCompletionResponse,
} from '../userTypes/index.js';
import { BaseHandler } from './base.js';
import { InputError } from './types.js';

// Helper function to handle streaming responses, similar to OpenAIHandler
async function* streamGroq(
  response: Stream<ChatCompletionChunk>
): StreamCompletionResponse {
  for await (const chunk of response) {
    yield chunk;
  }
}

export class GroqHandler extends BaseHandler<GroqModel> {
  validateInputs(body: ProviderCompletionParams<'groq'>): void {
    super.validateInputs(body);

    if (body.response_format?.type === 'json_object') {
      if (body.stream) {
        throw new InputError(
          `Groq does not support streaming when the 'response_format' is 'json_object'.`
        );
      }

      if (body.stop !== null && body.stop !== undefined) {
        throw new InputError(
          `Groq does not support the 'stop' parameter when the 'response_format' is 'json_object'.`
        );
      }
    }
  }

  async create(
    body: ProviderCompletionParams<'groq'>
  ): Promise<CompletionResponse | StreamCompletionResponse> {
    this.validateInputs(body);

    const apiKey = this.opts.apiKey ?? process.env.GROQ_API_KEY;
    // Note: This uses the standard 'openai' SDK, not a Libretto-specific one.
    const client = new OpenAI({
      apiKey,
      baseURL: 'https://api.groq.com/openai/v1',
    });

    if (apiKey === undefined) {
      throw new InputError(
        'API key is required for Groq, define GROQ_API_KEY in your environment or specifty the apiKey option.'
      );
    }

    // The 'libretto' property is part of ProviderCompletionParams for Libretto.ai integration.
    // However, Groq's API (via the standard OpenAI SDK) does not support this property.
    // Similarly, 'provider' is an internal property for token.js and not part of the Groq API.
    // These properties are removed to ensure compatibility with the Groq API.
    // 'model' is pulled out separately to ensure it's explicitly in the final request body,
    // as it's a required top-level parameter for the OpenAI SDK's create method.
    const { libretto, provider, messages, model, ...otherOpenAIParams } = body as any;

    const processedMessages = messages.map((message: ChatCompletionMessageParam) => {
      if (message.role === 'assistant') {
        // If assistant content is an array like [{type: 'text', text: '...'}],
        // and not a tool_calls message, convert it to a simple string for Groq compatibility.
        // This handles cases where the primary tambo-cloud logic sends structured assistant content
        // that Libretto-specific clients for other providers might handle, but the standard OpenAI SDK won't.
        if (
          Array.isArray(message.content) &&
          message.content.length === 1 &&
          message.content[0].type === 'text' &&
          typeof message.content[0].text === 'string' &&
          !message.tool_calls // Ensure it's not a tool call message which might have null/string content
        ) {
          return { ...message, content: message.content[0].text };
        }
        // If content is null and tool_calls are present, it's valid.
        // If content is a string (even with tool_calls), it's valid.
        // Other array structures for assistant content without tool_calls are likely errors for this API.
      }
      // Note: User messages can also have array content for multimodal (e.g., images).
      // Groq (via OpenAI SDK) expects string or array of ChatCompletionContentPart.
      // Since Groq doesn't support images, user text content should ideally be stringified
      // if it's wrapped in an array like assistant messages were.
      // However, we are only addressing the specific error encountered for assistant messages.
      return message;
    });

    // Construct the body for the OpenAI client, ensuring all required fields are present.
    const finalApiBody: OpenAI.Chat.Completions.ChatCompletionCreateParams = {
      model: model, // 'model' is a required parameter
      messages: processedMessages,
      ...otherOpenAIParams, // Spreads other valid OpenAI parameters like temperature, tools, stream etc.
    };

    if (finalApiBody.stream) {
      const stream = await client.chat.completions.create(
        finalApiBody as OpenAI.Chat.Completions.ChatCompletionCreateParamsStreaming
      );
      return streamGroq(stream);
    } else {
      return client.chat.completions.create(
        finalApiBody as OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming
      );
    }
  }
}