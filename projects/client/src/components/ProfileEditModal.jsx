import { Button, FormControl, FormErrorMessage, FormLabel, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, VStack } from "@chakra-ui/react"
import { Form, Formik } from "formik"

const ProfileEditModal = (props) => {
    return (
        <Modal isOpen={props.data.isOpen} onClose={props.data.onClose} scrollBehavior='outside' isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit profile</ModalHeader>
                <ModalCloseButton />
                <Formik
                    initialValues={props.data.initialValues}
                    validationSchema={props.data.validationSchema}
                    onSubmit={props.data.onSubmit}
                >
                    {props => (
                        <Form>
                            <ModalBody>
                                <VStack>
                                    <FormControl isInvalid={props.errors.username && props.touched.username}>
                                        <FormLabel>Name</FormLabel>
                                        <Input
                                            id='username'
                                            value={props.values.username}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        <FormErrorMessage>{props.errors.username}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={props.errors.email && props.touched.email}>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            id='email'
                                            value={props.values.email}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        <FormErrorMessage>{props.errors.email}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={props.errors.gender && props.touched.gender}>
                                        <FormLabel>Gender</FormLabel>
                                        <RadioGroup defaultValue={props.values.gender}>
                                            <HStack>
                                                <Radio
                                                    value='Male'
                                                    onChange={(e) => props.values.gender = e.target.value}
                                                >
                                                    Male
                                                </Radio>
                                                <Radio
                                                    value='Female'
                                                    onChange={(e) => props.values.gender = e.target.value}
                                                >
                                                    Female
                                                </Radio>
                                            </HStack>
                                        </RadioGroup>
                                        <FormErrorMessage>{props.errors.gender}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={props.errors.birthdate && props.touched.birthdate}>
                                        <FormLabel>Birthdate</FormLabel>
                                        <Input
                                            id='birthdate'
                                            type='date'
                                            value={props.values.birthdate}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        <FormErrorMessage>{props.errors.birthdate}</FormErrorMessage>
                                    </FormControl>
                                </VStack>
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="blue" width="full" type='submit' isLoading={props.isSubmitting}>Save</Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </ModalContent>
        </Modal>
    )
}

export default ProfileEditModal