import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import API_URL from '../helper';
import { useNavigate } from 'react-router-dom';
import { Box, Button, ButtonGroup, Card, CardBody, Center, Container, Flex, Heading, Image, Input, Select, Spacer, Text } from '@chakra-ui/react';
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";

function OrderDetail() {
    const navigate = useNavigate();
    const {id,action} = useParams();
    const [data,setData] = useState(null) 
    const { isTenant,id_user } = useSelector((state) => {
        return {
            id_user: state.userReducer.id_user || null,
            isTenant: state.userReducer.isTenant || false,
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

    const SubmitBtn = (status)=>{
        let getLocalStorage = localStorage.getItem("prw_login")
        if(action == "reject"){
            Axios.post(API_URL + `/orders/reject`,{
                id_order:id,
                order_status:status
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
        }else if(action == "process"){
            Axios.post(API_URL + `/orders/confirm`,{
                id_order:id,
                order_status:status
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
    }

    useEffect(()=>{
        loadOrder()
    },[])

    return !isTenant?
            <Box p={10} flex={1}>
                <Center>
                    <Flex direction={'column'}>
                        <Heading>Anda Tidak Memiliki Akses</Heading>
                        <Button onClick={()=>navigate('/')}>Back to Home</Button>
                    </Flex>
                </Center>
            </Box>
            
            :action == "reject"?<Box p={10}>
                <Heading>Reject Action</Heading>
                {data != null?<>
                <Card mb={6} key={data.id_order}>
                    <CardBody>
                        <Flex flexDirection={["column", null, "row"]} gap={6}>
                            <Image src={ API_URL + data.payment_proof} maxH={200} maxW={200} alignSelf="center" />
                            <Box>
                                <Text fontSize="4xl">{data.no_invoice}</Text>
                                <Text fontSize="3xl">{data.user.username}</Text>
                                <Text>{data.order_status}</Text>
                                <Text>{data.checkin_date} - {data.checkout_date}</Text>
                            </Box>
                        </Flex>
                    </CardBody>
                </Card>
                <Card mb={6} key={data.property.id_property}>
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
                <Card mb={6} key={data.room.id_room}>
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
                </Card>
                <Box>
                    <ButtonGroup>
                        {data.order_status === "UNPAID"?<Button onClick={()=>SubmitBtn("CANCELED")}>Reject</Button>:<></>}
                        <Button onClick={(e)=>navigate("/admin/order")}>Back</Button>
                    </ButtonGroup>
                </Box></>:<Text>Loading ...</Text>}
            </Box>
            :action === "process"?<Box p={10}>
                <Heading>Process Action</Heading>
                {data != null?<><Card mb={6} key={data.id_order}>
                    <CardBody>
                        <Flex flexDirection={["column", null, "row"]} gap={6}>
                            <Image src={ API_URL + data.payment_proof} maxH={200} maxW={200} alignSelf="center" />
                            <Box>
                                <Text fontSize="4xl">{data.no_invoice}</Text>
                                <Text fontSize="3xl">{data.user.username}</Text>
                                <Text>{data.order_status}</Text>
                                <Text>{data.checkin_date} - {data.checkout_date}</Text>
                            </Box>
                        </Flex>
                    </CardBody>
                </Card>
                <Card mb={6} key={data.property.id_property}>
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
                <Card mb={6} key={data.room.id_room}>
                    <CardBody>
                        <Flex flexDirection={["column", null, "row"]} gap={6}>
                            {/* <Image src={ API_URL + data.room.picture} maxH={200} maxW={200} alignSelf="center" /> */}
                            <Box>
                                <Text fontSize="4xl">{data.room.name}</Text>
                                <Text>{data.room.description}</Text>
                                <Text>{data.room.basePrice}</Text>
                            </Box>
                        </Flex>
                    </CardBody>
                </Card>
                <Box>
                    <ButtonGroup>
                        {data.order_status === "PAID"?<>
                        <Button onClick={()=>SubmitBtn("CONFIRMED")}>Accept Order</Button>
                        <Button onClick={()=>SubmitBtn("UNPAID")}>Reject Order</Button>
                        </>:<></>}
                        
                        <Button onClick={(e)=>navigate("/admin/order")}>Back</Button>
                    </ButtonGroup>
                </Box></>:<Text>Loading ...</Text>}
            </Box>
            :<Box p={10}>
                <Heading>No Action Please Back</Heading>
                <Button onClick={()=>navigate("/admin/order")}>Back to Home</Button>
            </Box>;
}

export default OrderDetail;