import { CompletionParams, OpenAICompatibleModel, ProviderCompletionParams } from '../chat/index.js';
import { CompletionResponse, StreamCompletionResponse } from '../userTypes/index.js';
import { BaseHandler } from './base.js';
export declare class OpenAICompatibleHandler extends BaseHandler<OpenAICompatibleModel> {
    protected validateInputs(body: CompletionParams): void;
    determineAPIKey: () => string;
    create(body: ProviderCompletionParams<'openai'>): Promise<CompletionResponse | StreamCompletionResponse>;
}
