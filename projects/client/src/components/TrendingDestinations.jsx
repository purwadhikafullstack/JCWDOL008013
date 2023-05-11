import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { activeOrder } from "../actions/orderUserAction";
import Axios from "axios";
import API_URL from "../helper";
import { useNavigate } from "react-router-dom";

const TrendingDestinations = (props) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const today = new Date(new Date().setHours(0, 0, 0, 0));

    const onSubmitBtn = (value) => {
        let orderdata = { startDate: today, endDate: today, cityId: value };
        let formed = JSON.stringify(orderdata);
        localStorage.setItem('order_form', formed);
        dispatch(activeOrder(formed));

        let getLocalStorage = localStorage.getItem('prw_login');
        Axios.get(API_URL + `/orders/availableproperty`, {
            params: orderdata,
            headers: {
                "Authorization": `Bearer ${getLocalStorage}`
            }
        })
            .then((res) => {
                console.log(res.data);
                navigate("/search");
            })
            .catch((err) => {
                console.log(err)
                if (!err.response.data.success) {
                    alert(err.response.data.message);
                }
                console.log("check error", err);
            });
    };

    return (
        <Box px={[8, null, 36]} mt={8}>
            <Flex flexDirection='column' alignItems='center'>
                <Box w='full'>
                    <Text fontSize='3xl' fontWeight='bold'>Trending Destinations</Text>
                    <Text color='gray.500'>Pick a vibe and explore the top destinations in Indonesia</Text>
                    <Flex gap={4} mt={4} flexDirection={['column', null, 'row']}>
                        <Box h={[200, null, 300]} w={['100%', null, '50%']} position='relative' cursor='pointer' onClick={() => onSubmitBtn({ value: 17, label: 'Kabupaten Badung' })}>
                            <Image borderRadius={8} h='full' w='full' objectFit='cover' src='https://cms-asset.ayana.com/OG_Image_ARSB_66cefac2a6.jpg' />
                            <Text position='absolute' top={4} left={4} color='white' fontSize='2xl' fontWeight='bold'>Badung, Bali</Text>
                        </Box>
                        <Box h={[200, null, 300]} w={['100%', null, '50%']} position='relative' cursor='pointer' onClick={() => onSubmitBtn({ value: 501, label: 'Kota Yogyakarta' })}>
                            <Image borderRadius={8} h='full' w='full' objectFit='cover' src='https://www.indonesia.travel/content/dam/indtravelrevamp/en/destinations/java/di-yogyakarta/image11.jpg' />
                            <Text position='absolute' top={4} left={4} color='white' fontSize='2xl' fontWeight='bold'>Yogyakarta, DI Yogyakarta</Text>
                        </Box>
                    </Flex>
                    <Flex gap={4} mt={4} flexDirection={['column', null, 'row']}>
                        <Box h={[200, null, 300]} w={['100%', null, '33%']} position='relative' cursor='pointer' onClick={() => onSubmitBtn({ value: 23, label: 'Kota Bandung' })}>
                            <Image borderRadius={8} h='full' w='full' objectFit='cover' src='https://res.klook.com/images/fl_lossy.progressive,q_65/c_fill,w_1200,h_630/w_80,x_15,y_15,g_south_west,l_Klook_water_br_trans_yhcmh3/activities/feamccwtfm4afqbyqtxh/Lembang%20Tour%20from%20Bandung,%20Indonesia.jpg' />
                            <Text position='absolute' top={4} left={4} color='white' fontSize='2xl' fontWeight='bold'>Bandung, Jawa Barat</Text>
                        </Box>
                        <Box h={[200, null, 300]} w={['100%', null, '33%']} position='relative' cursor='pointer' onClick={() => onSubmitBtn({ value: 152, label: 'Kota Jakarta Pusat' })}>
                            <Image borderRadius={8} h='full' w='full' objectFit='cover' src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Jakarta_Skyline_Part_2.jpg/800px-Jakarta_Skyline_Part_2.jpg' />
                            <Text position='absolute' top={4} left={4} color='white' fontSize='2xl' fontWeight='bold'>Jakarta Pusat, DKI Jakarta</Text>
                        </Box>
                        <Box h={[200, null, 300]} w={['100%', null, '33%']} position='relative' cursor='pointer' onClick={() => onSubmitBtn({ value: 256, label: 'Kota Malang' })}>
                            <Image borderRadius={8} h='full' w='full' objectFit='cover' src='https://img.okezone.com/content/2018/12/02/406/1985747/5-objek-wisata-batu-malang-yang-lagi-hits-di-medsos-sudah-pernah-singgah-belum-0tjVWSB8YX.jpg' />
                            <Text position='absolute' top={4} left={4} color='white' fontSize='2xl' fontWeight='bold'>Malang, Jawa Timur</Text>
                        </Box>
                    </Flex>
                </Box>
            </Flex>
        </Box>
    )
}

export default TrendingDestinations