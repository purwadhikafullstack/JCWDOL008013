import {
    Box,
    Flex,
    Avatar,
    HStack,
    Link,
    IconButton,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    ButtonGroup,
    Spinner,
    Icon,
    Text,
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";

import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

import { AiOutlineLogout } from 'react-icons/ai'

import { logoutAction } from "../actions/userAction";

import { useNavigate } from "react-router-dom"

import API_URL from '../helper';

import { MdHotel } from "react-icons/md"

import { FaSignOutAlt } from "react-icons/fa"

const Links = [
    { title: "Dashboard", url: "/" },
    { title: "Projects", url: "/projects" },
    { title: "Order List", url: "/admin/order", tenant: 1 },
    { title: "Order Report", url: "/admin/report", tenant: 1 },
    { title: "Order List", url: "/admin/order", tenant: 1 },
    { title: "Order Report", url: "/admin/report", tenant: 1 },
];

const NavLink = ({ children, url }) => (
    <Link
        px={2}
        py={1}
        rounded={"md"}
        _hover={{
            textDecoration: "none",
            bg: useColorModeValue("gray.200", "gray.700"),
        }}
        href={url}
        fontWeight='semibold'
    >
        {children}
    </Link>
);

const Navbar = (props) => {
    const { username, isTenant, picture } = useSelector((state) => {
        return {
            username: state.userReducer.username,
            isTenant: state.userReducer.isTenant,
            picture: API_URL + state.userReducer.picture,
        };
    });

    const dispatch = useDispatch()
    const { isOpen, onOpen, onClose } = useDisclosure();

    const navigate = useNavigate()

    return (
        <>
            <Box borderTop='4px' borderColor='blue.400' px={4}>
                <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                    <IconButton
                        size={"md"}
                        icon={<HamburgerIcon />}
                        aria-label={"Open Menu"}
                        display={{ md: "none" }}
                        onClick={onOpen}
                    />
                    <Box display={{ md: "none" }} justifySelf='center'>
                        <Flex gap={2} onClick={() => navigate("/")} cursor="pointer">
                            <Icon as={MdHotel} boxSize={6} color='blue.400' />
                            <Text fontWeight='bold'>StayComfy</Text>
                        </Flex>
                    </Box>
                    <HStack
                        as={"nav"}
                        spacing={4}
                        display={{ base: "none", md: "flex" }}
                    >
                        <NavLink url='/'>
                            <Flex gap={2}>
                                <Icon as={MdHotel} boxSize={6} color='blue.400' />
                                <Text fontWeight='bold'>StayComfy</Text>
                            </Flex>
                        </NavLink>
                        {!username ?
                            <></>
                            : isTenant ?
                                <>
                                    <NavLink url='/mybooking'>
                                        My Booking
                                    </NavLink>
                                    <NavLink url='/profile'>
                                        Profile
                                    </NavLink>
                                    <NavLink url='/admin/property'>
                                        Manage Property
                                    </NavLink>
                                    <NavLink url='/admin/order'>
                                        Order List
                                    </NavLink>
                                    <NavLink url='/admin/report'>
                                        Report
                                    </NavLink>
                                </>
                                :
                                <>
                                    <NavLink url='/mybooking'>
                                        My Booking
                                    </NavLink>
                                </>
                        }
                    </HStack>

                    <Flex alignItems={"center"}>
                        {props.loading ? <Spinner /> :
                            username && !props.loading ? (
                                <Menu>
                                    <MenuButton
                                        as={Button}
                                        rounded={"full"}
                                        variant={"link"}
                                        cursor={"pointer"}
                                        minW={0}
                                    >
                                        <Avatar
                                            size={"sm"}
                                            src={picture}
                                        />
                                    </MenuButton>
                                    <MenuList zIndex={100}>
                                        <MenuItem onClick={() => navigate("/mybooking")}>My Booking</MenuItem>
                                        <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
                                        {isTenant ?
                                            <>
                                                <MenuDivider />
                                                <MenuItem onClick={() => navigate("/admin/property")}>Manage Property</MenuItem>
                                                <MenuItem onClick={() => navigate("/admin/order")}>Order List</MenuItem>
                                                <MenuItem onClick={() => navigate("/admin/report")}>Report</MenuItem>
                                            </>
                                            :
                                            <>
                                            </>
                                        }
                                        <MenuDivider />
                                        <MenuItem onClick={() => {
                                            dispatch(logoutAction())
                                            navigate("/")
                                        }}>Sign Out <Icon as={AiOutlineLogout} ms={1} mt={0.5} /></MenuItem>
                                    </MenuList>
                                </Menu>
                            ) : (
                                <ButtonGroup>
                                    <Button
                                        variant={"solid"}
                                        colorScheme="blue"
                                        size={"sm"}
                                        as="a"
                                        href={"/login"}
                                    >
                                        Login
                                    </Button>

                                    <Button
                                        variant="outline"
                                        colorScheme="blue"
                                        size={"sm"}
                                        as="a"
                                        href={"/register"}
                                    >
                                        Sign Up
                                    </Button>
                                </ButtonGroup>
                            )}

                    </Flex>
                </Flex>

                <Drawer
                    isOpen={isOpen}
                    placement='left'
                    onClose={onClose}
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <DrawerCloseButton />
                        <DrawerHeader>
                            <Flex gap={2} onClick={() => navigate("/")} cursor="pointer">
                                <Icon as={MdHotel} boxSize={6} color='blue.400' mt={1} />
                                <Text fontWeight='bold'>StayComfy</Text>
                            </Flex>
                        </DrawerHeader>

                        <DrawerBody>
                            {!username ?
                                <></>
                                : isTenant ?
                                    <Stack>
                                        <NavLink url='/mybooking'>
                                            My Booking
                                        </NavLink>
                                        <NavLink url='/profile'>
                                            Profile
                                        </NavLink>
                                        <NavLink url='/admin/property'>
                                            Manage Property
                                        </NavLink>
                                        <NavLink url='/admin/order'>
                                            Order List
                                        </NavLink>
                                        <NavLink url='/admin/report'>
                                            Report
                                        </NavLink>
                                    </Stack>
                                    :
                                    <Stack>
                                        <NavLink url='/mybooking'>
                                            My Booking
                                        </NavLink>
                                        <NavLink url='/profile'>
                                            Profile
                                        </NavLink>
                                    </Stack>
                            }
                        </DrawerBody>
                        <DrawerFooter>
                            <IconButton
                                w='full'
                                icon={<FaSignOutAlt />}
                                onClick={() => {
                                    dispatch(logoutAction());
                                    window.location.href = "/";
                                }}
                            />
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </Box>
        </>
    );
}

export default Navbar;