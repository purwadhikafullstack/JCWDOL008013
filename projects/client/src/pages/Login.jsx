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
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    useToast,
  } from "@chakra-ui/react";
  import { HiEye, HiEyeOff } from "react-icons/hi";
  import { FcGoogle } from "react-icons/fc";
  import React, { useState } from "react";
  import { useNavigate } from "react-router-dom";
  import Axios from "axios";
  import { loginAction } from "../actions/userAction";
  import { useDispatch } from "react-redux";
  import API_URL from "../helper";
//   const API_URL = process.env.REACT_APP_API_BASE_URL
  
  
  const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [inputEmail, setInputEmail] = useState("");
    const [inputPass, setInputPass] = useState("");
    const [inputType, setInputType] = useState("password");
    const [emailVerify, setEmailVerify] = useState("");

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
  
    const onBtnLogin = () => {
     
      Axios.post(API_URL + `/users/login`, {
        email:inputEmail,
        password:inputPass
      })
        .then((res) => {
          // console.log(`res login data ${res.data}`);
          dispatch(loginAction(res.data)); // menjalankan fungsi action
          localStorage.setItem('prw_login', res.data.token);
          if(res.data.isTenant===true) {
            navigate("/dashboard", {replace:true})
          }
          navigate("/", { replace: true });
           
        })
        .catch((err) => {
          console.log(err)
          if(!err.response.data.success){
  
            alert(err.response.data.message);
          }
          console.log("check error", err)
        });
    };
  
    const onClickReveal = () => {
      if (inputType === "password") {
        setInputType("text");
      } else {
        setInputType("password");
      }
    };

    const verifyButton = async () => {
      try {
        let res = await Axios.post(API_URL + "/users/reverify", { email: emailVerify });
        if (res.data.success) {
          toast({
            title: 'Success',
            description: res.data.message,
            status: 'success',
            duration: 9000,
            position: 'top',
            isClosable: true,
            onCloseComplete: () => onClose(),
          })
        } else {
          toast({
            title: 'Failed',
            description: res.data.message,
            status: 'error',
            duration: 9000,
            position: 'top',
            isClosable: true,
            onCloseComplete: () => onClose(),
          })
        }
      } catch (error) {
        console.log(error);
      }
    }

    return (
      <Container
        maxW="md"
        py={24}
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
                  base: "lg",
                  md: "lg",
                }}
              >
                Log in to your account
              </Heading>
              <HStack spacing="1" justify="center">
                <Text color="muted">Don't have an account?</Text>
                <Button
                  variant="link"
                  colorScheme="blue"
                  as="a"
                  href={"/register"}
                >
                  Sign up
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
              base: "0px",
              sm: "8px",
            }}
            border={{
              base: "0px",
              md: "1px"
            }}
            borderColor={['', null, 'blue.400']}
          >
            <Stack spacing="6">
              <Stack spacing="5">
                <FormControl>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <Input
                    id="email"
                    type="email"
                    onChange={(element) => setInputEmail(element.target.value)}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <InputGroup>
                    <Input
                      id="password"
                      type={inputType}
                      onChange={(element) => setInputPass(element.target.value)}
                    />
                    <InputRightElement>
                      <IconButton
                        onClick={onClickReveal}
                        size="sm"
                        icon={inputType === "password" ? <HiEye /> : <HiEyeOff />}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </Stack>
              <HStack justify="space-between">
                <Button variant="link" colorScheme="blue" size="sm" onClick={onOpen}>Verify your account</Button>
                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Verify your account</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                      <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input type="email" onChange={(e) => setEmailVerify(e.target.value)} />
                      </FormControl>
                    </ModalBody>

                    <ModalFooter>
                      <Button colorScheme='blue' variant="outline" mr={3} onClick={onClose}>
                        Close
                      </Button>
                      <Button colorScheme="blue" onClick={verifyButton}>Verify</Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
                <Button variant="link" colorScheme="blue" size="sm" onClick={() => navigate("/resetpass")}>
                  Forgot password?
                </Button>
              </HStack>
                <Button colorScheme="blue" variant="solid" onClick={onBtnLogin}>
                  Login
                </Button>
            </Stack>
          </Box>
        </Stack>
      </Container>
    );
  };
  
  export default Login;
  