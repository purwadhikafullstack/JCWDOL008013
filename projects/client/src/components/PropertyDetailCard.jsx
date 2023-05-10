import { Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Divider, Flex, Icon, Image, Text } from "@chakra-ui/react"
import { IoLocationSharp } from "react-icons/io5"

const PropertyDetailCard = (props) => {
    return (
        <Card maxW={800}>
            <CardHeader>
                <Text fontSize='2xl' fontWeight='bold' mb={2}>{props.data.name}</Text>
                <Text bg='blue.500' w='max-content' px={4} mb={2} rounded={20} color='white'>Hotel</Text>
                <Flex>
                    <Icon as={IoLocationSharp} boxSize={6} me={1} mt={0.5} />
                    <Text color='gray.500' fontSize='lg'>{props.data.address}, {props.data.city}</Text>
                </Flex>
            </CardHeader>
            <CardBody>
                <Flex justifyContent='center' mb={8}>
                    <Image src={props.data.picture} rounded={16} />
                </Flex>
                <Text fontWeight='bold'>Description:</Text>
                <Text mb={2}>{props.data.description}</Text>
                <Text fontWeight='bold'>Rules:</Text>
                <Text>{props.data.rules}</Text>
            </CardBody>
            <Divider />
            <CardFooter justifyContent='flex-end'>
                <ButtonGroup>
                    <Button onClick={props.data.onEditOpen}>Edit</Button>
                    <Button onClick={props.data.onDeleteOpen}>Delete</Button>
                </ButtonGroup>
            </CardFooter>
        </Card>
    )
}

export default PropertyDetailCard