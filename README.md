# GraphRAG Explorer

An interactive demonstration of Graph-Powered Retrieval Augmented Generation (GraphRAG), showcasing how graph databases enhance GenAI accuracy, transparency, and explainability.

![GraphRAG Explorer](https://img.shields.io/badge/React-18-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind-3-blue) ![D3.js](https://img.shields.io/badge/D3.js-7-orange)

## Overview

This application demonstrates the intersection of graph databases and generative AI by visualizing how Neo4j's graph structure can dramatically improve RAG systems. Built for the Neo4j GenAI team, it showcases both technical depth and design sensibility in creating intuitive user experiences for AI-powered applications.

### Key Features

- **Interactive Graph Visualization**: Force-directed D3.js visualization with zoom, pan, and node exploration
- **GenAI Chat Interface**: Streaming responses with source attribution and transparent reasoning
- **Cypher Query Display**: Educational view of graph query patterns and execution
- **Knowledge Graph Exploration**: Click nodes to explore relationships and properties
- **Sample Query Builder**: Pre-built queries demonstrating GraphRAG patterns
- **Source Citations**: Direct linking between chat responses and knowledge graph nodes
- **Responsive Design**: Fully responsive layout using Tailwind CSS
- **Accessibility**: Keyboard navigation, ARIA labels, and semantic HTML

## Why GraphRAG?

Traditional RAG systems use vector databases to retrieve similar documents, but they miss the semantic relationships between entities. GraphRAG leverages Neo4j to:

1. **Understand Context**: Traverse multi-hop relationships to find relevant information
2. **Improve Accuracy**: Ground responses in structured, relationship-rich knowledge
3. **Enable Explainability**: Show the reasoning path through the graph
4. **Reduce Hallucinations**: Provide factual context that's verifiable and traceable

This application visualizes these benefits in action.

## Technical Architecture

### Frontend Stack

- **React 18** - Modern hooks-based architecture with concurrent features
- **TypeScript** - Type safety and improved developer experience
- **Vite** - Fast build tooling and HMR for development
- **Tailwind CSS** - Utility-first CSS for rapid, maintainable styling
- **D3.js** - Data-driven graph visualization with force simulation
- **Lucide React** - Consistent, high-quality icon library

### Design Decisions

#### 1. Component Architecture
- **Separation of Concerns**: Each component has a single responsibility
- **Prop-driven Design**: Components are reusable with clear interfaces
- **Hooks for State**: Modern React patterns with useState, useCallback, useEffect
- **Type Safety**: Comprehensive TypeScript types for all data structures

#### 2. Graph Visualization
- **D3 Force Simulation**: Natural clustering based on relationship strength
- **Interactive Controls**: Drag nodes, zoom, pan for exploration
- **Dynamic Highlighting**: Visual feedback for RAG context retrieval
- **Accessible SVG**: Proper ARIA labels and semantic structure

#### 3. Chat Interface
- **Streaming Simulation**: Demonstrates proper async handling of LLM responses
- **Source Attribution**: Click sources to explore their graph context
- **Cypher Transparency**: Shows the underlying graph queries
- **Message History**: Persistent conversation context

#### 4. Performance Optimizations
- **useCallback**: Memoized event handlers to prevent re-renders
- **Debouncing**: For responsive search and input handling
- **Lazy Rendering**: Only visible components are actively rendered
- **Code Splitting**: Ready for dynamic imports (future enhancement)

#### 5. Accessibility
- **Keyboard Navigation**: Full keyboard support for all interactions
- **ARIA Labels**: Screen reader support throughout
- **Semantic HTML**: Proper heading hierarchy and landmarks
- **Focus Management**: Clear focus indicators and logical tab order

### Data Model

```typescript
interface GraphNode {
  id: string
  label: string
  type: 'Person' | 'Company' | 'Technology' | 'Concept' | 'Document'
  properties: Record<string, any>
}

interface GraphRelationship {
  id: string
  source: string
  target: string
  type: string
  properties?: Record<string, any>
}
```

The knowledge graph focuses on GenAI, graph databases, and Neo4j's value proposition - directly relevant to the target role.

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The application runs on `http://localhost:5173` by default. Vite provides instant HMR for fast development iterations.

## Project Structure

```
neo4j-graphrag-explorer/
├── src/
│   ├── components/         # React components
│   │   ├── GraphVisualization.tsx
│   │   ├── ChatInterface.tsx
│   │   ├── NodeDetailsPanel.tsx
│   │   └── QueryBuilder.tsx
│   ├── data/
│   │   └── sampleGraph.ts # Knowledge graph data
│   ├── lib/
│   │   └── utils.ts       # Utility functions
│   ├── types/
│   │   └── index.ts       # TypeScript definitions
│   ├── App.tsx            # Main application component
│   ├── index.css          # Global styles with Tailwind
│   └── main.tsx           # Application entry point
├── public/                # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.ts        # Vite build configuration
└── README.md             # This file
```

## Key Implementation Highlights

### 1. Simulated GraphRAG Pipeline

The application simulates a real GraphRAG workflow:

```typescript
// 1. User submits natural language query
// 2. Convert to Cypher query (simulated with pattern matching)
// 3. Retrieve relevant nodes from graph
const relevantNodes = await simulateGraphRetrieval(query, graphData)

// 4. Pass graph context to LLM (simulated with pre-written responses)
const response = await generateResponse(query, relevantNodes)

// 5. Stream response with source attribution
for await (const chunk of streamText(response)) {
  // Update UI with streaming content
}
```

### 2. Graph Visualization with D3.js

Force-directed layout that naturally clusters related concepts:

```typescript
const simulation = d3.forceSimulation(nodes)
  .force('link', d3.forceLink(relationships).distance(100))
  .force('charge', d3.forceManyBody().strength(-300))
  .force('center', d3.forceCenter(width / 2, height / 2))
  .force('collision', d3.forceCollide().radius(40))
```

### 3. Type-Safe Data Flow

Comprehensive TypeScript types ensure reliability:

```typescript
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: GraphNode[]      // Link to graph nodes
  cypherQuery?: string       // Show the query
  isStreaming?: boolean      // UI state
}
```

## Future Enhancements

### Real Neo4j Integration
- Connect to actual Neo4j database via Bolt protocol
- Execute real Cypher queries
- Support user-provided graph data

### Advanced GenAI Features
- Integration with OpenAI, Anthropic, or other LLM APIs
- Natural language to Cypher translation
- Multi-turn conversation with context retention
- Query refinement based on feedback

### Enhanced Visualization
- Multiple layout algorithms (hierarchical, circular, radial)
- Graph filtering and search
- Subgraph extraction
- Path highlighting between specific nodes
- Time-based graph evolution

### Performance Optimizations
- Virtual scrolling for large chat histories
- WebGL rendering for large graphs (via deck.gl or similar)
- Graph data pagination
- Web Workers for heavy computations

## Why This Project Matters for Neo4j

This application directly demonstrates Neo4j's core value proposition for GenAI:

1. **Accuracy**: Shows how graph relationships improve context retrieval
2. **Transparency**: Visualizes the reasoning path through the graph
3. **Explainability**: Makes the "black box" of AI interpretable
4. **User Experience**: Proves that complex tech can have intuitive interfaces

It's a working proof-of-concept that could be extended into Neo4j's GenAI product portfolio.

## Technical Proficiency Demonstrated

### React & Modern JavaScript
- Hooks-based architecture (useState, useCallback, useEffect)
- Async/await for promise handling
- Generator functions for streaming
- TypeScript for type safety
- Component composition and reusability

### UI/UX Design
- Intuitive information hierarchy
- Responsive grid layout
- Smooth animations and transitions
- Accessible keyboard navigation
- Clear visual feedback for user actions

### Data Visualization
- D3.js force simulation
- SVG manipulation
- Event handling for interactivity
- Dynamic data binding
- Performance optimization for rendering

### Best Practices
- Clean code with meaningful comments
- Separation of concerns
- Type-safe interfaces
- Performance optimizations
- Accessibility considerations

## CI/CD Ready

The project is structured for easy deployment:

```yaml
# .github/workflows/deploy.yml
- Build with Vite
- Run type checking with tsc
- Deploy to Vercel/Netlify/Cloudflare Pages
```

## License

MIT License - feel free to use this as a reference or starting point for your own projects.

---

**Built by Daniele Tatasciore for Neo4j GenAI Team**
Demonstrating the intersection of graph databases, generative AI, and exceptional user experience.
