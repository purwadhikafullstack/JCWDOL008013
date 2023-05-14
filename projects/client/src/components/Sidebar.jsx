import { useState } from "react";
import {
  Box,
  Flex,
  IconButton,
  Icon,
  Text,
  useBreakpointValue,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Stack,
  Link,
  DrawerFooter,
} from "@chakra-ui/react";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import {
  FaRegCalendar,
  FaUser,
  FaCamera,
  FaLock,
  FaHome,
  FaFileAlt,
  FaSignOutAlt,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { logoutAction } from "../actions/userAction";
import { MdHotel } from "react-icons/md"
import { useNavigate } from "react-router-dom"


const menuItems = {
  false: [
    { label: "Home", icon: FaLock, url: "/" },
    { label: "My Booking", icon: FaRegCalendar, url: "/mybooking" },
    { label: "Profile", icon: FaUser, url: "/profile" },
    { label: "Change Profile Picture", icon: FaCamera, url: "/profilepicture" },
    { label: "Change Password", icon: FaLock, url: "/changepass" },
    { label: "To Be Tenant", icon: FaLock, url: "/tobetenant" },

  ],
  true: [
    { label: "Home", icon: FaLock, url: "/" },
    { label: "My Booking", icon: FaRegCalendar, url: "/mybooking" },
    { label: "Profile", icon: FaUser, url: "/profile" },
    { label: "Change Profile Picture", icon: FaCamera, url: "/profilepicture" },
    { label: "Change Password", icon: FaLock, url: "/changepass" },
    { label: "Manage Property", icon: FaHome, url: "/admin/property" },
    { label: "Order List", icon: FaFileAlt, url: "/admin/order" },
    { label: "Report", icon: FaFileAlt, url: "/admin/report" },

  ],
};


const Sidebar = () => {
  const navigate = useNavigate()

  const [isOpen, setIsOpen] = useState(false);
  const activeMenu = useBreakpointValue({ base: "My Dashboard", md: null });

  const { isTenant, username } = useSelector((state) => {

    return {
      isTenant: state.userReducer.isTenant === 1,
      username: state.userReducer.username,
    };
  });
  //   console.log(isTenant)
  const items = menuItems[isTenant];

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const dispatch = useDispatch();


  return (
    <>
      {/* Mobile view */}
      <Flex
        as="header"
        align="center"
        justify="space-between"
        py="4"
        px="6"
        borderTopWidth="4px"
        borderTopColor="blue.400"
        borderBottomWidth="1px"
        borderBottomColor="gray.200"
        display={{ base: "flex", md: "none" }}
      >
        <IconButton
          icon={<Icon as={isOpen ? AiOutlineClose : AiOutlineMenu} />}
          variant="ghost"
          aria-label="Open menu"
          onClick={handleOpen}
        />
        {/* <Text>{activeMenu}</Text> */}
        <Flex gap={2} onClick={() => navigate("/")} cursor="pointer">
          <Icon as={MdHotel} boxSize={6} color='blue.400' />
          <Text fontWeight='bold'>StayComfy</Text>
        </Flex>

      </Flex>

      {/* Desktop and tablet view */}
      <Box
        as="nav"
        display={{ base: "none", md: "block" }}
        bg="white"
        borderTopWidth="4px"
        borderRightWidth="1px"
        borderColor="blue.400"
        w="60"
        h="full"
        pos="fixed"
        top="0"
        left="0"
      >
        <Flex h="full" flexDirection="column" justifyContent={username ? "space-between" : "flex-end"}>
          {!username ?
            <></>
            :
            <>
              <Stack spacing="4" mt="8" mx="4">
                {
                  items.map((item) => (
                    <Link key={item.label} href={item.url}>
                      <Flex
                        key={item.label}
                        align="center"
                        px="2"
                        py="1"
                        bg={activeMenu === item.label ? "gray.100" : "transparent"}
                        borderRadius="md"
                        cursor="pointer"
                      >
                        <Icon as={item.icon} mr="2" />
                        <Text>{item.label}</Text>
                      </Flex>
                    </Link>
                  ))
                }
              </Stack>
              <Box px={4} mb={4}>
                <IconButton
                  w="full"
                  icon={<FaSignOutAlt />}
                  onClick={() => {
                    dispatch(logoutAction());
                    window.location.href = "/";
                  }}
                />
              </Box>
            </>
          }
        </Flex>
      </Box>

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={handleClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{activeMenu}</DrawerHeader>

          {!username ?
            <></>
            :
            <>
              <DrawerBody>
                <Stack spacing="4">
                  {items.map((item) => (
                    <Link key={item.label} href={item.url}>
                      <Flex
                        key={item.label}
                        align="center"
                        px="2"
                        py="1"
                        bg={activeMenu === item.label ? "gray.100" : "transparent"}
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() => {
                          handleClose();
                        }}
                      >
                        <Icon as={item.icon} mr="2" />
                        <Text>{item.label}</Text>
                      </Flex>
                    </Link>
                  ))}
                </Stack>
              </DrawerBody>
              <DrawerFooter>
                <IconButton
                  w="full"
                  icon={<FaSignOutAlt />}
                  onClick={() => {
                    dispatch(logoutAction());
                    window.location.href = "/";
                  }}
                />
              </DrawerFooter>
            </>
          }
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
