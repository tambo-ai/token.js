import { LLMChat, LLMProvider } from './chat/index.js';
import { models } from './models.js';
import { ConfigOptions } from './userTypes/index.js';
export * from './models.js';
export * from './userTypes/index.js';
type TokenJSInterface = {
    chat: LLMChat;
    extendModelList<P extends Exclude<LLMProvider, 'openrouter' | 'openai-compatible'>>(provider: P, name: string, featureSupport: extendedModelFeatureSupport<P>): void;
};
export type extendedModelFeatureSupport<P extends LLMProvider> = ((typeof models)[P]['models'] extends readonly string[] ? (typeof models)[P]['models'][number] : never) | {
    streaming: boolean;
    json: boolean;
    toolCalls: boolean;
    images: boolean;
};
type extendedModelList = Array<{
    provider: LLMProvider;
    name: string;
    featureSupport: extendedModelFeatureSupport<any>;
}>;
export declare class TokenJS implements TokenJSInterface {
    private opts;
    static extendedModelList: Readonly<extendedModelList>;
    chat: LLMChat;
    constructor({ ...opts }?: ConfigOptions);
    extendedModelExist<P extends Exclude<LLMProvider, 'openrouter' | 'openai-compatible'>>(provider: P, name: string): boolean;
    extendModelList<P extends Exclude<LLMProvider, 'openrouter' | 'openai-compatible'>>(provider: P, name: string, featureSupport: extendedModelFeatureSupport<P>): this;
}
