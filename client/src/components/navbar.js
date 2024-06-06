import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, DropdownMenu, Avatar, DropdownTrigger, Dropdown, DropdownItem, Chip } from "@nextui-org/react";
import { getToken, getUser } from "../lib/utils";
import { GithubIcon } from "./icons";


export default function NavBar() {
  const user = getUser()
  const token = getToken()

  function handleLogout() {
    localStorage.clear()
    window.location.assign("/")
  }

  return (
    <Navbar className="justify-center">
      <NavbarBrand>
        <span className="font-bold text-inherit">Userbase</span>
      </NavbarBrand>

      <NavbarContent className="ml-auto" justify="end">
        {user && token ?
          <Dropdown size="lg" placement="bottom-end" className="dark text-foreground">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="default"
                name={user.name}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="font-semibold text-xl">
                Signed in as {user.email}
              </DropdownItem>
              <DropdownItem><Chip variant="dot" radius="sm" color={user.isAdmin ? "secondary" : "primary"}>{user.isAdmin ? "Admin" : "User"}</Chip></DropdownItem>
              <DropdownItem onPress={handleLogout} key="logout" color="danger">
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
          :
          <NavbarItem className="">
            <Button as={Link} variant="faded" href="/">Login</Button>
          </NavbarItem>
        }
        <NavbarItem className="">
          <Button isIconOnly as={Link} isExternal variant="ghost" href="https://github.com/Mike-M-87/userbase"><GithubIcon /></Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}