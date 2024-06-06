import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  User,
  Pagination,
  Chip,
  Tooltip,
  Spinner,
} from "@nextui-org/react";
import { PlusIcon, SearchIcon, EditIcon, DeleteIcon, RefreshIcon } from "../components/icons";
import { DeleteUser, GetUsers } from "../lib/requests";
import NavBar from "../components/navbar";
import EditModal from "../components/editmodal";
import CreateModal from "../components/createmodal";
import toast from "react-hot-toast";


const VISIBLE_COLUMNS = ["name", "email", "company", "role", "actions"];

export default function HomePage() {
  // init of state vars
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [users, setusers] = useState([]) // users variable to store fetched users
  const [selectedUser, setselectedUser] = useState()
  const [registering, setregistering] = useState(false)
  const [pages, setpages] = useState(1)
  const [loading, setloading] = useState(false)


  // isSearch is used to set page back to 1 when beginning search
  async function FetchUsers(isSearch) {
    setloading(true)
    const res = await GetUsers(isSearch ? 1 : page, filterValue)
    if (res?.success) {
      setusers(res.data?.users)
      setpages(res?.meta.totalPages)
    }
    setloading(false)
  }

  // hook for page change
  useEffect(() => {
    FetchUsers()
  }, [page])


  // hook to fetch original users data after search is cleared
  useEffect(() => {
    if (!filterValue) FetchUsers()
  }, [filterValue])


  // sets selected user which opens edit user modal
  const handleEditUser = (key) => {
    setselectedUser(users.find(usr => usr._id === key))
  }


  function handleSearchUsers() {
    if (filterValue) {
      setPage(1)
      FetchUsers(true)
    }
  }

  async function handleDeleteUser(userId) {
    const res = await DeleteUser(userId)
    if (res?.success) {
      toast.success("User has been deleted successfully")
      FetchUsers()
    }
  }


  // table cell component
  const renderCell = (user, columnKey) => {
    const cellValue = columnKey === "role" ? user.isAdmin : user[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "full", size: "sm", isBordered: true }}
            classNames={{
              description: "text-default-500",
            }}
            description={user.phoneNumber}
            name={cellValue}
          >
            {user.name}
          </User>
        );

      case "role":
        return (
          <Chip className="capitalize" color={cellValue ? "secondary" : "primary"} size="sm" variant="flat">
            {cellValue ? "Admin" : "User"}
          </Chip>
        );

      case "actions":
        return (
          <div className="relative flex items-center gap-4">
            <Tooltip content="Edit user">
              <Button onClick={() => handleEditUser(user._id)} isIconOnly size="lg" variant="light" className="opacity-70">
                <EditIcon height="1.3em" width="1.3em" />
              </Button>
            </Tooltip>
            <Tooltip color="danger" content="Delete user">
              <Button onPress={() => handleDeleteUser(user._id)} isIconOnly size="lg" variant="light" className="opacity-70">
                <DeleteIcon height="1.3em" width="1.3em" />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };



  return (
    <section className="min-h-svh pb-20">
      <NavBar />
      <Table
        selectionMode
        className="lg:px-20 px-5 mt-20 w-full"
        onRowAction={handleEditUser}
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={
          <Pagination
            showControls
            classNames={{
              cursor: "bg-foreground text-background",
            }}
            color="default"
            page={page}
            total={pages}
            variant="light"
            onChange={setPage}
          />
        }
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper: "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={{
          th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
          td: [
            "group-data-[first=true]:first:before:rounded-none",
            "group-data-[first=true]:last:before:rounded-none",
            "group-data-[middle=true]:before:rounded-none",
            "group-data-[last=true]:first:before:rounded-none",
            "group-data-[last=true]:last:before:rounded-none",
          ],
        }}

        topContent={
          <div className="flex flex-col gap-4">
            <div className="flex gap-3 items-center">
              <Input
                classNames={{
                  base: "w-full sm:max-w-[44%]",
                  inputWrapper: "border-1",
                }}
                placeholder="Search by name..."
                size="lg"
                value={filterValue}
                variant="bordered"
                onValueChange={setFilterValue}
                endContent={
                  <Button isIconOnly size="sm" variant="flat" onPress={handleSearchUsers}><SearchIcon /></Button>
                }
              />
              <Button
                className="bg-foreground ml-auto text-background"
                endContent={<PlusIcon />}
                onPress={() => setregistering(true)}
              >
                Create User
              </Button>
              <Button className="bg-foreground text-background" isIconOnly onPress={FetchUsers}><RefreshIcon fill="black" /> </Button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-default-400 text-small">Total {users.length} users</span>
            </div>
          </div>
        }
        topContentPlacement="outside"
      >
        <TableHeader>
          {VISIBLE_COLUMNS.map(column =>
            <TableColumn key={column} className="capitalize">{column}</TableColumn>
          )}
        </TableHeader>
        <TableBody isLoading={loading}
          loadingContent={<Spinner />}
          emptyContent={"No users found"} items={users}>
          {!loading &&
            ((item) =>
              <TableRow className="cursor-pointer" key={item._id}>
                {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
        </TableBody>
      </Table>

      <EditModal onupdate={() => { setselectedUser(null); FetchUsers(); }} userItem={selectedUser} onclose={() => setselectedUser(undefined)} />
      <CreateModal active={registering} onclose={() => setregistering(false)} oncreate={() => { setregistering(false); FetchUsers() }} />
    </section >
  );
}