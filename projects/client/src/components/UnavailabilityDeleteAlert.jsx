import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonGroup } from "@chakra-ui/react"

const UnavailabilityDeleteAlert = (props) => {
    return (
        <AlertDialog isOpen={props.data.isOpen} leastDestructiveRef={props.data.leastDestructiveRef} onClose={props.data.onClose}>
            <AlertDialogOverlay />
            <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>Delete unavailable dates</AlertDialogHeader>
                <AlertDialogBody>Are you sure?</AlertDialogBody>
                <AlertDialogFooter>
                    <ButtonGroup>
                        <Button ref={props.data.leastDestructiveRef} onClick={props.data.onClose}>
                            Cancel
                        </Button>
                        <Button colorScheme='red' onClick={props.data.onClick}>
                            Delete
                        </Button>
                    </ButtonGroup>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default UnavailabilityDeleteAlert