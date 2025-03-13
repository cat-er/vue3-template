import i18n from "@/locale";
const { t } = i18n.global;
export const columns = [
  {
    title: '#',
    dataIndex: 'sort',
    key: 'sort',
  },
  {
    title: t('order_number'),
    dataIndex: 'order_no',
    key: 'order_no',
  },
  {
    title: t('applied_amount'),
    dataIndex: 'applied',
    key: 'applied',
  },
  {
    title: t('status'),
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: t('notes'),
    dataIndex: 'notes',
    key: 'notes',
  },
  {
    title: t('pay_method'),
    dataIndex: 'method',
    key: 'method',
  },
  {
    title: t('time'),
    dataIndex: 'time',
    key: 'time',
  },
  {
    title: t('operation'),
    dataIndex: 'operation',
    key: 'operation',
  },
];
