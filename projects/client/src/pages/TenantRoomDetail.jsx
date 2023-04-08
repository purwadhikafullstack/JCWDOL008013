import { Box, Card, CardHeader, CardBody, CardFooter, Text, Flex, Image, Button, useDisclosure, Divider, ButtonGroup, useToast, Link, Grid, GridItem } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios'
import API_URL from '../helper';
import { roomValidation } from '../schemas';
import SpecialPriceTable from '../components/SpecialPriceTable';
import UnavailabilityTable from '../components/UnavailabilityTable';
import EditRoomModal from '../components/EditRoomModal';
import DeleteRoomAlert from '../components/DeleteRoomAlert';
import Pagination from '../components/Pagination';
import SpecialPriceModal from '../components/SpecialPriceModal';
import UnavailabilityModal from '../components/UnavailabilityModal';
import CalendarCard from '../components/CalendarCard';

const TenantRoomDetail = (props) => {
    // Redirect page
    const navigate = useNavigate();

    // Get query
    const { search } = useLocation();

    // State for property name
    const [propertyName, setPropertyName] = useState('');

    // State for room detail
    const [name, setName] = useState('');
    const [picture, setPicture] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);

    // State for room special price
    const [priceDates, setPriceDates] = useState([]);
    const [nominal, setNominal] = useState(0);
    const [percent, setPercent] = useState(0);
    const [priceData, setPriceData] = useState([]);

    // State for room unavailability
    const [unavailableDates, setUnavailableDates] = useState([new Date(), new Date()]);
    const [unavailableData, setUnavailableData] = useState([]);

    // Pop up notification
    const toast = useToast();

    // Modal
    const { isOpen: isPriceOpen, onOpen: onPriceOpen, onClose: onPriceClose } = useDisclosure();
    const { isOpen: isUnavailableOpen, onOpen: onUnavailableOpen, onClose: onUnavailableClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    // Alert dialog
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = React.useRef();

    // Get property name
    const getPropertyName = async () => {
        try {
            let getLocalStorage = localStorage.getItem('prw_login');
            if (getLocalStorage) {
                let res = await Axios.get(API_URL + `/properties/getpropertydetail${search.split('&')[0]}`, { headers: { Authorization: `Bearer ${getLocalStorage}` } });
                setPropertyName(res.data.name);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Get room detail
    const getDetail = async () => {
        try {
            let res = await Axios.get(API_URL + `/rooms/detail${search}`);
            setName(res.data[0].name);
            setPicture(API_URL + res.data[0].picture);
            setDescription(res.data[0].description);
            setPrice(res.data[0].basePrice);
        } catch (error) {
            console.log(error);
        }
    }

    // Edit room
    const editRoom = async (value) => {
        try {
            const formData = new FormData();
            formData.append('images', value.picture);
            formData.append('data', JSON.stringify({ id_room: search.split('=')[2], name: value.name, price: value.price, description: value.description }));
            let res = await Axios.patch(API_URL + '/rooms/editroom', formData);
            toast({
                title: `${res.data.message}`,
                description: "You've successfully edited your room",
                status: 'success',
                position: 'top',
                duration: 9000,
                isClosable: true,
                onCloseComplete: () => {
                    getDetail()
                    onEditClose()
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Delete room
    const deleteRoom = async () => {
        try {
            let res = await Axios.patch(API_URL + '/rooms/deleteroom', { id_room: search.split('=')[2] });
            toast({
                title: `${res.data.message}`,
                description: "You've successfully deleted your room",
                status: 'error',
                position: 'top',
                duration: 9000,
                isClosable: true,
                onCloseComplete: () => {
                    navigate(`/tenant/room${search.split('&')[0]}`)
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Set room unavailability
    const unavailability = async () => {
        try {
            let start_date = new Date(unavailableDates[0].getTime() - (unavailableDates[0].getTimezoneOffset() * 60000)).toISOString();
            let end_date = new Date(unavailableDates[1].getTime() - (unavailableDates[1].getTimezoneOffset() * 60000));
            end_date.setDate(end_date.getDate() + 1);
            end_date.toISOString();
            let res = await Axios.post(API_URL + '/unavailabilities/unavailability', { id_room: search.split('=')[2], start_date, end_date });
            toast({
                title: `${res.data.message}`,
                description: "You've successfully set unavailable dates",
                status: 'success',
                position: 'top',
                duration: 9000,
                isClosable: true,
                onCloseComplete: () => window.location.reload(false)
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Set room special price
    const specialPrice = async () => {
        try {
            let start_date = new Date(priceDates[0].getTime() - (priceDates[0].getTimezoneOffset() * 60000)).toISOString();
            let end_date = new Date(priceDates[1].getTime() - (priceDates[1].getTimezoneOffset() * 60000));
            end_date.setDate(end_date.getDate() + 1);
            end_date.toISOString();
            let res = await Axios.post(API_URL + '/specialprices/setprice', { id_room: search.split('=')[2], start_date, end_date, nominal, percent });
            toast({
                title: `${res.data.message}`,
                description: "You've successfully set special price",
                status: 'success',
                position: 'top',
                duration: 9000,
                isClosable: true,
                onCloseComplete: () => window.location.reload(false)
            });
        } catch (error) {
            console.log(error);
        }
    }

    // Get unavailable date
    const getUnavailability = async () => {
        try {
            let res = await Axios.get(API_URL + `/unavailabilities/getunavailability?${search.split('&')[1]}`);
            setUnavailableData(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    // Get special price
    const getSpecialPrice = async () => {
        try {
            let res = await Axios.get(API_URL + `/specialprices/getspecialprice?${search.split('&')[1]}`);
            setPriceData(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getPropertyName();
        getDetail();
        getUnavailability();
        getSpecialPrice();
    }, [])

    return (
        <Box px={16} py={8} bg='gray.100'>
            <Flex mb={8} flexDirection='column' alignItems='center'>
                <Text mb={8} fontSize='sm' color='gray.500' fontWeight='semibold'>
                    <Link href='/tenant/property' _hover={{ textDecoration: 'none' }}>Property </Link>
                    /
                    <Link href={'/tenant/room' + search.split('&')[0]} _hover={{ textDecoration: 'none' }}> {propertyName} </Link>
                    / {name}
                </Text>
                <Card maxW={700}>
                    <CardHeader>
                        <Text fontSize='2xl' fontWeight='bold' mb={2}>{name}</Text>
                        <Text bg='green.500' w='max-content' px={4} mb={2} rounded={20} color='white'>Room</Text>
                    </CardHeader>
                    <CardBody>
                        <Flex justifyContent='center' mb={8}>
                            <Image src={picture} rounded={16} />
                        </Flex>
                        <Text fontWeight='bold'>Description:</Text>
                        <Text mb={2}>{description}</Text>
                        <Text fontWeight='bold'>Price:</Text>
                        <Text color='blue.500' fontWeight='bold'>Rp {price.toLocaleString('id')}</Text>
                        <Text color='gray.500'>/ room / night(s)</Text>
                    </CardBody>
                    <Divider />
                    <CardFooter justifyContent='flex-end'>
                        <ButtonGroup>
                            <Button onClick={onPriceOpen}>Set room special price</Button>
                            <SpecialPriceModal data={{
                                isOpen: isPriceOpen, onClose: onPriceClose, selectedDates: priceDates, onDateChange: setPriceDates, onChangeNominal: (e) => setNominal(e.target.value), onChangePercent: (e) => setPercent(e.target.value), onClick: () => {
                                    onPriceClose()
                                    specialPrice()
                                }
                            }} />
                            <Button onClick={onUnavailableOpen}>Set room unavailability</Button>
                            <UnavailabilityModal data={{
                                isOpen: isUnavailableOpen, onClose: onUnavailableClose, selectedDates: unavailableDates, onDateChange: setUnavailableDates, onClick: () => {
                                    onUnavailableClose()
                                    unavailability()
                                }
                            }} />
                            <Button onClick={onEditOpen}>Edit</Button>
                            <EditRoomModal data={{
                                isOpen: isEditOpen, onClose: onEditClose, initialValues: { name, price, description, picture: '' }, validationSchema: roomValidation, onSubmit: (values, actions) => {
                                    onEditClose();
                                    editRoom(values);
                                }
                            }} />
                            <Button onClick={onDeleteOpen}>Delete</Button>
                            <DeleteRoomAlert data={{
                                isOpen: isDeleteOpen, leastDestructiveRef: cancelRef, onClose: onDeleteClose, onClick: () => {
                                    onDeleteClose();
                                    deleteRoom();
                                }
                            }} />
                        </ButtonGroup>
                    </CardFooter>
                </Card>
            </Flex>
            <Grid justifyContent='center' templateColumns='repeat(2, 1fr)' gap={6}>
                <GridItem>
                    <CalendarCard data={{ events: unavailableData.concat(priceData) }} />
                </GridItem>
                <GridItem>
                    <UnavailabilityTable data={{ unavailableData, pagination: <Pagination /> }} />
                    <SpecialPriceTable data={{ priceData, pagination: <Pagination /> }} />
                </GridItem>
            </Grid>
        </Box>
    )
}

export default TenantRoomDetail