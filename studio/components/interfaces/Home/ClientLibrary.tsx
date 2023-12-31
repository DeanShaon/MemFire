import { FC } from 'react'
import { IconBookOpen, IconGitHub, Button, Badge } from 'ui'

interface Props {
  language: string
  officialSupport?: boolean
  releaseState?: string
  docsUrl?: string
  gitUrl: string
}

const ClientLibrary: FC<Props> = ({ language, releaseState, officialSupport, docsUrl, gitUrl }) => {
  return (
    <div className="flex items-start space-x-6">
      <img
        src={`/img/libraries/${language.toLowerCase()}-icon.svg`}
        alt={`${language} logo`}
        width="21"
      />
      <div className="space-y-4">
        <div>
          <h5 className="flex items-center gap-2 text-base text-scale-1200">
            {language} {releaseState && <Badge color="yellow">{`Public ${releaseState}`}</Badge>}
          </h5>
          <p className="text-sm text-scale-1000">
            {officialSupport
              ? '这个库是官方支持的'
              : '这个库是社区支持的'}
          </p>
        </div>
        <div className="space-x-1">
          {docsUrl && (
            <a href={docsUrl} target="_blank">
              <Button icon={<IconBookOpen />} type="default">
                文档
              </Button>
            </a>
          )}
          <a href={gitUrl} target="_blank">
            <Button icon={<IconGitHub />} type="default">
              查看 GitHub
            </Button>
          </a>
        </div>
      </div>
    </div>
  )
}

export default ClientLibrary
