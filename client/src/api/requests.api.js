import client from "./client";
import { toFormBody } from "../utils/form";

/**
 * GET /service_requests -> { items, page, per_page, total, pages }
 * params: { page, per_page, status, category_id } (undefined values are left out)
 */
export const getServiceRequests = (params) =>
  client.get("/service_requests", { params }).then((res) => res.data);

/** GET /service_requests/<id> */
export const getServiceRequest = (id) =>
  client.get(`/service_requests/${id}`).then((res) => res.data);

/** POST /service_requests -> the new request. image_url is optional. */
export const submitServiceRequest = ({
  category_id,
  location,
  description,
  image_url,
}) =>
  client
    .post(
      "/service_requests",
      toFormBody({ category_id, location, description, image_url }),
    )
    .then((res) => res.data);

/**
 * PATCH /service_requests/<id> -> the updated request.
 * Send only what changed. Owners: location, description, image_url (while Pending).
 * Pass image_url: '' to remove the photo.
 */
export const updateServiceRequest = (id, fields) =>
  client
    .patch(`/service_requests/${id}`, toFormBody(fields, ["image_url"]))
    .then((res) => res.data);

/** Admin: change the status */
export const updateRequestStatus = (id, status) =>
  updateServiceRequest(id, { status });

/** DELETE /service_requests/<id> (owner, while Pending) */
export const withdrawServiceRequest = (id) =>
  client.delete(`/service_requests/${id}`).then((res) => res.data);

/** GET /service_requests/analytics -> { scope, total, by_status, by_category } */
export const getAnalytics = () =>
  client.get("/service_requests/analytics").then((res) => res.data);
