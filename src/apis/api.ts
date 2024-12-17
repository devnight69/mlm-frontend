import { AxiosRequestConfig } from "axios";
import axiosInstance from "./axiosInstance";

const withInterceptors = async (callback: () => Promise<any>) => {
  return callback();
};

// Function to make a GET request with optional params and headers
export const getAPI = async <T>(
  endpoint: string,
  params: any = {},
  headers: AxiosRequestConfig["headers"] = {}
): Promise<T> => {
  return withInterceptors(async () => {
    try {
      const response = await axiosInstance.get<T>(endpoint, {
        params,
        headers,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.message);
    }
  });
};

// Function to make a POST request with optional data and headers
export const postAPI = async <T>(
  endpoint: string,
  data: any = {},
  params: any = {},
  headers: AxiosRequestConfig["headers"] = {}
): Promise<T> => {
  return withInterceptors(async () => {
    try {
      const response = await axiosInstance.post<T>(endpoint, data, {
        params,
        headers,
      });

      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.message);
    }
  });
};

// Function to make a PUT request with optional data and headers
export const putAPI = async <T>(
  endpoint: string,
  data: any = {},
  params: any = {},
  headers: AxiosRequestConfig["headers"] = {}
): Promise<T> => {
  return withInterceptors(async () => {
    try {
      const response = await axiosInstance.put<T>(endpoint, data, {
        params,
        headers,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.message);
    }
  });
};

// Function to make a DELETE request with optional data and headers
export const deleteAPI = async <T>(
  endpoint: string,
  data: any = {},
  params: any = {},
  headers: AxiosRequestConfig["headers"] = {}
): Promise<T> => {
  return withInterceptors(async () => {
    try {
      const response = await axiosInstance.delete<T>(endpoint, {
        data,
        params,
        headers,
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.message);
    }
  });
};
