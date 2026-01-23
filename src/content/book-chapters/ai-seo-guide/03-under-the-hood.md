---
title: "Under the Hood: The AI Search Workflow"
chapterNumber: 3
book: "ai-seo-guide"
faq:
  - question: "What actually happens when you search with AI?"
    answer: "The AI rewrites your question, sometimes breaks it into sub-queries, searches the web, reads the results, synthesizes an answer with citations, and sometimes suggests follow-up questions. There's also a feedback loop where your thumbs-up or thumbs-down helps improve future responses."
  - question: "What is query preprocessing?"
    answer: "Before searching, the AI reformats your question for better results. 'How is puppy food different from adult?' might become three separate searches: one about nutritional differences, one about when to switch, one about why formulas differ. This happens automatically."
  - question: "How does AI decide which sources to cite?"
    answer: "Each AI has its own ranking logic. Studies show 33-73% overlap with traditional search results - meaning AI often cites different sources than Google would rank highest. Authority matters, but so do factors we can only guess at."
howTo:
  name: "How to Analyze AI Source Selection for Your Topic"
  description: "See which sources AI picks for your topics and learn from the patterns."
  totalTime: "PT30M"
  steps:
    - name: "Run the same query across 4 AI tools"
      text: "Search your main topic in ChatGPT, Perplexity, Claude, and Google AI Mode. Copy the queries exactly."
    - name: "List every source cited"
      text: "Record every domain that appears in citations across all four tools. Note which appear in multiple tools versus just one."
    - name: "Identify common patterns"
      text: "Look for what the cited sources have in common: domain authority, content format, page structure, how they answer the question directly."
    - name: "Compare to your own content"
      text: "Check if your pages match those patterns. If cited sources all have FAQ sections and yours doesn't, that's a gap to fix."
---

# Chapter 3: Under the Hood: The AI Search Workflow
![](/assets/book/ai-seo-guide/images/ch03-chapter.png)

In this chapter we will break down the process behind AI search into a step by step workflow: from initial user’s query input to the final response. You will gain insight into how each stage contributes to delivering more accurate and efficient responses.

How does AI search actually work? It started conceptually as a simple idea of using a Large Language Model (LLM) to summarize traditional search results: 

**\[Search Results\] \+ \[AI Summarization\] \= AI search results ?**

However, the process has quickly evolved into a more sophisticated and  multi-stage workflow with built-in feedback loop. Let's break down the typical journey of an AI search query:

**![](/assets/book/ai-seo-guide/images/ch03-general-workflow-diagram-illustrating-th.png)**Figure 3.1. General workflow diagram illustrating the stages of an AI search query from input to feedback loop.*   
*(Source: Author graphic based on common AI search processes)*

**Query Input Step**

It begins, as always, with the user entering a search query. This can be anything: a direct question, a keyword phrase, or a specific term.

**Pre-processing Step (The AI "Reasoning")** 

This is where the AI magic starts. Before even searching the web, the LLM often pre-processes the query to optimize performance and accuracy. This can involve:

* **Rewriting** \- rephrasing the query for better search engine understanding.

* **Decomposition** \- breaking down complex questions into multiple, simpler sub-queries.

* **Formatting** \- structuring the query optimally for the underlying search index.

**Search Execution Step:** The AI then performs an actual web search using one or more indexes. This “index” can be from Google, Bing, Brave Search, an internal web-index (more about it later) or a mix.

**Summarization & Synthesis Step:** The LLM (AI) analyzes the content retrieved from the selected web sources. It doesn't just copy-paste\! it synthesizes the information, combines:

* insights from multiple sources to generate a coherent, comprehensive final answer;  
* includes inline citations;  
* includes references back to the original websites as inline links or as separate footnotes;

**Follow-Up Generation Step (Optional):** To facilitate deeper exploration, the AI search engine might generate a set of follow-up questions. These can help the user:

* **Explore the topic** in greater detail.

* **Dive into related areas** of interest.

