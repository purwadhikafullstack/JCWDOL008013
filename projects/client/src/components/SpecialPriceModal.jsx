import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, VStack } from "@chakra-ui/react"
import { RangeDatepicker } from "chakra-dayzed-datepicker"

const SpecialPriceModal = (props) => {
    return (
        <Modal isOpen={props.data.isOpen} onClose={props.data.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Set room special price</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <VStack>
                        <FormControl>
                            <FormLabel>Date</FormLabel>
                            <RangeDatepicker
                                selectedDates={props.data.selectedDates}
                                onDateChange={props.data.onDateChange}
                                closeOnSelect={true}
                                minDate={new Date()}
                                propsConfigs={{
                                    inputProps: {
                                        placeholder: 'Select date range'
                                    },
                                }}
                                configs={{
                                    dateFormat: 'dd/MM/yyyy'
                                }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Nominal</FormLabel>
                            <Input type='number' onChange={props.data.onChangeNominal} />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Percent</FormLabel>
                            <Input type='number' onChange={props.data.onChangePercent} />
                        </FormControl>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={props.data.onClick}>Save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default SpecialPriceModal