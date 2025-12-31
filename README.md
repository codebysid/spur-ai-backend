# Spur – AI-Powered Customer Support Chat

Live here: https://spur-ai-frontend-one.vercel.app/

Spur is a lightweight AI-powered customer support chat application for an imaginary e-commerce store.  
It demonstrates **frontend + backend architecture**, **LLM integration**, **rate limiting**, **Redis usage**, and **clean system design**.

---

## 🧱 Tech Stack

- Node.js
- Express.js
- TypeScript
- Supabase (PostgreSQL)
- Redis (Upstash)
- Free LLM API (Groq)

---

## 🚀 How to run it locally ?

#### Clone repo:

```bash
$ git clone <repo_url or ssh>
$ cd <directory>
```

#### Install dependencies:

```bash
$ npm install
```

#### Setup other projects

1- [Supabase](https://supabase.com): Create a Supabase project and Database

2- [Upstash](https://upstash.com/): Create a redis store and you will get:

- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN

3- [LLM](https://groq.com): Generate LLM api key on groq and you will get:

- LLM_API_KEY
- LLM_BASE_URL
- LLM_MODEL: llama-3.3-70b-versatile is a good choice otherwise you can use whatever LLM you want from listed LLM's on groq

#### Set environent variables:

```bash
$ PORT=4000

$ SUPABASE_URL=<url>
$ SUPABASE_SERVICE_ROLE_KEY=<service_role>

$ LLM_API_KEY=<from groq>
$ LLM_BASE_URL=<from groq>
$ LLM_MODEL=llama-3.3-70b-versatile

$ UPSTASH_REDIS_REST_URL=<from upstash>
$ UPSTASH_REDIS_REST_TOKEN=<from upstash>
```

#### Run dev Server:

```bash
$ npm run dev
```

#### Fontend repo, setup and all details: https://github.com/codebysid/spur-ai-frontend

## ✨ Features

- Live LLM used from Groq platform
- Redis to cache common questions and answers
- Rate Limiting: Redis to implement rate limiing to avoid exploitation
- Concurrent Requests: Redis to avoid concurrent request from same IP (because no auth)
- Supabase (PostgreSQL): Used for data storage

---

## 🤖 LLM Notes

This backend integrates a Large Language Model (LLM) to act as an AI-powered customer support agent.  
The implementation focuses on **correctness, cost control, and predictable behavior**, rather than raw model capabilities.

### 🧠 Model Choice

- Uses **Groq (free tier)** with an OpenAI-compatible API
- Selected for:
  - Free usage for demos and assignments
  - Low latency
  - Familiar OpenAI-style API surface

The LLM can be swapped easily by updating the LLM service without touching business logic.

### 📝 Prompt Design

The LLM is called with a structured prompt consisting of:

1. **System Prompt**

   - Defines the AI’s role and behavior
   - Prevents hallucinations and unsafe answers

2. **Store FAQ Context**

   - Provides reliable domain knowledge
   - Ensures consistent answers to common questions

3. **Conversation History**
   - Recent messages are included to maintain context
   - History is truncated to avoid excessive token usage

This layered prompt approach ensures stable, predictable responses.

### ⚠️ Guardrails & Safety

- Explicit instructions to avoid hallucinating policies
- If unsure, the model is instructed to defer to a human agent
- Graceful fallback messages on:
  - API errors
  - Timeouts
  - Rate limits
  - Invalid API keys

Users always receive a friendly, non-technical error message.

### 💰 Cost Control

- Limits conversation history length
- Caps max tokens per response
- Caches common questions using Redis
- Avoids unnecessary LLM calls for repeated FAQs

This keeps usage predictable and cost-efficient.

### ⚡ Caching Strategy

- Redis is used to cache responses for:
  - Common FAQ-style questions
  - Identical or near-identical user inputs

Cache keys are normalized to improve hit rates.

This reduces:

- LLM latency
- Token usage
- External API dependency

### 🔄 Extensibility

The LLM logic is isolated in a dedicated service:

This allows easy future enhancements such as:

- Streaming responses
- Tool calling / function calling
- Retrieval-Augmented Generation (RAG)
- Multiple model fallback strategies

## ⏲️ If i had more time?
I would have built:
- Authentication and Authorization 
- Streaming
- Websockets
- Retrieval Augmented Generation and Embeddings

## 🏗 Architecture Overview

- User sends a query
- Query gets validated through checks
- Answer first looked in Redis and if found, returned from there
- No answer found in Redis then it calls the actual LLM with necessary chats history, quer, system prompt and external demo data of the store
- Server sends the repo back to the user frontends's
