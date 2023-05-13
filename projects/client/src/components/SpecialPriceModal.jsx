import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Radio, RadioGroup, Stack, VStack } from "@chakra-ui/react"
import { RangeDatepicker } from "chakra-dayzed-datepicker"

const SpecialPriceModal = (props) => {
    return (
        <Modal isOpen={props.data.isOpen} onClose={props.data.onClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{props.data.title}</ModalHeader>
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
                            <FormLabel>Special Price</FormLabel>
                            <RadioGroup value={props.data.value}>
                                <Stack direction='row' spacing='4'>
                                    <Radio value='1' onChange={props.data.setValue}>Nominal</Radio>
                                    <Radio value='2' onChange={props.data.setValue}>Percent</Radio>
                                </Stack>
                            </RadioGroup>
                            <Input mt={2} type='number' value={props.data.value === '1' ? props.data.nominal : props.data.percent} onChange={props.data.value === '1' ? props.data.onChangeNominal : props.data.onChangePercent} />
                        </FormControl>
                    </VStack>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme='blue' w='full' onClick={props.data.onClick}>Save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default SpecialPriceModal