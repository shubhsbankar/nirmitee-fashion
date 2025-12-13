/*import { useState, useEffect, useMemo } from  'react';
import axios from 'axios';

const useFetch = (url, method = 'GET', options = {}) =>{
  const [data,setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const optionsString = JSON.stringify(options);

  const requestOptions = useMemo(() => {
    const opts = {...options};
    if (method === 'POST' && !opts.data){
      opts.data = {}
    }
    return opts;
  }, [method,optionsString]);

  useEffect(() => {
    const apiCall = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data : response } = await axios({
        url,
        method,
        ...(requestOptions)
      });

      if (!response.success){
          throw new Error(response.message);
        }

        setData(response);
    }
    catch(error) {
      setError(error.message);
    }finally {
      setLoading(false);
    }
  }
  apiCall();
  }, [url,refreshIndex, requestOptions]);

  const refetch = () => {
    setRefreshIndex(prev => prev + 1)
  }
  return { data , loading, error, refetch};
}

export default useFetch;
*/

import { useState, useEffect, useMemo, useCallback } from 'react'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

/**
 * Generic useFetch hook
 *
 * T: expected shape of response.data (defaults to any)
 *
 * Example usage:
 *   const { data, loading, error, refetch } = useFetch<MyResponse>('/api/thing')
 */
function safeStringify(value: any): string {
  try {
    return JSON.stringify(value)
  } catch {
    // fallback for circular structures or non-serializable values
    return String(value)
  }
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export default function useFetch<T = any>(
  url: string | null,
  method: Method = 'GET',
  options: AxiosRequestConfig = {}
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [refreshIndex, setRefreshIndex] = useState<number>(0)

  // Stable serialized value for options so memo dependency works even if options is a new object each render
  const optionsString = useMemo(() => safeStringify(options), [options])

  const requestOptions = useMemo<AxiosRequestConfig>(() => {
    const opts: AxiosRequestConfig = { ...(options || {}) }

    // If method is one that typically expects a payload, ensure opts.data exists so axios doesn't fail when callers
    // rely on data being present. Keep empty object only when developer hasn't supplied data explicitly.
    if ((method === 'POST' || method === 'PUT' || method === 'PATCH') && typeof opts.data === 'undefined') {
      opts.data = {}
    }

    return opts
  }, [method, optionsString])

  useEffect(() => {
    // if url is falsy, skip the fetch
    if (!url) return

    let mounted = true

    const apiCall = async () => {
      try {
        setLoading(true)
        setError(null)

        const axiosConfig: AxiosRequestConfig = {
          url,
          method: method.toLowerCase() as AxiosRequestConfig['method'],
          ...requestOptions,
        }

        const resp: AxiosResponse<T> = await axios.request<T>(axiosConfig)
        const respData = resp.data

        // If your API follows { success: boolean, message: string } pattern, the original hook threw
        // when success was false. We preserve that behaviour only when respData has a 'success' boolean.
        // Otherwise we assume response body is the actual payload and set it as-is.
        if (respData && typeof (respData as any).success === 'boolean') {
          if ((respData as any).success === false) {
            throw new Error((respData as any).message ?? 'Request failed')
          }
        }

        if (mounted) {
          setData(respData)
        }
      } catch (err: any) {
        // Normalize error message
        let message = 'Unknown error'
        if (axios.isAxiosError(err)) {
          message = err.response?.data?.message ?? err.message
        } else if (err instanceof Error) {
          message = err.message
        } else {
          message = String(err)
        }
        if (mounted) setError(message)
      } finally {
        if (mounted) setLoading(false)
      }
    }

    apiCall()

    return () => {
      mounted = false
    }
    // requestOptions is stable because it is memoized above
  }, [url, refreshIndex, requestOptions, method])

  const refetch = useCallback(() => {
    setRefreshIndex((p) => p + 1)
  }, [])

  return { data, loading, error, refetch }
}
