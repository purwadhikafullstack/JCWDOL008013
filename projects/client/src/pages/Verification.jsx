import {
  Box,
  Button,
  Container,
  FormControl,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import React,{useState} from "react";
import { useLocation } from "react-router-dom";
import API_URL from "../helper";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Verification = () => {
  const location = useLocation();
  // console.log("from verify page : ", location);
  const navigate = useNavigate()
  const [inputOtp, setInputOtp] = useState("");

  const onBtnVerified = async () => {
    try {
      let token = location.search.split("=")[1];
      await axios.patch(
        API_URL + `/users/verify`,
        {
          otp:inputOtp
        }, 
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      ).then((res)=>{
        console.log(res.data)
        alert(res.data.message)
        navigate('/login')
      });
    } catch (err) {
      console.log(err)
      alert(err.response.data.message);
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
          >
            Verify Your Account
          </Heading>
        </Stack>
      </Stack>

      <Stack spacing="8" mt={8}>
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
              <HStack spacing="1" justify="center">
                <Text color="muted" fontWeight='bold'>OTP Code</Text>
              </HStack>
              <FormControl>



                <Input
                  id="otp"
                  type="number"
                  onChange={(element) => setInputOtp(element.target.value)}
                />
              </FormControl>
            </Stack>

            <Stack spacing="6">
              <Button
                colorScheme="blue"
                variant="solid"
                onClick={onBtnVerified}
              >
                Verify
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default Verification;
