import { Box, Button, Card, CardBody, Container, Flex, Heading, Image, Slider, SliderFilledTrack, SliderThumb, SliderTrack, Text, Textarea, VStack } from "@chakra-ui/react";
import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import API_URL from '../helper';
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { MdStars } from "react-icons/md";

function RatingUser() {
    const navigate = useNavigate();
    const [rating,setRating] = useState(0)
    const [comment,setComment] = useState("")
    const [data,setData] = useState(null) 
    const {id} = useParams();
    const { id_user } = useSelector((state) => {
        return {
            id_user: state.userReducer.id_user || null,
        };
    });

    const loadOrder = ()=>{
        let getLocalStorage = localStorage.getItem("prw_login")
        Axios.get(API_URL + `/orders/detail`,{params:{
            id_order:id
        },headers: {
            Authorization: `Bearer ${getLocalStorage}`
        }})
        .then((res) => {
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

    useEffect(()=>{
        loadOrder()
    },[])

    const submitBtn = ()=>{
        let getLocalStorage = localStorage.getItem("prw_login")

        Axios.post(API_URL + `/orders/review`,{
            id_order:id,
            rating:rating,
            comment:comment
        },{headers: {
            Authorization: `Bearer ${getLocalStorage}`
        }})
        .then((res) => {
            alert(res.data.message)
            loadOrder()
        })
        .catch((err) => {
            console.log(err)
            if (!err.response.data.success) {
                alert(err.response.data.message);
            }
            console.log("check error", err)
        });
    }

    return ( <Box bg="gray.50" p={10}>
            <Container bg="white" textAlign="center" py={12}>
                <Heading mb={10}>Rate Order</Heading>
                <VStack>
                    {data != null?<><Card mb={6} key={1}>
                        <CardBody>
                            <Flex flexDirection={["column", null, "row"]} gap={6}>
                                {/* <Image src={ API_URL + data.payment_proof} maxH={200} maxW={200} alignSelf="center" /> */}
                                <Box>
                                    <Text fontSize="4xl">{data.no_invoice}</Text>
                                    <Text fontSize="3xl">{data.user.username}</Text>
                                    <Text>{data.order_status}</Text>
                                    <Text>{data.checkin_date} - {data.checkout_date}</Text>
                                </Box>
                            </Flex>
                        </CardBody>
                    </Card>
                    <Card mb={6} key={2}>
                        <CardBody>
                            <Flex flexDirection={["column", null, "row"]} gap={6}>
                                <Image src={ API_URL + data.property.picture} maxH={200} maxW={200} alignSelf="center" />
                                <Box>
                                    <Text fontSize="4xl">{data.property.name}</Text>
                                    <Text>{data.property.address}</Text>
                                    <Text>{data.property.city.name}, {data.property.city.province}</Text>
                                    <Text>{data.property.description}</Text>
                                    <Text>{data.property.rules}</Text>
                                    <Text>{data.property.room}</Text>
                                </Box>
                            </Flex>
                        </CardBody>
                    </Card>
                    <Card mb={6} key={3}>
                        <CardBody>
                            <Flex flexDirection={["column", null, "row"]} gap={6}>
                                <Image src={ API_URL + data.room.picture} maxH={200} maxW={200} alignSelf="center" />
                                <Box>
                                    <Text fontSize="4xl">{data.room.name}</Text>
                                    <Text>{data.room.description}</Text>
                                    <Text>{data.room.basePrice}</Text>
                                </Box>
                            </Flex>
                        </CardBody>
                    </Card></>:<></>}
                </VStack>
                <Box p={10}>
                    {data?.rating === null?<>
                        <Text>Rating</Text>
                        <Slider aria-label='slider-ex-4' min={1} max={5} step={1} onChange={(val)=>setRating(val)}>
                            <SliderTrack bg='red.100'>
                                <SliderFilledTrack bg='tomato' />
                            </SliderTrack>
                            <SliderThumb boxSize={6}>
                                <Box color='tomato' as={MdStars} />
                            </SliderThumb>
                        </Slider>
                        <Text>Comment</Text>
                        <Textarea placeholder='Here is a sample placeholder' onChange={(e)=>setComment(e.target.value)} />
                        <Button mt={10} mb={2} width="full" colorScheme='teal' onClick={submitBtn}>Save</Button>
                    </>:<></>}
                    <Button mt={10} mb={2} width="full" colorScheme='teal' onClick={(e)=>navigate("/")}>Back</Button>
                </Box>
                
                
            </Container>
        </Box>
    );
}

export default RatingUser;