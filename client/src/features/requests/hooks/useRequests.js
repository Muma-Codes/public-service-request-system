import { getServiceRequests } from "../../../api/requests.api";
import useApi from "../../../hooks/useApi";

/**
 * One page of requests (own for citizens, everyone's for admins), newest first.
 * Returns { requests, pagination: { page, pages, total, perPage }, isLoading, isRefreshing, error, reload }.
 */
export default function useRequests({
  page = 1,
  perPage = 10,
  status = "",
  categoryId = "",
} = {}) {
  const result = useApi(
    () =>
      getServiceRequests({
        page,
        per_page: perPage,
        status: status || undefined,
        category_id: categoryId || undefined,
      }),
    [page, perPage, status, categoryId],
    { keepPrevious: true },
  );

  const { data } = result;
  return {
    ...result,
    requests: data?.items ?? [],
    pagination: {
      page: data?.page ?? page,
      pages: data?.pages ?? 0,
      total: data?.total ?? 0,
      perPage: data?.per_page ?? perPage,
    },
  };
}
