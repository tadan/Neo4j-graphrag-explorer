import type { GraphData } from '../types'

/**
 * Sample knowledge graph about GenAI and Graph Databases
 * Demonstrates understanding of Neo4j's domain and value proposition
 *
 * This graph represents the relationships between GenAI concepts,
 * technologies, and real-world applications - perfect for demonstrating
 * how graphs improve RAG accuracy and explainability.
 */
export const sampleGraphData: GraphData = {
  nodes: [
    // Core GenAI Concepts
    {
      id: 'genai',
      label: 'Generative AI',
      type: 'Concept',
      properties: {
        description: 'AI systems that can generate new content based on training data',
        challenges: 'Hallucinations, lack of transparency, factual accuracy'
      }
    },
    {
      id: 'rag',
      label: 'RAG (Retrieval Augmented Generation)',
      type: 'Technology',
      properties: {
        description: 'Architecture pattern that grounds LLMs with retrieved contextual information',
        benefit: 'Reduces hallucinations by 40-60%'
      }
    },
    {
      id: 'graphrag',
      label: 'GraphRAG',
      type: 'Technology',
      properties: {
        description: 'RAG enhanced with graph database for relationship-aware context retrieval',
        advantage: 'Understands complex multi-hop relationships between entities'
      }
    },
    {
      id: 'llm',
      label: 'Large Language Model',
      type: 'Technology',
      properties: {
        description: 'Neural network trained on vast amounts of text data',
        examples: 'GPT-4, Claude, Llama'
      }
    },

    // Technologies
    {
      id: 'neo4j',
      label: 'Neo4j',
      type: 'Technology',
      properties: {
        description: 'Leading graph database platform',
        strength: 'Optimized for relationship traversal and pattern matching'
      }
    },
    {
      id: 'vectordb',
      label: 'Vector Database',
      type: 'Technology',
      properties: {
        description: 'Database optimized for similarity search using embeddings',
        limitation: 'Does not capture semantic relationships between entities'
      }
    },
    {
      id: 'cypher',
      label: 'Cypher',
      type: 'Technology',
      properties: {
        description: 'Neo4j\'s declarative graph query language',
        feature: 'Pattern matching syntax for intuitive relationship queries'
      }
    },

    // Real-world Applications
    {
      id: 'knowledge-management',
      label: 'Enterprise Knowledge Management',
      type: 'Concept',
      properties: {
        useCase: 'Connecting siloed information across departments',
        benefit: 'Enables AI to answer questions requiring cross-domain knowledge'
      }
    },
    {
      id: 'recommendation',
      label: 'Intelligent Recommendations',
      type: 'Concept',
      properties: {
        useCase: 'Personalized suggestions based on user behavior and item relationships',
        example: 'E-commerce product recommendations'
      }
    },
    {
      id: 'fraud-detection',
      label: 'Fraud Detection',
      type: 'Concept',
      properties: {
        useCase: 'Identifying suspicious patterns in transaction networks',
        advantage: 'Detects complex fraud rings through relationship analysis'
      }
    },

    // Companies/Organizations
    {
      id: 'nasa',
      label: 'NASA',
      type: 'Company',
      properties: {
        achievement: 'Got to Mars 2 years earlier using Neo4j',
        application: 'Mission planning and resource optimization'
      }
    },
    {
      id: 'icij',
      label: 'ICIJ',
      type: 'Company',
      properties: {
        achievement: 'Broke Panama Papers story',
        application: 'Uncovering hidden financial networks'
      }
    },

    // Key Differentiators
    {
      id: 'explainability',
      label: 'AI Explainability',
      type: 'Concept',
      properties: {
        description: 'Ability to trace and understand AI decision-making process',
        importance: 'Critical for regulated industries and trust'
      }
    },
    {
      id: 'accuracy',
      label: 'Response Accuracy',
      type: 'Concept',
      properties: {
        description: 'Correctness and factual grounding of AI-generated content',
        challenge: 'LLMs tend to hallucinate without proper grounding'
      }
    },
    {
      id: 'context',
      label: 'Contextual Understanding',
      type: 'Concept',
      properties: {
        description: 'Comprehension of relationships and semantic connections',
        graphAdvantage: 'Graphs naturally encode context through relationships'
      }
    }
  ],

  relationships: [
    // GenAI architecture relationships
    { id: 'r1', source: 'genai', target: 'llm', type: 'POWERED_BY' },
    { id: 'r2', source: 'rag', target: 'genai', type: 'IMPROVES' },
    { id: 'r3', source: 'graphrag', target: 'rag', type: 'ENHANCES' },
    { id: 'r4', source: 'graphrag', target: 'neo4j', type: 'USES' },
    { id: 'r5', source: 'rag', target: 'vectordb', type: 'OFTEN_USES' },

    // Query language
    { id: 'r6', source: 'neo4j', target: 'cypher', type: 'PROVIDES' },
    { id: 'r7', source: 'graphrag', target: 'cypher', type: 'QUERIES_WITH' },

    // Benefits and improvements
    { id: 'r8', source: 'graphrag', target: 'accuracy', type: 'IMPROVES' },
    { id: 'r9', source: 'graphrag', target: 'explainability', type: 'ENABLES' },
    { id: 'r10', source: 'graphrag', target: 'context', type: 'CAPTURES' },
    { id: 'r11', source: 'neo4j', target: 'context', type: 'EXCELS_AT' },

    // Applications
    { id: 'r12', source: 'knowledge-management', target: 'graphrag', type: 'LEVERAGES' },
    { id: 'r13', source: 'recommendation', target: 'neo4j', type: 'POWERED_BY' },
    { id: 'r14', source: 'fraud-detection', target: 'neo4j', type: 'RELIES_ON' },

    // Real-world success stories
    { id: 'r15', source: 'nasa', target: 'neo4j', type: 'USES' },
    { id: 'r16', source: 'icij', target: 'neo4j', type: 'USES' },
    { id: 'r17', source: 'nasa', target: 'knowledge-management', type: 'APPLIED_FOR' },
    { id: 'r18', source: 'icij', target: 'fraud-detection', type: 'APPLIED_FOR' },

    // Challenges addressed
    { id: 'r19', source: 'accuracy', target: 'genai', type: 'CHALLENGE_FOR', properties: { severity: 'high' } },
    { id: 'r20', source: 'explainability', target: 'genai', type: 'CHALLENGE_FOR', properties: { severity: 'high' } },

    // Comparative advantages
    { id: 'r21', source: 'neo4j', target: 'vectordb', type: 'COMPLEMENTS' },
    { id: 'r22', source: 'context', target: 'accuracy', type: 'LEADS_TO' }
  ]
}

