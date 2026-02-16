import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

export class ApiClient {
  private instance: AxiosInstance;
  private getAccessToken: () => string | null;

  constructor(baseURL: string, getAccessToken: () => string | null) {
    this.getAccessToken = getAccessToken;

    this.instance = axios.create({
      baseURL,
      withCredentials: true,
    });

    this.initializeInterceptors();
  }

  private initializeInterceptors() {
    this.instance.interceptors.request.use((config) => {
      const token = this.getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  public get<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance.get<T>(url, config);
  }

  public post<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.instance.post<T>(url, data, config);
  }

  public put<T>(url: string, data?: unknown, config?: AxiosRequestConfig) {
    return this.instance.put<T>(url, data, config);
  }

  public delete<T>(url: string, config?: AxiosRequestConfig) {
    return this.instance.delete<T>(url, config);
  }
}
