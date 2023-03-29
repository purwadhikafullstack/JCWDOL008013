import {
    Box,
    Button,
    Center,
    Flex,
    Heading,
    Image,
    Stack,
    Text,
    useBreakpointValue,
  } from "@chakra-ui/react";
  import { useNavigate } from "react-router-dom";
  import { useEffect, useState } from "react";
  import axios from "axios";
  import API_URL from "../helper";
  
  
  const Confirmation = () => {
    // variable about data
    const [bookingData, setBookingData] = useState({});
    const [propertyData, setPropertyData] = useState({});
    const [roomData, setRoomData] = useState({});
    // const [cityData, setCityData] = useState({});
  
    // variable about display
  
    const isMobile = useBreakpointValue({ base: true, md: false });
    const navigate = useNavigate();
  
    // auth
    useEffect(()=>{
  
      const isLoggedIn = localStorage.getItem("prw_login") !== null;
      const hasOrder = localStorage.getItem("prw_order") !== null;
      if (!isLoggedIn) {
        navigate("/404");
        return null;
      }
      if (!hasOrder) {
        navigate("/");
        return alert("You don't have any order");
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    // end Auth
  
    //Get data from DB and Local storage when the component is accessed
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const bookingData = JSON.parse(localStorage.getItem('prw_order'));
      setBookingData(bookingData);
  
      const token = localStorage.getItem('prw_login');
  
      // Get property data from API
      // console.log(bookingData.id_property)
      axios.get(API_URL+`/orders/property?propertyId=${bookingData.id_property}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          setPropertyData(response.data);
          // setCityData(response.data.city);
        })
        .catch(error => {
          console.error(error);
        });
  
      // Get room data from API
      // console.log(bookingData.id_room)
      axios.get(API_URL+`/orders/room?roomId=${bookingData.id_room}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          // console.log(response)
          setRoomData(response.data);
        })
        .catch(error => {
          console.error(error);
        });
    }, []);
  
  // when button confirm is clicked
    const onConfirmBtn = () => {
      const token = localStorage.getItem('prw_login');
      console.log(token)
      // const bookingData = JSON.parse(localStorage.getItem('prw_order'));
      const requestData = {
        id_property: bookingData.id_property,
        id_room: bookingData.id_room,
        checkin_date: bookingData.checkin_date,
        checkout_date: bookingData.checkout_date,
        total: bookingData.total,
        // id_user: propertyData.id_user // Replace with the actual user ID
      };
  
      axios.post(API_URL+`/orders/create`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then(response => {
          const orderId = response.data.id_order;
          localStorage.setItem('prw_order', JSON.stringify({ ...bookingData, orderId }));
          navigate('/payment');
        })
        .catch(error => {
          console.error(error);
        });
    };
  
    //on Botton cancel
    const onCancelBtn = () => {
      localStorage.removeItem('prw_order')
      navigate("/detail");
    };
  
    return (
      <Box py="10">
        <Heading as="h2" textAlign="center" mb="6">
          Order Confirmation
        </Heading>
  
        {/* Property Information */}
        <Flex
          flexDirection={isMobile ? "column" : "row"}
          alignItems="center"
          justifyContent="center"
          mb="8"
        >
          {/* Property Picture */}
          <Box mb={isMobile ? "6" : 0} width={isMobile ? "80%" : "25%"}>
            <Center>
              <Image
                src={API_URL + propertyData.picture}
                alt="Property picture"
                objectFit="cover"
                width="100%"
                height="auto"
                borderRadius="md"
                boxShadow="md"
              />
            </Center>
            <Center>
              <Stack
                direction="row"
                alignItems="baseline"
                justifyContent="space-between"
                mt="2"
                width="100%"
              >
                <Box textAlign="left">
                  <Text fontSize="lg" fontWeight="bold">
                    {propertyData.name}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {propertyData.city}, {propertyData.province}
                  </Text>
                </Box>
                <Box textAlign="right">
                  <Text fontSize="sm" color="gray.500">
                    Rp {bookingData.total}
                  </Text>
                </Box>
              </Stack>
            </Center>
          </Box>
  
          {/* Add vertical or horizontal line based on breakpoint */}
          {isMobile ? (
            <Box w="80%" h="1px" bg="gray.300" my={4}></Box>
          ) : (
            <Box
              h="300px"
              w="1px"
              bg="gray.300"
              color="black"
              mx={4}
              marginLeft="55px"
            ></Box>
          )}
  
          {/* Order Detail */}
          <Box
            ml={isMobile ? 0 : "10"}
            width={isMobile ? "80%" : "25%"}
            alignSelf={isMobile ? "center" : "flex-start"}
          >
            <Stack spacing="2">
              <Stack direction="row" justifyContent="space-between">
                <Text fontWeight="bold">Property:</Text>
                <Text>{propertyData.name}</Text>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Text fontWeight="bold">Address:</Text>
                <Text>{propertyData.address}</Text>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Text fontWeight="bold">City:</Text>
                <Text>{propertyData.city}</Text>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Text fontWeight="bold">Province:</Text>
                <Text>{propertyData.province}</Text>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Text fontWeight="bold">Room Type:</Text>
                <Text>{roomData.type}</Text>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Text fontWeight="bold">Check In:</Text>
                <Text>{bookingData.checkin_date}</Text>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Text fontWeight="bold">Check Out:</Text>
                <Text>{bookingData.checkout_date}</Text>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Text fontWeight="bold">Total Price:</Text>
                <Text>Rp {bookingData.total}</Text>
              </Stack>
            </Stack>
          </Box>
        </Flex>
  
        {/* Action Buttons */}
        <Flex
          width="100%"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Flex width={isMobile ? "50%" : "20%"} flexDirection="column">
            <Button
              colorScheme="teal"
              mx="auto"
              width="100%"
              mb="4"
              onClick={onConfirmBtn}
            >
              Confirm to Order
            </Button>
            <Button colorScheme="teal" variant="outline" mx="auto" width="100%" onClick={onCancelBtn}>
              Cancel
            </Button>
          </Flex>
        </Flex>
      </Box>
    );
  };
  
  export default Confirmation;
  