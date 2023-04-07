import { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Detail = () => {
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [duration, setDuration] = useState(1);
  const [roomType, setRoomType] = useState("A");
  const [totalPrice] = useState(1000000);
  const [propertyName] = useState("Changgu Sunrise Heritage");
  const [minCheckOutDate, setMinCheckOutDate] = useState("");

  const navigate = useNavigate();

  const handleCheckInChange = (event) => {
    console.log(event.target.value)
    setCheckInDate(event.target.value);
    setMinCheckOutDate(addDays(event.target.value, 1));
    console.log(minCheckOutDate)
  };

  const handleCheckOutChange = (event) => {
    if (event.target.value < checkInDate) {
      alert("Check-out date must be after check-in date");
    } else {
      setCheckOutDate(event.target.value);
    }
  };

  const handleDurationChange = (event) => {
    setDuration(parseInt(event.target.value));
    setCheckOutDate(addDays(checkInDate, parseInt(event.target.value)));
  };

  const handleRoomTypeChange = (event) => {
    setRoomType(event.target.value);
  };

  const handleRentRoomClick = () => {
    if (!checkInDate || (checkOutDate === "" && duration === 1) || !roomType) {
      alert("Please fill in all input fields");
    } else {
      const orderData = {
        id_property: 9,
        id_room: getRoomIdFromType(roomType),
        checkin_date: checkInDate,
        checkout_date: checkOutDate,
        total: totalPrice,
      };
      localStorage.setItem("prw_order", JSON.stringify(orderData));
      navigate("/confirmation");
    }
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split("T")[0];
  };

  const getRoomIdFromType = (type) => {
    switch (type) {
      case "A":
        return 1;
      case "B":
        return 2;
      case "C":
        return 3;
      default:
        return null;
    }
    
  };
  
  return (
    <Flex align="center" justify="center" direction="column" minH="100vh">
      <Box
        w={{ base: "80%", md: "50%" }}
        borderWidth="1px"
        p={{ base: "4", md: "6" }}
        borderRadius="lg"
        boxShadow="lg"
      >
        <Heading mb="4">{propertyName}</Heading>
        <FormControl id="checkin-date" isRequired>
          <FormLabel>Check In Date:</FormLabel>
          <Input
            type="date"
            value={checkInDate}
            onChange={handleCheckInChange}
            min={new Date().toISOString().split("T")[0]}
          />
        </FormControl>
        <FormControl id="duration" isRequired mt="4">
          <FormLabel>Duration of Stay:</FormLabel>
          <Select value={duration} onChange={handleDurationChange}>
            <option value={1}>1 day</option>
            <option value={2}>2 days</option>
            <option value={3}>3 days</option>
          </Select>
        </FormControl>
        <FormControl id="checkout-date" isRequired mt="4">
          <FormLabel>Check Out Date:</FormLabel>
          {duration === 1 ? (
            <Input
              type="date"
              value={checkOutDate}
              onChange={handleCheckOutChange}
              min={minCheckOutDate}
            />
          ) : (
            <span>{addDays(checkInDate, duration)}</span>
          )}
        </FormControl>

        <FormControl id="room-type" isRequired mt="4">
          <FormLabel>Room Type:</FormLabel>
          <Select value={roomType} onChange={handleRoomTypeChange}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </Select>
        </FormControl>
        <FormControl id="total-price" isReadOnly mt="4">
          <FormLabel>Total Price:</FormLabel>
          <Input type="text" value={`Rp${totalPrice}`} />
        </FormControl>
        <Button mt="4" onClick={handleRentRoomClick}>
          Rent the Room
        </Button>
      </Box>
    </Flex>
  );
};

export default Detail;
