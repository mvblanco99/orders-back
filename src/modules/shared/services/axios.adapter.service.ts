import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpAdapter } from '../interface/http-adapter.interface';

@Injectable()
export class AxiosAdapterService implements HttpAdapter {
  private readonly axios: AxiosInstance = axios;

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const { data } = await this.axios.get<T>(url, config);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async post<T>(
    url: string,
    payload: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const { data } = await this.axios.post<T>(url, payload, config);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async put<T>(
    url: string,
    payload: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const { data } = await this.axios.put<T>(url, payload, config);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async patch<T>(
    url: string,
    payload: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const { data } = await this.axios.patch<T>(url, payload, config);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const { data } = await this.axios.delete<T>(url, config);
      return data;
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: any): never {
    try {
      const errorMessage = error?.message || 'Unknown error';
      if (axios.isAxiosError(error)) {
        const errorDetails = error.response?.data
          ? JSON.stringify(error.response.data)
          : '';
        throw new BadRequestException(
          `Request failed: ${errorMessage}. ${errorDetails}`.trim(),
        );
      } else {
        throw new BadRequestException(`Unexpected error: ${errorMessage}`);
      }
    } catch (error) {
      throw error;
    }
  }
}
