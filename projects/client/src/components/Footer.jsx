import {
    Button,
    Container,
    Divider,
    Flex,
    Icon,
    Image,
    Input,
    Stack,
    Text,
} from "@chakra-ui/react";

import { Logo } from "./Logo";

import { MdHotel } from "react-icons/md"

const Footer = () => {
    return (
        <Container as="footer" role="contentinfo" maxWidth="100%" bg='blue.400' px={[8, null, 36]}>
            <Stack
                spacing="8"
                direction={{
                    base: "column",
                    md: "row",
                }}
                justify="space-between"
                py={{
                    base: "12",
                    md: "16",
                }}
            >
                <Stack
                    align="start"
                    direction={{
                        base: "row",
                        md: "column",
                    }}
                >
                    {/* <Logo /> */}
                    <Icon as={MdHotel} boxSize={20} color='white' mt={[-4, null, 0]} me={[4, null, 0]} />
                    <Text color="white" fontSize='3xl' fontWeight='bold'>StayComfy</Text>
                </Stack>
                <Divider display={['block', null, 'none']} />
                <Flex direction="row" gap={12}>
                    <Stack spacing="4" minW="36" flex="1">
                        <Text fontSize='xl' fontWeight="bold" color='white'>
                            Product
                        </Text>
                        <Stack spacing="3" shouldWrapChildren>
                            <Button variant="link" color='white'>How it works</Button>
                            <Button variant="link" color='white'>Pricing</Button>
                            <Button variant="link" color='white'>Use Cases</Button>
                        </Stack>
                    </Stack>
                    <Stack spacing="4" minW="36" flex="1">
                        <Text fontSize='xl' fontWeight="bold" color='white'>
                            Legal
                        </Text>
                        <Stack spacing="3" shouldWrapChildren>
                            <Button variant="link" color='white'>Privacy</Button>
                            <Button variant="link" color='white'>Terms</Button>
                            <Button variant="link" color='white'>License</Button>
                        </Stack>
                    </Stack>
                </Flex>
            </Stack>
        </Container>
    )
};

export default Footer