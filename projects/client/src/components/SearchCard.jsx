import { Button, Card, CardBody, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react"

const SearchCard = (props) => {
    return (
        <Card mb={4}>
            <CardBody>
                <VStack spacing={4}>
                    <FormControl>
                        <FormLabel>Search:</FormLabel>
                        <Input placeholder={props.data.placeholder} value={props.data.query} onChange={props.data.onChange} />
                    </FormControl>
                    <Button w='full' onClick={props.data.searchButton}>Search</Button>
                    <Button w='full' onClick={props.data.resetButton}>Reset</Button>
                </VStack>
            </CardBody>
        </Card>
    )
}

export default SearchCard