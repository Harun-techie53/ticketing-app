/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestHeaders } from "axios";
import axiosInstance from "./axios";
import { utils } from "../utils";

type HTTPRequestCommon = {
  apiPath: string;
  data?: any;
  config?: object;
  withCredentials?: boolean;
  external?: boolean;
  isMultipart?: boolean;
};

interface CustomAxiosHeaders extends AxiosRequestHeaders {
  "x-auth-token"?: string;
}

function transformConfig(config: any, data: any) {
  let transformedData = data;
  if (
    config &&
    utils.isDefined(config, "headers") &&
    utils.isDefined(config.headers, "Content-Type") &&
    config.headers["Content-Type"] === "application/x-www-form-urlencoded"
  ) {
    transformedData = JSON.stringify(data);
  } else if (data instanceof FormData) {
    transformedData = data;
  }
  return transformedData;
}

const apiGet = async <T>({
  apiPath,
  config = {},
  withCredentials = false,
  external = false,
}: HTTPRequestCommon): Promise<T> => {
  const axiosToUse = external ? axios : axiosInstance();
  const fullUrl = apiPath;
  const newConfig = {
    ...config,
    withCredentials,
  };

  try {
    const response = await axiosToUse.get(fullUrl, newConfig);
    return response.data.data as T;
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status;
      const errorMessage = extractErrorMessage(error.response.data);
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error("Request setup error");
    }
  }
};

const apiPost = async <T>({
  apiPath,
  data,
  config = {},
  withCredentials = false,
  external = false,
  isMultipart = false,
}: HTTPRequestCommon): Promise<T> => {
  const newConfig: any = {
    ...config,
    withCredentials,
  };

  if (isMultipart) {
    newConfig.headers = {
      ...newConfig.headers,
      "Content-Type": "multipart/form-data",
    };
  }

  const transformedData = transformConfig(newConfig, data);
  const axiosToUse = external ? axios : axiosInstance();
  const fullUrl = apiPath;
  try {
    const response = await axiosToUse.post(fullUrl, transformedData, newConfig);
    return response.data;
  } catch (error: any) {
    if (error.response) {
    // const errors: {message:} =  error.response.data.errors;
      let status;
      let errorMessage;
      if (!utils.isHTML(error.response)) {
        status = 400;
        errorMessage = error.response.data.message;
      } else {
        status = error.response.status;
        errorMessage = extractErrorMessage(error.response.data);
      }
      throw new Error(errorMessage);
    } else if (error.request) {
      throw new Error("No response from server");
    } else {
      throw new Error("Request setup error");
    }
  }
};

const apiPut = async ({
  apiPath,
  data,
  config = {},
  external = false,
  isMultipart = false,
  withCredentials,
}: HTTPRequestCommon) => {
  const newConfig: any = {
    ...config,
    withCredentials,
  };

  if (isMultipart) {
    newConfig.headers = {
      ...newConfig.headers,
      "Content-Type": "multipart/form-data",
    };
  }

  const transformedData = transformConfig(newConfig, data);
  const axiosToUse = external ? axios : axiosInstance();
  const fullUrl = apiPath;

  try {
    const response = await axiosToUse.put(fullUrl, transformedData, newConfig);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      let status;
      let errorMessage;
      if (!utils.isHTML(error.response)) {
        status = 400;
        errorMessage = error.response.data.message;
      } else {
        status = error.response.status;
        errorMessage = extractErrorMessage(error.response.data);
      }
      return { status, errorMessage };
    } else if (error.request) {
      return { status: 500, errorMessage: "No response from server" };
    } else {
      return { status: 500, errorMessage: "Request setup error" };
    }
  }
};

function apiPatch({
  apiPath,
  data,
  config = {},
  external = false,
}: HTTPRequestCommon) {
  const newConfig = {
    ...config,
  };
  const transformedData = transformConfig(newConfig, data);
  const axiosToUse = external ? axios : axiosInstance();
  const fullUrl = apiPath;

  return new Promise(async (resolve, reject) => {
    try {
      const response = await axiosToUse.patch(
        fullUrl,
        transformedData,
        newConfig
      );
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
}

async function apiDelete({
  apiPath,
  config = {},
  external = false,
  withCredentials,
}: HTTPRequestCommon) {
  const newConfig = {
    ...config,
    withCredentials,
  };
  const axiosToUse = external ? axios : axiosInstance();
  const fullUrl = apiPath;

  try {
    const response = await axiosToUse.delete(fullUrl, newConfig);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      let status;
      let errorMessage;
      if (!utils.isHTML(error.response)) {
        status = 400;
        errorMessage = error.response.data.message;
      } else {
        status = error.response.status;
        errorMessage = extractErrorMessage(error.response.data);
      }
      return { status, errorMessage };
    } else if (error.request) {
      return { status: 500, errorMessage: "No response from server" };
    } else {
      return { status: 500, errorMessage: "Request setup error" };
    }
  }
}

export const extractErrorMessage = (htmlContent: string): string => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlContent, "text/html");
  const preElement = doc.querySelector("pre");
  if (preElement) {
    const errorMessageOnly = preElement.innerHTML.split("<br>")?.[0];
    return errorMessageOnly || "";
  } else {
    return "Unknown error";
  }
};

export { apiDelete, apiGet, apiPost, apiPut, apiPatch };
