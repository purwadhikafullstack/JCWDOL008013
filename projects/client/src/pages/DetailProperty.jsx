import { useEffect, useState } from 'react';
import Axios from 'axios';
import API_URL from '../helper';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, Center, Container, Flex, FormControl, Grid, Heading, Image, Stack, Text } from '@chakra-ui/react';
import {RangeDatepicker} from 'chakra-dayzed-datepicker'

import { Select } from "chakra-react-select";
import { activeOrder, resetOrder } from '../actions/orderUserAction';
import CalendarTable from '../components/CalendarTable'
import leftPad from 'left-pad';

function DetailProperty() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {id} = useParams();
    const [data,setData] = useState(null) 
    const [groupedOptions,setGroupedOptions] = useState([])
    const [selectedDates, setSelectedDates] = useState([]);
    const today = new Date()
    const end = 2024;
    const start = 2023;
    const yearRange = Array.from({length: (end - start)}, (v, k) => k + start);

    const [selectedCity,setSelectedCity]= useState(null);
    const [property,setProperty] = useState(null)
    const [pricecal , setPriceCal] = useState([])
    const [price,setPrice] = useState([])

    const [other,setOther] = useState({})
    const [formdate,setformdate] = useState("")

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
            if(res.data.data.length != 0){
                setProperty(res.data.data[0].property) 
            }
            for(let r of res.data.data){
                findprice(r.id_room)
            }
            console.log(price,data)
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

    const findprice = async(roomid) =>{
        let getLocalStorage = localStorage.getItem("prw_login")
        Axios.get(API_URL + `/orders/totalprice`,{params:{
            startDate:selectedDates[0],
            endDate:selectedDates[1],
            idRoom:roomid
        },headers: {
            Authorization: `Bearer ${getLocalStorage}`
        }})
        .then((res) => {
            let arr = price
            if(arr.findIndex(x=>x.id===roomid) >= 0){
                arr[arr.findIndex(x=>x.id===roomid)].data = res.data.total
            }else{
                arr.push({id:roomid,data:res.data.total})
            }
            setPrice(arr)
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
                // loadRoomAvaliable()
            }else{
                dispatch(resetOrder)
            }

        } catch(err){
            console.log(err)
        }
    }

    const checkcalendar = async()=>{
        
        let getLocalStorage = localStorage.getItem("prw_login")
        let date = new Date(formdate), y = date.getFullYear(), m = date.getMonth();

        if(!isNaN(y) && !isNaN(m)){
            let firstDay = new Date(y, m, 1).toISOString().substring(0,10);
            let lastDay = new Date(y, m + 1, 0).toISOString().substring(0,10);

            Axios.get(API_URL + `/orders/getPriceCalendarBydate`,{params:{
                startDate:firstDay,
                endDate:lastDay,
                id_property:id
            },headers: {
                Authorization: `Bearer ${getLocalStorage}`
            }})
            .then((res) => {
                setPriceCal(res.data.data)
            })
            .catch((err) => {
                console.log(err)
                if (!err.response.data.success) {
                    alert(err.response.data.message);
                }
                console.log("check error", err)
            });
        }
        
    }

    useEffect(()=>{
        loadCity()
        checksavedorder()
        const today = new Date();

        const dateOfMonth = today.getDate();
        const monthOfYear = today.getMonth() + 1; // 0 based
        const year        = today.getFullYear();
        
        setOther( {
            day: dateOfMonth,
            month: monthOfYear,
            year: year
        })
        
    },[])

    useEffect(()=>{
        setformdate ( [
            leftPad(other.year, 4, 0),
            leftPad(other.month, 2, 0),
            leftPad(other.day, 2, 0)
        ].join("-"))
    },[other])

    useEffect(()=>{
        checkcalendar()
    },[formdate])
    
    useEffect(()=>{
        if(selectedDates.length == 2 && selectedCity != null)
            loadRoomAvaliable()
    },[selectedCity,selectedDates])

    const onOrderBtn = (data)=>{
        console.log(data)
        // TODO: mas rajib di sini kirim data ordernya 
        let od = {
            id_property: data.id_property,
            id_room: data.id_room,
            checkin_date: data.startDate,
            checkout_date: data.endDate,
            total: data.price,
        };
        localStorage.setItem("prw_order", JSON.stringify(od));
        navigate("/confirmation")
    }

    const onSubmitBtn = (data)=>{
        loadRoomAvaliable()
    }


    return (
        <Box p={10}>
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
            <Flex flexWrap="wrap" borderWidth="1px" borderRadius="lg" >
                {property != null ?<>
                    <Box flex="1" mr="4">
                        <Image src={API_URL + property.picture} alt={property.name} height={500} objectFit="cover" mb="4" />
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
                    {data != null && price.length == data.length ?data.map(room => {
                        {/* price[price.findIndex(x=>x.id==room.id_room)].data */}
                        let orderdata = {
                            id_property:room.id_property,
                            id_room:room.id_room,
                            price: room.basePrice,
                            cityId:selectedCity.value,
                            startDate:selectedDates[0].toISOString().split("T")[0],
                            endDate:selectedDates[1].toISOString().split("T")[0],
                        }
                        console.log(orderdata);
                        return (
                        <Box key={room.id} flex={1} borderWidth="1px" borderRadius="lg" >
                            <Flex>
                                <Box mr={4} flex={1}>
                                    <Image src={API_URL + room.picture} alt={room.name} height={240} objectFit="fill" mb="4" mx="4"/>
                                </Box>
                                <Box p="6" flex={2}>
                                    <Box d="flex" alignItems="baseline">
                                        <Text fontWeight="semibold" fontSize="xl" mr="2">
                                        {room.name}
                                        </Text>
                                        <Text fontSize="lg" color="gray.600">
                                        {/* { price[price.findIndex(x=>x.id==room.id_room)].data.toLocaleString('id',{ style: 'currency', currency: 'IDR' })} per night */}
                                        { room.basePrice.toLocaleString('id',{ style: 'currency', currency: 'IDR' })} per night
                                        </Text>
                                    </Box>
                                    <Text mt="2" fontSize="md" color="gray.600">
                                        {room.description}
                                    </Text>
                                    <Button p={5} colorScheme='blue' onClick={()=>onOrderBtn(orderdata)}>Order</Button>
                                </Box>
                            </Flex>
                        </Box>
                    )}):<Text>No Room Data</Text>}
                </Flex>
                <br/><br/>
                <Heading as="h2" size="lg" mb="4">
                    Price Calendar This Month
                </Heading>
                <Stack border='2px' borderColor='gray.200'  boxShadow='sm' padding={5}>
                <label htmlFor="month">Month</label>
                <select className='form-control' name="month" value={other.month} onChange={(e) => setOther({...other,month: e.target.value})}>
                    <option value="1">01 - January</option>
                    <option value="2">02 - February</option>
                    <option value="3">03 - March</option>
                    <option value="4">04 - April</option>
                    <option value="5">05 - May</option>
                    <option value="6">06 - June</option>
                    <option value="7">07 - July</option>
                    <option value="8">08 - August</option>
                    <option value="9">09 - September</option>
                    <option value="10">10 - October</option>
                    <option value="11">11 - November</option>
                    <option value="12">12 - December</option>
                </select>
                <label htmlFor="year">Year</label>
                <select className='form-control' name="year" value={other.year}  onChange={(e) => setOther({...other,year: e.target.value})}>
                    {yearRange.map( (year) => {
                        return <option key={year} value={year}>{year}</option>
                    })}
                </select>
                </Stack>
                <br/>
                <CalendarTable data={pricecal} date={formdate}/>
            </Flex>
        </Box>
    );
}

export default DetailProperty;