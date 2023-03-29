import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Flex,
  Heading,
  Image,
  Text,
  Button,
  useBreakpointValue,
  Box,
  Center,
} from "@chakra-ui/react";
import API_URL from "../helper";

const Success = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <Flex flexDirection="column" alignItems="center">
      <Breadcrumb mb={8} separator=">" color="gray.400" fontWeight="medium">
        <BreadcrumbItem>
          <BreadcrumbLink href="/confirmation">Order Details</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbLink href="/payment">Payment</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink color="teal.500">Success</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Heading mb={4}>Yay! Finished</Heading>

      <Box mb={isMobile ? "3" : 0} width={isMobile ? "90%" : "40%"}>
        <Center>
          <Image
            src={API_URL + "/assets/sukses1.png"}
            alt="Success picture"
            objectFit="cover"
            width="100%"
            height="auto"
            borderRadius="md"
            boxShadow="md"
          />
        </Center>
        <Flex alignItems="center">
        <Text mb={4}>
          Your order has been received. Please wait for tenant confirmation.
        </Text>
      </Flex>
      </Box>

      

      <Button colorScheme="teal" onClick={() => (window.location.href = "/")}>
        Back to Home
      </Button>
    </Flex>
  );
};

export default Success;
