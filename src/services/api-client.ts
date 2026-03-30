const DEFAULT_API_BASE_URL = '/api'

/**
 * 拼接最终请求地址。
 * 之所以单独抽成函数，是因为以后无论切换到本地 mock、网关前缀还是完整域名，这里都能统一收口。
 */
function buildRequestUrl(endpoint: string): string {
  const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL ?? DEFAULT_API_BASE_URL
  const normalizedBaseUrl = configuredBaseUrl.endsWith('/')
    ? configuredBaseUrl.slice(0, -1)
    : configuredBaseUrl
  const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`

  return `${normalizedBaseUrl}${normalizedEndpoint}`
}

/**
 * 请求并解析 JSON 数据。
 * 这是整个项目未来对接真实后端时的统一入口，错误处理和鉴权逻辑都可以继续往这里集中。
 */
export async function requestJson<T>(
  endpoint: string,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(buildRequestUrl(endpoint), {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    throw new Error(`请求失败：${response.status} ${response.statusText}`)
  }

  return (await response.json()) as T
}
