import { useState, useRef } from 'react'
// import { scrollTo } from '@lib/smooth-scroll';
import cn from 'classnames'
// import GithubIcon from '~/components/LaunchWeek/Ticket/icons/icon-github'
// import CheckIcon from '~/components/LaunchWeek/Ticket/icons/icon-check'
import { SITE_ORIGIN } from '~/lib/constants'
import useConfData from '~/components/LaunchWeek/Ticket//hooks/use-conf-data'
import LoadingDots from './loading-dots'
import formStyles from './form.module.css'
import ticketFormStyles from './ticket-form.module.css'

type FormState = 'default' | 'loading' | 'error'
type TicketGenerationState = 'default' | 'loading'

type Props = {
  defaultUsername?: string
  setTicketGenerationState: React.Dispatch<React.SetStateAction<TicketGenerationState>>
}

export default function Form({ defaultUsername = '', setTicketGenerationState }: Props) {
  const [username] = useState(defaultUsername)
  const [formState, setFormState] = useState<FormState>('default')
  const [errorMsg] = useState('')
  const { supabase } = useConfData()
  const formRef = useRef<HTMLFormElement>(null)

  return formState === 'error' ? (
    <div>
      <div className={cn(formStyles['form-row'], ticketFormStyles['form-row'])}>
        <div className={cn(formStyles['input-label'], formStyles.error)}>
          <div className={cn(formStyles.input, formStyles['input-text'])}>{errorMsg}</div>
          <button
            type="button"
            className={cn(formStyles.submit, formStyles.error)}
            onClick={() => {
              setFormState('default')
              setTicketGenerationState('default')
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  ) : (
    <form
      ref={formRef}
      onSubmit={async (e) => {
        e.preventDefault()

        if (formState !== 'default') {
          setTicketGenerationState('default')
          setFormState('default')
          return
        }

        setFormState('loading')
        setTicketGenerationState('loading')

        await supabase.auth.signInWithOAuth({
          provider: 'github',
          options: { redirectTo: `${SITE_ORIGIN}/launch-week/tickets` },
        })
      }}
    >
      <div className={cn(formStyles['form-row'], ticketFormStyles['form-row'])}>
        <div className={cn(formStyles['github-wrapper'])}>
          <button
            type="submit"
            className={cn(
              formStyles.submit,
              formStyles['generate-with-github'],
              formStyles[formState]
            )}
            disabled={formState === 'loading' || Boolean(username)}
            onClick={() => {
              // if (formRef && formRef.current && isMobileOrTablet()) {
              //   scrollTo(formRef.current, formRef.current.offsetHeight);
              // }
            }}
          >
            <div className={ticketFormStyles.generateWithGithub}>
              <span className={ticketFormStyles.githubIcon}>
                {/* <GithubIcon color="#fff" size={24} /> */}
              </span>
              {formState === 'loading' ? (
                <LoadingDots size={4} />
              ) : (
                username || 'Generate with GitHub'
              )}
            </div>
            {username ? (
              <span className={ticketFormStyles.checkIcon}>
                {/* <CheckIcon color="#fff" size={24} /> */}
              </span>
            ) : null}
          </button>
          <p className={ticketFormStyles.description}>Only public info will be used.</p>
        </div>
      </div>
    </form>
  )
}
