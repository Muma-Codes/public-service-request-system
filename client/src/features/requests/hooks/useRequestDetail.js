import { getServiceRequest } from "../../../api/requests.api";
import useApi from "../../../hooks/useApi";

export default function useRequestDetail(id) {
  return useApi(() => getServiceRequest(id), [id]);
}
