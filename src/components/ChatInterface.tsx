import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Database, Sparkles } from 'lucide-react'
import type { Message, GraphNode } from '../types'
import { cn } from '../lib/utils'

interface ChatInterfaceProps {
  messages: Message[]
  onSendMessage: (content: string) => void
  isLoading: boolean
  onSourceClick?: (node: GraphNode) => void
}

/**
 * Chat interface component for GenAI interactions
 *
 * Features:
 * - Streaming message display with typing animation
 * - Source citations with clickable graph nodes
 * - Cypher query display for transparency
 * - Accessible keyboard navigation
 * - Auto-scroll to latest message
 * - Loading states and error handling
 */
export function ChatInterface({
  messages,
  onSendMessage,
  isLoading,
  onSourceClick
}: ChatInterfaceProps) {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send on Enter (without Shift)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-slate-200">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-gradient-to-r from-neo4j-blue/5 to-neo4j-purple/5">
        <Sparkles className="w-5 h-5 text-neo4j-blue" />
        <div>
          <h2 className="font-semibold text-slate-900">GraphRAG Assistant</h2>
          <p className="text-xs text-slate-600">
            Ask questions about GenAI and graph databases
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
            <Database className="w-12 h-12 mb-4 text-slate-300" />
            <p className="text-sm font-medium mb-2">Start exploring the knowledge graph</p>
            <p className="text-xs max-w-md">
              Try asking: "How does GraphRAG improve AI accuracy?" or "What companies use Neo4j?"
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              onSourceClick={onSourceClick}
            />
          ))
        )}

        {isLoading && (
          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Searching knowledge graph...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about the knowledge graph..."
            className="flex-1 resize-none rounded-lg border border-slate-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neo4j-blue focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            rows={2}
            disabled={isLoading}
            aria-label="Message input"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="px-4 rounded-lg bg-neo4j-blue text-white font-medium transition-all hover:bg-neo4j-blue/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neo4j-blue flex items-center gap-2"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Press Enter to send • Shift+Enter for new line
        </p>
      </form>
    </div>
  )
}

function MessageBubble({
  message,
  onSourceClick
}: {
  message: Message
  onSourceClick?: (node: GraphNode) => void
}) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div className={cn('flex flex-col gap-2 max-w-[80%]', isUser && 'items-end')}>
        {/* Message bubble */}
        <div
          className={cn(
            'rounded-lg px-4 py-3 text-sm',
            isUser
              ? 'bg-neo4j-blue text-white'
              : 'bg-slate-100 text-slate-900 border border-slate-200'
          )}
        >
          {message.isStreaming ? (
            <span className="inline-flex items-center gap-1">
              {message.content}
              <span className="inline-block w-1 h-4 bg-current animate-pulse" />
            </span>
          ) : (
            <p className="whitespace-pre-wrap">{message.content}</p>
          )}
        </div>

        {/* Cypher query display */}
        {message.cypherQuery && !isUser && (
          <div className="bg-slate-50 rounded-lg border border-slate-200 p-3 text-xs font-mono">
            <div className="flex items-center gap-2 mb-2">
              <Database className="w-3 h-3 text-neo4j-blue" />
              <span className="font-semibold text-slate-700">Cypher Query</span>
            </div>
            <pre className="text-slate-600 whitespace-pre-wrap">
              {message.cypherQuery}
            </pre>
          </div>
        )}

        {/* Sources */}
        {message.sources && message.sources.length > 0 && !isUser && (
          <div className="flex flex-wrap gap-2">
            <span className="text-xs text-slate-600">Sources:</span>
            {message.sources.map((source) => (
              <button
                key={source.id}
                onClick={() => onSourceClick?.(source)}
                className="text-xs bg-white border border-slate-200 rounded-full px-3 py-1 hover:bg-slate-50 hover:border-neo4j-blue transition-colors"
                aria-label={`View source: ${source.label}`}
              >
                {source.label}
              </button>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="text-xs text-slate-500">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  )
}
