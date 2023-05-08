import {  useState } from "react";
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
import { useSelector,useDispatch } from "react-redux";
import { logoutAction } from "../actions/userAction";


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
    { label: "Manage Booking", icon: FaFileAlt, url: "/" },
    { label: "Report", icon: FaFileAlt, url: "/" },
    
      ],
};


const Sidebar = () => {

  const [isOpen, setIsOpen] = useState(false);
  const activeMenu = useBreakpointValue({ base: "My Dashboard", md: null });

  const { isTenant } = useSelector((state) => {
    
    return {
      isTenant: state.userReducer.isTenant === 1,
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
        borderBottomWidth="1px"
        borderColor="gray.200"
        display={{ base: "flex", md: "none" }}
      >
        <IconButton
          icon={<Icon as={isOpen ? AiOutlineClose : AiOutlineMenu} />}
          variant="ghost"
          aria-label="Open menu"
          onClick={handleOpen}
        />
        <Text>{activeMenu}</Text>

      </Flex>

      {/* Desktop and tablet view */}
      <Box
        as="nav"
        display={{ base: "none", md: "block" }}
        bg="white"
        borderRightWidth="1px"
        borderColor="gray.200"
        w="60"
        h="full"
        pos="fixed"
        top="0"
        left="0"
      >
        <Stack spacing="4" mt="8" mx="4">
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
              >
                <Icon as={item.icon} mr="2" />
                <Text>{item.label}</Text>
              </Flex>
            </Link>
          ))}
          <IconButton
          icon={<FaSignOutAlt/>}
          onClick={() => {
            dispatch(logoutAction());
            window.location.href = "/";
          }}
        />
        </Stack>
      </Box>

      {/* Mobile drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={handleClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>{activeMenu}</DrawerHeader>

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
              <IconButton
          icon={<FaSignOutAlt/>}
          onClick={() => {
            dispatch(logoutAction());
            window.location.href = "/";
          }}
        />
            </Stack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
