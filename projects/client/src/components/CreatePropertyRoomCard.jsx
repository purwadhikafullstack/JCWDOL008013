import { Box, Button, Card, CardBody, FormLabel } from "@chakra-ui/react"

const CreatePropertyRoomCard = (props) => {
    return (
        <Box border='1px' borderColor='blue.400' borderRadius={8} p={4}>
            <FormLabel>{props.data.title}</FormLabel>
            <Button colorScheme='blue' w='full' onClick={props.data.onOpen}>Create</Button>
        </Box>
    )
}

export default CreatePropertyRoomCard