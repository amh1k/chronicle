import { ApiError } from "./apiError";

export const getParam = (
  params: Record<string, string | string[] | undefined>,
  key: string,
) => {
  const value = params[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  if (typeof value === "string") {
    return value;
  }
  throw new ApiError(400, `Missing or invalid parameter: ${key}`);
};
