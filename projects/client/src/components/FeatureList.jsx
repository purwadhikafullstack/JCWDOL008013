import { ReactElement } from 'react';
import { Box, SimpleGrid, Icon, Text, Stack, Flex } from '@chakra-ui/react';
import { FcAssistant, FcDonate, FcInTransit, FcLock, FcMoneyTransfer } from 'react-icons/fc';

const FeatureBox = ( {title, text, icon} ) => {
    return (
        <Stack>
        <Flex
            w={16}
            h={16}
            align={'center'}
            justify={'center'}
            color={'white'}
            rounded={'full'}
            bg={'gray.100'}
            mb={1}>
            {icon}
        </Flex>
        <Text fontWeight={600}>{title}</Text>
        <Text color={'gray.600'}>{text}</Text>
        </Stack>
    );
};

export default function FeatureList(props) {
    
    return (
        <Box px={36} my={24}>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10}>
                {props.fitur.map((data,index)=>(
                    <FeatureBox
                        key={index}
                        icon={data.icon}
                        title={data.title}
                        text={data.text}
                        />
                ))}
                {/* <FeatureBox
                icon={<Icon as={FcMoneyTransfer} w={10} h={10} />}
                title={'Hassle-Free'}
                text={
                    'Make a transaction from anywhere at any time, from desktop, mobile app, or mobile web.'
                }
                />
                <FeatureBox
                icon={<Icon as={FcAssistant} w={10} h={10} />}
                title={'Service You Can Trust'}
                text={
                    'You get what you paid for – guaranteed.'
                }
                />
                <FeatureBox
                icon={<Icon as={FcLock} w={10} h={10} />}
                title={'Secure Transaction Guaranteed'}
                text={
                    'Security and privacy of your online transaction are protected'
                }
                /> */}
            </SimpleGrid>
        </Box>
    );
}