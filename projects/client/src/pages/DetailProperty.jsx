import { useEffect, useState } from 'react';
import Axios from 'axios';
import API_URL from '../helper';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, Center, Container, Flex, FormControl, Grid, Heading, Image, Text } from '@chakra-ui/react';
import {RangeDatepicker} from 'chakra-dayzed-datepicker'

import { Select } from "chakra-react-select";
import { activeOrder, resetOrder } from '../actions/orderUserAction';


function DetailProperty() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id} = useParams();
    const [data,setData] = useState(null) 
    const [groupedOptions,setGroupedOptions] = useState([])
    const [selectedDates, setSelectedDates] = useState([]);
    const today = new Date()
    const [selectedCity,setSelectedCity]= useState(null);
    const [property,setProperty] = useState(null)

    const { id_user } = useSelector((state) => {
        return {
            id_user: state.userReducer.id_user || null,
        };
    });

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


    const loadRoomAvaliable = ()=>{
        let getLocalStorage = localStorage.getItem("prw_login")
        Axios.get(API_URL + `/orders/availableroom`,{params:{
            cityId:selectedCity.value,
            startDate:selectedDates[0],
            endDate:selectedDates[1],
            propertyId:id
        },headers: {
            Authorization: `Bearer ${getLocalStorage}`
        }})
        .then((res) => {
            console.log(res.data.data)
            setData(res.data.data)
            if(res.data.data.length != 0){
                setProperty(res.data.data[0].property) 
            }
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
                // loadRoomAvaliable()
            }else{
                dispatch(resetOrder)
            }

        } catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        loadCity()
        checksavedorder()
    },[])
    
    useEffect(()=>{
        if(selectedDates.length == 2 && selectedCity != null)
            loadRoomAvaliable()
    },[selectedCity,selectedDates])



    const onSubmitBtn = ()=>{
    }

    const onOrderBtn = ()=>{
    }


    return (
        <Box p={10}>
            {/* <Box p={5} >
                <Flex border='2px' borderColor='gray.200'  boxShadow='xl' >
                    <FormControl isRequired p={5}>
                        <Select
                            name="colors"
                            options={groupedOptions}
                            placeholder="Select City"
                            onChange={(el)=>setForm({...form,cityId:el.value})}
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
            </Box> */}
            <Flex flexWrap="wrap">
                {property != null ?<>
                    <Box flex="1" mr="4">
                        <Image src={property.image} alt={property.name} height={500} objectFit="cover" mb="4" />
                    </Box>
                    <Box flex="2">
                        <Heading as="h1" size="xl" mb="2">
                        {property.name}
                        </Heading>
                        <Text fontSize="lg" color="gray.600" mb="2">
                        {property.description}
                        </Text>
                    </Box>
                </>:<Text>Fail Take Property Data</Text>}
            
            </Flex>
            <Flex direction={"column"} mt="8">
            <Heading as="h2" size="lg" mb="4">
                Rooms
            </Heading>
            <Flex flexWrap="wrap" justifyContent="center" direction={"column"} gap={5}>
                {data != null ?data.map(room => (
                    <Box key={room.id} flex={1} borderWidth="1px" borderRadius="lg" >
                        <Flex>
                            <Box mr={4} flex={1}>
                                <Image src={room.picture} alt={room.name} height={240} objectFit="fill" mb="4" mx="4"/>
                            </Box>
                            <Box p="6" flex={2}>
                                <Box d="flex" alignItems="baseline">
                                    <Text fontWeight="semibold" fontSize="xl" mr="2">
                                    {room.name}
                                    </Text>
                                    <Text fontSize="lg" color="gray.600">
                                    ${room.basePrice} per night
                                    </Text>
                                </Box>
                                <Text mt="2" fontSize="md" color="gray.600">
                                    {room.description}
                                </Text>
                                <Button p={5} colorScheme='blue' onClick={onOrderBtn}>Order</Button>
                            </Box>
                        </Flex>
                    </Box>
                )):<Text>No Room Data</Text>}
            </Flex>
            </Flex>
        </Box>
    );
}

export default DetailProperty;