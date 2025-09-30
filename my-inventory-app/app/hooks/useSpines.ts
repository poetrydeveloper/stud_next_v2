// app/hooks/useSpines.ts
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then(res => res.json());

export function useSpines() {
  const { data, error, mutate } = useSWR("/api/spines", fetcher);
  return {
    spines: data ?? [],
    loading: !data && !error,
    error,
    mutate,
  };
}
