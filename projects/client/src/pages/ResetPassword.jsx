import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import  API_URL  from "../helper";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const [inputEmail, setInputEmail] = useState("");

  const navigate = useNavigate();

  const onBtnReset = () => {
    console.log(inputEmail)
    axios.get(API_URL + "/users/resetpass?email=" + inputEmail)
      .then((res) => {
        console.log(res.data);
        alert(res.data.message);
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  return (
    <Box maxW="300px" mx="auto" mt="10">
      <Heading size="md" mb="5">
        Reset Password
      </Heading>
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
        </Stack>
        <Stack spacing="5">
          <Button colorScheme="teal" variant="solid" onClick={onBtnReset}>
            Reset Password
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ResetPassword;