/**
 * Sample queries that demonstrate different GraphRAG patterns
 */
export const sampleQueries = [
  {
    natural: "How does GraphRAG improve AI accuracy?",
    cypher: `MATCH path = (graphrag:Technology {label: 'GraphRAG'})-[*1..3]-(accuracy:Concept {label: 'Response Accuracy'})
RETURN path`,
    explanation: "Multi-hop pattern matching to find all paths between GraphRAG and Accuracy"
  },
  {
    natural: "What companies use Neo4j and for what purpose?",
    cypher: `MATCH (company:Company)-[:USES]->(neo4j:Technology {label: 'Neo4j'})
MATCH (company)-[:APPLIED_FOR]->(useCase)
RETURN company.label as Company, useCase.label as UseCase, company.achievement as Achievement`,
    explanation: "Relationship traversal to connect companies with their use cases"
  },
  {
    natural: "How is GraphRAG different from regular RAG?",
    cypher: `MATCH (graphrag:Technology {label: 'GraphRAG'})-[:ENHANCES]->(rag:Technology)
MATCH (graphrag)-[:USES]->(tech)
MATCH (rag)-[:OFTEN_USES]->(altTech)
RETURN graphrag, rag, tech, altTech`,
    explanation: "Pattern comparison showing architectural differences"
  },
  {
    natural: "What are the main challenges facing GenAI?",
    cypher: `MATCH (challenge)-[r:CHALLENGE_FOR]->(genai:Concept {label: 'Generative AI'})
RETURN challenge.label as Challenge, challenge.description as Description, r.severity as Severity
ORDER BY r.severity DESC`,
    explanation: "Relationship properties used for filtering and sorting"
  }
]
