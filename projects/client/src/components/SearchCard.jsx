import { Box, Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react"

const SearchCard = (props) => {
    return (
        <Box mb={4} border='1px' borderColor='blue.400' borderRadius={8} p={4}>
            <VStack spacing={4}>
                <FormControl>
                    <FormLabel>Search:</FormLabel>
                    <Input placeholder={props.data.placeholder} value={props.data.query} onChange={props.data.onChange} />
                </FormControl>
                <Button colorScheme='blue' w='full' onClick={props.data.searchButton}>Search</Button>
                <Button colorScheme='blue' variant='outline' w='full' onClick={props.data.resetButton}>Reset</Button>
            </VStack>
        </Box>
    )
}

export default SearchCard