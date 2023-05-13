import { Flex, Box, Heading, Text, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

const Page404 = () => {
  return (
    <Flex
      height="80vh"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    
    >
      <Box textAlign="center">
        <Heading fontSize="9xl" mb={8}>404</Heading>

        <Text fontSize="3xl" mb={8}>Oops! Page not found.</Text>
        <Link to="/login">
          <Button colorScheme="blue" size="lg">Go Login</Button>
        </Link>
      </Box>
    </Flex>
  );
};

export default Page404;
