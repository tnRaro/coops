import { HttpError } from "@coops/error";

export interface FetchWrapperOptions {
  url: string;
  method?: string;
  authorId?: string;
  body?: any;
}
export const fetchWrapper = async <TResult>({
  url,
  method,
  authorId,
  body,
}: FetchWrapperOptions): Promise<TResult> => {
  const headers: HeadersInit = {};
  if (authorId != null) {
    headers.authorization = `X-API-KEY ${authorId}`;
  }
  const res = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
  });
  if (res.status >= 400) {
    throw new HttpError(res.status as any, res.statusText);
  }
  if (res.status !== 204) {
    const text = await res.text();
    if (text === "") {
      return {} as TResult;
    }
    try {
      return JSON.parse(text) as TResult;
    } catch (error) {
      return {} as TResult;
    }
  }
  return {} as TResult;
};
