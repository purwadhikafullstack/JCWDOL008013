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

import { useEffect, useState } from 'react';

import Axios from 'axios';

import API_URL from '../helper';

const Links = [
    { title: "Dashboard", url: "/" },
    { title: "Projects", url: "/projects" },
    { title: "Order List", url: "/admin/order",tenant:1},
    { title: "Order Report", url: "/admin/report",tenant:1},
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
    const { username,isTenant } = useSelector((state) => {
        return {
            username: state.userReducer.username,
            isTenant: state.userReducer.isTenant,
        };
    });

    const dispatch = useDispatch()
    const { isOpen, onOpen, onClose } = useDisclosure();

    const navigate = useNavigate()

    const [picture, setPicture] = useState('');

    // Get profile picture
    const profileData = async () => {
        try {
            let getLocalStorage = localStorage.getItem('prw_login');
            if (getLocalStorage) {
                let res = await Axios.get(API_URL + '/users/profiledata', { headers: { Authorization: `Bearer ${getLocalStorage}` } });
                setPicture(API_URL + res.data.picture);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        profileData();
    }, []);
    

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
                                link.tenant? isTenant ?
                                <NavLink key={link.title} url={link.url}>
                                    {link.title}
                                </NavLink>
                                :""
                                :<NavLink key={link.title} url={link.url}>
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
                                            src={picture}
                                        />
                                    </MenuButton>
                                    <MenuList>
                                        <MenuItem onClick={() => navigate("/mybooking")}>My Dashboard</MenuItem>
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