import { useEffect, useState } from 'react';
import Axios from 'axios';
import API_URL from '../helper';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Box, Button, Center, Container, Flex, FormControl, Grid, Heading, Image, Skeleton, Text } from '@chakra-ui/react';
import { Select } from "chakra-react-select";
import {RangeDatepicker} from 'chakra-dayzed-datepicker'
import { activeOrder, resetOrder } from '../actions/orderUserAction';

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

    const today = new Date()

    const { id_user } = useSelector((state) => {
        return {
            id_user: state.userReducer.id_user || null,
        };
    });

    const loadListPropertyAvailable = ()=>{
        console.log("avail prop")

        let getLocalStorage = localStorage.getItem("prw_login")
        Axios.get(API_URL + `/orders/availableproperty`,{params:{
            startDate:selectedDates[0],
            endDate:selectedDates[1],
            cityId:selectedCity.value,
            page,
            keyword,
            sort,
            order
        },headers: {
            Authorization: `Bearer ${getLocalStorage}`
        }})
        .then((res) => {
            console.log(res.data.data)
            setData(res.data.data)
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
                console.log(selectedCity,selectedDates)
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
        if(selectedDates.length == 2 && selectedCity != null)
                loadListPropertyAvailable()
    },[selectedCity,selectedDates])

    const checkRoomBtn = (id)=>{
        navigate("/detailproperty/"+id)
    }

    const onSubmitBtn = ()=>{
        console.log("submit",selectedDates,selectedCity,selectedDates.length == 2,selectedCity != null)
        if(selectedDates.length == 2 && selectedCity != null){
            let orderdata = {startDate:selectedDates[0],endDate:selectedDates[1],cityId:selectedCity}
            let formed = JSON.stringify(orderdata)
            dispatch(activeOrder(formed))

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
                <Box width={300} height={400}>
                    Filter Box
                    <Skeleton width={300} height={400}></Skeleton>
                </Box>
                <Flex flex={1} direction={"column"} gap={6}>
                    {data != null ?data.map(property => (
                    <Flex key={property.id_property} flex={1} flexDirection={"row"} >
                        <Box p={6}>
                            <Image src={property.picture} alt={property.name}  height={200}/>
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
                            <Text mt="2" fontSize="md" color="gray.600">
                                {property.description}
                            </Text>
                            {property.listrooms.length != 0?<Button onClick={()=>checkRoomBtn(property.id_property)}>Check Room</Button>:<Text>No Rooms Avaliable</Text>}
                            
                        </Box>
                    </Flex>
                    )):<Heading p={10}>No Data to Show</Heading>}
                </Flex>
            </Flex>
            
        </Box>
    );
    
}

export default AvaliableProperty;