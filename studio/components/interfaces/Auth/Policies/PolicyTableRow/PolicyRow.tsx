import { FC } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Button, Dropdown, IconEdit, IconTrash, IconMoreVertical } from 'ui'
import { PostgresPolicy } from '@supabase/postgres-meta'
import { PermissionAction } from '@supabase/shared-types/out/constants'

import { checkPermissions } from 'hooks'
import Panel from 'components/ui/Panel'

interface Props {
  policy: PostgresPolicy
  onSelectEditPolicy: (policy: PostgresPolicy) => void
  onSelectDeletePolicy: (policy: PostgresPolicy) => void
}

const PolicyRow: FC<Props> = ({
  policy,
  onSelectEditPolicy = () => {},
  onSelectDeletePolicy = () => {},
}) => {
  const canUpdatePolicies = checkPermissions(PermissionAction.TENANT_SQL_ADMIN_WRITE, 'policies')

  return (
    <Panel.Content
      className={[
        'flex border-panel-border-light dark:border-panel-border-dark',
        'w-full space-x-4 border-b py-4 lg:items-center',
      ].join(' ')}
    >
      <div className="flex grow flex-col space-y-1">
        <div className="flex items-center space-x-4">
          <p className="font-mono text-xs text-scale-1000">{policy.command}</p>
          <p className="text-sm text-scale-1200">{policy.name}</p>
        </div>
        <div className="flex items-center space-x-2">
          <p className="text-scale-1000 text-sm">应用到：</p>
          {policy.roles.map((role, i) => (
            <code key={`policy-${role}-${i}`} className="text-scale-1000 text-xs">
              {role}
            </code>
          ))}
        </div>
      </div>
      <div>
        {canUpdatePolicies ? (
          <Dropdown
            side="bottom"
            align="end"
            size="small"
            overlay={
              <>
                <Dropdown.Item
                  icon={<IconEdit size={14} />}
                  onClick={() => onSelectEditPolicy(policy)}
                >
                  编辑
                </Dropdown.Item>
                <Dropdown.Separator />
                <Dropdown.Item
                  icon={<IconTrash size={14} />}
                  onClick={() => onSelectDeletePolicy(policy)}
                >
                  删除
                </Dropdown.Item>
              </>
            }
          >
            <Button
              type="default"
              style={{ paddingLeft: 4, paddingRight: 4 }}
              icon={<IconMoreVertical />}
            />
          </Dropdown>
        ) : (
          <Tooltip.Root delayDuration={0}>
            <Tooltip.Trigger>
              <Button
                disabled
                type="default"
                style={{ paddingLeft: 4, paddingRight: 4 }}
                icon={<IconMoreVertical />}
              />
            </Tooltip.Trigger>
            {!canUpdatePolicies && (
              <Tooltip.Content side="left">
                <Tooltip.Arrow className="radix-tooltip-arrow" />
                <div
                  className={[
                    'rounded bg-scale-100 py-1 px-2 leading-none shadow',
                    'border border-scale-200',
                  ].join(' ')}
                >
                  <span className="text-xs text-scale-1200">
                    您需要其他权限才能编辑 RLS 策略
                  </span>
                </div>
              </Tooltip.Content>
            )}
          </Tooltip.Root>
        )}
      </div>
    </Panel.Content>
  )
}

export default PolicyRow
