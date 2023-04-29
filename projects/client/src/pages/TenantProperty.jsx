import { Box, Grid, GridItem, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import API_URL from '../helper';
import { propertyValidation } from '../schemas';
import SortOrderCard from '../components/SortOrderCard';
import SearchCard from '../components/SearchCard';
import PropertyModal from '../components/PropertyModal';
import Pagination from '../components/Pagination';
import PropertyListCard from '../components/PropertyListCard';
import CreatePropertyRoomCard from '../components/CreatePropertyRoomCard';

const TenantProperty = (props) => {
    // State for data
    const [propertyData, setPropertyData] = useState([]);
    const [groupedOptions, setGroupedOptions] = useState([]);

    // State for pagination
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);

    // State for sort, order, and filter
    const [sort, setSort] = useState('id_property');
    const [order, setOrder] = useState('ASC');
    const [query, setQuery] = useState('');
    const [keyword, setKeyword] = useState('');

    // Pop up notification
    const toast = useToast();

    // Modal new property
    const { isOpen, onOpen, onClose } = useDisclosure();

    // Pagination
    const handlePageClick = (data) => {
        setPage(data.selected);
        window.scrollTo({ top: 0, left: 0 });
    }

    // Filtering
    const searchButton = () => {
        setPage(0);
        setKeyword(query);
    }

    const resetButton = () => {
        setPage(0);
        setSort('id_property');
        setOrder('ASC');
        setKeyword('');
        setQuery('');
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

    // Get property data
    const getProperty = async () => {
        try {
            let getLocalStorage = localStorage.getItem('prw_login')
            if (getLocalStorage) {
                let res = await Axios.get(API_URL + `/properties/getproperty?page=${page}&keyword=${keyword}&sort=${sort}&order=${order}`, { headers: { Authorization: `Bearer ${getLocalStorage}` } });
                setTotalPage(res.data.totalPage);
                setPropertyData(res.data.rows);
            }
        } catch (error) {
            console.log(error);
        }
    }

    // Create new property
    const newProperty = async (value) => {
        try {
            let getLocalStorage = localStorage.getItem('prw_login')
            if (getLocalStorage) {
                const formData = new FormData();
                formData.append('images', value.picture);
                formData.append('data', JSON.stringify({ name: value.name, address: value.address, id_city: value.city, description: value.description, rules: value.rules }));
                let res = await Axios.post(API_URL + '/properties/addproperty', formData, { headers: { Authorization: `Bearer ${getLocalStorage}` } });
                toast({
                    title: `${res.data.message}`,
                    description: "You've successfully added new property",
                    status: 'success',
                    position: 'top',
                    duration: 9000,
                    isClosable: true,
                    onCloseComplete: () => getProperty(),
                });
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadCity();
    }, []);

    useEffect(() => {
        getProperty();
    }, [page, sort, order, keyword]);


    return (
        <Box p={8} bg='gray.100'>
            <Grid mb={4} justifyContent='center' templateColumns={['repeat(1, 1fr)', null, 'repeat(3, 1fr)']}>
                <GridItem justifySelf='flex-end' w={['full', null, 250]}>
                    <SortOrderCard data={{
                        selectSort: (e) => setSort(e.target.value), optionValue1: 'id_property', option1: 'ID', optionValue2: 'name', option2: 'Name', optionValue3: 'id_city', option3: 'City', selectOrder: (e) => setOrder(e.target.value)
                    }} />
                    <SearchCard data={{
                        placeholder: 'Hotel or city', query, onChange: (e) => setQuery(e.target.value), searchButton, resetButton
                    }} />
                    <CreatePropertyRoomCard data={{ title: 'Create new property:', onOpen }} />
                    <PropertyModal data={{
                        title: 'Create new property', groupedOptions, isOpen, onClose, initialValues: { name: '', address: '', city: '', picture: '', description: '', rules: '' }, validationSchema: propertyValidation, onSubmit: (values, actions) => {
                            newProperty(values);
                            onClose();
                        }
                    }} />
                </GridItem>
                <GridItem colSpan={[1, null, 2]} ms={[0, null, 6]} mt={[4, null, 0]}>
                    <PropertyListCard data={{ propertyData }} />
                </GridItem>
            </Grid>
            <Pagination data={{ totalPage, handlePageClick }} />
        </Box>
    )
}

export default TenantProperty