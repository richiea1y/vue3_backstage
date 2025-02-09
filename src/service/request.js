import axios from 'axios'

export function request(config) {
  config.headers.token = !localStorage.getItem('userInfo')
    ? ''
    : JSON.parse(localStorage.getItem('userInfo')).token
  const service = axios.create({
    headers: config.headers,
    baseURL: import.meta.env.MODE === 'production' ? import.meta.env.VITE_BASE_API : '/api',
    timeout: 30000,
    transformRequest: [
      (data = config.params) => {
        const tempData = getJwtData(JSON.stringify(data))
        return tempData.data
      }
    ]
  })
  const getJwtData = (data) => {
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        const val = data[key]
        if (val === '' || val === undefined) {
          delete data[key]
        }
      }
    }
    const jwt = encodeURIComponent(btoa(encodeURIComponent(data)))
    return { data: jwt }
  }

  // request攔截
  service.interceptors.request.use(
    (config) => {
      return config
    },
    (error) => {
      console.log(error)
      Promise.reject(error)
    }
  )

  // response攔截
  service.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      // 這裡處理具體的錯誤代碼
      if (error.response) {
        switch (error.response.status) {
          case 400:
            console.error('400 Bad Request')
            break
          case 404:
            console.error('404 Not Found')
            break
          case 500:
            console.error('500 Internal Server Error')
            break
          default:
            console.error(`Error: ${error.response.status}`)
        }
      } else {
        console.error('Network Error or Request Timed Out')
      }
      return Promise.reject(error)
    }
  )
  return service(config)
}

console.log(import.meta.env.MODE)