import { Project } from 'types'
import { ProductMenuGroup } from 'components/ui/ProductMenu/ProductMenu.types'
import { IS_PLATFORM } from 'lib/constants'
import { useFlag } from 'hooks'

export const generateLogsMenu = (project?: Project): ProductMenuGroup[] => {
  const ref = project?.ref ?? 'default'

  const logsPostgrest = useFlag('logsPostgrest')
  const logsPgbouncer = useFlag('logsPgbouncer')

  return [
    ...(IS_PLATFORM
      ? [
          {
            items: [
              {
                name: 'Logs Explorer',
                key: 'explorer',
                url: `/project/${ref}/logs/explorer`,
                items: [],
              },
              {
                name: 'Edge',
                key: 'edge-logs',
                url: `/project/${ref}/logs/edge-logs`,
                items: [],
              },
              {
                name: 'Postgres',
                key: 'postgres-logs',
                url: `/project/${ref}/logs/postgres-logs`,
                items: [],
              },
              ...(logsPostgrest
                ? [
                    {
                      name: 'PostgREST',
                      key: 'postgrest-logs',
                      url: `/project/${ref}/logs/postgrest-logs`,
                      items: [],
                    },
                  ]
                : []),
              ...(logsPgbouncer
                ? [
                    {
                      name: 'PgBouncer',
                      key: 'pgbouncer-logs',
                      url: `/project/${ref}/logs/pgbouncer-logs`,
                      items: [],
                    },
                  ]
                : []),
              {
                name: 'Auth',
                key: 'auth-logs',
                url: `/project/${ref}/logs/auth-logs`,
                items: [],
              },
              {
                name: 'Storage',
                key: 'storage-logs',
                url: `/project/${ref}/logs/storage-logs`,
                items: [],
              },

              {
                name: 'Realtime',
                key: 'realtime-logs',
                url: `/project/${ref}/logs/realtime-logs`,
                items: [],
              },
            ],
          },
        ]
      : []),
  ]
}
