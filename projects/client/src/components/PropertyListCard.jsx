import { Box, Card, CardBody, Flex, Image, Link, Text } from "@chakra-ui/react"
import API_URL from "../helper"

const PropertyListCard = (props) => {
    return (
        <>
            {props.data.propertyData.map((value) => {
                let propertyPicture = API_URL + value.picture;
                return (
                    <Link href={'/admin/room?property=' + value.id_property} _hover={{ textDecoration: 'none' }} key={value.id_property}>
                        <Box mb={4} _hover={{ bg: 'gray.100' }} border='1px' borderColor='blue.400' borderRadius={8} p={2}>
                            <Flex gap={[4, 8]}>
                                <Image src={propertyPicture} w={[100, 150, 200]} h={150} borderRadius={8} objectFit='cover' />
                                <Flex justifyContent='space-between' alignItems='center'>
                                    <Box>
                                        <Text fontSize='xl' fontWeight='bold' mb={2}>{value.name}</Text>
                                        <Text display={['none', null, 'block']} bg='blue.500' w='max-content' px={4} mb={2} rounded={20} color='white'>Hotel</Text>
                                        <Text color='gray.500'>{value.city.name}, {value.city.province}</Text>
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

export default PropertyListCard