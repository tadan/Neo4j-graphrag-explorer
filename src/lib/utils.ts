import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Simulates streaming text response with realistic delays
 * This demonstrates proper handling of GenAI streaming patterns
 */
export async function* streamText(text: string, delayMs: number = 20): AsyncGenerator<string> {
  const words = text.split(' ')
  for (let i = 0; i < words.length; i++) {
    await new Promise(resolve => setTimeout(resolve, delayMs))
    yield words[i] + (i < words.length - 1 ? ' ' : '')
  }
}

/**
 * Formats Cypher queries with syntax highlighting markup
 */
export function formatCypherQuery(query: string): string {
  return query
    .replace(/(MATCH|WHERE|RETURN|CREATE|WITH|ORDER BY|LIMIT)/g, '<span class="text-neo4j-blue font-semibold">$1</span>')
    .replace(/(\([a-z]+:[A-Z][a-zA-Z]+\))/g, '<span class="text-neo4j-green">$1</span>')
    .replace(/(\{[^}]+\})/g, '<span class="text-neo4j-purple">$1</span>')
}

/**
 * Debounce function for performance optimization
 */
export function debounce<T extends (...args: never[]) => unknown>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), waitMs)
  }
}
