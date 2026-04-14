import { useEffect, useMemo, useState } from 'react'

export interface PagefindPostSearchResult {
  slug: string
  url: string
  title: string
  excerptHtml: string
  category: string
  date: string
}

type PagefindSearchMode = 'idle' | 'loading' | 'ready' | 'error'

interface PagefindSearchApiResult {
  url: string
  excerpt?: string
  meta: Record<string, string>
}

interface PagefindSearchResponse {
  results: Array<{
    data: () => Promise<PagefindSearchApiResult>
  }>
}

interface PagefindSearchModule {
  options: (options: {
    baseUrl: string
    bundlePath: string
    excerptLength: number
  }) => Promise<void>
  search: (term: string) => Promise<PagefindSearchResponse>
}

interface UsePagefindPostSearchResult {
  mode: PagefindSearchMode
  matchedPostSlugs: string[] | null
  results: PagefindPostSearchResult[]
  isUsingPagefind: boolean
  errorMessage: string | null
}

let pagefindModulePromise: Promise<PagefindSearchModule> | null = null

async function loadPagefindModule(): Promise<PagefindSearchModule> {
  if (!pagefindModulePromise) {
    const normalizedBaseUrl = import.meta.env.BASE_URL.endsWith('/')
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`
    const pagefindScriptUrl = `${normalizedBaseUrl}pagefind/pagefind.js`.replace(
      /\/{2,}/g,
      '/',
    )

    pagefindModulePromise = import(/* @vite-ignore */ pagefindScriptUrl).then(
      async (module) => {
        const pagefind = (module.default ?? module) as PagefindSearchModule

        await pagefind.options({
          baseUrl: normalizedBaseUrl,
          bundlePath: `${normalizedBaseUrl}pagefind/`.replace(/\/{2,}/g, '/'),
          excerptLength: 18,
        })

        return pagefind
      },
    )
  }

  return pagefindModulePromise
}

function normalizeSearchKeyword(keyword: string): string {
  return keyword.trim()
}

function extractPagefindPostSearchResult(
  result: PagefindSearchApiResult,
): PagefindPostSearchResult | null {
  const slug = result.meta.slug?.trim()
  const title = result.meta.title?.trim()

  if (!slug || !title) {
    return null
  }

  return {
    slug,
    url: result.url,
    title,
    excerptHtml: result.excerpt ?? result.meta.excerpt ?? '',
    category: result.meta.category ?? '',
    date: result.meta.date ?? '',
  }
}

export function usePagefindPostSearch(
  keyword: string,
): UsePagefindPostSearchResult {
  const normalizedKeyword = useMemo(() => normalizeSearchKeyword(keyword), [keyword])
  const [mode, setMode] = useState<PagefindSearchMode>('idle')
  const [matchedPostSlugs, setMatchedPostSlugs] = useState<string[] | null>(null)
  const [results, setResults] = useState<PagefindPostSearchResult[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!normalizedKeyword) {
      setMode('idle')
      setMatchedPostSlugs(null)
      setResults([])
      setErrorMessage(null)
      return
    }

    let disposed = false
    setMode('loading')
    setErrorMessage(null)

    const timeoutId = window.setTimeout(async () => {
      try {
        const pagefind = await loadPagefindModule()
        const response = await pagefind.search(normalizedKeyword)
        const loadedResults = await Promise.all(
          response.results.slice(0, 8).map((result) => result.data()),
        )

        if (disposed) {
          return
        }

        const searchResults = loadedResults
          .map((result) => extractPagefindPostSearchResult(result))
          .filter((result): result is PagefindPostSearchResult => result !== null)
        const rankedSearchSlugs = searchResults.map((result) => result.slug)

        setResults(searchResults)
        setMatchedPostSlugs(rankedSearchSlugs)
        setMode('ready')
      } catch (error) {
        if (disposed) {
          return
        }

        const nextErrorMessage =
          error instanceof Error ? error.message : 'Pagefind 索引加载失败。'

        setResults([])
        setMatchedPostSlugs(null)
        setMode('error')
        setErrorMessage(nextErrorMessage)
      }
    }, 180)

    return () => {
      disposed = true
      window.clearTimeout(timeoutId)
    }
  }, [normalizedKeyword])

  return {
    mode,
    matchedPostSlugs,
    results,
    isUsingPagefind: mode === 'ready',
    errorMessage,
  }
}
