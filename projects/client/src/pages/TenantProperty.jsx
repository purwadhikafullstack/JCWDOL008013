import { Box, Button, Card, CardBody, Flex, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Image, Input, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Text, useDisclosure, useToast, VStack } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import API_URL from '../helper';
import ReactPaginate from 'react-paginate';
import { Select as ReactSelect } from 'chakra-react-select';
import { Form, Formik } from 'formik';
import { propertyValidation } from '../schemas';

const TenantProperty = (props) => {
    // State for data
    const [propertyData, setPropertyData] = useState([])
    const [groupedOptions, setGroupedOptions] = useState([])

    // State for pagination
    const [page, setPage] = useState(0)
    const [totalPage, setTotalPage] = useState(0)

    // State for sort, order, and filter
    const [sort, setSort] = useState('id_property')
    const [order, setOrder] = useState('ASC')
    const [query, setQuery] = useState('')
    const [keyword, setKeyword] = useState('')

    // Pop up notification
    const toast = useToast()

    // Pagination
    const handlePageClick = (data) => {
        setPage(data.selected)
        window.scrollTo({ top: 0, left: 0 })
    }

    // Filtering
    const searchButton = () => {
        setPage(0)
        setKeyword(query)
    }

    const resetButton = () => {
        setPage(0)
        setSort('id_property')
        setOrder('ASC')
        setKeyword('')
        setQuery('')
    }

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

    // Get property data
    const getProperty = () => {
        let getLocalStorage = localStorage.getItem('prw_login')
        if (getLocalStorage) {
            Axios.get(API_URL + `/properties/getproperty?page=${page}&keyword=${keyword}&sort=${sort}&order=${order}`, {
                headers: {
                    Authorization: `Bearer ${getLocalStorage}`
                }
            })
                .then((res) => {
                    setTotalPage(res.data.totalPage);
                    setPropertyData(res.data.rows);
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
        getProperty()
    }, [page, sort, order, keyword]);

    // Print property data
    const printProperty = () => {
        return propertyData.map((value) => {
            let propertyPicture = API_URL + value.picture
            return (
                <Link href={'/tenant/room?property=' + value.id_property} _hover={{ textDecoration: 'none' }} key={value.id_property}>
                    <Card mb={4} w={700} _hover={{ bg: 'gray.100' }}>
                        <Flex>
                            <Image src={propertyPicture} w={200} roundedLeft={5} />
                            <CardBody alignSelf='center'>
                                <Flex justifyContent='space-between'>
                                    <Box>
                                        <Text fontSize='2xl' fontWeight='bold' mb={2}>{value.name}</Text>
                                        <Text bg='blue.500' w='max-content' px={4} mb={2} rounded={20} color='white'>Hotel</Text>
                                        <Text color='gray.500'>{value.city.name}, {value.city.province}</Text>
                                    </Box>
                                </Flex>
                            </CardBody>
                        </Flex>
                    </Card>
                </Link>
            )
        })
    }

    // Modal new property
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Create new property
    const newProperty = (value) => {
        let getLocalStorage = localStorage.getItem('prw_login')
        if (getLocalStorage) {
            const formData = new FormData()
            formData.append('images', value.picture)
            formData.append('data', JSON.stringify({ name: value.name, address: value.address, id_city: value.city, description: value.description, rules: value.rules }))
            Axios.post(API_URL + '/properties/addproperty', formData,
                {
                    headers: {
                        Authorization: `Bearer ${getLocalStorage}`
                    }
                })
                .then((res) => {
                    toast({
                        title: `${res.data.message}`,
                        description: "You've successfully added new property",
                        status: 'success',
                        position: 'top',
                        duration: 9000,
                        isClosable: true,
                        onCloseComplete: () => getProperty()
                    });
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

    return (
        <Box py={8} bg='gray.100'>
            <Grid mb={4} justifyContent='center' templateColumns='repeat(3, 1fr)'>
                <GridItem justifySelf='flex-end'>
                    <Card w={250} mb={4}>
                        <CardBody>
                            <VStack>
                                <FormControl>
                                    <FormLabel>Sort your search results by:</FormLabel>
                                    <Select onChange={(e) => setSort(e.target.value)}>
                                        <option value='id_property'>ID</option>
                                        <option value='name'>Name</option>
                                        <option value='id_city'>City</option>
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
                            <FormLabel>Create new property:</FormLabel>
                            <Button w='full' onClick={onOpen}>Create</Button>
                            <Modal isOpen={isOpen} onClose={onClose} scrollBehavior='outside' isCentered>
                                <ModalOverlay />
                                <ModalContent>
                                    <ModalHeader>Create new property</ModalHeader>
                                    <ModalCloseButton />
                                    <Formik
                                        initialValues={{ name: '', address: '', city: '', picture: '', description: '', rules: '' }}
                                        validationSchema={propertyValidation}
                                        onSubmit={(values, actions) => {
                                            newProperty(values);
                                            onClose();
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
                        </CardBody>
                    </Card>
                </GridItem>
                <GridItem colSpan={2} ms={6}>
                    {printProperty()}
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

export default TenantProperty