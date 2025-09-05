'use client';

import { UserDetail } from '@/app/dashboard/user/user-detail';
import { ProTable } from '@/components/pro-table';
import { filterBalanceLog } from '@/services/admin/log';
import { formatDate } from '@/utils/common';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';

export default function BalanceLogPage() {
  const t = useTranslations('log');
  const sp = useSearchParams();
  const initialFilters = {
    search: sp.get('search') || undefined,
    date: sp.get('date') || undefined,
    user_id: sp.get('user_id') ? Number(sp.get('user_id')) : undefined,
  };
  return (
    <ProTable<API.BalanceLog, { search?: string }>
      header={{ title: t('title.balance') }}
      initialFilters={initialFilters}
      columns={[
        {
          accessorKey: 'user',
          header: t('column.user'),
          cell: ({ row }) => <UserDetail id={Number(row.original.user_id)} />,
        },
        { accessorKey: 'amount', header: t('column.amount') },
        { accessorKey: 'order_id', header: t('column.orderId') },
        { accessorKey: 'balance', header: t('column.balance') },
        { accessorKey: 'type', header: t('column.type') },
        {
          accessorKey: 'timestamp',
          header: t('column.time'),
          cell: ({ row }) => formatDate(row.original.timestamp),
        },
      ]}
      params={[
        { key: 'search' },
        { key: 'date', type: 'date' },
        { key: 'user_id', placeholder: t('column.userId') },
      ]}
      request={async (pagination, filter) => {
        const { data } = await filterBalanceLog({
          page: pagination.page,
          size: pagination.size,
          search: filter?.search,
          date: (filter as any)?.date,
          user_id: (filter as any)?.user_id,
        });
        const list = (data?.data?.list || []) as any[];
        const total = Number(data?.data?.total || list.length);
        return { list, total };
      }}
    />
  );
}
