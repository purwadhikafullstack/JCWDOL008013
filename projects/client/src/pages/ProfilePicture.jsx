import { Avatar, Box, Button, Flex, FormControl, FormErrorMessage, Input, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import API_URL from '../helper';
import { Form, Formik } from 'formik';
import { profilePictureValidation } from '../schemas';

const ProfilePicture = (props) => {
    const [picture, setPicture] = useState('');

    // Pop up notification
    const toast = useToast();

    const profileData = async () => {
        try {
            let getLocalStorage = localStorage.getItem('prw_login');
            if (getLocalStorage) {
                let res = await Axios.get(API_URL + '/users/profiledata', { headers: { Authorization: `Bearer ${getLocalStorage}` } });
                setPicture(API_URL + res.data.picture);
            }
        } catch (error) {
            console.log(error);
        }
    }

    const editButton = async (value) => {
        try {
            let getLocalStorage = localStorage.getItem('prw_login');
            let res = await Axios.post(API_URL + '/users/profilepicture', { profileImg: value.picture }, { headers: { Authorization: `Bearer ${getLocalStorage}`, "Content-Type": "multipart/form-data", } });
            toast({
                title: `${res.data.message}`,
                description: "You've successfully changed your profile picture",
                status: 'success',
                position: 'top',
                duration: 9000,
                isClosable: true,
                onCloseComplete: () => profileData()
            });
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
                <Box w={500} p={8} border={[0, null, '1px']} borderColor={['', null, 'blue.400']} borderRadius={8}>
                    <Flex justifyContent='center'>
                        <Avatar size='2xl' src={picture} />
                    </Flex>
                    <Formik
                        initialValues={{ picture }}
                        validationSchema={profilePictureValidation}
                        onSubmit={(values, actions) => {
                            editButton(values);
                            actions.setSubmitting(false);
                        }}
                    >
                        {(props) => (
                            <Form>
                                <FormControl isInvalid={props.errors.picture && props.touched.picture} mt={12}>
                                    <Input
                                        id='picture'
                                        type='file'
                                        accept='image/*'
                                        onChange={(e) => {
                                            props.setFieldValue('picture', e.target.files[0]);
                                        }}
                                        onBlur={props.handleBlur}
                                    />
                                    <FormErrorMessage>{props.errors.picture}</FormErrorMessage>
                                </FormControl>
                                <Button mt={4} colorScheme='blue' w="full" type='submit' isLoading={props.isSubmitting}>Save</Button>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Flex>
        </Box>
    )
}

export default ProfilePicture