import React, { useState } from 'react';
import { Box, Button, Container, FormControl, FormLabel, Heading, HStack, Input, Link, Radio, RadioGroup, VStack } from "@chakra-ui/react";
import Axios from "axios"
import API_URL from "../helper"

const Profile = (props) => {
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [birthdate, setBirthdate] = useState("")
    const [gender, setGender] = useState("")

    const editButton = () => {
        let getLocalStorage = localStorage.getItem("prw_login")
        console.log("cek localstorage", getLocalStorage);
        if (getLocalStorage) {
            Axios.patch(API_URL + "/users/profile",
                {
                    username,
                    email,
                    birthdate,
                    gender
                },
                {
                    headers: {
                        Authorization: `Bearer ${getLocalStorage}`
                    }
                })
                .then((res) => {
                    console.log(res.data);
                    alert(res.data.message);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    return (
        <Box bg="gray.50">
            <Container bg="white" textAlign="center" py={12}>
                <Heading mb={10}>Edit Profile</Heading>
                <VStack>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input onChange={(e) => setUsername(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Email</FormLabel>
                        <Input onChange={(e) => setEmail(e.target.value)} />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Gender</FormLabel>
                        <RadioGroup>
                            <HStack>
                                <Radio value="Male" onChange={(e) => setGender(e.target.value)}>Male</Radio>
                                <Radio value="Female" onChange={(e) => setGender(e.target.value)}>Female</Radio>
                            </HStack>
                        </RadioGroup>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Birthdate</FormLabel>
                        <Input type="date" onChange={(e) => setBirthdate(e.target.value)} />
                    </FormControl>
                </VStack>
                <Button mt={10} mb={2} width="full" colorScheme='teal' onClick={editButton}>Save</Button>
                <Link href="/profilepicture" color="blue.500">Change your profile picture here</Link>
            </Container>
        </Box>
    )
}

export default Profile