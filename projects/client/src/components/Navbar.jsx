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
    Spinner
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";

import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";

import { AiOutlineLogout } from 'react-icons/ai'

import { logoutAction } from "../actions/userAction";

import { useNavigate } from "react-router-dom"

const Links = [
    { title: "Dashboard", url: "/" },
    { title: "Projects", url: "/projects" },
    { title: "Team", url: "/team" },
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
    >
        {children}
    </Link>
);

const Navbar = (props) => {
    const { username } = useSelector((state) => {
        return {
            username: state.userReducer.username,
        };
    });

    const dispatch = useDispatch()
    const { isOpen, onOpen, onClose } = useDisclosure();

    const navigate = useNavigate()

    return (
        <>
            <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
                <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
                    <IconButton
                        size={"md"}
                        icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
                        aria-label={"Open Menu"}
                        display={{ md: "none" }}
                        onClick={isOpen ? onClose : onOpen}
                    />
                    <HStack spacing={8} alignItems={"center"}>
                        <Box as="a" href="/" sx={{ textDecoration: "none" }}>
                            Logo
                        </Box>

                        <HStack
                            as={"nav"}
                            spacing={4}
                            display={{ base: "none", md: "flex" }}
                        >
                            {Links.map((link) => (
                                <NavLink key={link.title} url={link.url}>
                                    {link.title}
                                </NavLink>
                            ))}
                        </HStack>
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
                                            src={
                                                "https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9"
                                            }
                                        />
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem onClick={() => navigate("/mybooking")}>My Dashboard</MenuItem>
                                        <MenuItem onClick={() => navigate("/profile")}>Profile</MenuItem>
                                        <MenuItem onClick={() => navigate("/property")}>Property</MenuItem>
                                        <MenuDivider />
                                        <MenuItem onClick={() => dispatch(logoutAction())}>Sign Out <AiOutlineLogout /></MenuItem>
                                    </MenuList>
                                </Menu>
                            ) : (
                                <ButtonGroup>
                                    <Button
                                        variant={"solid"}
                                        colorScheme={"teal"}
                                        size={"sm"}
                                        mr={4}
                                        as="a"
                                        href={"/login"}
                                    >
                                        Login
                                    </Button>

                                    <Button
                                        variant={"outline"}
                                        colorScheme={"teal"}
                                        size={"sm"}
                                        mr={4}
                                        as="a"
                                        href={"/register"}
                                    >
                                        Sign Up
                                    </Button>
                                </ButtonGroup>
                            )}

                    </Flex>
                </Flex>

                {isOpen ? (
                    <Box pb={4} display={{ md: "none" }}>
                        <Stack as={"nav"} spacing={4}>
                            {Links.map((link) => (
                                <NavLink key={link}>{link}</NavLink>
                            ))}
                        </Stack>
                    </Box>
                ) : null}
            </Box>
        </>
    );
}

export default Navbar;