* **Discover alternative ways** to frame their original query.

* **Feedback Loop:** Continuous improvement is built-in. Users can often provide feedback (e.g., thumbs up/down) on the quality of the answer. Internally, platforms frequently employ human annotators to review and rate responses, further training and refining the AI models.

This systematic process allows AI search engines to move beyond simple keyword matching towards a deeper understanding and more direct fulfillment of user intent.

## Query Input Step
The very first step to a search is when a user types a search query using a natural language question in a form of question

* *How puppy food differs from adult*

* *How to ..*

* *Where to ..*

* *What is ..*

* *When ..*

Or in more brief form like “*puppy food vs adult.*“ 

These “*Question-like*” types of search queries appear in  up to 52% of all requests according to a few studies.[^17][^18]

## Pre-processing Step: Decoding Intent
AI may instantly consider a request to require a web search based on the input query (like Perplexity AI or Anthropic Claude). Others, like ChatGPT, may require users to explicitly enable “*web search*” mode:

![](/assets/book/ai-seo-guide/images/ch03-chatgpt-interface-showing-the-option-to-.png)

*Figure 3.2. ChatGPT interface showing the option to explicitly enable "Search" or "Deep research" modes.*   
*(Source: chatgpt.com, accessed Mar 2025\)*

Let's dive deeper into the fascinating pre-processing step. This initial stage, where the AI rewrites or decomposes the query, reveals much about how these systems interpret user intent.

Consider this real-world example when a user asks: **"*how adult food differs from puppy food?*"![](/assets/book/ai-seo-guide/images/ch03-perplexity-ai-s-pre-processing-step-deco.png)**

*Figure 3.3. Perplexity AI's pre-processing step decomposing the query "how adult food differs from puppy food?"*   
*into three specific sub-queries (highlighted). (Source: perplexity.ai, accessed Dec 2024\)*

Instead of just searching for that exact phrase, the AI's pre-processing step rewrites the query as “*Research the difference between adult dog food and puppy food*” and then intelligently breaks it down into three distinct, more targeted web searches:

1. **"*differences between adult food and puppy food*"**: This captures the core, general comparison. It seeks basic differences.

2. **"*puppy food vs adult food nutritional differences*"**: Here, the LLM demonstrates understanding. Recognizing the query is about *food*, it specifically probes the *nutritional* aspects, which are key differentiators.

3. **"*why puppy food is different from adult dog food*"**: This is particularly insightful. The AI doesn't just want to know *what* the differences are, but *why* they exist. It generates a new question exploring the underlying reasons and rationale behind the formulation differences.

As you can see, the pre-processing isn't just a simple cleanup. It's an active step where the AI refines the query, anticipates related facets (like nutrition), and even generates new angles (the "*why*") to make sure that a comprehensive search is conducted before any answer is synthesized. This multi-query approach allows the AI to gather richer, more relevant information to construct its final response.

Once the web search query (for the original or/and decomposed and rewritten questions) is processed, the AI needs to decide which web pages to "read" to formulate its answer. How does it choose these sources, and how do they compare to traditional search results?

### Source Selection: Authority and Overlap
The research[^19] comparing the sources cited by Google's AI Overview summaries with the traditional "*blue link*" results for the same query revealed a significant, but not total, overlap: findings suggest this overlap ranges from 33% to 73%. But this overlap can differ significantly depending on the category of the search. 

Here is the sample analysis of search results overlap between major AI search engines (for the query “*how puppy food differs from adult*”):

![](/assets/book/ai-seo-guide/images/ch03-source-analysis-tool-displaying-website-.png)

 *Figure 3.4. Source analysis tool displaying website mentions and rankings across multiple AI search engines (List View).*   
*(Source: aichatwatch.com, accessed Dec 2024\)*

![](/assets/book/ai-seo-guide/images/ch03-source-analysis-tool-displaying-the-over.png)

 *Figure 3.5. Source analysis tool displaying the overlap and relationship between sources used by different AI engines (Graph View).*   
