import React, { useEffect, useState } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, Card, CardBody, CardFooter, Divider, Flex, FormControl, FormLabel, Grid, GridItem, Heading, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, useDisclosure, useToast, VStack } from "@chakra-ui/react"
import Axios from "axios"
import API_URL from "../helper"
import ReactPaginate from "react-paginate"
import { useNavigate } from 'react-router-dom';

const Property = (props) => {
    // Redirect page
    const navigate = useNavigate()

    // Pop up notification
    const toast = useToast()

    // State for add and edit input
    const [name, setName] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [picture, setPicture] = useState(null)
    const [description, setDescription] = useState("")
    const [rules, setRules] = useState("")
    const [room, setRoom] = useState("")
    const [idProperty, setIdProperty] = useState(0)

    // State for generate data
    const [provinceData, setProvinceData] = useState([])
    const [cityData, setCityData] = useState([])
    const [propertyData, setPropertyData] = useState([])

    // State for pagination
    const [page, setPage] = useState(0)
    const [totalPage, setTotalPage] = useState(0)

    // State for sort, order, and filter
    const [sort, setSort] = useState("id_property")
    const [order, setOrder] = useState("ASC")
    const [search, setSearch] = useState("")
    const [keyword, setKeyword] = useState("")

    // For modal
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()

    // For alert dialog
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
    const cancelRef = React.useRef()

    // Get province data
    const getProvince = () => {
        Axios.get(API_URL + "/cities/getprovince")
            .then((res) => {
                console.log(res.data);
                setProvinceData(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        getProvince()
    }, [])

    // Get city data
    const getCity = (value) => {
        Axios.post(API_URL + "/cities/getcity", {
            province: value
        })
            .then((res) => {
                console.log(res.data);
                setCityData(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // Form for add and edit input
    const propertyForm = () => {
        return (
            <>
                <GridItem>
                    <FormControl>
                        <FormLabel>Name</FormLabel>
                        <Input onChange={(e) => setName(e.target.value)} />
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl>
                        <FormLabel>Address</FormLabel>
                        <Input onChange={(e) => setAddress(e.target.value)} />
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl>
                        <FormLabel>Province</FormLabel>
                        <Select placeholder="Select Province" onChange={(e) => {
                            getCity(e.target.value)
                        }}>
                            {
                                provinceData.map((value) => {
                                    return (
                                        <option value={value.province} key={value.province}>{value.province}</option>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl>
                        <FormLabel>City</FormLabel>
                        <Select placeholder="Select City" onChange={(e) => setCity(e.target.value)}>
                            {
                                cityData.map((value) => {
                                    return (
                                        <option value={value.id_city} key={value.name}>{value.name}</option>
                                    )
                                })
                            }
                        </Select>
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl>
                        <FormLabel>Picture</FormLabel>
                        <Input type="file" onChange={(e) => setPicture(e.target.files[0])} />
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl>
                        <FormLabel>Description</FormLabel>
                        <Input onChange={(e) => setDescription(e.target.value)} />
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl>
                        <FormLabel>Rules</FormLabel>
                        <Input onChange={(e) => setRules(e.target.value)} />
                    </FormControl>
                </GridItem>
                <GridItem>
                    <FormControl>
                        <FormLabel>Room</FormLabel>
                        <Input onChange={(e) => setRoom(e.target.value)} />
                    </FormControl>
                </GridItem>
            </>
        )
    }

    // Button add property
    const saveAddButton = () => {
        let getLocalStorage = localStorage.getItem("prw_login")
        if (getLocalStorage) {
            const formData = new FormData()
            formData.append("images", picture)
            formData.append("data", JSON.stringify({ name, address, id_city: city, description, rules, room }))
            Axios.post(API_URL + "/properties/addproperty", formData,
                {
                    headers: {
                        Authorization: `Bearer ${getLocalStorage}`
                    }
                })
                .then((res) => {
                    toast({
                        title: `${res.data.message}`,
                        description: "You've successfully added new property",
                        status: "success",
                        position: "top",
                        duration: 9000,
                        isClosable: true,
                        onCloseComplete: () => window.location.reload(false)
                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    // Get property data
    const getProperty = () => {
        let getLocalStorage = localStorage.getItem("prw_login")
        if (getLocalStorage) {
            Axios.get(API_URL + `/properties/getproperty?page=${page}&keyword=${keyword}&sort=${sort}&order=${order}`, {
                headers: {
                    Authorization: `Bearer ${getLocalStorage}`
                }
            })
                .then((res) => {
                    console.log(res.data);
                    setTotalPage(res.data.totalPage)
                    setPropertyData(res.data.rows);
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    useEffect(() => {
        getProperty()
    }, [page, sort, order, keyword])

    // Button edit property
    const saveEditButton = () => {
        const formData = new FormData()
        formData.append("images", picture)
        formData.append("data", JSON.stringify({ id_property: idProperty, name, address, id_city: city, description, rules, room }))
        Axios.patch(API_URL + "/properties/editproperty", formData)
            .then((res) => {
                toast({
                    title: `${res.data.message}`,
                    description: "You've successfully edited your property",
                    status: "success",
                    position: "top",
                    duration: 9000,
                    isClosable: true,
                    onCloseComplete: () => window.location.reload(false)
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // Button delete property
    const deleteButton = () => {
        Axios.patch(API_URL + "/properties/deleteproperty", {
            id_property: idProperty
        })
            .then((res) => {
                toast({
                    title: `${res.data.message}`,
                    description: "You've successfully deleted your property",
                    status: "error",
                    position: "top",
                    duration: 9000,
                    isClosable: true,
                    onCloseComplete: () => window.location.reload(false)
                })
            })
            .catch((err) => {
                console.log(err);
            })
    }

    // Print property data
    const printProperty = () => {
        return propertyData.map((value) => {
            let propertyPicture = API_URL + value.picture
            return (
                <Card mb={6} key={value.id_property}>
                    <CardBody>
                        <Flex flexDirection={["column", null, "row"]} gap={6}>
                            <Image src={propertyPicture} maxH={200} maxW={200} alignSelf="center" />
                            <Box>
                                <Text fontSize="4xl">{value.name}</Text>
                                <Text>{value.address}</Text>
                                <Text>{value.city.name}, {value.city.province}</Text>
                                <Text>{value.description}</Text>
                                <Text>{value.rules}</Text>
                                <Text>{value.room}</Text>
                            </Box>
                        </Flex>
                    </CardBody>
                    <Divider />
                    <CardFooter justifyContent="flex-end">
                        <Button mr={4} onClick={() => navigate(`/room?id=${value.id_property}`)}>Room</Button>
                        <Button colorScheme="teal" mr={4} onClick={() => {
                            onEditOpen()
                            setIdProperty(value.id_property)
                        }}>Edit</Button>
                        <Modal isOpen={isEditOpen} onClose={onEditClose} scrollBehavior="inside" blockScrollOnMount={false}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Edit your property</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Grid templateColumns="repeat(1, 1fr)" gap={4}>
                                        {propertyForm()}
                                    </Grid>
                                </ModalBody>
                                <ModalFooter>
                                    <Button variant="ghost" colorScheme="red" mr={4} onClick={onEditClose}>Close</Button>
                                    <Button colorScheme="teal" onClick={saveEditButton}>Save</Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                        <Button variant="ghost" colorScheme="red" onClick={() => {
                            onDeleteOpen()
                            setIdProperty(value.id_property)
                        }}>Delete</Button>
                        <AlertDialog isOpen={isDeleteOpen}
                            leastDestructiveRef={cancelRef}
                            onClose={onDeleteClose}>
                            <AlertDialogOverlay>
                                <AlertDialogContent>
                                    <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                                        Delete Property
                                    </AlertDialogHeader>
                                    <AlertDialogBody>Are you sure?</AlertDialogBody>
                                    <AlertDialogFooter>
                                        <Button ref={cancelRef} onClick={onDeleteClose}>
                                            Cancel
                                        </Button>
                                        <Button colorScheme='red' onClick={deleteButton} ml={3}>
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

    // Pagination
    const handlePageClick = (data) => {
        setPage(data.selected)
    }

    // Filtering
    const searchButton = () => {
        setPage(0)
        setKeyword(search)
    }

    return (
        <Box py={16}>
            <Flex justifyContent="center">
                <Box p={12} mx={6} border="2px" borderColor="gray.200" shadow="xl" maxW={1000} alignSelf="center">
                    <Heading textAlign="center">Add New Property</Heading>
                    <Grid mt={10} templateColumns={["repeat(1, 1fr)", null, "repeat(2, 1fr)"]} gap={4}>
                        {propertyForm()}
                    </Grid>
                    <Button mt={8} width="full" colorScheme="teal" onClick={saveAddButton}>Save</Button>
                </Box>
            </Flex>
            <Box bg="gray.100" p={20} mt={20}>
                <Heading textAlign="center" mb={16}>Property List</Heading>
                <Grid templateColumns={["repeat(1, 1fr)", null, "repeat(3, 1fr)"]} gap={6}>
                    <GridItem>
                        <VStack bg="white" mb={8} p={12} border="2px" borderColor="gray.200" shadow="xl">
                            <FormControl>
                                <Select placeholder="Sort by" onChange={(e) => setSort(e.target.value)}>
                                    <option value="id_property">ID</option>
                                    <option value="name">Name</option>
                                    <option value="id_city">City</option>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <Select placeholder="Order" onChange={(e) => setOrder(e.target.value)}>
                                    <option value="ASC">Ascending</option>
                                    <option value="DESC">Descending</option>
                                </Select>
                            </FormControl>
                            <Input placeholder="Search" onChange={(e) => setSearch(e.target.value)} />
                            <Button w="full" onClick={searchButton}>Search</Button>
                        </VStack>
                    </GridItem>
                    <GridItem colSpan={[1, null, 2]}>
                        {printProperty()}
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

export default Property