import { Box, Button, ButtonGroup, FormControl, HStack, Heading, Select, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"

const UnavailabilityTable = (props) => {
    return (
        <Box>
            <Heading textAlign='center'>Unavailable Dates</Heading>
            <HStack mt={12}>
                <FormControl>
                    <Select onChange={(e) => props.data.sort(e.target.value)}>
                        <option value='id_availability'>ID</option>
                        <option value='start_date'>Start Date</option>
                        <option value='end_date'>End Date</option>
                    </Select>
                </FormControl>
                <FormControl>
                    <Select onChange={(e) => props.data.order(e.target.value)}>
                        <option value='ASC'>Ascending</option>
                        <option value='DESC'>Descending</option>
                    </Select>
                </FormControl>
            </HStack>
            <TableContainer mt={8}>
                <Table size='sm'>
                    <Thead>
                        <Tr>
                            <Th>Start date</Th>
                            <Th>End date</Th>
                            <Th isNumeric>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {props.data.unavailableLimitData.map((value) => {
                            return (
                                <Tr key={value.id}>
                                    <Td>{value.start}</Td>
                                    <Td>{value.end}</Td>
                                    <Td isNumeric>
                                        <ButtonGroup>
                                            {/* <Button onClick={() => props.data.edit(value.id)}>Edit</Button> */}
                                            <Button colorScheme='red' variant='outline' onClick={() => props.data.delete(value.id)}>Delete</Button>
                                        </ButtonGroup>
                                    </Td>
                                </Tr>
                            )
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
            <Box mt={8}>
                {props.data.pagination}
            </Box>
        </Box>
    )
}

export default UnavailabilityTable