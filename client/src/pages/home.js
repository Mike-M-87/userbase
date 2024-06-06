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
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  User,
  Pagination,
  Chip,
  Tooltip,
} from "@nextui-org/react";
import { PlusIcon, VerticalDotsIcon, SearchIcon, ChevronDownIcon, EyeIcon, EditIcon, DeleteIcon } from "../components/icons";

import { capitalize, GetUsers } from "../lib/requests";
import NavBar from "../components/navbar";
import EditModal from "../components/editmodal";
import CreateModal from "../components/createmodal";


const tempusers = [
  {
    id: 1,
    name: "Tony Reichert",
    isAdmin: false,
    phoneNumber: "9999-999-99",
    company: "my company",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Kelvin",
    isAdmin: true,
    phoneNumber: "555-999-99",
    company: "kill company",
    email: "kill.kkk@example.com",
  },
];
const pages = 5
const VISIBLE_COLUMNS = ["name", "email", "company", "role", "actions"];

export default function HomePage() {
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);
  const [users, setusers] = useState([])
  const [selectedUser, setselectedUser] = useState()
  const [filteredUsers, setfilteredUsers] = useState([])
  const [registering, setregistering] = useState(false)

  async function FetchUsers() {
    const res = await GetUsers()
    if (res?.success) {
      setusers(res.data?.users)
      setfilteredUsers(res.data?.users)
    }
  }

  useEffect(() => {
    FetchUsers()
  }, [])

  const handleSearch = () => {
    if (filterValue) setfilteredUsers(users.filter(user => user.name.toLowerCase() == filterValue.toLowerCase()))
    else setfilteredUsers(users)
  }

  const handleEditUser = (key) => {
    setselectedUser(users.find(usr => usr._id === key))
  }

  const handleDeleteUser = () => {
    console.log();
  }


  const renderCell = (user, columnKey) => {
    const cellValue = columnKey === "role" ? user.isAdmin : user[columnKey];
    switch (columnKey) {
      case "name":
        return (
          <User
            avatarProps={{ radius: "full", size: "sm" }}
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


  const bottomContent = () => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-foreground text-background",
          }}
          color="default"
          isDisabled={filterValue ? true : false}
          page={page}
          total={pages}
          variant="light"
          onChange={setPage}
        />
      </div>
    );
  }

  return (
    <section className="min-h-svh">
      <NavBar />
      <Table
        className="px-20 mt-20 w-full"
        // removeWrapper
        onRowAction={handleEditUser}
        aria-label="Example table with custom cells, pagination and sorting"
        bottomContent={bottomContent}
        bottomContentPlacement="outside"
        checkboxesProps={{
          classNames: {
            wrapper: "after:bg-foreground after:text-background text-background",
          },
        }}
        classNames={{
          th: ["bg-transparent", "text-default-500", "border-b", "border-divider"],
          td: [
            // changing the rows border radius
            // first
            "group-data-[first=true]:first:before:rounded-none",
            "group-data-[first=true]:last:before:rounded-none",
            // middle
            "group-data-[middle=true]:before:rounded-none",
            // last
            "group-data-[last=true]:first:before:rounded-none",
            "group-data-[last=true]:last:before:rounded-none",
          ],
        }}

        topContent={
          <div className="flex flex-col gap-4">
            <div className="flex justify-between gap-3 items-end">
              <Input
                isClearable
                classNames={{
                  base: "w-full sm:max-w-[44%]",
                  inputWrapper: "border-1",
                }}
                placeholder="Search by name..."
                size=""
                // value={filterValue}
                variant="bordered"
                onClear={() => setFilterValue("")}
                onValueChange={setFilterValue}
                endContent={
                  <Button isIconOnly size="sm" variant="shadow" onPress={handleSearch}><SearchIcon /></Button>
                }
              />
              <Button
                className="bg-foreground text-background"
                endContent={<PlusIcon />}
                onPress={() => setregistering(true)}
              >
                Create User
              </Button>
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
        <TableBody emptyContent={"No users found"} items={filteredUsers}>
          {(item) =>
            <TableRow className="cursor-pointer" key={item._id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          }
        </TableBody>
      </Table>

      <EditModal userItem={selectedUser} onclose={() => setselectedUser(undefined)} />
      <CreateModal active={registering} onclose={() => setregistering(false)} oncreate={() => { setregistering(false); FetchUsers() }} />
    </section >

  );
}