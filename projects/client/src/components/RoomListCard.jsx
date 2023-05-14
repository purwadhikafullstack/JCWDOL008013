import { Box, Card, CardBody, Flex, Image, Link, Text } from "@chakra-ui/react"
import API_URL from '../helper';

const RoomListCard = (props) => {
    const search = props.data.search;
    return (
        <>
            {props.data.roomData.map((value) => {
                let roomPicture = API_URL + value.picture;
                return (
                    <Link href={'/admin/room/detail' + search + '&room=' + value.id_room} _hover={{ textDecoration: 'none' }} key={value.id_room}>
                        <Box mb={4} _hover={{ bg: 'gray.100' }} border='1px' borderColor='blue.400' borderRadius={8} p={2}>
                            <Flex gap={[4, 8]}>
                                <Image src={roomPicture} w={[100, 150, 200]} h={150} borderRadius={8} objectFit='cover' />
                                <Flex justifyContent='space-between' alignItems='center'>
                                    <Box>
                                        <Text fontSize={['md', null, 'xl']} fontWeight='bold' mb={2}>{value.name}</Text>
                                        <Text bg='green.500' w='max-content' px={4} mb={2} rounded={20} color='white'>Room</Text>
                                        <Text color='blue.500' fontWeight='bold'>Rp {value.basePrice.toLocaleString('id')}</Text>
                                        <Text color='gray.500'>/ room / night(s)</Text>
                                    </Box>
                                </Flex>
                            </Flex>
                        </Box>
                    </Link>
                )
            })}
        </>
    )
}

export default RoomListCard