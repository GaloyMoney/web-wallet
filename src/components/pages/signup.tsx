import { useState } from "react"
import { history, useRequest } from "../../store"
import config from "../../store/config"

const SignUp = () => {
  const request = useRequest()
  const [errorMessage, setErrorMessage] = useState("")

  const submitSignUpRequest: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    setErrorMessage("")
    const email = event.currentTarget.email.value
    const password = event.currentTarget.password.value
    const data = await request.post(config.signupEmailEndpoint, {
      email,
      password,
    })

    if (data instanceof Error) {
      setErrorMessage(data.message)
      return
    }
    history.push("/")
  }

  return (
    <div className="signup">
      <div className="intro">{"Please signup"}</div>
      <form onSubmit={submitSignUpRequest}>
        <input type="text" name="email" className="email-input" autoFocus />
        <input type="password" name="password" className="password-input" autoFocus />
        <button type="submit">
          <i aria-hidden className="far fa-arrow-alt-circle-right"></i>
        </button>
      </form>
      {errorMessage && <div className="error">{errorMessage}</div>}
    </div>
  )
}

export default SignUp
