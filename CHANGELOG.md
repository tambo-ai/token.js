# @libretto/token.js

## 0.7.0

* Rebase with upstream/main
* Upgrade @libretto/openai to better handle streams.

## 0.7.1

### Patch Changes

- 2fc6edd: Fix: resolve error where new anthropic models do not work due to hardcoded max token limit

## 0.7.0

### Minor Changes

- 9b53159: Add gpt 4.1 models

## 0.6.0

https://github.com/libretto-ai/token.js/pull/17
* Fix a bug with system message for Anthropic
* Upgrade @libretto/anthropic to latest to better support tools in Libretto.

## 0.5.0

* Update @libretto/openai to latest version to allow for `templateChat` to be used in libretto params

## 0.4.0

* Cherry-pick upgrade to OpenAI 4.91.1 version from upstream PR.
* Upgrade to @libretto/openai 1.3.5, adds tools and raw responses to payload
* Add Libretto SDK on groq, perplexity, and other Openai compatible providers

## 0.3.0

* Merge from token.js/v0.5.4:

https://github.com/token-js/token.js/releases/tag/v0.5.4

## 0.2.0

* Handle Anthropic system messages correctly.

## 0.1.0

* Initial release of Libretto AI's library for users of TokenJS.

NOTE: Currently, only OpenAI and Anthropic will have events sent to Libretto.
