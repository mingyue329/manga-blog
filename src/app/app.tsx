import { useEffect, type ReactElement } from 'react'
import { RouterProvider } from 'react-router-dom'

import { appRouter } from '@/app/router'
import { siteMetadata } from '@/shared/site/site-metadata'

/**
 * 搴旂敤鏍圭粍浠躲€? * 杩欓噷闄や簡鎸傝浇 React Router 浠ュ锛岃繕璐熻矗鍦ㄨ繍琛屾椂鍚屾绔欑偣绾у厓鏁版嵁锛? * 璁╂祻瑙堝櫒鏍囩鏍囬鍜屾瀯寤烘湡娉ㄥ叆鍒?`index.html` 鐨勫垵濮嬫爣棰樹繚鎸佷竴鑷淬€? * 杩欐牱鍗充娇鏈潵鏍囬閰嶇疆鍙戠敓鍙樻洿锛屼篃鍙渶瑕佹敼涓€澶勫叡浜厤缃枃浠躲€? */
function App(): ReactElement {
  useEffect(() => {
    document.title = siteMetadata.title
  }, [])

  return <RouterProvider router={appRouter} />
}

export default App

