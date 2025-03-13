import i18n from "@/locale";
const { t } = i18n.global;
export const columns = [
  {
    title: 'Id',
    dataIndex: 'id',
    key: 'id',
  },
  {
    title: t('date'),
    dataIndex: 'created_at',
    key: 'created_at',
  },
  {
    title: t('related_to'),
    dataIndex: 'order_no',
    key: 'order_no',
  },
  {
    title: t('type'),
    dataIndex: 'type',
    key: 'type',
  },
  {
    title: t('amount'),
    dataIndex: 'score',
    key: 'score',
  },
];
