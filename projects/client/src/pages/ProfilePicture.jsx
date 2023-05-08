import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, FormControl, FormErrorMessage, Input, useToast } from '@chakra-ui/react';
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
            const formData = new FormData();
            formData.append('images', value.picture);
            let res = await Axios.patch(API_URL + '/users/profilepicture', formData, { headers: { Authorization: `Bearer ${getLocalStorage}` } });
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
        <Box bg='gray.100' ms={[0, null, 60]} px={8}>
            <Flex h='100vh' justifyContent='center' alignItems='center'>
                <Card w={500}>
                    <CardHeader>
                        <Flex justifyContent='center'>
                            <Avatar size='2xl' mt={10} src={picture} />
                        </Flex>
                    </CardHeader>
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
                                <CardBody>
                                    <FormControl isInvalid={props.errors.picture && props.touched.picture}>
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
                                </CardBody>
                                <CardFooter>
                                    <Button w="full" type='submit' isLoading={props.isSubmitting}>Save</Button>
                                </CardFooter>
                            </Form>
                        )}
                    </Formik>
                </Card>
            </Flex>
        </Box>
    )
}

export default ProfilePicture