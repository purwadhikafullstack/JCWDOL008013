import { Button, ButtonGroup, Card, CardBody, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"

const UnavailabilityTable = (props) => {
    return (
        <Card>
            <CardBody>
                <TableContainer>
                    <Table>
                        <TableCaption>Unavailable Dates</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Start date</Th>
                                <Th>End date</Th>
                                <Th isNumeric>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {props.data.unavailableData.map((value) => {
                                return (
                                    <Tr key={value.id}>
                                        <Td>{value.start}</Td>
                                        <Td>{value.end}</Td>
                                        <Td isNumeric>
                                            <ButtonGroup>
                                                <Button onClick={() => props.data.edit(value.id)}>Edit</Button>
                                                <Button onClick={() => props.data.delete(value.id)}>Delete</Button>
                                            </ButtonGroup>
                                        </Td>
                                    </Tr>
                                )
                            })}
                        </Tbody>
                    </Table>
                </TableContainer>
                {props.data.pagination}
            </CardBody>
        </Card>
    )
}

export default UnavailabilityTable