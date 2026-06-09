"use client"

import { useEffect, useRef } from "react"

type Props = {
  action: string
  username: string
  password: string
}

export function OCSAutoLogin({ action, username, password }: Props) {
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    const iframe = document.querySelector('iframe[name="ocs-frame"]') as HTMLIFrameElement | null
    if (!iframe) return

    const doSubmit = () => {
      // Small delay so the iframe has time to register the name target
      setTimeout(() => formRef.current?.submit(), 50)
    }

    if (iframe.contentDocument?.readyState === "complete") {
      doSubmit()
    } else {
      iframe.addEventListener("load", doSubmit, { once: true })
    }

    return () => iframe.removeEventListener("load", doSubmit)
  }, [])

  return (
    <form ref={formRef} method="POST" action={action} target="ocs-frame" style={{ display: "none" }}>
      <input type="hidden" name="LOGIN" value={username} />
      <input type="hidden" name="PASSWD" value={password} />
      <input type="hidden" name="Valid_CNX" value="Send" />
    </form>
  )
}
