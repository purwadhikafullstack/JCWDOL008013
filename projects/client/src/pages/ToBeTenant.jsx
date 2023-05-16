import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
} from "@chakra-ui/react";
import axios from "axios";
import  API_URL  from "../helper";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAction } from "../actions/userAction";

const ToBeTenant = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardPicture, setCardPicture] = useState(null);
  const [error, setError] = useState(null);
 
  const { token } = useSelector((state) => {
    return {
        token: state.userReducer.token,
    };
});
const dispatch = useDispatch()
const navigate = useNavigate()

  const handleCardNumberChange = (event) => {
    setCardNumber(event.target.value);
  };

  const handleCardPictureChange = (event) => {
    setCardPicture(event.target.files[0]);
  };

  const handleUpgradeClick = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":`multipart/form-data`,
        },
      };
      const response = await axios.post(
        API_URL + `/users/tobetenant`,
        { cardPicture, cardNumber },
        config
      );
      alert(response.data.message)
      setError(null);
      dispatch(logoutAction())
      navigate('/login')
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <Box ms={[0, null, 60]} px={8} borderTopWidth={[0, null, '4px']} borderColor='blue.400'>
    <Box maxW="400px" mx="auto" mt="20">
      <Heading size="md" mb="10" textAlign="center">
        Upgrade to Tenant
      </Heading>
      <Box
        py={{
          base: "0",
          sm: "8",
        }}
        px={8}
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
      <FormControl mb="2" isInvalid={!!error}>
        <FormLabel htmlFor="cardNumber">Card Number</FormLabel>
        <Input
          id="cardNumber"
          type="number"
          value={cardNumber}
          onChange={handleCardNumberChange}
          placeholder="Enter your card number"
        />
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
      <FormControl mb="5" isInvalid={!!error}>
        <FormLabel htmlFor="cardPicture">Card Picture</FormLabel>
        <Input
          id="cardPicture"
          type="file"
          name="images"
          accept="image/*"
          onChange={handleCardPictureChange}
        />
        <FormErrorMessage>{error}</FormErrorMessage>
      </FormControl>
      <Button colorScheme="blue" w="full" onClick={handleUpgradeClick}>
        Upgrade to Tenant
      </Button>
      </Box>
    </Box>
    </Box>
  );
};

export default ToBeTenant;
