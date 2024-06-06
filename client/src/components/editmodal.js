import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { UpdateUser } from "../lib/requests";

export default function EditModal({ userItem, onclose, onupdate }) {
  const [creds, setcreds] = useState();
  const [loading, setloading] = useState(false)


  useEffect(() => {
    // set creds to userItem since its the same data
    if (userItem) {
      const { _id, __v, isAdmin, ...rest } = userItem;
      setcreds(rest)
    }
  }, [userItem])

  async function handleUpdate() {
    if (!creds.email || !creds.name || !creds.phoneNumber || !creds.company) return
    setloading(true)
    const res = await UpdateUser(userItem._id, creds)
    if (res?.success) {
      toast.success("Details updated sucessfully")
      onupdate()
    }
    setloading(false)
  }

  return (
    <Modal
      scrollBehavior="outside"
      isOpen={userItem ? true : false}
      className="dark text-foreground"
      onClose={onclose}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Editing - {userItem.name}</ModalHeader>
            <ModalBody>
              <Input
                label="User ID"
                defaultValue={userItem._id}
                variant="flat"
                size="sm"
                readOnly
                className="mb-3"
              />
              <p>Edit and Update Details to save</p>
              <Input
                label="Enter new name"
                size="lg"
                defaultValue={userItem.name}
                onValueChange={(e) => setcreds({ ...creds, name: e, })}
                variant="bordered"
              />
              <Input
                label="Enter new email"
                size="lg"
                defaultValue={userItem.email}
                inputMode="email"
                onValueChange={(e) => setcreds({ ...creds, email: e, })}
                variant="bordered"
              />
              <Input
                size="lg"
                inputMode="tel"
                label="Enter new phone number"
                defaultValue={userItem.phoneNumber}
                variant="bordered"
                onValueChange={(e) => setcreds({ ...creds, phoneNumber: e, })}
              />
              <Input
                size="lg"
                label="Enter new company"
                defaultValue={userItem.company}
                onValueChange={(e) => setcreds({ ...creds, company: e, })}
                variant="bordered"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button disabled={loading} isLoading={loading} color="primary" onPress={handleUpdate}>
                {loading ? "Updating" : "Update Details"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}