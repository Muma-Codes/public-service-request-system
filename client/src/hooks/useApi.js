import { useCallback, useEffect, useState } from "react";
import { getErrorMessage } from "../utils/errors";

/**
 * Runs an API call on mount (and whenever `deps` change).
 * Returns { data, error, isLoading, isRefreshing, reload, setData }.
 *  - keepPrevious: when deps change, keep showing the old data (isRefreshing = true)
 *    instead of switching back to a full loader. Used for paging and filters.
 *  - setData lets a page apply a mutation's response without refetching.
 */
export default function useApi(
  fetcher,
  deps = [],
  { keepPrevious = false } = {},
) {
  const [state, setState] = useState({
    data: null,
    error: "",
    isLoading: true,
    isRefreshing: false,
  });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState((prev) => {
      const hasData = keepPrevious && prev.data !== null;
      return { ...prev, error: "", isLoading: !hasData, isRefreshing: hasData };
    });

    fetcher()
      .then(
        (data) =>
          !cancelled &&
          setState({ data, error: "", isLoading: false, isRefreshing: false }),
      )
      .catch(
        (error) =>
          !cancelled &&
          setState((prev) => ({
            ...prev,
            error: getErrorMessage(error),
            isLoading: false,
            isRefreshing: false,
          })),
      );

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);
  const setData = useCallback(
    (next) =>
      setState((prev) => ({
        ...prev,
        data: typeof next === "function" ? next(prev.data) : next,
      })),
    [],
  );

  return { ...state, reload, setData };
}
