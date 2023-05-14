import { Box, Grid, GridItem, Image, Text } from "@chakra-ui/react"
import Axios from "axios"
import API_URL from "../helper"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { activeOrder } from "../actions/orderUserAction"
import { useNavigate } from "react-router-dom"
import Pagination from "./Pagination"

const LandingProperty = (props) => {
    // Config date and time
    let today = new Date(new Date().setHours(7, 0, 0, 0));
    let tomorrow = new Date(new Date().setHours(7, 0, 0, 0));
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // State for property data
    const [property, setProperty] = useState([]);

    // State for pagination
    const [page, setPage] = useState(0);
    const [totalPage, setTotalPage] = useState(0);

    // Get property list
    const propertyList = async () => {
        try {
            let res = await Axios.get(API_URL + `/properties/landingproperty?page=${page}`);
            setTotalPage(res.data.totalPage);
            setProperty(res.data.data);
        } catch (error) {
            console.log(error);
        }
    }

    const onSubmitBtn = (value) => {
        let orderdata = { startDate: today, endDate: tomorrow, cityId: { value: value.id_city, label: value.name } }
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
                console.log(res.data);
                navigate(`/detailproperty/${value.id_property}`);
                window.scrollTo(0, 0);
            })
            .catch((err) => {
                console.log(err)
                if (!err.response.data.success) {
                    alert(err.response.data.message);
                }
                console.log("check error", err)
            });
    }

    const handlePageClick = (data) => {
        setPage(data.selected);
    }

    useEffect(() => {
        propertyList();
    }, [page]);

    return (
        <Box px={[8, null, 36]} mt={12}>
            <Text fontSize='3xl' fontWeight='bold'>Homes Guests Love</Text>
            <Text color='gray.500'>Most popular choices for travelers</Text>
            <Grid mt={4} mb={8} templateColumns={['repeat(2, 1fr)', null, 'repeat(4, 1fr)']} gap={4}>
                {property.map((val) => {
                    let price = {};
                    if (val.listrooms.length !== 0) {
                        price = val.listrooms.reduce((previous, current) => {
                            return current.basePrice < previous.basePrice ? current : previous;
                        });
                    }
                    return (
                        <GridItem key={val.id_property} cursor='pointer' onClick={() => onSubmitBtn({ id_city: val.city.id_city, name: val.city.name, id_property: val.id_property })}>
                            <Image borderRadius={8} src={"https://jcwdol00803.purwadhikabootcamp.com" + val.picture} w='full' h={[150, null, 200]} objectFit='cover' />
                            <Text mt={2} fontWeight='bold'>{val.name}</Text>
                            <Text color='gray.500'>{val.city.name}, {val.city.province}</Text>
                            <Text fontSize='sm'>Starting from {Object.keys(price).length === 0 ? '-' : price.basePrice.toLocaleString('id', { style: 'currency', currency: 'IDR' })}</Text>
                        </GridItem>
                    )
                })}
            </Grid>
            <Pagination data={{ totalPage, handlePageClick }} />
        </Box>
    )
}

export default LandingProperty