*(Source: aichatwatch.com, accessed Dec 2024\)*

Even when AI search engines use the same underlying web index (like Google or Bing), the sources they choose for their answers may differ. “*You need a combination of all, a hybrid*.” says[^20] *Aravind Srinivas*, founder of Perplexity AI.

Comparing Perplexity AI (Pro)(left) and Google (right) search results:

![](/assets/book/ai-seo-guide/images/ch03-side-by-side-comparison-of-perplexity-ai.png)  
*Figure 3.6. Side-by-side comparison of Perplexity AI (Pro) search sources and Google Search results for the same query.*   
*(Source: perplexity.ai, google.com, accessed Dec 2024\)*

Comparing ChatGPT Search (left) vs Bing (right) search  results:

![](/assets/book/ai-seo-guide/images/ch03-side-by-side-comparison-of-chatgpt-searc.png)

*Figure 3.7. Side-by-side comparison of ChatGPT Search results and Microsoft Bing search results for the same query.*   
*(Source: chatgpt.com, bing.com, accessed Dec 2024\)*

**What does this mean?** While AI search engines clearly value many of the same *authoritative* sources recognized by other AI and traditional search engines. But at the same time every AI search engine employs its own mix of unique algorithms, ranking signals and criteria to select which sources to use for generating their synthesized answers. 

## Summarization & Response Synthesis Step
On this step, AI summarizes search results and generates a final answer with links to sources, often prioritizing more authoritative sources. AI summarization mirrors human behavior:  if searching for information on *puppy food*, you might trust and check a few well-known veterinary sites and major brand websites first, rather than clicking through dozens of search results\! At the same time the summarization also depends on the specific LLM model because every model is trained on different datasets (more about it later). Final response to a user is the summary with inline clickable references to source websites:

![](/assets/book/ai-seo-guide/images/ch03-response-from-chatgpt-for-how-adult-food.png)

*Figure 3.8. Response from ChatGPT for “how adult food differs from puppy food”*   
*(Source: chatgpt.com, accessed Apr 2025\)*

Critically, these clickable inline references are the primary visibility points for driving users from AI search results to your website. Unlike “*traditional*” search results that often display full page titles and descriptions, AI summaries typically only show your *domain name* alongside the cited text (like on this screenshot above) or even hiding inside the group of links inside the dynamic hint that requires users to first hover over the reference, adding an extra click or even two\! This additional friction fundamentally reduces click-through opportunities and elevates the importance of building a strong and recognizable brand name.

## Follow-up Questions Generation Step
Most AI search engines currently generate few (usually no more than seven questions) follow-up questions that are aimed to engage users into continuing their search and helping them to look deeper into the topic. 

Take a look at the set of followup questions generated for “*puppy vs adult food*” search request on Perplexity AI:

![](/assets/book/ai-seo-guide/images/ch03-follow-up-questions-generated-by-perplex.png)

*Figure 3.12. Follow-up questions generated by Perplexity AI for a puppy food vs adult food query*  
*(Source: perplexity.ai, accessed Apr  2025\)*

## Feedback from User and Review by AI Assessors
Finally, most AI search engines incorporate tools for instant feedback which commonly allows users to indicate satisfaction by clicking on upvote or downvote buttons displayed for each response:

*Figure 3.14. Upvoting the response in  ChatGPT*   
*(Source: chatgpt.com, accessed Apr 2025\)*

Unlike “*traditional*” search results this feedback is built into the AI search’s iterative improvement process. It allows users to instantly send signals on the quality and helpfulness of received responses. In addition to user votes and using them for so-called reinforcement learning (RL), AI companies also may also employ internal human reviewers[^21]. These human reviewers (annotators) may evaluate responses against detailed quality guidelines, checking for accuracy and relevance, safety, and other key criteria to identify areas requiring internal adjustments. Combining feedback from users and internal annotators creates a continuous loop that enables companies to refine their AI and continuously enhance response quality and user satisfaction.

#