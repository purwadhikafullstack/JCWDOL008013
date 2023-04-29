import { Button, Card, CardBody, FormLabel } from "@chakra-ui/react"

const CreatePropertyRoomCard = (props) => {
    return (
        <Card>
            <CardBody>
                <FormLabel>{props.data.title}</FormLabel>
                <Button w='full' onClick={props.data.onCreateOpen}>Create</Button>
            </CardBody>
        </Card>
    )
}

export default CreatePropertyRoomCard