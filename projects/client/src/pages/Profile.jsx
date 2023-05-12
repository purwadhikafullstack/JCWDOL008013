import React, { useEffect, useState } from 'react';
import { Box, Flex, useDisclosure, useToast } from "@chakra-ui/react";
import Axios from "axios";
import API_URL from "../helper";
import { profileValidation } from '../schemas';
import ProfileEditModal from '../components/ProfileEditModal';
import ProfileCard from '../components/ProfileCard';

const Profile = (props) => {
    // State for profile data
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [gender, setGender] = useState('');
    const [picture, setPicture] = useState('');

    // Pop up notification
    const toast = useToast();

    // Modal edit profile
    const { isOpen, onOpen, onClose } = useDisclosure();

    const profileData = async () => {
        try {
            let getLocalStorage = localStorage.getItem('prw_login');
            if (getLocalStorage) {
                let res = await Axios.get(API_URL + '/users/profiledata', { headers: { Authorization: `Bearer ${getLocalStorage}` } });
                setUsername(res.data.username);
                setEmail(res.data.email);
                setBirthdate(res.data.birthdate);
                setGender(res.data.gender);
                setPicture(API_URL + res.data.picture);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const editButton = async (value) => {
        try {
            let getLocalStorage = localStorage.getItem("prw_login");
            if (getLocalStorage) {
                let res = await Axios.patch(API_URL + "/users/profile", value, { headers: { Authorization: `Bearer ${getLocalStorage}` } });
                toast({
                    title: `${res.data.message}`,
                    description: "You've successfully edited your profile",
                    status: 'success',
                    position: 'top',
                    duration: 9000,
                    isClosable: true,
                    onCloseComplete: () => profileData()
                })
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        profileData();
    }, []);

    return (
        <Box ms={[0, null, 60]} px={8} borderTopWidth={[0, null, '4px']} borderColor='blue.400'>
            <Flex justifyContent='center' mt={[8, null, 32]}>
                <ProfileCard data={{
                    picture, username, email, gender, birthdate, onOpen
                }} />
                <ProfileEditModal data={{
                    isOpen, onClose, initialValues: { username, email, gender, birthdate }, validationSchema: profileValidation, onSubmit: (values, actions) => {
                        onClose();
                        editButton(values);
                    }
                }} />
            </Flex>
        </Box >
    )
}

export default Profile