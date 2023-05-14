import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Stack,
    Text,
    InputGroup,
    InputRightElement,
    IconButton,
    useToast,
} from "@chakra-ui/react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Axios from "axios";
import API_URL from "../helper";

const Register = () => {
    const [username, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [inputType, setInputType] = useState("password");
    const navigate = useNavigate()
    const toast = useToast()

    const onBtnRegis = () => {
        Axios.post(API_URL + `/users/regis`, {
            username,
            email,
            phone,
            password,
            // role: "user",
        })
            .then((res) => {
                toast({
                    title: 'Success',
                    description: res.data.message,
                    status: 'success',
                    duration: 9000,
                    position: 'top',
                    isClosable: true,
                    onCloseComplete: () => navigate('/login'),
                })
            })
            .catch((err) => {
                toast({
                    title: 'Failed',
                    description: err.response.data.message,
                    status: 'error',
                    duration: 9000,
                    position: 'top',
                    isClosable: true,
                  });        
            });
    };

    const onClickReveal = () => {
        if (inputType === "password") {
            setInputType("text");
        } else {
            setInputType("password");
        }
    };
    return (
        <Container
            maxW="lg"
            py={{
                base: "12",
                md: "24",
            }}
            px={{
                base: "4",
                sm: "8",
            }}
        >
            <Stack spacing="8">
                <Stack spacing="6">
                    <Stack
                        spacing={{
                            base: "2",
                            md: "3",
                        }}
                        textAlign="center"
                    >
                        <Heading
                            size={{
                                base: "xs",
                                md: "sm",
                            }}
                        >
                            Create an account
                        </Heading>
                        <HStack spacing="1" justify="center">
                            <Text color="muted">Already have an account?</Text>
                            <Button variant="link" colorScheme="blue" as="a" href={"/login"}>
                                Log in
                            </Button>
                        </HStack>
                    </Stack>
                </Stack>
                <Box
                    py={{
                        base: "0",
                        sm: "8",
                    }}
                    px={{
                        base: "4",
                        sm: "10",
                    }}
                    bg={{
                        base: "transparent",
                        sm: "bg-surface",
                    }}
                    borderRadius={{
                        base: "none",
                        sm: "xl",
                    }}
                    border={{
                        base: "0px",
                        md: "1px"
                    }}
                    borderColor={['', null, 'blue.400']}
                >
                    <Stack spacing="6">
                        <Stack spacing="5">
                            <FormControl isRequired>
                                <FormLabel htmlFor="nama">Nama</FormLabel>
                                <Input
                                    id="nama"
                                    type="text"
                                    onChange={(element) => setUserName(element.target.value)}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel htmlFor="email">Email</FormLabel>
                                <Input
                                    id="email"
                                    type='email'
                                    onChange={(element) => setEmail(element.target.value)}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel htmlFor="phone">Phone</FormLabel>
                                <Input
                                    id="phone"
                                    type="tel"
                                    onChange={(element) => setPhone(element.target.value)}
                                />
                            </FormControl>
                            <FormControl isRequired>
                                <FormLabel htmlFor="password">Password</FormLabel>
                                <InputGroup>
                                    <Input
                                        id="password"
                                        type={inputType}
                                        onChange={(element) => setPassword(element.target.value)}
                                    />
                                    <InputRightElement>
                                        <IconButton
                                            onClick={onClickReveal}
                                            icon={inputType === "password" ? <HiEye /> : <HiEyeOff />}
                                            size="sm"
                                        />
                                    </InputRightElement>
                                </InputGroup>
                            </FormControl>
                        </Stack>
                        <HStack justify="space-between"></HStack>
                        <Button colorScheme="blue" variant="solid" onClick={onBtnRegis}>
                            Create account
                        </Button>
                    </Stack>
                </Box>
            </Stack>
        </Container>
    );
};

export default Register;