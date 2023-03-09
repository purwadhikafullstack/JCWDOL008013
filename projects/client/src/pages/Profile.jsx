import React from "react";
import { Box, Button, FormControl, FormLabel, Heading, HStack, Input, Radio, RadioGroup, VStack } from "@chakra-ui/react";

const Profile = (props) => {
    return (
        <Box my={10} mx={20}>
            <Heading mb={10}>Profile Page</Heading>
            <VStack spacing={5}>
                <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input placeholder="Enter Your Name" />
                </FormControl>
                <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input placeholder="Enter Your Email" />
                </FormControl>
                <FormControl>
                    <FormLabel>Gender</FormLabel>
                    <RadioGroup>
                        <HStack>
                            <Radio>Male</Radio>
                            <Radio>Female</Radio>
                        </HStack>
                    </RadioGroup>
                </FormControl>
                <FormControl>
                    <FormLabel>Birthdate</FormLabel>
                    <Input type="date" />
                </FormControl>
            </VStack>
            <Button mt={10} width="full" colorScheme='blue'>Save</Button>
        </Box>
    )
}

export default Profile