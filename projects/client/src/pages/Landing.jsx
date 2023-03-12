import React, { useEffect, useState } from 'react'
import { useDispatch } from "react-redux";
import Axios from "axios";
import API_URL from "./../helper";
import { useNavigate } from 'react-router-dom';
import CaptionCarousel from '../components/CaptionCarousel';
import FeatureList from '../components/FeatureList';
import {RangeDatepicker} from 'chakra-dayzed-datepicker'
import TestimonialList from '../components/TestimonialList';
import { Box, Container, Flex,Spacer,
    FormControl,
    FormLabel,
    FormErrorMessage,
    FormHelperText,
    Button,
    Center,
    AspectRatio 
} from '@chakra-ui/react';
import { Select } from "chakra-react-select";
const initialForm = {
    startDate:"",
    endDate:"",
    cityId:""
}

const Landing = () => {
    const navigate = useNavigate();
    const [groupedOptions,setGroupedOptions] = useState([])
    const [cities, setCities] = useState([])
    const [form,setForm] = useState(initialForm)
    const [selectedDates, setSelectedDates] = useState([]);
    const today = new Date()
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
        if(selectedDates.length == 2 && form.cityId != ""){
            setForm({...form,startDate:selectedDates[0],endDate:selectedDates[1]})
            console.log( selectedDates, JSON.stringify(form))
        }else{
            alert("Mohon Isi Tanggal dan Lokasi")
        }
    }

    return (
        
            <Flex direction={"column"}>
                <CaptionCarousel/>
                <Spacer />
                
                <Box p={5} >
                    <Flex border='2px' borderColor='gray.200'  boxShadow='xl' >
                        <FormControl isRequired p={5}>
                            {/* <FormLabel>City</FormLabel> */}
                            <Select
                                name="colors"
                                options={groupedOptions}
                                placeholder="Select City"
                                onChange={(el)=>setForm({...form,cityId:el.value})}
                                // value={form.cityId}
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
                <FeatureList/>
                <Spacer />
                <TestimonialList/>
            </Flex>
        
    )
}

export default Landing