import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Flex, Icon, Stack, Text } from "@chakra-ui/react"
import { HiOutlineMail } from 'react-icons/hi';
import { BsGenderAmbiguous } from 'react-icons/bs';
import { MdDateRange } from 'react-icons/md';

const ProfileCard = (props) => {
    return (
        <Card w={500}>
            <CardHeader>
                <Flex justifyContent='center'>
                    <Avatar mt={8} size='2xl' src={props.data.picture} />
                </Flex>
            </CardHeader>
            <CardBody>
                <Stack spacing={3}>
                    <Text fontSize='3xl' fontWeight='semibold'>{props.data.username}</Text>
                    <Text fontSize='lg'><Icon as={HiOutlineMail} boxSize={6} mt={-0.5} me={1} />{props.data.email}</Text>
                    <Text fontSize='lg'><Icon as={BsGenderAmbiguous} boxSize={6} mt={-0.5} me={1} />{props.data.gender}</Text>
                    <Text fontSize='lg'><Icon as={MdDateRange} boxSize={6} mt={-0.5} me={1} />{props.data.birthdate}</Text>
                </Stack>
            </CardBody>
            <CardFooter>
                <Button w='full' onClick={props.data.onOpen}>Edit</Button>
            </CardFooter>
        </Card>
    )
}

export default ProfileCard