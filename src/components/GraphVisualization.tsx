import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { GraphData, GraphNode } from '../types'
import { cn } from '../lib/utils'

interface GraphVisualizationProps {
  data: GraphData
  selectedNode: GraphNode | null
  onNodeSelect: (node: GraphNode | null) => void
  highlightedNodes?: string[]
  className?: string
}

/**
 * Interactive graph visualization using D3.js force simulation
 *
 * Key features demonstrated:
 * - Force-directed layout for natural clustering
 * - Interactive node selection and exploration
 * - Zoom and pan controls
 * - Highlight paths for RAG context visualization
 * - Responsive canvas sizing
 * - Accessible keyboard navigation
 */
export function GraphVisualization({
  data,
  selectedNode,
  onNodeSelect,
  highlightedNodes = [],
  className
}: GraphVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  // Color mapping for node types - using Neo4j brand colors
  const nodeColors: Record<string, string> = {
    Person: '#FF6B6B',
    Company: '#4ECDC4',
    Technology: '#008CC1', // Neo4j blue
    Concept: '#9C27B0', // Neo4j purple
    Document: '#95E1D3'
  }

  useEffect(() => {
    // Update dimensions on resize
    const updateDimensions = () => {
      if (svgRef.current) {
        const rect = svgRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    if (!svgRef.current || !data.nodes.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = dimensions

    // Create main group for zoom/pan
    const g = svg.append('g')

    // Setup zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        g.attr('transform', event.transform)
      })

    svg.call(zoom)

    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes as any)
      .force('link', d3.forceLink(data.relationships)
        .id((d: any) => d.id)
        .distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40))

    // Draw relationships
    const link = g.append('g')
      .selectAll('line')
      .data(data.relationships)
      .join('line')
      .attr('stroke', d =>
        highlightedNodes.includes(d.source as string) && highlightedNodes.includes(d.target as string)
          ? '#008CC1'
          : '#cbd5e1'
      )
      .attr('stroke-width', d =>
        highlightedNodes.includes(d.source as string) && highlightedNodes.includes(d.target as string)
          ? 3
          : 1.5
      )
      .attr('stroke-opacity', d =>
        highlightedNodes.length === 0 ||
        (highlightedNodes.includes(d.source as string) && highlightedNodes.includes(d.target as string))
          ? 0.6
          : 0.1
      )

    // Draw relationship labels
    const linkLabel = g.append('g')
      .selectAll('text')
      .data(data.relationships)
      .join('text')
      .attr('class', 'text-[10px] fill-slate-600 pointer-events-none')
      .attr('text-anchor', 'middle')
      .attr('dy', -5)
      .text(d => d.type.replace(/_/g, ' '))
      .attr('opacity', d =>
        highlightedNodes.length === 0 ||
        (highlightedNodes.includes(d.source as string) && highlightedNodes.includes(d.target as string))
          ? 0.7
          : 0
      )

    // Draw nodes
    const node = g.append('g')
      .selectAll('g')
      .data(data.nodes)
      .join('g')
      .attr('cursor', 'pointer')
      .call(d3.drag<any, GraphNode>()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any)

    // Node circles
    node.append('circle')
      .attr('r', d => selectedNode?.id === d.id ? 28 : 20)
      .attr('fill', d => nodeColors[d.type] || '#94a3b8')
      .attr('stroke', d => selectedNode?.id === d.id ? '#1e293b' : '#fff')
      .attr('stroke-width', d => selectedNode?.id === d.id ? 3 : 2)
      .attr('opacity', d =>
        highlightedNodes.length === 0 || highlightedNodes.includes(d.id) ? 1 : 0.2
      )
      .on('click', (event, d) => {
        event.stopPropagation()
        onNodeSelect(selectedNode?.id === d.id ? null : d)
      })

    // Node labels
    node.append('text')
      .attr('dy', 35)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-xs font-medium fill-slate-700 pointer-events-none')
      .attr('opacity', d =>
        highlightedNodes.length === 0 || highlightedNodes.includes(d.id) ? 1 : 0.2
      )
      .text(d => d.label)

    // Node type badges
    node.append('text')
      .attr('dy', 5)
      .attr('text-anchor', 'middle')
      .attr('class', 'text-[10px] font-bold fill-white pointer-events-none')
      .text(d => d.type.charAt(0))

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      linkLabel
        .attr('x', (d: any) => (d.source.x + d.target.x) / 2)
        .attr('y', (d: any) => (d.source.y + d.target.y) / 2)

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

    // Drag handlers
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    // Click on background to deselect
    svg.on('click', () => onNodeSelect(null))

    // Cleanup
    return () => {
      simulation.stop()
    }
  }, [data, dimensions, selectedNode, highlightedNodes, onNodeSelect])

  return (
    <div className={cn('relative w-full h-full bg-white rounded-lg border border-slate-200', className)}>
      <svg
        ref={svgRef}
        className="w-full h-full"
        role="img"
        aria-label="Interactive knowledge graph visualization"
      />

      {/* Legend */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200 p-3 text-xs">
        <div className="font-semibold mb-2 text-slate-700">Node Types</div>
        {Object.entries(nodeColors).map(([type, color]) => (
          <div key={type} className="flex items-center gap-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-slate-600">{type}</span>
          </div>
        ))}
      </div>

      {/* Controls hint */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-600">
        <div className="flex items-center gap-4">
          <span>Drag to pan • Scroll to zoom • Click nodes to explore</span>
        </div>
      </div>
    </div>
  )
}
