import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux";
import Axios from "axios";
import API_URL from "./../helper";
import { useNavigate } from 'react-router-dom';
import CaptionCarousel from '../components/CaptionCarousel';
import FeatureList from '../components/FeatureList';
import {RangeDatepicker} from 'chakra-dayzed-datepicker'
import TestimonialList from '../components/TestimonialList';
import { Box, Flex,Spacer,
    FormControl,
    Button,
    Center,
    Icon
} from '@chakra-ui/react';
import { Select } from "chakra-react-select";
import { FcAssistant, FcLock, FcMoneyTransfer } from 'react-icons/fc';
import { activeOrder, resetOrder } from '../actions/orderUserAction';

const Landing = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [groupedOptions,setGroupedOptions] = useState([])
    const [cities, setCities] = useState([])
    const [selectedDates, setSelectedDates] = useState([]);
    const today = new Date()
    const [selectedCity,setSelectedCity]= useState("");
    const cards = [
        {
        title: 'Banner 1',
        text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctorneque sed imperdiet nibh lectus feugiat nunc sem.",
        image:
            'https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDV8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60',
        },
        {
        title: 'Banner 2',
        text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctorneque sed imperdiet nibh lectus feugiat nunc sem.",
        image:
            'https://images.unsplash.com/photo-1438183972690-6d4658e3290e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2274&q=80',
        },
        {
        title: 'Banner 3',
        text:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctorneque sed imperdiet nibh lectus feugiat nunc sem.",
        image:
            'https://images.unsplash.com/photo-1507237998874-b4d52d1dd655?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1yZWxhdGVkfDR8fHxlbnwwfHx8fA%3D%3D&auto=format&fit=crop&w=900&q=60',
        },
    ];

    const fitur = [
        {icon:<Icon as={FcMoneyTransfer} w={10} h={10} />,title:'Hassle-Free',text:'Make a transaction from anywhere at any time, from desktop, mobile app, or mobile web.'},
        {icon:<Icon as={FcAssistant} w={10} h={10} />,title:'Service You Can Trust',text:'You get what you paid for – guaranteed.'},
        {icon:<Icon as={FcLock} w={10} h={10} />,title:'Secure Transaction Guaranteed',text:'Security and privacy of your online transaction are protected'},
    ]

    const review = [
        {heading:"Efficient Collaborating",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctorneque sed imperdiet nibh lectus feugiat nunc sem.",pic:'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',username:'Jane Cooper'},
        {heading:"Intuitive Design",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctorneque sed imperdiet nibh lectus feugiat nunc sem.",pic:'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',username:'Jane Cooper'},
        {heading:"Mindblowing Service",description:"Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctorneque sed imperdiet nibh lectus feugiat nunc sem.",pic:'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80',username:'Jane Cooper'},
    ]

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
    },[])

    const onSubmitBtn = ()=>{
        if(selectedDates.length == 2 && selectedCity != ""){
            let orderdata = {startDate:selectedDates[0],endDate:selectedDates[1],cityId:selectedCity}
            let formed = JSON.stringify(orderdata)
            localStorage.setItem('order_form',formed)
            dispatch(activeOrder(formed))

            let getLocalStorage = localStorage.getItem('prw_login');
            Axios.get(API_URL + `/orders/availableproperty`,{
                params:orderdata,
                headers:{
                    "Authorization" :`Bearer ${getLocalStorage}`
                }
            })
            .then((res) => {
                console.log(res.data)
                navigate("/search");
            })
            .catch((err) => {
                console.log(err)
                if (!err.response.data.success) {
                    alert(err.response.data.message);
                }
                console.log("check error", err)
            });
        }else{
            alert("Mohon Isi Tanggal dan Lokasi")
            dispatch(resetOrder)
        }
    }

    return (
            <Flex direction={"column"}>
                <CaptionCarousel cards={cards}/>
                <Spacer />
                
                <Box p={5} >
                    <Flex border='2px' borderColor='gray.200'  boxShadow='xl' >
                        <FormControl isRequired p={5}>
                            {/* <FormLabel>City</FormLabel> */}
                            <Select
                                name="colors"
                                options={groupedOptions}
                                placeholder="Select City"
                                onChange={setSelectedCity}
                                value={selectedCity}
                            />
                        </FormControl>
                        <FormControl isRequired p={5}>
                            {/* <FormLabel>Check In - Check Out</FormLabel> */}
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
                
                <Spacer />
                <FeatureList fitur={fitur}/>
                <Spacer />
                <TestimonialList review={review}/>
            </Flex>
        
    )
}

export default Landing