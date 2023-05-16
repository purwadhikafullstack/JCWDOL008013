import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
    Button,
    Tabs,
    TabList,
    Tab,
    TabPanels,
    TabPanel,
    Flex,
    UnorderedList,
    ListItem
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

function QuickView(props) {
    let data = props.data || []
    return (
    /**
     * You may move the Popover outside Flex.
     */
    <Flex justifyContent="center" mt={4}>
        <Popover placement="bottom" isLazy>
        <PopoverTrigger>
            <Button
            colorScheme="green"
            w="fit-content">
            Available Prop
            </Button>
        </PopoverTrigger>
        <PopoverContent _focus={{ boxShadown: 'none' }}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader fontWeight="bold">List Available</PopoverHeader>
            <PopoverBody w="full">
            <Tabs isLazy colorScheme="green">
                <TabList>
                {data != []?data.map(x=>{
                    return (<Tab key={x.id}
                    _focus={{ boxShadow: 'none' }}
                    fontSize="xs"
                    fontWeight="bold">
                    {x.name}
                    </Tab>)}):<Tab
                    _focus={{ boxShadow: 'none' }}
                    fontSize="xs"
                    fontWeight="bold">
                    No Property
                </Tab>}
                </TabList>
                <TabPanels>
                    {data != []?
                        data.map(x=>{
                            return x.listrooms.length != 0?
                            <TabPanel>
                                <UnorderedList>{x.listrooms.map(y=><ListItem key={y.id} >{y.name}</ListItem>)}</UnorderedList>
                            </TabPanel>:
                            <TabPanel>
                                No Rooms
                            </TabPanel>
                        }):
                        <TabPanel>
                            No Rooms
                        </TabPanel>
                    }
                </TabPanels>
            </Tabs>
            </PopoverBody>
        </PopoverContent>
        </Popover>
    </Flex>
    );
}

export default QuickView;

{/* <UnorderedList >
                        {data != [] ?data.map(x=>{
                            return (<ListItem>{x.name}
                                {x.listrooms.length != 0?<>
                                    <UnorderedList>{x.listrooms.map(y=><ListItem>{y.name}</ListItem>)}</UnorderedList>
                                </> :<></>}
                            </ListItem>)
                        }):<></>}

                    </UnorderedList> */}