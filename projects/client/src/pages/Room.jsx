import React, { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Card, CardBody, CardFooter, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Heading, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react';
import Axios from 'axios';
import API_URL from '../helper';
import { useLocation } from 'react-router-dom';
import ReactPaginate from "react-paginate"
import { Form, Formik } from 'formik';
import * as yup from "yup"

const Room = (props) => {
    // State for add and edit room
    const [idRoom, setIdRoom] = useState(0)

    // State for pagination
    const [page, setPage] = useState(0)
    const [totalPage, setTotalPage] = useState(0)

    // State for sort, order, and filter
    const [sort, setSort] = useState("id_room")
    const [order, setOrder] = useState("ASC")
    const [query, setQuery] = useState("")
    const [keyword, setKeyword] = useState("")

    // State for generate data
    const [roomData, setRoomData] = useState([])

    // Get id from query
    const { search } = useLocation();

    // Pop up notification
    const toast = useToast()

    // Get room data
    const getRoom = () => {
        Axios.get(API_URL + `/rooms/getroom${search}&page=${page}&keyword=${keyword}&sort=${sort}&order=${order}`)
            .then((res) => {
                console.log(res.data);
                setTotalPage(res.data.totalPage);
                setRoomData(res.data.rows);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        getRoom()
    }, [page, sort, order, keyword])

    // Validation for add and edit room form
    const validation = yup.object().shape({
        name: yup
            .string()
            .required("Required"),
        price: yup
            .number()
            .positive()
            .integer()
            .required("Required"),
        description: yup
            .string()
            .required("Required"),
        picture: yup
            .mixed()
            .required("Required")
            .test("fileFormat", "Unsupported format",
                value => value && [
                    "image/jpg",
                    "image/jpeg",
                    "image/gif",
                    "image/png"
                ].includes(value.type))
            .test("is-valid-size", "Max allowed size is 1MB",
                value => value && value.size <= 1048576)
    })

    // For modal
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()

    // For alert dialog
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const cancelRef = React.useRef()

    // Print room data
    const printRoom = () => {
        return roomData.map((value) => {
            let roomPicture = API_URL + value.picture
            return (
                <Card mb={6} key={value.id_room}>
                    <CardBody>
                        <Flex flexDirection={["column", null, "row"]} gap={6}>
                            <Image src={roomPicture} boxSize="150px" objectFit="cover" alignSelf="center" />
                            <Box>
                                <Text fontSize="4xl">{value.name}</Text>
                                <Text>{value.basePrice}</Text>
                                <Text>{value.description}</Text>
                            </Box>
                        </Flex>
                    </CardBody>
                    <Divider />
                    <CardFooter justifyContent="flex-end">
                        <Button colorScheme="teal" mr={4} onClick={() => {
                            onEditOpen()
                            setIdRoom(value.id_room)
                        }}>Edit</Button>
                        <Modal isOpen={isEditOpen} onClose={onEditClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Edit your room</ModalHeader>
                                <ModalCloseButton />
                                <Formik
                                    initialValues={{ name: "", price: "", description: "", picture: "" }}
                                    validationSchema={validation}
                                    onSubmit={(values, actions) => {
                                        editRoom(values);
                                        actions.resetForm();
                                    }}
                                >
                                    {props => (
                                        <Form>
                                            <ModalBody>
                                                <Grid gap={4}>
                                                    <FormControl isInvalid={props.errors.name && props.touched.name}>
                                                        <FormLabel>Name</FormLabel>
                                                        <Input
                                                            id="name"
                                                            value={props.values.name}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                        />
                                                        <FormErrorMessage>{props.errors.name}</FormErrorMessage>
                                                    </FormControl>
                                                    <FormControl isInvalid={props.errors.price && props.touched.price}>
                                                        <FormLabel>Price</FormLabel>
                                                        <Input
                                                            id="price"
                                                            type="number"
                                                            value={props.values.price}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                        />
                                                        <FormErrorMessage>{props.errors.price}</FormErrorMessage>
                                                    </FormControl>
                                                    <FormControl isInvalid={props.errors.description && props.touched.description}>
                                                        <FormLabel>Description</FormLabel>
                                                        <Input
                                                            id="description"
                                                            value={props.values.description}
                                                            onChange={props.handleChange}
                                                            onBlur={props.handleBlur}
                                                        />
                                                        <FormErrorMessage>{props.errors.description}</FormErrorMessage>
                                                    </FormControl>
                                                    <FormControl isInvalid={props.errors.picture && props.touched.picture}>
                                                        <FormLabel>Picture</FormLabel>
                                                        <Input
                                                            id="picture"
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                props.setFieldValue("picture", e.target.files[0]);
                                                            }}
                                                            onBlur={props.handleBlur}
                                                        />
                                                        <FormErrorMessage>{props.errors.picture}</FormErrorMessage>
                                                    </FormControl>
                                                </Grid>
                                            </ModalBody>
                                            <ModalFooter>
                                                <Button variant="ghost" colorScheme="red" mr={4} onClick={onEditClose}>Close</Button>
                                                <Button colorScheme="teal" isLoading={props.isSubmitting} type='submit'>Save</Button>
                                            </ModalFooter>
                                        </Form>
                                    )}
                                </Formik>
                            </ModalContent>
                        </Modal>
                        <Button variant="ghost" colorScheme="red" onClick={() => {
                            onDeleteOpen()
                            setIdRoom(value.id_room)
                        }}>Delete</Button>
                        <AlertDialog isOpen={isDeleteOpen}
                            leastDestructiveRef={cancelRef}
                            onClose={onDeleteClose}>
                            <AlertDialogOverlay>
                                <AlertDialogContent>
                                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                        Delete Room
                                    </AlertDialogHeader>
                                    <AlertDialogBody>Are you sure?</AlertDialogBody>
                                    <AlertDialogFooter>
                                        <Button ref={cancelRef} onClick={onDeleteClose}>
                                            Cancel
                                        </Button>
                                        <Button colorScheme='red' ml={3} onClick={deleteRoom}>
                                            Delete
                                        </Button>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialogOverlay>
                        </AlertDialog>
                    </CardFooter>
                </Card>
            )
        })
    }

    // Add room
    const addRoom = (value) => {
        const formData = new FormData()
        formData.append("images", value.picture)
        formData.append("data", JSON.stringify(
            {
                id_property: search.split("=")[1],
                name: value.name,
                price: value.price,
                description: value.description,
            }
        ))
        Axios.post(API_URL + "/rooms/addroom", formData)
            .then((res) => {
                toast({
                    title: `${res.data.message}`,
                    description: "You've successfully added new room",
                    status: "success",
                    position: "top",
                    duration: 9000,
                    isClosable: true,
                    onCloseComplete: () => getRoom()
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // Edit room
    const editRoom = (value) => {
        const formData = new FormData()
        formData.append("images", value.picture)
        formData.append("data", JSON.stringify(
            {
                id_room: idRoom,
                name: value.name,
                price: value.price,
                description: value.description,
            }
        ))
        Axios.patch(API_URL + "/rooms/editroom", formData)
            .then((res) => {
                toast({
                    title: `${res.data.message}`,
                    description: "You've successfully edited your room",
                    status: "success",
                    position: "top",
                    duration: 9000,
                    isClosable: true,
                    onCloseComplete: () => {
                        getRoom()
                        onEditClose()
                    }
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // Delete room
    const deleteRoom = () => {
        Axios.patch(API_URL + "/rooms/deleteroom", {
            id_room: idRoom,
        })
            .then((res) => {
                toast({
                    title: `${res.data.message}`,
                    description: "You've successfully deleted your room",
                    status: "error",
                    position: "top",
                    duration: 9000,
                    isClosable: true,
                    onCloseComplete: () => {
                        getRoom()
                        onDeleteClose()
                    }
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // Pagination
    const handlePageClick = (data) => {
        setPage(data.selected)
    }

    // Filtering
    const searchButton = () => {
        setPage(0)
        setKeyword(query)
    }

    const resetButton = () => {
        setPage(0)
        setSort("id_room")
        setOrder("ASC")
        setKeyword("")
        setQuery("")
    }

    return (
        <Box py={16}>
            <Flex justifyContent="center">
                <Box p={12} mx={6} border="2px" borderColor="gray.200" shadow="xl">
                    <Heading textAlign="center">Add New Room</Heading>
                    <Formik
                        initialValues={{ name: "", price: "", description: "", picture: "" }}
                        validationSchema={validation}
                        onSubmit={(values, actions) => {
                            addRoom(values);
                            actions.resetForm();
                        }}
                    >
                        {props => (
                            <Form>
                                <Grid mt={10} gap={4}>
                                    <FormControl isInvalid={props.errors.name && props.touched.name}>
                                        <FormLabel>Name</FormLabel>
                                        <Input
                                            id="name"
                                            value={props.values.name}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        <FormErrorMessage>{props.errors.name}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={props.errors.price && props.touched.price}>
                                        <FormLabel>Price</FormLabel>
                                        <Input
                                            id="price"
                                            type="number"
                                            value={props.values.price}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        <FormErrorMessage>{props.errors.price}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={props.errors.description && props.touched.description}>
                                        <FormLabel>Description</FormLabel>
                                        <Input
                                            id="description"
                                            value={props.values.description}
                                            onChange={props.handleChange}
                                            onBlur={props.handleBlur}
                                        />
                                        <FormErrorMessage>{props.errors.description}</FormErrorMessage>
                                    </FormControl>
                                    <FormControl isInvalid={props.errors.picture && props.touched.picture}>
                                        <FormLabel>Picture</FormLabel>
                                        <Input
                                            id="picture"
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                props.setFieldValue("picture", e.target.files[0]);
                                            }}
                                            onBlur={props.handleBlur}
                                        />
                                        <FormErrorMessage>{props.errors.picture}</FormErrorMessage>
                                    </FormControl>
                                    <Button
                                        mt={4}
                                        colorScheme='teal'
                                        isLoading={props.isSubmitting}
                                        type='submit'
                                    >
                                        Save
                                    </Button>
                                </Grid>
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Flex>
            <Box bg="gray.100" p={20} mt={20}>
                <Heading textAlign="center" mb={16}>Room List</Heading>
                <Grid templateColumns={["repeat(1, 1fr)", null, "repeat(3, 1fr)"]} gap={6}>
                    <GridItem>
                        <VStack bg="white" mb={8} p={12} border="2px" borderColor="gray.200" shadow="xl">
                            <FormControl>
                                <Select placeholder="Sort by" value={sort} onChange={(e) => setSort(e.target.value)}>
                                    <option value="id_room">ID</option>
                                    <option value="name">Name</option>
                                    <option value="basePrice">Price</option>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <Select placeholder="Order" value={order} onChange={(e) => setOrder(e.target.value)}>
                                    <option value="ASC">Ascending</option>
                                    <option value="DESC">Descending</option>
                                </Select>
                            </FormControl>
                            <Input placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
                            <Button w="full" onClick={searchButton}>Search</Button>
                            <Button w="full" onClick={resetButton}>Reset</Button>
                        </VStack>
                    </GridItem>
                    <GridItem colSpan={[1, null, 2]}>
                        {printRoom()}
                    </GridItem>
                </Grid>
                <ReactPaginate
                    previousLabel={"Previous"}
                    nextLabel={"Next"}
                    breakLabel={"..."}
                    pageCount={totalPage}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination justify-content-center"}
                    pageClassName={"page-item"}
                    pageLinkClassName={"page-link"}
                    previousClassName={"page-item"}
                    previousLinkClassName={"page-link"}
                    nextClassName={"page-item"}
                    nextLinkClassName={"page-link"}
                    breakClassName={"page-item"}
                    breakLinkClassName={"page-link"}
                    activeClassName={"active"}
                />
            </Box>
        </Box>
    )
}

export default Room