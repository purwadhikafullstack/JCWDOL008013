import {
    Box,
    Button,
    // Checkbox,
    Container,
    // Divider,
    FormControl,
    FormLabel,
    Heading,
    //   HStack,
    Input,
    Stack,
    //   Text,
    InputGroup,
    InputRightElement,
    IconButton,
  } from "@chakra-ui/react";
  import React, { useState, useEffect } from "react";
  import API_URL from "../helper";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";
  import { HiEye, HiEyeOff } from "react-icons/hi";
  import { logoutAction } from "../actions/userAction";
  import { useDispatch } from "react-redux";
  
  const ChangePassword = () => {
    const navigate = useNavigate();
  
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confPass, setConfPass] = useState("");
    const [inputType, setInputType] = useState("password");
  
    const dispatch = useDispatch()
  
    const onClickReveal = () => {
      if (inputType === "password") {
        setInputType("text");
      } else {
        setInputType("password");
      }
    };
  
    useEffect(() => {
      const token = localStorage.getItem('prw_login');
       if (!token) {
        window.location.href = "/";
      }
    }, []);
  
    const onBtnChangePass = async () => {
      const token = localStorage.getItem("prw_login");
      // console.log(token)
      // console.log({oldPass,newPass,confPass})
      try {
        await axios
          .patch(
            API_URL + `/users/changepass`,
            {
              oldPass,
              newPass,
              confPass,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((res) => {
            // console.log(res.data);
            alert(res.data.message);
            dispatch(logoutAction())
            navigate("/login");
          });
      } catch (err) {
        console.log(err);
        alert(err.response.data.message);
      }
    };
  
    return (
      <Box ms={[0, null, 60]} px={8} borderTopWidth={[0, null, '4px']} borderColor='blue.400'>
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
                md: "md",
              }}
              mb={8}
            >
              Change Your Password
            </Heading>
          </Stack>
        </Stack>
  
        <Stack spacing="8">
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
                <FormControl>
                  <FormLabel htmlFor="oldpassword">OldPassword</FormLabel>
                  <InputGroup>
                    <Input
                      id="oldpassword"
                      type={inputType}
                      onChange={(element) => setOldPass(element.target.value)}
                    />
                    <InputRightElement>
                      <IconButton
                        onClick={onClickReveal}
                        icon={inputType === "password" ? <HiEye /> : <HiEyeOff />}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="newpassword"> New Password</FormLabel>
                  <InputGroup>
                    <Input
                      id="newpassword"
                      type={inputType}
                      onChange={(element) => setNewPass(element.target.value)}
                    />
                    <InputRightElement>
                      <IconButton
                        onClick={onClickReveal}
                        icon={inputType === "password" ? <HiEye /> : <HiEyeOff />}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl>
                  <FormLabel htmlFor="confpassword">
                    Confirm New Password
                  </FormLabel>
                  <InputGroup>
                    <Input
                      id="confpassword"
                      type={inputType}
                      onChange={(element) => setConfPass(element.target.value)}
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
  
              <Stack spacing="6">
                <Button
                  colorScheme="blue"
                  variant="solid"
                  onClick={onBtnChangePass}
                >
                  Change Password
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
      </Box>
    );
  };
  
  export default ChangePassword;
  