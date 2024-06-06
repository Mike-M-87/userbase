import { useState } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Switch } from "@nextui-org/react";
import { EyeIcon, EyeSlashIcon } from "./icons";
import { RegisterUser } from "../lib/requests";
import toast from "react-hot-toast"


export default function CreateModal({ active, onclose, oncreate }) {
  const [creds, setcreds] = useState({ name: "", email: "", password: "", phoneNumber: "", isAdmin: false, company: "", passwordConfirm: "" })
  const [showPwd, setshowPwd] = useState(false)
  const [loading, setloading] = useState(false)

  // handle user registration
  async function handleRegister() {
    setloading(true)
    if (!creds.email || !creds.name || !creds.phoneNumber || !creds.password || !creds.passwordConfirm || !creds.company) return
    const res = await RegisterUser(creds)
    if (res?.success) {
      toast.success("Successfully created user")
      oncreate()
    }
    setloading(false)
  }

  return (
    <Modal
scrollBehavior="outside"
      isOpen={active}
      className="dark text-foreground"
      onClose={onclose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Register User</ModalHeader>
            <ModalBody className="flex flex-col gap-3">
              <p>Enter new user details to create their account</p>
              <Input
                label="Name"
                size="lg"
                onValueChange={(e) => setcreds({ ...creds, name: e, })}
                placeholder="Enter user name"
                variant="bordered"
              />
              <Input
                label="Email"
                size="lg"
                placeholder="Enter user email"
                onValueChange={(e) => setcreds({ ...creds, email: e, })}
                variant="bordered"
                inputMode="email"
              />
              <Input
                label="Phone"
                size="lg"
                placeholder="Enter phone number"
                variant="bordered"
                onValueChange={(e) => setcreds({ ...creds, phoneNumber: e, })}
                inputMode="tel"
              />
              <Input
                label="Company"
                size="lg"
                placeholder="Enter user's Company Name"
                variant="bordered"
                onValueChange={(e) => setcreds({ ...creds, company: e, })}
              />
              <Input
                endContent={
                  <Button onPress={() => setshowPwd(!showPwd)} className="my-auto" isIconOnly variant="light">
                    {showPwd ? <EyeSlashIcon /> : <EyeIcon className="text-xl text-default-400" />}
                  </Button>
                }
                label="Password"
                placeholder="Enter user password"
                type={showPwd ? "text" : "password"}
                onValueChange={(e) => setcreds({ ...creds, password: e, })}
                variant="bordered"
              />
              <Input
                endContent={
                  <Button onPress={() => setshowPwd(!showPwd)} className="my-auto" isIconOnly variant="light">
                    {showPwd ? <EyeSlashIcon /> : <EyeIcon className="text-xl text-default-400" />}
                  </Button>
                }
                label="Confirm Password"
                placeholder="Enter user password again"
                type={showPwd ? "text" : "password"}
                onValueChange={(e) => setcreds({ ...creds, passwordConfirm: e, })}
                variant="bordered"
              />
              <Switch isSelected={creds.isAdmin} color="secondary"
                onValueChange={(e) => setcreds({ ...creds, isAdmin: e, })}
              >
                Admin User
              </Switch>
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button disabled={loading} isLoading={loading} color="primary" onPress={handleRegister}>
                {loading ? "Adding User" : "Create User"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}