import client from "./client";
import { toFormBody } from "../utils/form";

/**
 * PATCH /citizens/<id> -> the updated citizen.
 * Send only what changed: name, phone_number or password (+ current_password).
 */
export const updateCitizen = (id, fields) =>
  client.patch(`/citizens/${id}`, toFormBody(fields)).then((res) => res.data);
