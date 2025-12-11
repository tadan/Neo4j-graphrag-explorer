import { useState } from 'react'
import { Code2, Lightbulb, Play } from 'lucide-react'
import { sampleQueries } from '../data/sampleGraph'
import { cn } from '../lib/utils'

interface QueryBuilderProps {
  onQueryExecute: (query: string) => void
  className?: string
}

/**
 * Interactive query builder with sample queries
 *
 * Demonstrates:
 * - Cypher query patterns
 * - Natural language to Cypher translation
 * - Educational tooltips for query understanding
 * - Quick execution of common patterns
 */
export function QueryBuilder({ onQueryExecute, className }: QueryBuilderProps) {
  const [selectedQuery, setSelectedQuery] = useState<number | null>(null)

  return (
    <div className={cn('bg-white rounded-lg border border-slate-200 p-4', className)}>
      <div className="flex items-center gap-2 mb-4">
        <Code2 className="w-5 h-5 text-neo4j-blue" />
        <h3 className="font-semibold text-slate-900">Sample Queries</h3>
      </div>

      <div className="space-y-3">
        {sampleQueries.map((query, index) => (
          <div
            key={index}
            className={cn(
              'border rounded-lg transition-all',
              selectedQuery === index
                ? 'border-neo4j-blue bg-neo4j-blue/5'
                : 'border-slate-200 hover:border-slate-300'
            )}
          >
            <button
              onClick={() => setSelectedQuery(selectedQuery === index ? null : index)}
              className="w-full text-left p-3"
            >
              <div className="flex items-start gap-3">
                <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 mb-1">
                    {query.natural}
                  </p>
                  <p className="text-xs text-slate-600">
                    {query.explanation}
                  </p>
                </div>
              </div>
            </button>

            {selectedQuery === index && (
              <div className="border-t border-slate-200 p-3 space-y-3 animate-in slide-in-from-top-2 duration-200">
                {/* Cypher query display */}
                <div className="bg-slate-900 rounded-lg p-3 font-mono text-xs text-slate-100 overflow-x-auto">
                  <pre className="whitespace-pre-wrap">{query.cypher}</pre>
                </div>

                {/* Execute button */}
                <button
                  onClick={() => onQueryExecute(query.natural)}
                  className="w-full bg-neo4j-blue text-white rounded-lg px-4 py-2 text-sm font-medium hover:bg-neo4j-blue/90 transition-colors flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" />
                  Execute Query
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Educational note */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-900">
          <strong className="font-semibold">About Cypher:</strong> Neo4j's declarative query
          language uses ASCII-art patterns to match graph structures. Nodes are in parentheses
          (node) and relationships are arrows -[RELATES_TO]-&gt;
        </p>
      </div>
    </div>
  )
}
