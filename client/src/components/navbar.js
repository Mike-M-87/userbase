import React, { useEffect } from "react";
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

      <NavbarContent className="">
        {user && token ?
          <Dropdown size="lg" placement="bottom-end" className="dark text-foreground">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name="Jason Hughes"
                size="sm"
                src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{user.email}</p>
                <Chip color={user.isAdmin ? "secondary" : "default"}>{user.isAdmin ? "Admin" : "User"}</Chip>
              </DropdownItem>
              <DropdownItem key="settings">My Profile</DropdownItem>
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