import { Flex, Box, Heading, Text, Button, Spinner } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Page404 = (props) => {
  const { username } = useSelector((state) => {
    return {
        username: state.userReducer.username,
    };
  })
  return (
    <>
      {props.loading ?
        <Flex justifyContent="flex-end">
          <Spinner />
        </Flex>
        :
        <Flex
          height="80vh"
          alignItems="center"
          justifyContent="center"
          flexDirection="column"

        >
          <Box textAlign="center">
            <Heading fontSize="9xl" mb={8}>404</Heading>

            <Text fontSize="3xl" mb={8}>Oops! Page not found.</Text>
            {!username ?
              <Link to="/login">
                <Button colorScheme="blue" size="lg">Go Login</Button>
              </Link>
              :
              <Link to="/">
                <Button colorScheme="blue" size="lg">Home</Button>
              </Link>
            }
          </Box>
        </Flex>
      }
    </>
  );
};

export default Page404;
