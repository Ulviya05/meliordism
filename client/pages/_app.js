import '@/styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import Loading from '@/components/Loading';
import axios from 'axios';

export default function App({ Component, pageProps }) {
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    console.log("hello")
    const user_id = localStorage.getItem("id");

    axios.interceptors.request.use(function (config) {
      if (!config.DISABLE_LOADING) {
        setLoading(true);
      }
      
      config.headers.Authorization = `Bearer ${user_id}`;
      return config;
    });

    axios.interceptors.response.use(
      function (response) {
          // Any status code that lie within the range of 2xx cause this function to trigger
          // Do something with response data
          if (response && response.data && response.data.message) {
              toast.success(response.data.message)
          }
          setLoading(false);
          return response
      },
      function (error) {
          console.log(error)
          setLoading(false);
          // Any status codes that falls outside the range of 2xx cause this function to trigger
          // Do something with response error
          if (error.response && error.response.data.message) {
            console.log("eeee")
            console.log(error.response.data.message)
            toast.error(error.response.data.message)
          } else if (error && error.response && error.response.data) {
            console.log("weeee")
              toast.error(
                console.log(error.response.data.message),
                  error.response.data.message ||
                      (typeof error.response.data === 'string'
                          ? error.response.data
                          : JSON.stringify(error.response.data))
              )
          }
          return Promise.reject(error)
      }
    )
  }, [])
  
  return <> {isLoading && <Loading />} <Component {...pageProps} setLoading={setLoading} /> <ToastContainer position='bottom-right' /></>
}


// import { useEffect } from 'react'
// import axios from 'axios'
// import { useSelector, useDispatch } from 'react-redux'
// import { toast, ToastContainer } from 'react-toastify'
// import { QueryClient, QueryClientProvider } from 'react-query'

// import { startLoading, stopLoading, selectLoading } from './slice'
// import Loading from '../packages/Core/Layout/Loading'
// import RouteRenderer from './routes/route-renderer'

// import 'react-toastify/dist/ReactToastify.min.css'

// import '@fontsource/poppins/400.css'
// import '@fontsource/poppins/500.css'
// import '@fontsource/poppins/600.css'
// import '@fontsource/poppins/700.css'

// function App() {
//     const loading = useSelector(selectLoading)
//     const dispatch = useDispatch()
//     const queryClient = new QueryClient()

//     useEffect(() => {
//         // Add a request interceptor
//         axios.interceptors.request.use(
//             function (config) {
//                 // Do something before request is sent
//                 const token = localStorage.getItem('access_token')
//                 if (token) {
//                     config.headers.Authorization = `Bearer ${token}`
//                 }
//                 if (config.ENABLE_GLOBAL_LOADING) {
//                     dispatch(startLoading())
//                 }
//                 return config
//             },
//             function (error) {
//                 // Do something with request error
//                 if (error && error.message) {
//                     toast.error(error.message)
//                 }
//                 dispatch(stopLoading())
//                 return Promise.reject(error)
//             }
//         )

//         // Add a response interceptor
//         axios.interceptors.response.use(
//             function (response) {
//                 // Any status code that lie within the range of 2xx cause this function to trigger
//                 // Do something with response data
//                 if (response && response.data && response.data.message) {
//                     toast.success(response.data.message)
//                 }
//                 dispatch(stopLoading())
//                 return response
//             },
//             function (error) {
//                 // Any status codes that falls outside the range of 2xx cause this function to trigger
//                 // Do something with response error
//                 if (error.response && error.response.data.error_description) {
//                     toast.error(error.response.data.error_description)
//                 } else if (error && error.response && error.response.data) {
//                     toast.error(
//                         error.response.data.message ||
//                             (typeof error.response.data === 'string'
//                                 ? error.response.data
//                                 : JSON.stringify(error.response.data))
//                     )
//                 } else {
//                     toast.error(error.toJSON().message)
//                 }
//                 setTimeout(() => {
//                     dispatch(stopLoading())
//                 }, 500)
//                 return Promise.reject(error)
//             }
//         )
//     }, [])

//     if (loading) {
//         return <Loading />
//     }

//     return (
//         <QueryClientProvider client={queryClient}>
//             <div className="App">
//                 <RouteRenderer />
//                 <ToastContainer position="bottom-right" />
//             </div>
//         </QueryClientProvider>
//     )
// }

// export default App