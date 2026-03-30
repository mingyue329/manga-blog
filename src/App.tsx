import type { ReactElement } from 'react'
import { RouterProvider } from 'react-router-dom'

import { appRouter } from '@/app/router'

/**
 * 应用根组件。
 * 这里的职责非常单一，只负责把路由系统挂载进 React 运行时。
 */
function App(): ReactElement {
  return <RouterProvider router={appRouter} />
}

export default App
