const HAS_ZONE = /(Z|[+-]\d{2}:?\d{2})$/i;

export function parseServerDate(value) {
  if (!value) return null;
  const iso = value.includes("T") ? value : value.replace(" ", "T");
  const date = new Date(HAS_ZONE.test(iso) ? iso : `${iso}Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const dateTimeFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export const formatDate = (value) => {
  const date = parseServerDate(value);
  return date ? dateFormat.format(date) : "";
};

export const formatDateTime = (value) => {
  const date = parseServerDate(value);
  return date ? dateTimeFormat.format(date) : "";
};
