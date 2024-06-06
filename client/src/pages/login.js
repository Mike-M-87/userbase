import { Button, Checkbox, Image, Input, Link } from "@nextui-org/react";
import { EyeIcon, LockIcon, MailIcon } from "../components/icons";
import { useState } from "react";
import { LoginUser } from "../lib/requests";
import { AUTHTOKEN, AUTHUSER } from "../lib/utils";

export default function LoginPage() {
  const [creds, setcreds] = useState({ emailOrPhone: "", password: "" })

  console.log('====================================');
  console.log(creds);
  console.log('====================================');
  async function handleLogin() {
    if (!creds.emailOrPhone || !creds.password) return
    const res = await LoginUser(creds)
    if (res?.success) {
      localStorage.setItem(AUTHTOKEN, res.token)
      localStorage.setItem(AUTHUSER, JSON.stringify(res.data.user))
      window.location.assign("/home")
    }
  }

  return (
    <section className="flex min-h-svh items-center gap-10 justify-between">
      <div className="w-1/2 mx-auto px-10">
        <h2 className="flex flex-col mb-10 text-4xl gap-1">Log in</h2>
        <Input
          autoFocus
          endContent={
            <MailIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Email/Phone"
          placeholder="Enter your email or phone number"
          variant="bordered"
          onValueChange={(e) => setcreds({ ...creds, emailOrPhone: e })}
        />
        <Input
          endContent={
            <EyeIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
          }
          label="Password"
          placeholder="Enter your password"
          type="password"
          className="my-5"
          onValueChange={(e) => setcreds({ ...creds, password: e, })}
          variant="bordered"
        />
        <Button color="primary" disabled={!creds.emailOrPhone || !creds.password} onPress={handleLogin} className="mt-5 w-full lg:w-40 disabled:bg-gray-500">
          Sign in
        </Button>
      </div>
      <div className="w-1/2 bg-white h-svh hidden items-center lg:flex flex-col justify-center"><Image src="/logo512.png" /></div>
    </section >
  )
}