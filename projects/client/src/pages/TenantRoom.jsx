import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Box, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Divider, Flex, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Icon, Image, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios'
import API_URL from '../helper';
import { IoLocationSharp } from 'react-icons/io5'
import { Select as ReactSelect } from 'chakra-react-select';
import { Form, Formik } from 'formik';
import ReactPaginate from 'react-paginate';
import { propertyValidation, roomValidation } from '../schemas';

const TenantRoom = (props) => {
    // Redirect page
    const navigate = useNavigate()

    // Get query
    const { search } = useLocation();

    // State for data
    const [roomData, setRoomData] = useState([])
    const [groupedOptions, setGroupedOptions] = useState([])

    // State for property detail
    const [name, setName] = useState('')
    const [address, setAddress] = useState('')
    const [city, setCity] = useState('')
    const [picture, setPicture] = useState('')
    const [description, setDescription] = useState('')
    const [rules, setRules] = useState('')

    // State for pagination
    const [page, setPage] = useState(0)
    const [totalPage, setTotalPage] = useState(0)

    // State for sort, order, and filter
    const [sort, setSort] = useState('id_room')
    const [order, setOrder] = useState('ASC')
    const [query, setQuery] = useState('')
    const [keyword, setKeyword] = useState('')

    // Pagination
    const handlePageClick = (data) => {
        setPage(data.selected)
        window.scrollTo({ top: 980, left: 0 })
    }

    // Filtering
    const searchButton = () => {
        setPage(0)
        setKeyword(query)
    }

    const resetButton = () => {
        setPage(0)
        setSort('id_room')
        setOrder('ASC')
        setKeyword('')
        setQuery('')
    }

    // Pop up notification
    const toast = useToast()

    // Modal edit property
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    // Modal create new room
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()

    // For alert dialog
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = React.useRef()

    // Get property detail
    const propertyDetail = () => {
        let getLocalStorage = localStorage.getItem('prw_login')
        if (getLocalStorage) {
            Axios.get(API_URL + `/properties/getpropertydetail${search}`, {
                headers: {
                    Authorization: `Bearer ${getLocalStorage}`
                }
            })
                .then((res) => {
                    setName(res.data.name);
                    setAddress(res.data.address);
                    setCity(res.data.city.name + ", " + res.data.city.province);
                    setPicture(API_URL + res.data.picture);
                    setDescription(res.data.description);
                    setRules(res.data.rules);
                })
                .catch((err) => {
                    console.log(err);
                    if (!err.response.data.success) {
                        alert(err.response.data.message);
                    }
                    console.log('check error', err);
                })
        }
    }

    useEffect(() => {
        propertyDetail()
    }, [])

    // Get city data
    const loadCity = () => {
        Axios.get(API_URL + `/cities`)
            .then((res) => {
                let group = []
                res.data.map(x => {
                    if (group.filter(r => r.label == x.province).length > 0) {
                        group[group.findIndex(r => r.label == x.province)].options.push({ value: x.id_city, label: x.name })
                    } else {
                        group.push({ label: x.province, options: [{ value: x.id_city, label: x.name }] })
                    }
                })
                setGroupedOptions(group)
            })
            .catch((err) => {
                console.log(err)
                if (!err.response.data.success) {
                    alert(err.response.data.message);
                }
                console.log('check error', err);
            });
    }

    useEffect(() => {
        loadCity()
    }, [])

    // Edit property
    const editProperty = (value) => {
        const formData = new FormData()
        formData.append('images', value.picture)
        formData.append('data', JSON.stringify({ id_property: search.split('=')[1], name: value.name, address: value.address, id_city: value.city, description: value.description, rules: value.rules }))
        Axios.patch(API_URL + '/properties/editproperty', formData)
            .then((res) => {
                toast({
                    title: `${res.data.message}`,
                    description: "You've successfully edited your property",
                    status: 'success',
                    position: 'top',
                    duration: 9000,
                    isClosable: true,
                    onCloseComplete: () => propertyDetail()
                })
            })
            .catch((err) => {
                console.log(err)
                if (!err.response.data.success) {
                    alert(err.response.data.message);
                }
                console.log('check error', err);
            })
    }

    // Delete property
    const deleteProperty = () => {
        Axios.patch(API_URL + '/properties/deleteproperty', {
            id_property: search.split('=')[1]
        })
            .then((res) => {
                toast({
                    title: `${res.data.message}`,
                    description: "You've successfully deleted your property",
                    status: 'error',
                    position: 'top',
                    duration: 9000,
                    isClosable: true,
                    onCloseComplete: () => navigate('/tenant/property')
                })
            })
            .catch((err) => {
                console.log(err)
                if (!err.response.data.success) {
                    alert(err.response.data.message);
                }
                console.log('check error', err);
            })
    }

    // Create new room
    const newRoom = (value) => {
        const formData = new FormData()
        formData.append('images', value.picture)
        formData.append('data', JSON.stringify(
            {
                id_property: search.split('=')[1],
                name: value.name,
                price: value.price,
                description: value.description,
            }
        ))
        Axios.post(API_URL + '/rooms/addroom', formData)
            .then((res) => {
                toast({
                    title: `${res.data.message}`,
                    description: "You've successfully created new room",
                    status: 'success',
                    position: 'top',
                    duration: 9000,
                    isClosable: true,
                    onCloseComplete: () => getRoom()
                })
            })
            .catch((err) => {
                console.log(err);
                if (!err.response.data.success) {
                    alert(err.response.data.message);
                }
                console.log('check error', err);
            })
    }

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
                if (!err.response.data.success) {
                    alert(err.response.data.message);
                }
                console.log('check error', err);
            })
    }

    useEffect(() => {
        getRoom()
    }, [page, sort, order, keyword])

    // Print room data
    const printRoom = () => {
        return roomData.map((value) => {
            let roomPicture = API_URL + value.picture
            return (
                <Link href={'/tenant/room/detail' + search + '&room=' + value.id_room} _hover={{ textDecoration: 'none' }} key={value.id_room}>
                    <Card mb={4} w={700} _hover={{ bg: 'gray.100' }}>
                        <Flex>
                            <Image src={roomPicture} w={200} roundedLeft={5} />
                            <CardBody alignSelf='center'>
                                <Flex justifyContent='space-between'>
                                    <Box>
                                        <Text fontSize='2xl' fontWeight='bold' mb={2}>{value.name}</Text>
                                        <Text bg='green.500' w='max-content' px={4} mb={2} rounded={20} color='white'>Room</Text>
                                        <Text color='blue.500' fontWeight='bold'>Rp {value.basePrice.toLocaleString('id')}</Text>
                                        <Text color='gray.500'>/ room / night(s)</Text>
                                    </Box>
                                </Flex>
                            </CardBody>
                        </Flex>
                    </Card>
                </Link>
            )
        })
    }

    return (
        <Box px={16} py={8} bg='gray.100'>
            <Flex flexDirection='column' alignItems='center' mb={8}>
                <Text mb={8} fontSize='sm' color='gray.500' fontWeight='semibold'>
                    <Link href='/tenant/property' _hover={{ textDecoration: 'none' }}>Property </Link>
                    / {name}
                </Text>
                <Card maxW={700}>
                    <CardHeader>
                        <Text fontSize='2xl' fontWeight='bold' mb={2}>{name}</Text>
                        <Text bg='blue.500' w='max-content' px={4} mb={2} rounded={20} color='white'>Hotel</Text>
                        <Flex>
                            <Icon as={IoLocationSharp} boxSize={6} me={1} mt={0.5} />
                            <Text color='gray.500' fontSize='lg'>{address}, {city}</Text>
                        </Flex>
                    </CardHeader>
                    <CardBody>
                        <Flex justifyContent='center' mb={8}>
                            <Image src={picture} rounded={16} />
                        </Flex>
                        <Text fontWeight='bold'>Description:</Text>
                        <Text mb={2}>{description}</Text>
                        <Text fontWeight='bold'>Rules:</Text>
                        <Text>{rules}</Text>
                    </CardBody>
                    <Divider />
                    <CardFooter justifyContent='flex-end'>
                        <ButtonGroup>
                            <Button onClick={onEditOpen}>Edit</Button>
                            <Modal isOpen={isEditOpen} onClose={onEditClose} scrollBehavior='outside' isCentered>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Edit your property</ModalHeader>
                                    <ModalCloseButton />
                                    <Formik
                                        initialValues={{ name, address, city: '', picture: '', description, rules }}
                                        validationSchema={propertyValidation}
                                        onSubmit={(values, actions) => {
                                            editProperty(values);
                                            onEditClose();
                                        }}
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
                            <Button onClick={onDeleteOpen}>Delete</Button>
                            <AlertDialog isOpen={isDeleteOpen} leastDestructiveRef={cancelRef} onClose={onDeleteClose}>
                                <AlertDialogOverlay>
                                    <AlertDialogContent>
                                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>Delete property</AlertDialogHeader>
                                        <AlertDialogBody>Are you sure?</AlertDialogBody>
                                        <AlertDialogFooter>
                                            <ButtonGroup>
                                                <Button ref={cancelRef} onClick={onDeleteClose}>
                                                    Cancel
                                                </Button>
                                                <Button colorScheme='red' onClick={() => {
                                                    onDeleteClose();
                                                    deleteProperty();
                                                }}>
                                                    Delete
                                                </Button>
                                            </ButtonGroup>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialogOverlay>
                            </AlertDialog>
                        </ButtonGroup>
                    </CardFooter>
                </Card>
            </Flex>
            <Grid mb={4} justifyContent='center' templateColumns='repeat(3, 1fr)'>
                <GridItem justifySelf='flex-end'>
                    <Card w={250} mb={4}>
                        <CardBody>
                            <VStack>
                                <FormControl>
                                    <FormLabel>Sort your search results by:</FormLabel>
                                    <Select onChange={(e) => setSort(e.target.value)}>
                                        <option value='id_room'>ID</option>
                                        <option value='name'>Name</option>
                                        <option value='basePrice'>Price</option>
                                    </Select>
                                </FormControl>
                                <FormControl>
                                    <FormLabel>Order by:</FormLabel>
                                    <Select onChange={(e) => setOrder(e.target.value)}>
                                        <option value='ASC'>Ascending</option>
                                        <option value='DESC'>Descending</option>
                                    </Select>
                                </FormControl>
                            </VStack>
                        </CardBody>
                    </Card>
                    <Card w={250} mb={4}>
                        <CardBody>
                            <VStack spacing={4}>
                                <FormControl>
                                    <FormLabel>Search:</FormLabel>
                                    <Input placeholder='Hotel or city' value={query} onChange={(e) => setQuery(e.target.value)} />
                                </FormControl>
                                <Button w='full' onClick={searchButton}>Search</Button>
                                <Button w='full' onClick={resetButton}>Reset</Button>
                            </VStack>
                        </CardBody>
                    </Card>
                    <Card w={250}>
                        <CardBody>
                            <FormLabel>Create new room:</FormLabel>
                            <Button w='full' onClick={onCreateOpen}>Create</Button>
                            <Modal isOpen={isCreateOpen} onClose={onCreateClose} scrollBehavior='outside' isCentered>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Create new room</ModalHeader>
                                    <ModalCloseButton />
                                    <Formik
                                        initialValues={{ name: '', price: '', description: '', picture: '' }}
                                        validationSchema={roomValidation}
                                        onSubmit={(values, actions) => {
                                            onCreateClose();
                                            newRoom(values);
                                        }}
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
                                                        <FormControl isInvalid={props.errors.price && props.touched.price}>
                                                            <FormLabel>Price</FormLabel>
                                                            <Input
                                                                id='price'
                                                                type='number'
                                                                value={props.values.price}
                                                                onChange={props.handleChange}
                                                                onBlur={props.handleBlur}
                                                            />
                                                            <FormErrorMessage>{props.errors.price}</FormErrorMessage>
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
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem colSpan={2} ms={6}>
                    {printRoom()}
                </GridItem>
            </Grid>
            <ReactPaginate
                previousLabel={'Previous'}
                nextLabel={'Next'}
                breakLabel={'...'}
                pageCount={totalPage}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                containerClassName={'pagination justify-content-center'}
                pageClassName={'page-item'}
                pageLinkClassName={'page-link'}
                previousClassName={'page-item'}
                previousLinkClassName={'page-link'}
                nextClassName={'page-item'}
                nextLinkClassName={'page-link'}
                breakClassName={'page-item'}
                breakLinkClassName={'page-link'}
                activeClassName={'active'}
            />
        </Box>
    )
}

export default TenantRoom