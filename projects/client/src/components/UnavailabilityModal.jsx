import { Button, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react"
import { RangeDatepicker } from "chakra-dayzed-datepicker"

const UnavailabilityModal = (props) => {
    return (
        <Modal isOpen={props.data.isOpen} onClose={props.data.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{props.data.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
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
                </ModalBody>
                <ModalFooter>
                    <Button onClick={props.data.onClick}>Save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default UnavailabilityModal