import { Tabs } from 'ui'
import { observer } from 'mobx-react-lite'

import { TEMPLATES_SCHEMAS } from 'stores/authConfig/schema'
import { FormHeader, FormPanel } from 'components/ui/Forms'
import TemplateEditor from './TemplateEditor'

const EmailTemplates = observer(() => {
  return (
    <div>
      <FormHeader
        title="邮件模板"
        description="自定义将发送给用户的电子邮件。"
      />
      <FormPanel>
        <Tabs
          scrollable
          size="small"
          type="underlined"
          listClassNames="px-8 pt-4"
          defaultActiveId={TEMPLATES_SCHEMAS[0].title.trim().replace(/\s+/g, '-')}
        >
          {TEMPLATES_SCHEMAS.map((template) => {
            const panelId = template.title.trim().replace(/\s+/g, '-')
            return (
              <Tabs.Panel id={panelId} label={template.title} key={panelId}>
                <TemplateEditor key={template.title} template={template} />
              </Tabs.Panel>
            )
          })}
        </Tabs>
      </FormPanel>
    </div>
  )
})

export default EmailTemplates
