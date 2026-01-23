---
title: "The Brains of the Operation: LLMs and Their Knowledge Base"
chapterNumber: 4
book: "ai-seo-guide"
faq:
  - question: "When does AI search the web versus use its training data?"
    answer: "For factual or current questions, it searches. For creative or conceptual stuff, it often relies on training data. Ask about yesterday's news and it searches. Ask for a joke and it probably doesn't. You can usually tell by whether citations appear."
  - question: "What's different about AI answers with web search on versus off?"
    answer: "Web search adds specific numbers, current data, and source citations. Without it, you get more general answers from training data. The core information is often similar, but web search provides the specifics and proof points."
  - question: "Why does it matter if my brand is in AI training data?"
    answer: "When AI doesn't search the web, it answers from memory. If you're in that memory, you can get mentioned even without appearing in search results. Many questions get answered without web search ever running."
howTo:
  name: "How to Check If Your Brand Is in AI Training Data"
  description: "Test whether AI knows your brand from training versus web search."
  totalTime: "PT15M"
  steps:
    - name: "Disable web search in ChatGPT"
      text: "In ChatGPT, don't enable the 'Search' toggle. Ask 'What is [your brand]?' and see if it knows you without searching."
    - name: "Ask about your founding and products"
      text: "Without web search, ask specific questions: when was the company founded, what products do they offer, who are competitors. Check accuracy."
    - name: "Compare with search enabled"
      text: "Enable web search and ask the same questions. Note what information comes from training data versus live search."
    - name: "Document gaps"
      text: "If AI doesn't know you from training, focus on getting mentioned on sites that feed training data: Wikipedia, Reddit threads, industry publications."
---

# Chapter 4: The Brains of the Operation: LLMs and Their Knowledge Base
![](/assets/book/ai-seo-guide/images/ch04-chapter.png)

This chapter introduces the internal mechanics of AI search where Large Language Models (LLMs) merges its internal knowledge (based on the training data) with real-time information from web search. It lays the foundation for understanding how AIs generate responses.

At the heart of AI search lies the Large Language Model (LLM),  the "smart" assistant that processes information and generates the answers. It summarizes, reviews, and synthesizes data from the selected web sources. 

However, the AI's reliance on real-time web search versus its internal knowledge varies.

### Example 1: AI answers without a web search enabled
Here is the screenshot where ChatGPT answers for “*how adult food differs from puppy food*” without searching the web by replying solely using its own internal knowledge (in other words, using the dataset it was trained on):

**![](/assets/book/ai-seo-guide/images/ch04-example-of-a-chatgpt-response-generated-.png)**  
*Figure 4.1. Example of a ChatGPT response generated using only its internal knowledge base (web search disabled).*   
*(Source: Author’s private chat on chatgpt.com, accessed Dec 2024\)*

### Example 2: AI answers with web search enabled
And here is how ChatGPT answer for “*how adult food differs from puppy food*” with “*search*” function explicitly enabled and so it is searching the web and summarizing it in the response as the following:

![](/assets/book/ai-seo-guide/images/ch04-example-of-a-chatgpt-response-generated-.png)   
*Figure 4.2. Example of a ChatGPT response generated with web search enabled, showing included data and source references (highlighted).*   
*(Source: Author’s private chat on chatgpt.com, accessed Dec 2024\)*

What can we see comparing responses from ChatGPT without and with web search enabled? 

* The core information is similar, but the version with web search includes specific numerical data (protein, fat percentages in this case);  
* The version with web search also adds references to authoritative sources (like *AAFCO* and *DOGSTER*) extracted from the web search (these references are highlighted on the screenshot).

Also, AI may decide not to run a web search at all for some queries even if it is enabled\! Below is the screenshot that shows AI providing an answer to a simple question ("*what is the most stupid joke?*") without referencing to any external web references:

![](/assets/book/ai-seo-guide/images/ch04-example-of-a-perplexity-ai-response-with.png)  
*Figure 4.3. Example of a Perplexity AI response without running a web search*  
*(Source: Author’s private chat on Perplexity.ai, accessed Dec 2024\)*

As you see, for some questions, particularly those requiring **factual**, **up-to-the-minute information or specific data points**, the AI makes a decision to run a web search. For requests which are conceptual or creative queries, AI may decide to answer using solely its internal knowledge base. 

Supposedly it may skip web search if it understands the query as it is not about some recent events (because AI’s internal knowledge is usually about six months out of date) or it is not about rapidly changing topics like stocks, weather and similar subjects.

That is why it is important to have AI models to know about your brand and product not just from a web search but also from its “*brain*”, the so called “**L**arge **L**anguage **M**odel*” (LLM) which we will discuss in the next chapter.

#