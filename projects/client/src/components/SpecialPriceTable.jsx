import { Button, ButtonGroup, Card, CardBody, Table, TableCaption, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react"

const SpecialPriceTable = (props) => {
    return (
        <Card mt={6}>
            <CardBody>
                <TableContainer>
                    <Table>
                        <TableCaption>Special Price Dates</TableCaption>
                        <Thead>
                            <Tr>
                                <Th>Start date</Th>
                                <Th>End date</Th>
                                <Th>Nominal</Th>
                                <Th>Percent</Th>
                                <Th isNumeric>Actions</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {props.data.priceData.map((value) => {
                                return (
                                    <Tr key={value.id}>
                                        <Td>{value.start}</Td>
                                        <Td>{value.end}</Td>
                                        <Td>{value.nominal}</Td>
                                        <Td>{value.percent}</Td>
                                        <Td isNumeric>
                                            <ButtonGroup>
                                                <Button>Edit</Button>
                                                <Button>Delete</Button>
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

export default SpecialPriceTable