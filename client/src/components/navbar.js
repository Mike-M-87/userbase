import { Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, DropdownMenu, Avatar, DropdownTrigger, Dropdown, DropdownItem, Chip } from "@nextui-org/react";
import { getToken, getUser } from "../lib/utils";


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
        <p className="font-bold text-inherit">Userbase</p>
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
      </NavbarContent>
    </Navbar>
  );
}