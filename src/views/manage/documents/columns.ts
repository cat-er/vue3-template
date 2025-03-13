import i18n from "@/locale";
const { t } = i18n.global;
export const columns = [
  {
    title: t('file_name'),
    dataIndex: 'filename',
    key: 'filename',
  },
  {
    title: t('uploaded_on'),
    dataIndex: 'created_at',
    key: 'created_at',
  },
  {
    title: t('description'),
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: t('action'),
    dataIndex: 'operation',
    key: 'operation',
  },
];

