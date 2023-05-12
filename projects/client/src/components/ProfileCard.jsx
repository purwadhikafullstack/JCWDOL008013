import { Avatar, Box, Button, Flex, Icon, Stack, Text } from "@chakra-ui/react"
import { HiOutlineMail } from 'react-icons/hi';
import { BsGenderAmbiguous } from 'react-icons/bs';
import { MdDateRange } from 'react-icons/md';

const ProfileCard = (props) => {
    return (
        <Box w={500} p={8} border={[0, null, '1px']} borderColor={['', null, 'blue.400']} borderRadius={8}>
            <Flex justifyContent='center'>
                <Avatar size='2xl' src={props.data.picture} />
            </Flex>
            <Text mt={8} fontSize='3xl' fontWeight='semibold'>{props.data.username}</Text>
            <Stack spacing={3} mt={4}>
                <Flex justifyContent='space-between'>
                    <Text fontSize='lg' fontWeight='semibold' color='gray.500'><Icon as={HiOutlineMail} boxSize={6} mt={-0.5} me={1} />Email:</Text>
                    <Text fontSize='lg'>{props.data.email}</Text>
                </Flex>
                <Flex justifyContent='space-between'>
                    <Text fontSize='lg' fontWeight='semibold' color='gray.500'><Icon as={BsGenderAmbiguous} boxSize={6} mt={-0.5} me={1.5} ms={-0.5} />Gender:</Text>
                    <Text fontSize='lg'>{props.data.gender}</Text>
                </Flex>
                <Flex justifyContent='space-between'>
                    <Text fontSize='lg' fontWeight='semibold' color='gray.500'><Icon as={MdDateRange} boxSize={6} mt={-0.5} me={1} />Birthdate:</Text>
                    <Text fontSize='lg'>{props.data.birthdate}</Text>
                </Flex>
            </Stack>
            <Button mt={8} colorScheme='blue' w='full' onClick={props.data.onOpen}>Edit</Button>
        </Box>
    )
}

export default ProfileCard