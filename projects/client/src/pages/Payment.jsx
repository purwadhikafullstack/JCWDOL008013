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
    useToast,
  } from "@chakra-ui/react";
  
  import { useNavigate } from "react-router-dom";
  import { useState, useEffect } from "react";
  import axios from "axios";
  import API_URL  from "../helper";
  import { useSelector } from "react-redux";
  
  const Payment = () => {
    const isMobile = useBreakpointValue({ base: true, md: false });
    const navigate = useNavigate();
    const [totalPrice, setTotalPrice] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [orderId, setOrderId] = useState(null);
    const [paymentProof, setPaymentProof] = useState(null);
    const toast = useToast();
  
    const { token } = useSelector((state) => {
      return {
        token: state.userReducer.token,
      };
    });
  
    // auth
    useEffect(() => {
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
    });
    // end Auth
  
    // get data "total" from localstorage
    useEffect(() => {
      const orderData = JSON.parse(localStorage.getItem("prw_order"));
      setTotalPrice(orderData.total);
      setOrderId(orderData.orderId)
    }, []);
  
    const handleFileUpload = (e) => {
      const file = e.target.files[0];
  
      // Use FileReader to read the contents of the file
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Set the file state and the data URL
        setPaymentProof(file);
        setFileUrl(reader.result);
      };
    };
  
    const onConfirmBtn = async () => {
      if (!paymentProof) {
        toast({
          title: "Please upload payment proof",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
        return;
      }
  
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type":`multipart/form-data`,
          },
        };
        // console.log(token)
        const response = await axios.post(
          `${API_URL}/orders/paymentproof`,
          { paymentProof, orderId },
          config
        );
  
        // Check if the patch request was successful
        if (response.status === 200) {
          localStorage.removeItem("prw_order");
          navigate("/success");
        } else {
          toast({
            title: "Failed to update database",
            status: "error",
            duration: 3000,
            isClosable: true,
            position: 'top',
          });
        }
      } catch (error) {
        console.error(error);
        let message = "Error updating database";
        if (error.response && error.response.data && error.response.data.message) {
          message = error.response.data.message;
        }
        toast({
          title: message,
          status: "error",
          duration: 3000,
          isClosable: true,
          position: 'top',
        });
      }
    };
  
    const onCancelBtn = () => {
      navigate("/confirmation");
    };
  
    const dummyImage = "https://via.placeholder.com/300x200";
  
    return (
      <Box py="10">
        <Heading as="h2" textAlign="center" mb="6">
          Payment
        </Heading>
  
        {/* Property Information */}
        <Flex
          flexDirection={isMobile ? "column" : "row"}
          alignItems="center"
          justifyContent="center"
          mb="8"
        >
          {/* Payment Detail */}
          <Box
            ml={isMobile ? 0 : "10"}
            width={isMobile ? "80%" : "25%"}
            alignSelf={isMobile ? "center" : "flex-start"}
            mb="4"
          >
            <Text fontWeight="bold" fontSize="xl" mb="4">
              Transfer Your Payment
            </Text>
            <Stack spacing="4">
              <Stack direction="row">
                <Image
                  src={API_URL + "/assets/logo-bca.jpg"}
                  alt="BCA Logo"
                  objectFit="cover"
                  width="auto"
                  height="20%"
                  borderRadius="md"              
                />
                <Box>
                  <Text fontWeight="bold">Bank Central Asia</Text>
                  <Text>012345678</Text>
                  <Text>Purwadhika 0803</Text>
                </Box>
              </Stack>
              <Stack direction="row">
                <Image
                  src={API_URL + "/assets/logo-mandiri.jpg"}
                  alt="Mandiri Logo"
                  objectFit="cover"
                  width="auto"
                  height="50%"
                  borderRadius="md"
                />
                <Box>
                  <Text fontWeight="bold">Bank Mandiri</Text>
                  <Text>012345678</Text>
                  <Text>Purwadhika 0803</Text>
                </Box>
              </Stack>
              <Stack direction="row">
                <Text fontWeight="bold">Total Price:</Text>
                <Text>Rp {totalPrice}</Text>
              </Stack>
            </Stack>
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
              marginLeft="-10"
            ></Box>
          )}
  
          {/* Upload Payment Proof */}
          <Box mb={isMobile ? "6" : 0} width={isMobile ? "80%" : "25%"}>
            <Center>
              <Text fontWeight="bold">Upload Your Payment Proof</Text>
            </Center>
            <Center>
              <Stack
                direction="column"
                alignItems="center"
                justifyContent="center"
                // width="100%"
              >
                <Box>
                  {fileUrl && (
                    <Image
                      src={fileUrl || dummyImage}
                      alt="Payment Proof"
                      objectFit="cover"
                      width="100%"
                      height="auto"
                      borderRadius="md"
                      boxShadow="md"
                    />
                  )}
                </Box>
                <Box>
                  {!paymentProof && (
                    <input
                    id="paymentProof"
                      type="file"
                      onChange={handleFileUpload}
                      accept="image/*"
                    />
                  )}
                </Box>
              </Stack>
            </Center>
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
              colorScheme="blue"
              mx="auto"
              width="100%"
              mb="4"
              onClick={onConfirmBtn}
            >
              Confirm Payment
            </Button>
            <Button
              colorScheme="blue"
              variant="outline"
              mx="auto"
              width="100%"
              onClick={onCancelBtn}
            >
              Cancel
            </Button>
          </Flex>
        </Flex>
      </Box>
    );
  };
  
  export default Payment;
  