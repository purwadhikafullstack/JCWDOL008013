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
    const formData = new FormData();
    formData.append("cardPicture", cardPicture);
    formData.append("cardNumber",cardNumber)

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type":`multipart/form-data`,
        },
      };
      //   console.log(cardNumber)
      //   console.log(cardPicture)
      console.log(token);
      const response = await axios.patch(
        API_URL + `/users/tobetenant`,
        formData,
        config
      );
      console.log(`res data :`,response);
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
    <Box maxW="300px" mx="auto" mt="10">
      <Heading size="md" mb="5">
        Upgrade to Tenant
      </Heading>
      <FormControl mb="5" isInvalid={!!error}>
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
      <Button colorScheme="blue" onClick={handleUpgradeClick}>
        Upgrade to Tenant
      </Button>
    </Box>
  );
};

export default ToBeTenant;
