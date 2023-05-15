import { Box, Flex, Grid, GridItem, Link, Text, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Axios from 'axios'
import API_URL from '../helper';
import { propertyValidation, roomValidation } from '../schemas';
import PropertyModal from '../components/PropertyModal';
import DeleteAlert from '../components/DeleteAlert';
import PropertyDetailCard from '../components/PropertyDetailCard';
import SortOrderCard from '../components/SortOrderCard';
import SearchCard from '../components/SearchCard';
import RoomModal from '../components/RoomModal';
import Pagination from '../components/Pagination';
import RoomListCard from '../components/RoomListCard';
import CreatePropertyRoomCard from '../components/CreatePropertyRoomCard';

const TenantRoom = (props) => {
    // Redirect page
    const navigate = useNavigate();

    // Get query
    const { search } = useLocation();

    // State for data
    const [roomData, setRoomData] = useState([]);
    const [groupedOptions, setGroupedOptions] = useState([]);

    // State for property detail
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [picture, setPicture] = useState('');
    const [description, setDescription] = useState('');
    const [rules, setRules] = useState('');

    // State for pagination
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);

    // State for sort, order, and filter
    const [sort, setSort] = useState('id_room');
    const [order, setOrder] = useState('ASC');
    const [query, setQuery] = useState('');
    const [keyword, setKeyword] = useState('');

    // Pagination
    const handlePageClick = (data) => {
        setPage(data.selected);
    }

    // Filtering
    const searchButton = () => {
        setPage(0);
        setKeyword(query);
    }

    const resetButton = () => {
        setPage(0);
        setSort('id_room');
        setOrder('ASC');
        setKeyword('');
        setQuery('');
    }

    // Pop up notification
    const toast = useToast();

    // Modal edit property
    const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

    // Modal create new room
    const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure();

    // For alert dialog
    const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure();
    const cancelRef = React.useRef();

    // Get property detail
    const propertyDetail = async () => {
        try {
            let getLocalStorage = localStorage.getItem('prw_login');
            if (getLocalStorage) {
                let res = await Axios.get(API_URL + `/properties/getpropertydetail${search}`, {
                    headers: { Authorization: `Bearer ${getLocalStorage}` }
                });
                setName(res.data.name);
                setAddress(res.data.address);
                setCity(res.data.city.name + ", " + res.data.city.province);
                setPicture(API_URL + res.data.picture);
                setDescription(res.data.description);
                setRules(res.data.rules);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Get city data
    const loadCity = async () => {
        try {
            let res = await Axios.get(API_URL + `/cities`);
            let group = []
            res.data.map(x => {
                if (group.filter(r => r.label == x.province).length > 0) {
                    group[group.findIndex(r => r.label == x.province)].options.push({ value: x.id_city, label: x.name });
                } else {
                    group.push({ label: x.province, options: [{ value: x.id_city, label: x.name }] });
                }
            })
            setGroupedOptions(group);
        } catch (error) {
            console.log(error);
        }
    }

    // Edit property
    const editProperty = async (value) => {
        try {
            let res = await Axios.post(API_URL + '/properties/editproperty', { id_property: search.split('=')[1], name: value.name, address: value.address, id_city: value.city, description: value.description, rules: value.rules, propertyImg: value.picture }, { headers: { "Content-Type": "multipart/form-data", }});
            toast({
                title: `${res.data.message}`,
                description: "You've successfully edited your property",
                status: 'success',
                position: 'top',
                duration: 9000,
                isClosable: true,
                onCloseComplete: () => propertyDetail(),
            })
        } catch (error) {
            console.log(error);
        }
    }

    // Delete property
    const deleteProperty = async () => {
        try {
            let res = await Axios.patch(API_URL + '/properties/deleteproperty', { id_property: search.split('=')[1] });
            toast({
                title: `${res.data.message}`,
                description: "You've successfully deleted your property",
                status: 'error',
                position: 'top',
                duration: 9000,
                isClosable: true,
                onCloseComplete: () => navigate('/admin/property'),
            })
        } catch (error) {
            console.log(error);
        }
    }

    // Create new room
    const newRoom = async (value) => {
        try {
            let res = await Axios.post(API_URL + '/rooms/addroom', {
                id_property: search.split('=')[1],
                name: value.name,
                price: value.price,
                description: value.description,
                roomImg: value.picture,
            }, { headers: { "Content-Type": "multipart/form-data", } });
            toast({
                title: `${res.data.message}`,
                description: "You've successfully created new room",
                status: 'success',
                position: 'top',
                duration: 9000,
                isClosable: true,
                onCloseComplete: () => getRoom(),
            })
        } catch (error) {
            console.log(error);
        }
    }

    // Get room data
    const getRoom = async () => {
        try {
            let res = await Axios.get(API_URL + `/rooms/getroom${search}&page=${page}&keyword=${keyword}&sort=${sort}&order=${order}`);
            setTotalPage(res.data.totalPage);
            setRoomData(res.data.rows);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        propertyDetail();
        loadCity();
    }, []);

    useEffect(() => {
        getRoom();
    }, [page, sort, order, keyword]);

    return (
        <Box ms={[0, null, 60]} p={[2, null, 8]} borderTopWidth={[0, null, '4px']} borderColor='blue.400'>
            <Flex flexDirection='column' alignItems='center' mb={8}>
                <Text mb={8} fontSize='sm' color='gray.500' fontWeight='semibold'>
                    <Link href='/admin/property' _hover={{ textDecoration: 'none' }}>Property </Link>
                    / {name}
                </Text>
                <PropertyDetailCard data={{
                    name, address, city, picture, description, rules, onEditOpen, onDeleteOpen
                }} />
                <PropertyModal data={{
                    title: 'Edit your property', groupedOptions, isOpen: isEditOpen, onClose: onEditClose, initialValues: { name, address, city: '', picture: '', description, rules }, validationSchema: propertyValidation, onSubmit: (values, actions) => {
                        editProperty(values);
                        actions.setSubmitting(false);
                        onEditClose();
                    }
                }} />
                <DeleteAlert data={{
                    title: 'Delete property', isOpen: isDeleteOpen, leastDestructiveRef: cancelRef, onClose: onDeleteClose, onClick: () => {
                        onDeleteClose();
                        deleteProperty();
                    }
                }} />
            </Flex>
            <Grid mb={4} justifyContent='center' templateColumns={['repeat(1, 1fr)', null, null, 'repeat(5, 1fr)']}>
                <GridItem justifySelf='flex-end' w={['full', null, null, 250]}>
                    <SortOrderCard data={{
                        selectSort: (e) => setSort(e.target.value), optionValue1: 'id_room', option1: 'ID', optionValue2: 'name', option2: 'Name', optionValue3: 'basePrice', option3: 'Price', selectOrder: (e) => setOrder(e.target.value)
                    }} />
                    <SearchCard data={{
                        placeholder: 'Room', query, onChange: (e) => setQuery(e.target.value), searchButton, resetButton
                    }} />
                    <CreatePropertyRoomCard data={{ title: 'Create new room:', onOpen: onCreateOpen }} />
                    <RoomModal data={{
                        title: 'Create new room', isOpen: isCreateOpen, onClose: onCreateClose, initialValues: { name: '', price: '', description: '', picture: '' }, validationSchema: roomValidation, onSubmit: (values, actions) => {
                            newRoom(values);
                            actions.setSubmitting(false);
                            onCreateClose();
                        }
                    }} />
                </GridItem>
                <GridItem colSpan={[1, null, null, 4]} ms={[0, null, null, 6]} mt={[4, null, null, 0]}>
                    <RoomListCard data={{ roomData, search }} />
                </GridItem>
            </Grid>
            <Pagination data={{ totalPage, handlePageClick }} />
        </Box>
    )
}

export default TenantRoom