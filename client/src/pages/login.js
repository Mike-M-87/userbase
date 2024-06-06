import { Button, Image, Input } from "@nextui-org/react";
import { EyeIcon, EyeSlashIcon } from "../components/icons";
import { useState } from "react";
import { LoginUser } from "../lib/requests";
import { AUTHTOKEN, AUTHUSER } from "../lib/utils";

export default function LoginPage() {
  // state vars to store login body
  const [creds, setcreds] = useState({ emailOrPhone: "", password: "" })
  const [showPwd, setshowPwd] = useState(false)
  const [loading, setloading] = useState(false)

  // login function
  async function handleLogin(e) {
    e.preventDefault()
    setloading(true)
    if (!creds.emailOrPhone || !creds.password) return
    const res = await LoginUser(creds)
    if (res?.success) {
      // persisting token in localstorage
      localStorage.setItem(AUTHTOKEN, res.token)
      localStorage.setItem(AUTHUSER, JSON.stringify(res.data.user))
      window.location.assign("/home")
    }
    setloading(false)
  }

  return (
    <section className="flex min-h-svh lg:items-center gap-10 justify-between">
      <form onSubmit={handleLogin} className="lg:w-1/2 w-full mx-auto px-10">
        <h1 className="text-xl font-black mt-5 mb-10">Userbase</h1>
        <h2 className="flex flex-col mb-10 text-3xl gap-1">Log in</h2>
        <Input
          autoFocus
          label="Email/Phone"
          placeholder="Enter your email or phone number"
          variant="bordered"
          onValueChange={(e) => setcreds({ ...creds, emailOrPhone: e })}
        />
        <Input
          endContent={
            <Button onPress={() => setshowPwd(!showPwd)} className="my-auto" isIconOnly variant="light">
              {showPwd ? <EyeSlashIcon /> : <EyeIcon className="text-xl text-default-400" />}
            </Button>
          }
          label="Password"
          placeholder="Enter your password"
          type={showPwd ? "text" : "password"}
          className="my-5"
          onValueChange={(e) => setcreds({ ...creds, password: e, })}
          variant="bordered"
        />
        <Button color="primary" type="submit" disabled={!creds.emailOrPhone || !creds.password || loading} isLoading={loading} className="mt-5 w-full lg:w-40 disabled:bg-gray-500">
          {loading ? "Logging in" : "Sign in"}
        </Button>
      </form>
      <div className="w-1/2 h-svh hidden items-center lg:flex flex-col justify-center"><Image src="/wall2.jpg"/></div>
    </section >
  )
}