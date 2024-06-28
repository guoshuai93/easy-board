import dayjs from "dayjs";

export const formatDate = (dateStr: string | undefined, format?: string) => {
  if (!dateStr) return "";
  return dayjs(dateStr).format(format || "M.D");
};
