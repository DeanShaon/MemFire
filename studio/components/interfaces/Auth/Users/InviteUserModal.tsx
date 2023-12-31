import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite'
import * as Tooltip from '@radix-ui/react-tooltip'
import { Button, Modal, Input, IconPlus, IconMail, Form } from 'ui'
import { PermissionAction } from '@supabase/shared-types/out/constants'

import { useStore, checkPermissions } from 'hooks'
import { post } from 'lib/common/fetch'
import { API_URL } from 'lib/constants'
import { PageContext } from 'pages/project/[ref]/auth/users'

const InviteUserModal = () => {
  const { ui } = useStore()
  const PageState: any = useContext(PageContext)
  const [visible, setVisible] = useState(false)

  const handleToggle = () => setVisible(!visible)
  const canInviteUsers = checkPermissions(PermissionAction.AUTH_EXECUTE, 'invite_user')

  const validate = (values: any) => {
    const errors: any = {}
    const emailValidateRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

    if (values.email.length === 0) {
      errors.email = '请输入有效邮箱地址'
    } else if (!emailValidateRegex.test(values.email)) {
      errors.email = `${values.email}是一个无效的邮箱地址`
    }

    return errors
  }

  const onInviteuser = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true)

    const response = await post(`${API_URL}/auth/${PageState.projectRef}/invite`, {
      email: values.email,
    })
    if (response.error) {
      ui.setNotification({
        category: 'error',
        message: `邀请用户失败：${response.error.message}`,
      })
    } else {
      PageState.fetchData(1)
      ui.setNotification({
        category: 'success',
        message: `已发送邀请邮件至${values.email}`,
      })
      setVisible(false)
    }

    setSubmitting(false)
  }

  return (
    <div>
      <Tooltip.Root delayDuration={0}>
        <Tooltip.Trigger>
          <Button as="span" onClick={handleToggle} icon={<IconPlus />} disabled={!canInviteUsers}>
            邀请
          </Button>
        </Tooltip.Trigger>
        {!canInviteUsers && (
          <Tooltip.Content side="bottom">
            <Tooltip.Arrow className="radix-tooltip-arrow" />
            <div
              className={[
                'rounded bg-scale-100 py-1 px-2 leading-none shadow',
                'border border-scale-200',
              ].join(' ')}
            >
              <span className="text-xs text-scale-1200">
                您需要额外的权限才能邀请用户
              </span>
            </div>
          </Tooltip.Content>
        )}
      </Tooltip.Root>
      <Modal
        closable
        hideFooter
        size="small"
        key="invite-user-modal"
        visible={visible}
        header="邀请新用户"
        onCancel={handleToggle}
      >
        <Form
          validateOnBlur
          initialValues={{ email: '' }}
          validate={validate}
          onSubmit={onInviteuser}
        >
          {({ isSubmitting }: { isSubmitting: boolean }) => (
            <div className="space-y-6 py-4">
              <Modal.Content>
                <Input
                  autoFocus
                  id="email"
                  className="w-full"
                  label="用户邮箱"
                  icon={<IconMail />}
                  type="email"
                  name="email"
                  placeholder="用户邮箱"
                />
              </Modal.Content>
              <Modal.Content>
                <Button
                  block
                  size="small"
                  htmlType="submit"
                  loading={isSubmitting}
                  disabled={!canInviteUsers || isSubmitting}
                >
                  邀请用户
                </Button>
              </Modal.Content>
            </div>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default observer(InviteUserModal)
