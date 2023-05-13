import { Box, Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Divider, Flex, Icon, Image, Text } from "@chakra-ui/react"
import { IoLocationSharp } from "react-icons/io5"

const PropertyDetailCard = (props) => {
    return (
        <Box maxW={800} border='1px' borderColor='blue.400' borderRadius={8} p={4}>
            <Text fontSize='2xl' fontWeight='bold' mb={2}>{props.data.name}</Text>
            <Text bg='blue.500' w='max-content' px={4} mb={2} rounded={20} color='white'>Hotel</Text>
            <Flex mb={6}>
                <Icon as={IoLocationSharp} boxSize={6} me={1} mt={0.5} />
                <Text color='gray.500' fontSize='lg'>{props.data.address}, {props.data.city}</Text>
            </Flex>
            <Flex justifyContent='center' mb={8}>
                <Image src={props.data.picture} rounded={8} />
            </Flex>
            <Text fontWeight='bold'>Description:</Text>
            <Text mb={2}>{props.data.description}</Text>
            <Text fontWeight='bold'>Rules:</Text>
            <Text>{props.data.rules}</Text>
            <Flex flexDirection={['column', null, 'row']} justifyContent='flex-end' mt={8} gap={4}>
                {/* <ButtonGroup> */}
                <Button colorScheme='blue' onClick={props.data.onEditOpen}>Edit</Button>
                <Button colorScheme='red' variant='outline' onClick={props.data.onDeleteOpen}>Delete</Button>
                {/* </ButtonGroup> */}
            </Flex>
        </Box>
    )
}

export default PropertyDetailCard