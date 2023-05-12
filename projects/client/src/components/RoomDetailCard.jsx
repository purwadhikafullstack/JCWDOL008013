import { Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Flex, Grid, GridItem, Image, Text } from "@chakra-ui/react"

const RoomDetailCard = (props) => {
    return (
        <Box maxW={800} border='1px' borderColor='blue.400' borderRadius={8} p={4}>
            <Text fontSize='2xl' fontWeight='bold' mb={2}>{props.data.name}</Text>
            <Text bg='green.500' w='max-content' px={4} mb={6} rounded={20} color='white'>Room</Text>
            <Flex justifyContent='center' mb={8}>
                <Image src={props.data.picture} rounded={16} objectFit='cover' />
            </Flex>
            <Text fontWeight='bold'>Description:</Text>
            <Text mb={2}>{props.data.description}</Text>
            <Text fontWeight='bold'>Price:</Text>
            <Text color='blue.500' fontWeight='bold'>Rp {props.data.price.toLocaleString('id')}</Text>
            <Text color='gray.500'>/ room / night(s)</Text>
            <Flex mt={8} justifyContent='center'>
                <Grid templateColumns={['repeat(1, 1fr)', 'repeat(2, 1fr)', null, 'repeat(4, 1fr)']} gap={4} w='full'>
                    <GridItem>
                        <Button variant='outline' onClick={props.data.onPriceOpen} w='full'>Set special price</Button>
                    </GridItem>
                    <GridItem>
                        <Button variant='outline' onClick={props.data.onUnavailableOpen} w='full'>Set unavailability</Button>
                    </GridItem>
                    <GridItem>
                        <Button colorScheme='blue' onClick={props.data.onEditOpen} w='full'>Edit</Button>
                    </GridItem>
                    <GridItem>
                        <Button colorScheme='red' variant='outline' onClick={props.data.onDeleteOpen} w='full'>Delete</Button>
                    </GridItem>
                </Grid>
            </Flex>
        </Box>
        // <Card mt={8} maxW={800}>
        //     <CardHeader>
        //         <Text fontSize='2xl' fontWeight='bold' mb={2}>{props.data.name}</Text>
        //         <Text bg='green.500' w='max-content' px={4} mb={2} rounded={20} color='white'>Room</Text>
        //     </CardHeader>
        //     <CardBody>
        //         <Flex justifyContent='center' mb={8}>
        //             <Image src={props.data.picture} rounded={16} objectFit='cover' />
        //         </Flex>
        //         <Text fontWeight='bold'>Description:</Text>
        //         <Text mb={2}>{props.data.description}</Text>
        //         <Text fontWeight='bold'>Price:</Text>
        //         <Text color='blue.500' fontWeight='bold'>Rp {props.data.price.toLocaleString('id')}</Text>
        //         <Text color='gray.500'>/ room / night(s)</Text>
        //     </CardBody>
        //     <Divider />
        //     <CardFooter justifyContent='center'>
        //         <Grid templateColumns={['repeat(2, 1fr)', null, null, 'repeat(4, 1fr)']} gap={4}>
        //             <GridItem>
        //                 <Button onClick={props.data.onPriceOpen} w={40}>Set special price</Button>
        //             </GridItem>
        //             <GridItem>
        //                 <Button onClick={props.data.onUnavailableOpen} w={40}>Set unavailability</Button>
        //             </GridItem>
        //             <GridItem>
        //                 <Button onClick={props.data.onEditOpen} w={40}>Edit</Button>
        //             </GridItem>
        //             <GridItem>
        //                 <Button onClick={props.data.onDeleteOpen} w={40}>Delete</Button>
        //             </GridItem>
        //         </Grid>
        //     </CardFooter>
        // </Card>
    )
}

export default RoomDetailCard