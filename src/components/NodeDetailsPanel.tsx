import { X, ExternalLink, Database } from 'lucide-react'
import type { GraphNode, GraphData } from '../types'
import { cn } from '../lib/utils'

interface NodeDetailsPanelProps {
  node: GraphNode | null
  graphData: GraphData
  onClose: () => void
  onNodeClick: (node: GraphNode) => void
}

/**
 * Side panel displaying detailed node information and connections
 *
 * Shows:
 * - Node properties and metadata
 * - Connected nodes (relationships)
 * - Cypher query to retrieve this node
 * - Quick actions for exploration
 */
export function NodeDetailsPanel({
  node,
  graphData,
  onClose,
  onNodeClick
}: NodeDetailsPanelProps) {
  if (!node) return null

  // Find all relationships connected to this node
  const connections = graphData.relationships.filter(
    rel => rel.source === node.id || rel.target === node.id
  )

  // Get connected nodes
  const connectedNodes = connections.map(rel => {
    const connectedId = rel.source === node.id ? rel.target : rel.source
    const connectedNode = graphData.nodes.find(n => n.id === connectedId)
    return {
      node: connectedNode,
      relationship: rel,
      direction: rel.source === node.id ? 'outgoing' : 'incoming'
    }
  }).filter(c => c.node)

  // Generate Cypher query for this node
  const cypherQuery = `MATCH (n:${node.type} {id: '${node.id}'})
RETURN n`

  const nodeColors: Record<string, string> = {
    Person: '#FF6B6B',
    Company: '#4ECDC4',
    Technology: '#008CC1',
    Concept: '#9C27B0',
    Document: '#95E1D3'
  }

  return (
    <div className="h-full bg-white rounded-lg border border-slate-200 overflow-hidden flex flex-col">
      {/* Header */}
      <div
        className="px-4 py-3 border-b border-slate-200"
        style={{
          background: `linear-gradient(135deg, ${nodeColors[node.type]}15 0%, ${nodeColors[node.type]}05 100%)`
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: nodeColors[node.type] }}
            >
              {node.type.charAt(0)}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{node.label}</h3>
              <span className="text-xs text-slate-600">{node.type}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded transition-colors"
            aria-label="Close panel"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
        {/* Properties */}
        {Object.keys(node.properties).length > 0 && (
          <section>
            <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <Database className="w-4 h-4" />
              Properties
            </h4>
            <div className="space-y-2">
              {Object.entries(node.properties).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-slate-50 rounded-lg p-3 border border-slate-200"
                >
                  <div className="text-xs font-medium text-slate-600 mb-1">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div className="text-sm text-slate-900">
                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Connections */}
        {connectedNodes.length > 0 && (
          <section>
            <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Connections ({connectedNodes.length})
            </h4>
            <div className="space-y-2">
              {connectedNodes.map(({ node: connectedNode, relationship, direction }) => (
                <button
                  key={relationship.id}
                  onClick={() => connectedNode && onNodeClick(connectedNode)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-3 hover:border-neo4j-blue hover:bg-slate-50 transition-colors text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                      style={{ backgroundColor: connectedNode ? nodeColors[connectedNode.type] : '#94a3b8' }}
                    >
                      {connectedNode?.type.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">
                        {connectedNode?.label}
                      </div>
                      <div className="text-xs text-slate-600 mt-0.5">
                        <span className={cn(
                          'font-mono',
                          direction === 'outgoing' ? 'text-neo4j-blue' : 'text-neo4j-purple'
                        )}>
                          {direction === 'outgoing' ? '→' : '←'} {relationship.type.replace(/_/g, ' ')}
                        </span>
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-neo4j-blue transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Cypher Query */}
        <section>
          <h4 className="text-sm font-semibold text-slate-900 mb-3">Cypher Query</h4>
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs text-slate-100 overflow-x-auto">
            <pre className="whitespace-pre-wrap">{cypherQuery}</pre>
          </div>
          <p className="text-xs text-slate-600 mt-2">
            Use this query to retrieve this node in Neo4j
          </p>
        </section>
      </div>
    </div>
  )
}
