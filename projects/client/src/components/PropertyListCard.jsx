import { Box, Card, CardBody, Flex, Image, Link, Text } from "@chakra-ui/react"
import API_URL from "../helper"

const PropertyListCard = (props) => {
    return (
        <>
            {props.data.propertyData.map((value) => {
                let propertyPicture = API_URL + value.picture;
                return (
                    <Link href={'/tenant/room?property=' + value.id_property} _hover={{ textDecoration: 'none' }} key={value.id_property}>
                        <Card mb={4} maxW={700} _hover={{ bg: 'gray.100' }}>
                            <Flex>
                                <Image src={propertyPicture} maxW={[150, null, 200]} roundedLeft={5} />
                                <CardBody alignSelf='center'>
                                    <Flex justifyContent='space-between'>
                                        <Box>
                                            <Text fontSize='2xl' fontWeight='bold' mb={2}>{value.name}</Text>
                                            <Text display={['none', null, 'block']} bg='blue.500' w='max-content' px={4} mb={2} rounded={20} color='white'>Hotel</Text>
                                            <Text color='gray.500'>{value.city.name}, {value.city.province}</Text>
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

export default PropertyListCard