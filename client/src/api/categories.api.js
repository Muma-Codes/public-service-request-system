import client from "./client";
import { toFormBody } from "../utils/form";

export const getCategories = () =>
  client.get("/categories").then((res) => res.data);

// Admin only
export const createCategory = (name) =>
  client
    .post("/categories", toFormBody({ service_category_name: name }))
    .then((res) => res.data);

export const renameCategory = (id, name) =>
  client
    .patch(`/categories/${id}`, toFormBody({ service_category_name: name }))
    .then((res) => res.data);

export const deleteCategory = (id) =>
  client.delete(`/categories/${id}`).then((res) => res.data);
