import { AlertDialog, AlertDialogBody, AlertDialogCloseButton, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, ButtonGroup, Flex } from "@chakra-ui/react"

const DeleteAlert = (props) => {
    return (
        <AlertDialog isOpen={props.data.isOpen} leastDestructiveRef={props.data.leastDestructiveRef} onClose={props.data.onClose}>
            <AlertDialogOverlay />
            <AlertDialogContent>
                <AlertDialogHeader fontSize='lg' fontWeight='bold'>{props.data.title}</AlertDialogHeader>
                <AlertDialogCloseButton />
                <AlertDialogBody>Are you sure?</AlertDialogBody>
                <AlertDialogFooter>
                    {/* <ButtonGroup> */}
                    <Flex flexDirection='column' w='full' gap={4}>
                        <Button colorScheme='red' w='full' variant='outline' onClick={props.data.onClick}>
                            Delete
                        </Button>
                        <Button colorScheme='blue' w='full' ref={props.data.leastDestructiveRef} onClick={props.data.onClose}>
                            Cancel
                        </Button>
                    </Flex>
                    {/* </ButtonGroup> */}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteAlert