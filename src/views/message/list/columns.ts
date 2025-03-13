import i18n from "@/locale";
const { t } = i18n.global;
export const columns = [
  {
    title: t("from_to"),
    dataIndex: "role",
    key: "role"
  },

  {
    title: t("provider"),
    dataIndex: "provider",
    key: "provider"
  },
  {
    title: t("content"),
    dataIndex: "message",
    key: "message"
  },
  {
    title: t("date"),
    dataIndex: "created_at_utc",
    key: "created_at_utc"
  }
];
