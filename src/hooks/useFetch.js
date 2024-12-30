import { useEffect, useState } from "react";

export function useFetch(fetchFunction, initialValue) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setIsError] = useState();
  const [data, setData] = useState(initialValue);

  console.log(initialValue);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await fetchFunction();
        setData(data);
      } catch (error) {
        setIsError({
          message: error.message || "Failed to fetch data",
        });
        setData([]);
      }
      setIsLoading(false);
    }

    fetchData();
  }, [fetchFunction]);

  console.log(data);

  return { error, isLoading, data, setData };
}
