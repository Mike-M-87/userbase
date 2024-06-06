import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input } from "@nextui-org/react";

export default function EditModal({ userItem, onclose }) {
  return (
    <Modal
      isOpen={userItem ? true : false}
      placement="top-center"
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
                defaultValue={userItem.id}
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
                variant="bordered"
              />
              <Input
                size="lg"
                label="Enter new phone number"
                defaultValue={userItem.phoneNumber}
                variant="bordered"
              />
              <Input
                size="lg"
                label="Enter new company"
                defaultValue={userItem.company}
                variant="bordered"
              />
            </ModalBody>
            <ModalFooter>
              <Button color="danger" variant="flat" onPress={onClose}>
                Close
              </Button>
              <Button color="primary" onPress={onClose}>
                Update Details
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}