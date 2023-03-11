import {
    Button,
    Container,
    Divider,
    Input,
    Stack,
    Text,
} from "@chakra-ui/react";

import { Logo } from "./Logo";

const Footer = () => {
    return (
        <Container as="footer" role="contentinfo" maxWidth="100%">
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
                    spacing={{
                        base: "6",
                        md: "8",
                    }}
                    align="start"
                >
                    <Logo />
                    <Text color="muted">Create beautiful websites remarkably fast.</Text>
                </Stack>
                <Stack
                    direction={{
                        base: "column-reverse",
                        md: "column",
                        lg: "row",
                    }}
                    spacing={{
                        base: "12",
                        md: "8",
                    }}
                >
                    <Stack direction="row" spacing="8">
                        <Stack spacing="4" minW="36" flex="1">
                            <Text fontSize="sm" fontWeight="semibold" color="subtle">
                                Product
                            </Text>
                            <Stack spacing="3" shouldWrapChildren>
                                <Button variant="link">How it works</Button>
                                <Button variant="link">Pricing</Button>
                                <Button variant="link">Use Cases</Button>
                            </Stack>
                        </Stack>
                        <Stack spacing="4" minW="36" flex="1">
                            <Text fontSize="sm" fontWeight="semibold" color="subtle">
                                Legal
                            </Text>
                            <Stack spacing="3" shouldWrapChildren>
                                <Button variant="link">Privacy</Button>
                                <Button variant="link">Terms</Button>
                                <Button variant="link">License</Button>
                            </Stack>
                        </Stack>
                    </Stack>
                    <Stack spacing="4">
                        <Text fontSize="sm" fontWeight="semibold" color="subtle">
                            Stay up to date
                        </Text>
                        <Stack
                            spacing="4"
                            direction={{
                                base: "column",
                                sm: "row",
                            }}
                            maxW={{
                                lg: "360px",
                            }}
                        >
                            <Input placeholder="Enter your email" type="email" required />
                            <Stack direction="row" align="center">
                                <Button
                                    variant="solid"
                                    type="submit"
                                    flexShrink={0}
                                    colorScheme="teal"
                                >
                                    Subscribe
                                </Button>
                            </Stack>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>
            <Divider />
        </Container>
    )
};

export default Footer