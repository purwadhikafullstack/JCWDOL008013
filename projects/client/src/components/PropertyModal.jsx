import { Button, FormControl, FormErrorMessage, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from "@chakra-ui/react"
import { Form, Formik } from "formik"
import { Select as ReactSelect } from 'chakra-react-select';

const PropertyModal = (props) => {
    const groupedOptions = props.data.groupedOptions

    return (
        <Modal isOpen={props.data.isOpen} onClose={props.data.onClose} scrollBehavior='outside' isCentered>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{props.data.title}</ModalHeader>
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
                                    <FormControl isInvalid={props.errors.name && props.touched.name}>
                                        <FormLabel>Name</FormLabel>
                                        <Input
                                            id='name'
                                            value={props.values.name}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        <FormErrorMessage>{props.errors.name}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={props.errors.address && props.touched.address}>
                                        <FormLabel>Address</FormLabel>
                                        <Input
                                            id='address'
                                            value={props.values.address}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        <FormErrorMessage>{props.errors.address}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={props.errors.city && props.touched.city}>
                                        <FormLabel>City</FormLabel>
                                        <ReactSelect
                                            id='city'
                                            city='colors'
                                            options={groupedOptions}
                                            placeholder='Select City'
                                            onChange={(e) => props.setFieldValue('city', e.value)}
                                            onBlur={props.handleBlur}
                                        />
                                        <FormErrorMessage>{props.errors.city}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={props.errors.picture && props.touched.picture}>
                                        <FormLabel>Picture</FormLabel>
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
                                    <FormControl isInvalid={props.errors.description && props.touched.description}>
                                        <FormLabel>Description</FormLabel>
                                        <Input
                                            id='description'
                                            value={props.values.description}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        <FormErrorMessage>{props.errors.description}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={props.errors.rules && props.touched.rules}>
                                        <FormLabel>Rules</FormLabel>
                                        <Input
                                            id='rules'
                                            value={props.values.rules}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        <FormErrorMessage>{props.errors.rules}</FormErrorMessage>
                                    </FormControl>
                                </VStack>
                            </ModalBody>
                            <ModalFooter>
                                <Button type='submit' isLoading={props.isSubmitting}>Save</Button>
                            </ModalFooter>
                        </Form>
                    )}
                </Formik>
            </ModalContent>
        </Modal>
    )
}

export default PropertyModal