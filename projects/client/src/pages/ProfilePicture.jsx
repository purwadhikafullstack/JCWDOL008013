import { Avatar, Box, Button, Container, Heading, Input } from '@chakra-ui/react';
import React, { useState } from 'react';
import Axios from 'axios';
import API_URL from '../helper';

const ProfilePicture = (props) => {
    const [picture, setPicture] = useState(null)

    const editButton = () => {
        let getLocalStorage = localStorage.getItem("prw_login")
        const formData = new FormData()
        formData.append("images", picture)
        Axios.patch(API_URL + "/users/profilepicture", formData, {
            headers: {
                Authorization: `Bearer ${getLocalStorage}`
            }
        })
            .then((res) => {
                alert(res.data.message)
                window.location.reload(false)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <Box bg="gray.50">
            <Container bg="white" textAlign="center" py={12}>
                <Heading>Edit Profile Picture</Heading>
                <Avatar size="2xl" mt={10} />
                <Input mt={10} type="file" onChange={(e) => setPicture(e.target.files[0])} />
                <Button colorScheme="teal" mt={10} w="full" onClick={editButton}>Save</Button>
            </Container>
        </Box>
    )
}

export default ProfilePicture