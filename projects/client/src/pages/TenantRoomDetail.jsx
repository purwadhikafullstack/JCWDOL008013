import { Box, Text, Flex, useDisclosure, Divider, useToast, Link, Card } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios'
import API_URL from '../helper';
import { roomValidation } from '../schemas';
import SpecialPriceTable from '../components/SpecialPriceTable';
import UnavailabilityTable from '../components/UnavailabilityTable';
import RoomModal from '../components/RoomModal';
import Pagination from '../components/Pagination';
import SpecialPriceModal from '../components/SpecialPriceModal';
import UnavailabilityModal from '../components/UnavailabilityModal';
import CalendarCard from '../components/CalendarCard';
import DeleteAlert from '../components/DeleteAlert';
import RoomDetailCard from '../components/RoomDetailCard';

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
    const [editPriceDates, setEditPriceDates] = useState([]);
    const [radioValue, setRadioValue] = useState('1');
    const [nominal, setNominal] = useState('');
    const [percent, setPercent] = useState('');
    const [priceData, setPriceData] = useState([]);
    const [priceId, setPriceId] = useState(0);
    const [pagePrice, setPagePrice] = useState(0);
    const [totalPagePrice, setTotalPagePrice] = useState(0);
    const [priceLimitData, setPriceLimitData] = useState([]);
    const [sortPrice, setSortPrice] = useState('id_special_price');
    const [orderPrice, setOrderPrice] = useState('ASC');


    // State for room unavailability
    const [unavailableDates, setUnavailableDates] = useState([]);
    const [editUnavailableDates, setEditUnavailableDates] = useState([]);
    const [unavailableData, setUnavailableData] = useState([]);
    const [unavailableId, setUnavailableId] = useState(0);
    const [pageUnavailability, setPageUnavailability] = useState(0);
    const [totalPageUnavailability, setTotalPageUnavailability] = useState(0);
    const [unavailableLimitData, setUnavailableLimitData] = useState([]);
    const [sortUnavailablility, setSortUnavailability] = useState('id_availability');
    const [orderUnavailability, setOrderUnavailability] = useState('ASC');

    // Pop up notification
    const toast = useToast();

    // Modal
    const { isOpen: isPriceOpen, onOpen: onPriceOpen, onClose: onPriceClose } = useDisclosure();
    const { isOpen: isEditPriceOpen, onOpen: onEditPriceOpen, onClose: onEditPriceClose } = useDisclosure();
    const { isOpen: isUnavailableOpen, onOpen: onUnavailableOpen, onClose: onUnavailableClose } = useDisclosure();
    const { isOpen: isEditUnavailableOpen, onOpen: onEditUnavailableOpen, onClose: onEditUnavailableClose } = useDisclosure();
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    // Alert dialog
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const { isOpen: isDeletePriceOpen, onOpen: onDeletePriceOpen, onClose: onDeletePriceClose } = useDisclosure();
    const { isOpen: isDeleteUnavailableOpen, onOpen: onDeleteUnavailableOpen, onClose: onDeleteUnavailableClose } = useDisclosure();
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
            let res = await Axios.get(API_URL + `/unavailabilities/getunavailability?${search.split('&')[1]}&page=${pageUnavailability}&sort=${sortUnavailablility}&order=${orderUnavailability}`);
            setUnavailableData(res.data.allData);
            setTotalPageUnavailability(res.data.totalPage);
            setUnavailableLimitData(res.data.limitData);

        } catch (error) {
            console.log(error);
        }
    }

    // Get special price
    const getSpecialPrice = async () => {
        try {
            let res = await Axios.get(API_URL + `/specialprices/getspecialprice?${search.split('&')[1]}&page=${pagePrice}&sort=${sortPrice}&order=${orderPrice}`);
            setPriceData(res.data.allData);
            setTotalPagePrice(res.data.totalPage);
            setPriceLimitData(res.data.limitData);
        } catch (error) {
            console.log(error);
        }
    }

    // Edit unavailable date
    const editUnavailability = async () => {
        try {
            let start_date = new Date(editUnavailableDates[0].getTime() - (editUnavailableDates[0].getTimezoneOffset() * 60000)).toISOString();
            let end_date = new Date(editUnavailableDates[1].getTime() - (editUnavailableDates[1].getTimezoneOffset() * 60000));
            end_date.setDate(end_date.getDate() + 1);
            end_date.toISOString();
            let res = await Axios.patch(API_URL + '/unavailabilities/editunavailability', { id_availability: unavailableId, start_date, end_date });
            toast({
                title: `${res.data.message}`,
                description: "You've successfully edited unavailable dates",
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

    // Delete unavailable date
    const deleteUnavailability = async () => {
        try {
            let res = await Axios.post(API_URL + "/unavailabilities/deleteunavailability", { id_availability: unavailableId })
            toast({
                title: `${res.data.message}`,
                description: "You've successfully deleted unavailable dates",
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

    // Edit special price
    const editSpecialPrice = async () => {
        try {
            let start_date = new Date(editPriceDates[0].getTime() - (editPriceDates[0].getTimezoneOffset() * 60000)).toISOString();
            let end_date = new Date(editPriceDates[1].getTime() - (editPriceDates[1].getTimezoneOffset() * 60000));
            end_date.setDate(end_date.getDate() + 1);
            end_date.toISOString();
            let res = await Axios.patch(API_URL + '/specialprices/editspecialprice', { id_special_price: priceId, start_date, end_date, nominal, percent });
            toast({
                title: `${res.data.message}`,
                description: "You've successfully edited special price",
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

    // Delete special price
    const deleteSpecialPrice = async () => {
        try {
            let res = await Axios.post(API_URL + '/specialprices/deletespecialprice', { id_special_price: priceId });
            toast({
                title: `${res.data.message}`,
                description: "You've successfully deleted special price",
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

    // Unavailability table pagination
    const handlePageClickUnavailability = (data) => {
        setPageUnavailability(data.selected);
    }

    // Special price table pagination
    const handlePageClickPrice = (data) => {
        setPagePrice(data.selected);
    }

    useEffect(() => {
        getPropertyName();
        getDetail();
        getSpecialPrice();
    }, []);

    useEffect(() => {
        getUnavailability();
        getSpecialPrice();
    }, [pageUnavailability, sortUnavailablility, orderUnavailability, pagePrice, sortPrice, orderPrice]);

    return (
        <Box ms={[0, null, 60]} p={8} bg='gray.100'>
            <Flex flexDirection='column' alignItems='center'>
                <Text fontSize='sm' color='gray.500' fontWeight='semibold'>
                    <Link href='/admin/property' _hover={{ textDecoration: 'none' }}>Property </Link>
                    /
                    <Link href={'/admin/room' + search.split('&')[0]} _hover={{ textDecoration: 'none' }}> {propertyName} </Link>
                    / {name}
                </Text>
                <RoomDetailCard data={{
                    name, picture, description, price, onPriceOpen, onUnavailableOpen, onEditOpen, onDeleteOpen,
                }} />
                <SpecialPriceModal data={{
                    title: 'Set room special price', isOpen: isPriceOpen, onClose: onPriceClose, selectedDates: priceDates, onDateChange: setPriceDates, nominal, percent, value: radioValue, setValue: (e) => {
                        setRadioValue(e.target.value)
                        setNominal('');
                        setPercent('');
                    }, onChangeNominal: (e) => {
                        setNominal(e.target.value);
                        setPercent(null);
                    }, onChangePercent: (e) => {
                        setPercent(e.target.value);
                        setNominal(null);
                    }, onClick: () => {
                        onPriceClose();
                        specialPrice();
                    }
                }} />
                <UnavailabilityModal data={{
                    title: 'Set room unavailability', isOpen: isUnavailableOpen, onClose: onUnavailableClose, selectedDates: unavailableDates, onDateChange: setUnavailableDates, onClick: () => {
                        onUnavailableClose();
                        unavailability();
                    }
                }} />
                <RoomModal data={{
                    title: 'Edit your room', isOpen: isEditOpen, onClose: onEditClose, initialValues: { name, price, description, picture: '' }, validationSchema: roomValidation, onSubmit: (values, actions) => {
                        onEditClose();
                        editRoom(values);
                    }
                }} />
                <DeleteAlert data={{
                    title: 'Delete room', isOpen: isDeleteOpen, leastDestructiveRef: cancelRef, onClose: onDeleteClose, onClick: () => {
                        onDeleteClose();
                        deleteRoom();
                    }
                }} />
            </Flex>
            <Card px={8} py={16} mt={8}>
                <CalendarCard data={{ unavailability: unavailableData, specialPrice: priceData }} />
            </Card>
            <Card px={8} py={16} mt={8}>
                <UnavailabilityTable data={{
                    unavailableLimitData, pagination: <Pagination data={{ totalPage: totalPageUnavailability, handlePageClick: handlePageClickUnavailability }} />, edit: (value) => {
                        setUnavailableId(value);
                        onEditUnavailableOpen();
                    }, delete: (value) => {
                        setUnavailableId(value);
                        onDeleteUnavailableOpen();
                    }, sort: (value) => {
                        setSortUnavailability(value);
                    }, order: (value) => {
                        setOrderUnavailability(value);
                    }
                }} />
                <UnavailabilityModal data={{
                    title: 'Edit room unavailability', isOpen: isEditUnavailableOpen, onClose: onEditUnavailableClose, selectedDates: editUnavailableDates, onDateChange: setEditUnavailableDates, onClick: () => {
                        onEditUnavailableClose();
                        editUnavailability();
                    }
                }} />
                <DeleteAlert data={{
                    title: 'Delete unavailable dates', isOpen: isDeleteUnavailableOpen, leastDestructiveRef: cancelRef, onClose: onDeleteUnavailableClose, onClick: () => {
                        onDeleteUnavailableClose();
                        deleteUnavailability();
                    }
                }} />
            </Card>
            <Card px={8} py={16} mt={8}>
                <SpecialPriceTable data={{
                    priceLimitData, pagination: <Pagination data={{ totalPage: totalPagePrice, handlePageClick: handlePageClickPrice }} />, edit: (value) => {
                        setPriceId(value);
                        onEditPriceOpen();
                    }, delete: (value) => {
                        setPriceId(value);
                        onDeletePriceOpen();
                    }, sort: (value) => {
                        setSortPrice(value);
                    }, order: (value) => {
                        setOrderPrice(value);
                    }
                }} />
                <SpecialPriceModal data={{
                    title: 'Edit room special price', isOpen: isEditPriceOpen, onClose: onEditPriceClose, selectedDates: editPriceDates, onDateChange: setEditPriceDates, nominal, percent, value: radioValue, setValue: (e) => {
                        setRadioValue(e.target.value)
                        setNominal('');
                        setPercent('');
                    }, onChangeNominal: (e) => {
                        setNominal(e.target.value);
                        setPercent(null);
                    }, onChangePercent: (e) => {
                        setPercent(e.target.value);
                        setNominal(null);
                    }, onClick: () => {
                        onEditPriceClose();
                        editSpecialPrice();
                    }
                }} />
                <DeleteAlert data={{
                    title: 'Delete special price dates', isOpen: isDeletePriceOpen, leastDestructiveRef: cancelRef, onClose: onDeletePriceClose, onClick: () => {
                        onDeletePriceClose();
                        deleteSpecialPrice();
                    }
                }} />
            </Card>
        </Box>
    )
}

export default TenantRoomDetail