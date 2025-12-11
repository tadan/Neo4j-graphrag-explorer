import { useState, useCallback } from 'react'
import { GraphVisualization } from './components/GraphVisualization'
import { ChatInterface } from './components/ChatInterface'
import { NodeDetailsPanel } from './components/NodeDetailsPanel'
import { QueryBuilder } from './components/QueryBuilder'
import { sampleGraphData, sampleQueries } from './data/sampleGraph'
import type { Message, GraphNode, GraphData } from './types'
import { streamText } from './lib/utils'
import { Network, Sparkles } from 'lucide-react'

/**
 * GraphRAG Explorer - Interactive demonstration of Graph-Powered GenAI
 *
 * This application showcases:
 * 1. Graph database visualization and exploration
 * 2. GenAI chat interface with streaming responses
 * 3. Transparent RAG process with source attribution
 * 4. Cypher query understanding
 * 5. Modern React patterns and best practices
 *
 * Architecture decisions:
 * - React 18 with TypeScript for type safety
 * - D3.js for sophisticated graph visualization
 * - Tailwind CSS for efficient, maintainable styling
 * - Simulated streaming to demonstrate async handling
 * - Component-based architecture for reusability
 */
function App() {
  const [graphData] = useState<GraphData>(sampleGraphData)
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [highlightedNodes, setHighlightedNodes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  /**
   * Simulates GraphRAG query processing
   *
   * Real implementation would:
   * 1. Convert natural language to Cypher query
   * 2. Execute query against Neo4j database
   * 3. Retrieve relevant nodes and relationships
   * 4. Pass context to LLM with prompt
   * 5. Stream response back to user
   */
  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    // Simulate graph query processing delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // Find relevant sample query or generate response
    const matchingQuery = sampleQueries.find(q =>
      content.toLowerCase().includes(q.natural.toLowerCase().split(' ').slice(0, 3).join(' ').toLowerCase())
    )

    // Simulate retrieving relevant nodes based on query
    const relevantNodes = matchingQuery
      ? await simulateGraphRetrieval(content, graphData)
      : await simulateGraphRetrieval(content, graphData)

    setHighlightedNodes(relevantNodes.map(n => n.id))

    // Generate response with streaming
    const responseText = await generateResponse(content, relevantNodes, matchingQuery)

    const assistantMessage: Message = {
      id: `msg-${Date.now()}-assistant`,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      sources: relevantNodes,
      cypherQuery: matchingQuery?.cypher,
      isStreaming: true
    }

    setMessages(prev => [...prev, assistantMessage])
    setIsLoading(false)

    // Stream the response
    let streamedContent = ''
    for await (const chunk of streamText(responseText, 30)) {
      streamedContent += chunk
      setMessages(prev =>
        prev.map(msg =>
          msg.id === assistantMessage.id
            ? { ...msg, content: streamedContent }
            : msg
        )
      )
    }

    // Mark streaming as complete
    setMessages(prev =>
      prev.map(msg =>
        msg.id === assistantMessage.id
          ? { ...msg, isStreaming: false }
          : msg
      )
    )

    // Clear highlights after a delay
    setTimeout(() => setHighlightedNodes([]), 3000)
  }, [graphData])

  const handleNodeSelect = useCallback((node: GraphNode | null) => {
    setSelectedNode(node)
    if (node) {
      setHighlightedNodes([node.id])
    } else {
      setHighlightedNodes([])
    }
  }, [])

  const handleSourceClick = useCallback((node: GraphNode) => {
    setSelectedNode(node)
    setHighlightedNodes([node.id])
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-neo4j-blue to-neo4j-purple flex items-center justify-center">
              <Network className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                GraphRAG Explorer
                <Sparkles className="w-5 h-5 text-neo4j-purple" />
              </h1>
              <p className="text-sm text-slate-600">
                Explore how graph databases enhance GenAI accuracy and transparency
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Knowledge Graph Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-6 gap-6 grid grid-cols-12">
        {/* Left Column - Graph Visualization */}
        <div className="col-span-7 flex flex-col gap-4">
          <GraphVisualization
            data={graphData}
            selectedNode={selectedNode}
            onNodeSelect={handleNodeSelect}
            highlightedNodes={highlightedNodes}
            className="flex-1"
          />
          <QueryBuilder
            onQueryExecute={handleSendMessage}
            className="h-auto max-h-[300px] overflow-y-auto scrollbar-thin"
          />
        </div>

        {/* Middle Column - Chat Interface */}
        <div className="col-span-3">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onSourceClick={handleSourceClick}
          />
        </div>

        {/* Right Column - Node Details */}
        <div className="col-span-2">
          {selectedNode ? (
            <NodeDetailsPanel
              node={selectedNode}
              graphData={graphData}
              onClose={() => setSelectedNode(null)}
              onNodeClick={handleNodeSelect}
            />
          ) : (
            <div className="h-full bg-white rounded-lg border border-slate-200 flex items-center justify-center text-center p-6">
              <div className="text-slate-400">
                <Network className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm font-medium mb-1">No node selected</p>
                <p className="text-xs">Click on a node to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 px-6 py-3 flex-shrink-0">
        <div className="flex items-center justify-between text-xs text-slate-600">
          <p>
            Built with React, TypeScript, D3.js, and Tailwind CSS
          </p>
          <p>
            Demonstrating GraphRAG architecture for Neo4j GenAI Team
          </p>
        </div>
      </footer>
    </div>
  )
}

/**
 * Simulates retrieving relevant nodes from knowledge graph
 * In production, this would be a Cypher query against Neo4j
 */
async function simulateGraphRetrieval(
  query: string,
  graphData: GraphData
): Promise<GraphNode[]> {
  await new Promise(resolve => setTimeout(resolve, 500))

  const keywords = query.toLowerCase().split(' ')

  // Find nodes matching query keywords
  return graphData.nodes.filter(node => {
    const nodeText = `${node.label} ${JSON.stringify(node.properties)}`.toLowerCase()
    return keywords.some(keyword => keyword.length > 3 && nodeText.includes(keyword))
  }).slice(0, 3)
}

/**
 * Generates contextual response based on retrieved nodes
 * In production, this would be an LLM call with graph context
 */
async function generateResponse(
  query: string,
  sources: GraphNode[],
  matchingQuery?: typeof sampleQueries[0]
): Promise<string> {
  if (matchingQuery) {
    // Use predefined responses for sample queries
    const responses: Record<string, string> = {
      'How does GraphRAG improve AI accuracy?': `GraphRAG significantly improves AI accuracy by leveraging graph databases to provide relationship-aware context to language models. Unlike traditional RAG systems that retrieve isolated documents, GraphRAG understands how entities are connected. This enables the AI to:

1. Follow multi-hop relationships to find relevant context
2. Understand semantic connections between concepts
3. Provide citations that show the reasoning path
4. Reduce hallucinations by grounding responses in structured knowledge

The graph structure naturally encodes the relationships that make responses more accurate and explainable.`,

      'What companies use Neo4j and for what purpose?': `Several leading organizations use Neo4j for mission-critical applications:

NASA uses Neo4j for mission planning and resource optimization, which helped them reach Mars 2 years earlier than originally planned. The graph database's ability to model complex relationships between resources, schedules, and constraints was essential.

The International Consortium of Investigative Journalists (ICIJ) used Neo4j to break the Panama Papers story, uncovering hidden financial networks by traversing relationships between shell companies, individuals, and transactions.

These use cases demonstrate how graph databases excel at revealing patterns in highly connected data.`,

      'How is GraphRAG different from regular RAG?': `GraphRAG enhances traditional RAG by replacing or augmenting vector databases with graph databases:

Traditional RAG typically uses vector databases for similarity-based retrieval, which finds semantically similar documents but doesn't capture relationships between entities.

GraphRAG uses Neo4j's graph structure to:
- Query with Cypher for precise pattern matching
- Traverse relationships to find multi-hop context
- Understand how entities are connected
- Provide transparent reasoning paths

While vector databases are great for similarity search, they miss the semantic relationships that graphs naturally encode. The ideal architecture often combines both: vectors for similarity, graphs for relationships.`,

      'What are the main challenges facing GenAI?': `Generative AI faces several critical challenges that graph databases help address:

1. **Response Accuracy**: LLMs tend to hallucinate or generate plausible-sounding but incorrect information. GraphRAG grounds responses in factual, structured knowledge from the graph.

2. **AI Explainability**: Understanding how an AI arrived at a conclusion is crucial for trust and compliance. Graphs provide transparent reasoning paths by showing the relationships traversed to generate a response.

3. **Contextual Understanding**: Comprehending complex relationships between entities is difficult for traditional approaches. Graphs naturally encode context through their relationship structure.

These challenges are especially severe in regulated industries where accuracy and explainability are mandatory.`
    }

    const matchingResponse = Object.entries(responses).find(([key]) =>
      matchingQuery.natural.includes(key)
    )

    if (matchingResponse) {
      return matchingResponse[1]
    }
  }

  // Generate generic response based on sources
  if (sources.length === 0) {
    return `I searched the knowledge graph but couldn't find specific information about "${query}". The graph contains information about GenAI, graph databases, and their real-world applications. Try asking about GraphRAG, Neo4j use cases, or how graphs improve AI accuracy.`
  }

  const sourceNames = sources.map(s => s.label).join(', ')
  return `Based on the knowledge graph, I found relevant information in ${sourceNames}. ${sources[0].properties.description || 'These concepts are interconnected in the graph, showing how they relate to your question.'} The graph structure helps me understand these relationships and provide more accurate, explainable responses.`
}

export default App
