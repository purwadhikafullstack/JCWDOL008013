import { Box, Card, CardBody, Flex, Image, Link, Text } from "@chakra-ui/react"
import API_URL from '../helper';

const RoomListCard = (props) => {
    const search = props.data.search;
    return (
        <>
            {props.data.roomData.map((value) => {
                let roomPicture = API_URL + value.picture;
                return (
                    <Link href={'/tenant/room/detail' + search + '&room=' + value.id_room} _hover={{ textDecoration: 'none' }} key={value.id_room}>
                        <Card mb={4} maxW={700} _hover={{ bg: 'gray.100' }}>
                            <Flex>
                                <Image src={roomPicture} maxW={[150, null, 200]} roundedLeft={5} />
                                <CardBody alignSelf='center'>
                                    <Flex justifyContent='space-between'>
                                        <Box>
                                            <Text fontSize={['md', null, 'xl']} fontWeight='bold' mb={2}>{value.name}</Text>
                                            <Text display={['none', null, 'block']} bg='green.500' w='max-content' px={4} mb={2} rounded={20} color='white'>Room</Text>
                                            <Text color='blue.500' fontWeight='bold'>Rp {value.basePrice.toLocaleString('id')}</Text>
                                            <Text color='gray.500'>/ room / night(s)</Text>
                                        </Box>
                                    </Flex>
                                </CardBody>
                            </Flex>
                        </Card>
                    </Link>
                )
            })}
        </>
    )
}

export default RoomListCard