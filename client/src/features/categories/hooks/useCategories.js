import { useMemo } from "react";
import { getCategories } from "../../../api/categories.api";
import useApi from "../../../hooks/useApi";

/** All service categories, sorted by name. */
export default function useCategories() {
  const result = useApi(getCategories, []);
  const categories = useMemo(
    () =>
      [...(result.data ?? [])].sort((a, b) =>
        a.service_category_name.localeCompare(b.service_category_name),
      ),
    [result.data],
  );
  return { ...result, categories };
}
