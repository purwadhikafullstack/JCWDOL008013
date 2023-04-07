import {
    Box,
    Button,
    Checkbox,
    Container,
    Divider,
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
    return (
      <Container
        maxW="md"
        py={{
          base: "12",
          md: "24",
        }}
        px={{
          base: "0",
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
            boxShadow={{
              base: "none",
              sm: "md",
            }}
            borderRadius={{
              base: "none",
              sm: "xl",
            }}
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
                        icon={inputType === "password" ? <HiEye /> : <HiEyeOff />}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
              </Stack>
              <HStack justify="space-between">
                <Checkbox defaultChecked>Remember me</Checkbox>
                <Button variant="link" colorScheme="blue" size="sm" onClick={() => navigate("/resetpass")}>
                  Forgot password?
                </Button>
              </HStack>
              <Stack spacing="6">
                <Button colorScheme="teal" variant="solid" onClick={onBtnLogin}>
                  Login
                </Button>
                <HStack>
                  <Divider />
                  <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                    or
                  </Text>
                  <Divider />
                </HStack>
                <Button leftIcon={<FcGoogle />}>Login in with Google</Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    );
  };
  
  export default Login;
  