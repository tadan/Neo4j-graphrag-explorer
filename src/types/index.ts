/**
 * Core type definitions for GraphRAG Explorer
 * Demonstrates understanding of graph data structures and GenAI patterns
 */

export interface GraphNode {
  id: string
  label: string
  type: 'Person' | 'Company' | 'Technology' | 'Concept' | 'Document'
  properties: Record<string, any>
  x?: number
  y?: number
  vx?: number
  vy?: number
}

export interface GraphRelationship {
  id: string
  source: string
  target: string
  type: string
  properties?: Record<string, any>
}

export interface GraphData {
  nodes: GraphNode[]
  relationships: GraphRelationship[]
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  sources?: GraphNode[]
  cypherQuery?: string
  isStreaming?: boolean
}

export interface RAGContext {
  retrievedNodes: GraphNode[]
  retrievedRelationships: GraphRelationship[]
  cypherQuery: string
  relevanceScore: number
}

export type QueryMode = 'natural' | 'cypher' | 'hybrid'

export interface AppState {
  messages: Message[]
  graphData: GraphData
  selectedNode: GraphNode | null
  queryMode: QueryMode
  isLoading: boolean
}
