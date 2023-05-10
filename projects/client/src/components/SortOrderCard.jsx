import { Card, CardBody, FormControl, FormLabel, Select, VStack } from "@chakra-ui/react"

const SortOrderCard = (props) => {
    return (
        <Card mb={4}>
            <CardBody>
                <VStack>
                    <FormControl>
                        <FormLabel>Sort your search results by:</FormLabel>
                        <Select onChange={props.data.selectSort}>
                            <option value={props.data.optionValue1}>{props.data.option1}</option>
                            <option value={props.data.optionValue2}>{props.data.option2}</option>
                            <option value={props.data.optionValue3}>{props.data.option3}</option>
                        </Select>
                    </FormControl>
                    <FormControl>
                        <FormLabel>Order by:</FormLabel>
                        <Select onChange={props.data.selectOrder}>
                            <option value='ASC'>Ascending</option>
                            <option value='DESC'>Descending</option>
                        </Select>
                    </FormControl>
                </VStack>
            </CardBody>
        </Card>
    )
}

export default SortOrderCard