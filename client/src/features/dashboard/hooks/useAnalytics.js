import { getAnalytics } from "../../../api/requests.api";
import useApi from "../../../hooks/useApi";

/** Counts by status and category: system-wide for admins, personal for citizens. */
export default function useAnalytics() {
  return useApi(getAnalytics, []);
}
