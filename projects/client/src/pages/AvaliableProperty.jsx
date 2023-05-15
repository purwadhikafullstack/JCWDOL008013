import { useEffect, useState } from 'react';
import Axios from 'axios';
import API_URL from '../helper';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Box, Button, Center, Container, Flex, FormControl, Grid, Heading, Image, Skeleton, Text, VStack, Select as SelectCakra} from '@chakra-ui/react';
import { Select } from "chakra-react-select";
import {RangeDatepicker} from 'chakra-dayzed-datepicker'
import { activeOrder, resetOrder } from '../actions/orderUserAction';

import ReactPaginate from 'react-paginate';

function AvaliableProperty(props) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {} = useParams();
    const [data,setData] = useState(null) 
    const [page,setPage] = useState(1) 
    const [keyword,setKeyword] = useState(null) 
    const [sort,setSort] = useState("id_property") 
    const [order,setOrder] = useState("asc") 
    const [groupedOptions,setGroupedOptions] = useState([])
    const [cities, setCities] = useState([])
    const [selectedDates, setSelectedDates] = useState([]);
    const [selectedCity,setSelectedCity]= useState(null);

    const [perpage,setPerPage]= useState(10)
    const [total, setTotalItem] = useState(0)
    const [firstload, setFirstLoad] = useState(false)
    const today = new Date()

    const { id_user } = useSelector((state) => {
        return {
            id_user: state.userReducer.id_user || null,
        };
    });

    const loadListPropertyAvailable = ()=>{
        let getLocalStorage = localStorage.getItem("prw_login")
        Axios.get(API_URL + `/orders/availableproperty`,{params:{
            startDate:selectedDates[0],
            endDate:selectedDates[1],
            cityId:selectedCity.value,
            page,
            perpage,
            keyword,
            sort,
            order
        },headers: {
            Authorization: `Bearer ${getLocalStorage}`
        }})
        .then((res) => {
            setData(res.data.data.data)
            setTotalItem(res.data.data.total)
            let startDate = new Date(selectedDates[0].setHours(0, 0, 0, 0));
            let endDate = new Date(selectedDates[1].setHours(0, 0, 0, 0));
            let orderdata = { startDate, endDate, cityId: selectedCity }
            let formed = JSON.stringify(orderdata)
            localStorage.setItem('order_form', formed)
            dispatch(activeOrder(formed))
        })
        .catch((err) => {
            console.log(err)
            if (!err.response.data.success) {
                alert(err.response.data.message);
            }
            console.log("check error", err)
        });
    }

    const checksavedorder = async()=>{
        try {
            let getLocalStorage = localStorage.getItem('order_form');
            if(getLocalStorage){
                let presistentData = JSON.parse(getLocalStorage)
                dispatch(activeOrder(presistentData))
                setSelectedCity((x)=>x=presistentData.cityId)
                let arr =[]
                arr.push(new Date(presistentData.startDate))
                arr.push(new Date(presistentData.endDate))
                setSelectedDates((x)=>x=arr)
            }else{
                dispatch(resetOrder)
            }

        } catch(err){
            console.log(err)
        }
    }

    const loadCity = ()=>{
        Axios.get(API_URL + `/cities`)
        .then((res) => {
            let group = []
            res.data.map(x=>{
                if(group.filter(r=>r.label==x.province).length > 0){
                    group[group.findIndex(r=>r.label == x.province)].options.push({value:x.id_city,label:x.name})
                }else{
                    group.push({label:x.province,options:[{value:x.id_city,label:x.name}]})
                }
            })
            setGroupedOptions(group)
        })
        .catch((err) => {
            console.log(err)
            if (!err.response.data.success) {
                alert(err.response.data.message);
            }
            console.log("check error", err)
        });
    }

    useEffect(()=>{
        loadCity()
        checksavedorder()
        
    },[])

    useEffect(()=>{
        if(selectedDates.length == 2 && selectedCity != null && firstload == false){
            setFirstLoad(true)
            loadListPropertyAvailable()
        }
    },[selectedCity,selectedDates,page])

    const checkRoomBtn = (id)=>{
        navigate("/detailproperty/"+id)
    }

    const handlePageClick = (event) => {
        setPage(event.selected+1)
    };

    const onSubmitBtn = ()=>{
        
        if(selectedDates.length == 2 && selectedCity != null){
            // let orderdata = {startDate:selectedDates[0],endDate:selectedDates[1],cityId:selectedCity}
            // let formed = JSON.stringify(orderdata)
            // dispatch(activeOrder(formed))

            loadListPropertyAvailable()
        }else{
            alert("Mohon Isi Tanggal dan Lokasi")
        }
    }

    return (
        <Box p={20}>
            <Box p={5} >
                <Flex border='2px' borderColor='gray.200'  boxShadow='xl' >
                    <FormControl isRequired p={5}>
                        <Select
                            name="colors"
                            options={groupedOptions}
                            placeholder="Select City"
                            onChange={setSelectedCity}
                            value={selectedCity}
                        />
                    </FormControl>
                    <FormControl isRequired p={5}>
                        <RangeDatepicker
                            selectedDates={selectedDates}
                            onDateChange={setSelectedDates}
                            closeOnSelect={true}
                            minDate={today}
                            propsConfigs={{
                                inputProps: {
                                placeholder: "Check In - Check Out"
                                },
                            }}
                        />
                    </FormControl>
                    
                    <Center p={5}>
                        <Button p={5} colorScheme='blue' onClick={onSubmitBtn}>Submit</Button>
                    </Center>
                </Flex>
            </Box>
            <Heading>List of Properties</Heading>
            <Flex>
                <Box width={300} height={250} border='2px' borderColor='gray.200'  boxShadow='xl'>
                    <VStack p={5} margin={2}>
                        <Heading size={'l'}>Filter Box</Heading>
                        <SelectCakra placeholder='Sort By' onChange={(e)=>e.target.value!=""?setSort(e.target.value):setSort("id_property")}>
                            <option value='name'>Name</option>
                            <option value='id_property'>Property Terbaru</option>
                            {/* <option value='basePrice'>Price</option> */}
                        </SelectCakra>
                        <SelectCakra placeholder='Order By' onChange={(e)=>e.target.value!=""?setOrder(e.target.value):setOrder("asc")}>
                            <option value='asc'>ASC</option>
                            <option value='desc'>DESC</option>
                        </SelectCakra>
                        <Center p={5}>
                            <Button p={5} colorScheme='blue' onClick={onSubmitBtn}>Submit</Button>
                        </Center>
                    </VStack>
                </Box>
                <Flex marginStart={10} flex={1} direction={"column"} gap={6}>
                    <style>
                        @import "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
                    </style>
                    {data != null && data.length != 0 ?data.map(property => (
                    <Flex key={property.id_property} flex={1} flexDirection={"row"} boxShadow='outline' p='6' rounded='md' bg='white' >
                        <Box p={6}>
                            <Image src={API_URL + property.picture} alt={property.name}  height={200}/>
                        </Box>

                        <Box p="6">
                            <Box d="flex" alignItems="baseline">
                                <Text fontWeight="semibold" fontSize="xl" mr="2">
                                {property.name}
                                </Text>
                                <Text fontSize="lg" color="gray.600">
                                Start From {property.listrooms.length != 0?property.listrooms[0].basePrice.toLocaleString('id',{ style: 'currency', currency: 'IDR' }):"Rp. 0,00"} per night
                                </Text>
                            </Box>
                            <Text mt="2" fontSize="md" color="gray.600" noOfLines={2} align={'justify'}>
                                {property.description}
                            </Text>
                            {property.listrooms.length != 0?<Button onClick={()=>checkRoomBtn(property.id_property)}>Check Room</Button>:<Text>No Rooms Avaliable</Text>}
                            
                        </Box>
                    </Flex>
                    )):<Heading p={10}>No Available Booking</Heading>}
                    {data != null && total > perpage ?<Center p={5}>
                        <ReactPaginate
                            onPageChange={handlePageClick}
                            pageCount={Math.ceil(total/perpage) || 0}
                            pageRangeDisplayed={3}
                            marginPagesDisplayed={2}
                            nextLabel="next >"
                            previousLabel="< previous"
                            pageClassName="page-item"
                            pageLinkClassName="page-link"
                            previousClassName="page-item"
                            previousLinkClassName="page-link"
                            nextClassName="page-item"
                            nextLinkClassName="page-link"
                            breakLabel="..."
                            breakClassName="page-item"
                            breakLinkClassName="page-link"
                            containerClassName="pagination"
                            activeClassName="active"
                            renderOnZeroPageCount={null}
                        />
                    </Center>:<></>}
                </Flex>
                
            </Flex>
            
        </Box>
    );
    
}

export default AvaliableProperty;