import Link from 'next/link'
import { FC } from 'react'
import { useRouter } from 'next/router'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Badge, Button } from 'ui'
import { PostgresTable } from '@supabase/postgres-meta'
import { PermissionAction } from '@supabase/shared-types/out/constants'
import { checkPermissions } from 'hooks'

interface Props {
  table: PostgresTable
  onSelectToggleRLS: (table: PostgresTable) => void
  onSelectCreatePolicy: (table: PostgresTable) => void
}

const PolicyTableRowHeader: FC<Props> = ({
  table,
  onSelectToggleRLS = () => {},
  onSelectCreatePolicy = () => {},
}) => {
  const router = useRouter()
  const { ref } = router.query
  const canToggleRLS = checkPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'tables')
  const canCreatePolicies = checkPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'policies')

  return (
    <div id={table.id.toString()} className="flex w-full items-center justify-between">
      <div className="flex space-x-4 text-left">
        <Link href={`/project/${ref}/editor/${table.id}`}>
          <a>
            <h4 className="m-0">{table.name}</h4>
          </a>
        </Link>
        <Badge color={table.rls_enabled ? 'green' : 'yellow'}>
          {table.rls_enabled ? 'RLS enabled' : 'RLS disabled'}
        </Badge>
      </div>
      <div className="flex-1">
        <div className="flex flex-row-reverse">
          <Tooltip.Root delayDuration={0}>
            <Tooltip.Trigger>
              <Button
                type="outline"
                disabled={!canCreatePolicies}
                className="ml-2"
                onClick={() => onSelectCreatePolicy(table)}
              >
                新建策略
              </Button>
            </Tooltip.Trigger>
            {!canCreatePolicies && (
              <Tooltip.Content side="bottom">
                <Tooltip.Arrow className="radix-tooltip-arrow" />
                <div
                  className={[
                    'rounded bg-scale-100 py-1 px-2 leading-none shadow',
                    'border border-scale-200',
                  ].join(' ')}
                >
                  <span className="text-xs text-scale-1200">
                    需要其他权限才能创建 RLS 策略
                  </span>
                </div>
              </Tooltip.Content>
            )}
          </Tooltip.Root>
          <Tooltip.Root delayDuration={0}>
            <Tooltip.Trigger>
              <Button
                type="default"
                disabled={!canToggleRLS}
                onClick={() => onSelectToggleRLS(table)}
              >
                {table.rls_enabled ? '停用RLS' : '启用RLS'}
              </Button>
            </Tooltip.Trigger>
            {!canToggleRLS && (
              <Tooltip.Content side="bottom">
                <Tooltip.Arrow className="radix-tooltip-arrow" />
                <div
                  className={[
                    'rounded bg-scale-100 py-1 px-2 leading-none shadow',
                    'border border-scale-200',
                  ].join(' ')}
                >
                  <span className="text-xs text-scale-1200">
                    您需要其他权限才能切换RLS
                  </span>
                </div>
              </Tooltip.Content>
            )}
          </Tooltip.Root>
        </div>
      </div>
    </div>
  )
}

export default PolicyTableRowHeader
