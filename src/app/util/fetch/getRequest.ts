import { FetchError } from './fetchError';

const get = async (resource: RequestInfo, options?: RequestInit) => {
  const response = await fetch(resource, options);
  if (response.ok) {
    return response;
  }
  const error = new FetchError({
    message: `Network response to fetch request was not ok! Target URL: ${
      resource instanceof Request ? resource.url : resource
    }.`,
    status: response.status,
  });

  throw error;
};

export default get;
