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
    // Slight delay so the iframe is ready
    const t = setTimeout(() => formRef.current?.submit(), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <form ref={formRef} method="POST" action={action} target="ocs-frame" style={{ display: "none" }}>
      <input type="hidden" name="LOGIN" value={username} />
      <input type="hidden" name="PASSWD" value={password} />
      <input type="hidden" name="Valid_CNX" value="Send" />
    </form>
  )
}
