export const initSSE = () => {
  const ssEvents = new EventSource("http://localhost:4000/api/sse", {
    withCredentials: true,
  });
  return ssEvents;
};
