import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpAdapter } from '../interface/http-adapter.interface';

// Adapter basado en fetch nativo de Node >=18 (global fetch)
@Injectable()
export class FetchAdapterService implements HttpAdapter {
  async get<T>(url: string, config?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...config, method: 'GET' });
  }

  async post<T>(url: string, data: any, config?: RequestInit): Promise<T> {
    return this.requestWithBody<T>('POST', url, data, config);
  }

  async put<T>(url: string, data: any, config?: RequestInit): Promise<T> {
    return this.requestWithBody<T>('PUT', url, data, config);
  }

  async patch<T>(url: string, data: any, config?: RequestInit): Promise<T> {
    return this.requestWithBody<T>('PATCH', url, data, config);
  }

  async delete<T>(url: string, config?: RequestInit): Promise<T> {
    return this.request<T>(url, { ...config, method: 'DELETE' });
  }

  private async requestWithBody<T>(
    method: string,
    url: string,
    body: any,
    config?: RequestInit,
  ): Promise<T> {
    const isFormData =
      typeof FormData !== 'undefined' && body instanceof FormData;
    const headers: Record<string, string> = {
      ...(config?.headers as Record<string, string>),
    };
    if (!isFormData && body !== undefined && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    const payload = isFormData
      ? body
      : body !== undefined
        ? JSON.stringify(body)
        : undefined;
    return this.request<T>(url, { ...config, method, headers, body: payload });
  }

  private async request<T>(url: string, init?: RequestInit): Promise<T> {
    try {
      const response = await fetch(url, init);
      if (!response.ok) {
        const errorPayload = await this.safeParse(response);
        throw new BadRequestException(
          `Request failed: ${response.status} ${response.statusText}` +
            (errorPayload ? ` => ${errorPayload}` : ''),
        );
      }
      const data = await this.safeParse(response);
      return data as T;
    } catch (error: any) {
      this.handleError(error);
    }
  }

  private async safeParse(response: Response): Promise<any | undefined> {
    try {
      const contentType = response.headers.get('content-type') || '';
      if (response.status === 204 || response.status === 205) return undefined;
      if (contentType.includes('application/json')) {
        return await response.json();
      }
      const text = await response.text();
      if (!text) return undefined;
      try {
        return JSON.parse(text);
      } catch {
        return text;
      }
    } catch {
      return undefined;
    }
  }

  private handleError(error: any): never {
    if (error instanceof BadRequestException) {
      throw error;
    }
    const message = error?.message || 'Unknown error';
    throw new BadRequestException(`Unexpected fetch error: ${message}`);
  }
}
