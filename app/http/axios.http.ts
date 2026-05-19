// app/http/client.axios.ts
import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

class ClientAxios {
  private static instance: ClientAxios;
  private axiosInstance: AxiosInstance;

  private constructor() {
    if(!process.env.NEXT_PUBLIC_API_URL){
      throw new Error("Lỗi trong quá trình thực thi")
    }

    this.axiosInstance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      timeout: 5000,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    })

    this.setupInterceptors()
  }

  public static getInstance(): ClientAxios {
    if (!ClientAxios.instance) {
      ClientAxios.instance = new ClientAxios()
    }
    return ClientAxios.instance
  }

  private setupInterceptors() {
    let isRefreshing = false
    const queue: Array<{
      resolve: (value: unknown) => void
      reject: (reason?: unknown) => void
    }> = []

    const processQueue = (error: unknown) => {
      queue.forEach(({ resolve, reject }) => {
        if (error) reject(error)
        else resolve(null)
      })
      queue.length = 0
    }

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const original = error.config
        if (
          error.response?.status === 401 &&
          error.response?.data?.code === 'TOKEN_EXPIRED' &&
          !original._retry
        ) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              queue.push({ resolve, reject })
            })
              .then(() => this.axiosInstance(original))
              .catch(err => Promise.reject(err))
          }

          original._retry = true
          isRefreshing = true

          try {
            await this.axiosInstance.post('/auth/refresh-token', {},{
              withCredentials:true
            })
            processQueue(null)
            return this.axiosInstance(original)
          } catch (err) {
            processQueue(err)
            // window.location.href = '/login'
            return Promise.reject(err)
          } finally {
            isRefreshing = false
          }
        }

        return Promise.reject(error.response?.data || error)
      }
    )
  }

  async get<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    const res = await this.axiosInstance.get<T>(url, config)
    return res.data
  }

  async post<T>(url: string, body: unknown, config: AxiosRequestConfig = {}): Promise<T> {
    const res = await this.axiosInstance.post<T>(url, body, config)
    return res.data
  }

  async put<T>(url: string, body: unknown, config: AxiosRequestConfig = {}): Promise<T> {
    const res = await this.axiosInstance.put<T>(url, body, config)
    return res.data
  }

  async delete<T>(url: string, config: AxiosRequestConfig = {}): Promise<T> {
    const res = await this.axiosInstance.delete<T>(url, config)
    return res.data
  }
}

export default ClientAxios