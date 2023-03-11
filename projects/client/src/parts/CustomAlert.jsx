import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from '@chakra-ui/react'

const CustomAlert = ({ status, title, description, onClose }) => {
    return (
        <Alert status={status} variant="solid" flexDirection="column" alignItems="center" justifyContent="center">
            <AlertIcon />
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
            {onClose && (
                <CloseButton position="absolute" right="8px" top="8px" onClick={onClose} />
            )}
        </Alert>
    )
}

export default CustomAlert