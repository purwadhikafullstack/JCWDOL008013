import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux";
import Axios from "axios";
import API_URL from "./../helper";
import { useNavigate } from 'react-router-dom';
import CaptionCarousel from '../components/CaptionCarousel';
import FeatureList from '../components/FeatureList';
import { RangeDatepicker } from 'chakra-dayzed-datepicker'
import TestimonialList from '../components/TestimonialList';
import {
    Box, Flex, Spacer,
    FormControl,
    Button,
    Center,
    Icon
} from '@chakra-ui/react';
import { Select } from "chakra-react-select";
import { FcAssistant, FcLock, FcMoneyTransfer } from 'react-icons/fc';
import { activeOrder, resetOrder } from '../actions/orderUserAction';
import TrendingDestinations from '../components/TrendingDestinations';
import LandingProperty from '../components/LandingProperty';

const Landing = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [groupedOptions, setGroupedOptions] = useState([])
    const [cities, setCities] = useState([])
    const [selectedDates, setSelectedDates] = useState([]);
    const today = new Date()
    let yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const [selectedCity, setSelectedCity] = useState("");
    const cards = [
        {
            title: 'Paradise',
            text:
                "Escape to Paradise - Book Your Dream Hotel Today!",
            image:
                'https://images.unsplash.com/photo-1586611292717-f828b167408c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80',
        },
        {
            title: 'Luxury',
            text:
                "Experience Luxury Like Never Before - Book Your Stay Now!",
            image:
                'https://cdn.pixabay.com/photo/2018/04/05/13/08/water-3292794_960_720.jpg',
        },
        {
            title: 'Relax',
            text:
                "Unwind and Relax in Style - Book Your Next Getaway Today!",
            image:
                'https://images.unsplash.com/photo-1498503182468-3b51cbb6cb24?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
        },
    ];

    const fitur = [
        { icon: <Icon as={FcMoneyTransfer} w={10} h={10} />, title: 'Hassle-Free', text: 'Make a transaction from anywhere at any time, from desktop, mobile app, or mobile web.' },
        { icon: <Icon as={FcAssistant} w={10} h={10} />, title: 'Service You Can Trust', text: 'You get what you paid for – guaranteed.' },
        { icon: <Icon as={FcLock} w={10} h={10} />, title: 'Secure Transaction Guaranteed', text: 'Security and privacy of your online transaction are protected' },
    ]

    const review = [
        { heading: "Efficient Collaborating", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctorneque sed imperdiet nibh lectus feugiat nunc sem.", pic: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80', username: 'Jane Cooper' },
        { heading: "Intuitive Design", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctorneque sed imperdiet nibh lectus feugiat nunc sem.", pic: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80', username: 'Jane Cooper' },
        { heading: "Mindblowing Service", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctorneque sed imperdiet nibh lectus feugiat nunc sem.", pic: 'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80', username: 'Jane Cooper' },
    ]

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
                console.log("check error", err)
            });
    }

    useEffect(() => {
        loadCity()
    }, [])

    const onSubmitBtn = () => {
        if (selectedDates.length == 2 && selectedCity != "") {
            let startDate = new Date(selectedDates[0].setHours(0, 0, 0, 0));
            let endDate = new Date(selectedDates[1].setHours(0, 0, 0, 0));
            let orderdata = { startDate, endDate, cityId: selectedCity }
            let formed = JSON.stringify(orderdata)
            localStorage.setItem('order_form', formed)
            dispatch(activeOrder(formed))

            let getLocalStorage = localStorage.getItem('prw_login');
            Axios.get(API_URL + `/orders/availableproperty`, {
                params: orderdata,
                headers: {
                    "Authorization": `Bearer ${getLocalStorage}`
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
        } else {
            alert("Mohon Isi Tanggal dan Lokasi")
            dispatch(resetOrder)
        }
    }

    return (
        <Flex direction={"column"}>
            <CaptionCarousel cards={cards} />
            <Spacer />

            <Box px={[8, null, 36]} zIndex={100}>
                <Flex border='2px' borderColor='gray.200' borderRadius={8} boxShadow='xl' mt={-10} bg='white' flexDirection={['column', null, 'row']} justifyContent='center' alignItems='center' p={5} gap={4}>
                    <FormControl isRequired>
                        {/* <FormLabel>City</FormLabel> */}
                        <Select
                            name="colors"
                            options={groupedOptions}
                            placeholder="City"
                            onChange={setSelectedCity}
                            value={selectedCity}
                        />
                    </FormControl>
                    <FormControl isRequired>
                        {/* <FormLabel>Check In - Check Out</FormLabel> */}
                        <RangeDatepicker
                            selectedDates={selectedDates}
                            onDateChange={setSelectedDates}
                            closeOnSelect={true}
                            minDate={yesterday}
                            propsConfigs={{
                                inputProps: {
                                    placeholder: "Check In - Check Out"
                                },
                            }}
                            configs={{
                                dateFormat: 'dd/MM/yyyy'
                            }}
                        />
                    </FormControl>
                    <Button w={['full', null, 32]} colorScheme='blue' onClick={onSubmitBtn}>Submit</Button>
                </Flex>
            </Box>

            <Spacer />
            <TrendingDestinations />
            <Spacer />
            <LandingProperty />
            <Spacer />
            <FeatureList fitur={fitur} />
            <Spacer />
            {/* <TestimonialList review={review}/> */}
        </Flex>

    )
}

export default Landing