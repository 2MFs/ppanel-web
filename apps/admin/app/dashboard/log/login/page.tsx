'use client';

import { UserDetail } from '@/app/dashboard/user/user-detail';
import { IpLink } from '@/components/ip-link';
import { ProTable } from '@/components/pro-table';
import { filterLoginLog } from '@/services/admin/log';
import { Badge } from '@workspace/ui/components/badge';
import { formatDate } from '@workspace/ui/utils';
import { useTranslations } from 'next-intl';

export default function LoginLogPage() {
  const t = useTranslations('log');
  return (
    <ProTable<API.LoginLog, { search?: string }>
      header={{ title: t('title.login') }}
      columns={[
        {
          accessorKey: 'user',
          header: t('column.user'),
          cell: ({ row }) => <UserDetail id={Number(row.original.user_id)} />,
        },
        { accessorKey: 'method', header: t('column.method') },
        {
          accessorKey: 'login_ip',
          header: t('column.ip'),
          cell: ({ row }) => <IpLink ip={String((row.original as any).login_ip || '')} />,
        },
        { accessorKey: 'user_agent', header: t('column.userAgent') },
        {
          accessorKey: 'success',
          header: t('column.success'),
          cell: ({ row }) => (
            <Badge variant={row.original.success ? 'default' : 'destructive'}>
              {row.original.success ? t('success') : t('failed')}
            </Badge>
          ),
        },
        {
          accessorKey: 'login_time',
          header: t('column.time'),
          cell: ({ row }) => formatDate(row.original.login_time),
        },
      ]}
      params={[
        { key: 'search' },
        { key: 'date', type: 'date' },
        { key: 'user_id', placeholder: t('column.userId') },
      ]}
      request={async (pagination, filter) => {
        const { data } = await filterLoginLog({
          page: pagination.page,
          size: pagination.size,
          search: filter?.search,
          date: (filter as any)?.date,
          user_id: (filter as any)?.user_id,
        });
        const list = ((data?.data?.list || []) as API.LoginLog[]) || [];
        const total = Number(data?.data?.total || list.length);
        return { list, total };
      }}
    />
  );
}
