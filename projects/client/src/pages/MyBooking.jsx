import React, { useState } from "react";
import {
  Box,
  Flex,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useBreakpointValue,
  Text,
  Badge,
  Stack,
} from "@chakra-ui/react";

const MyBooking = () => {
 
  const data = [
    {
      id: 1,
      propertyName: "Property A",
      cityName: "City A",
      orderStatus: "Menunggu Pembayaran",
      checkinDate: "2023-04-01",
      invoiceNumber: "1234",
      totalPrice: "Rp. 3.000.000",
    },
    {
      id: 2,
      propertyName: "Property B",
      cityName: "City B",
      orderStatus: "Menunggu Konfirmasi",
      checkinDate: "2023-04-02",
      invoiceNumber: "5678",
      totalPrice: "Rp. 4.000.000",
    },
    {
      id: 3,
      propertyName: "Property C",
      cityName: "City C",
      orderStatus: "Diproses",
      checkinDate: "2023-04-03",
      invoiceNumber: "9101",
      totalPrice: "Rp. 5.000.000",
    },
    {
      id: 4,
      propertyName: "Property D",
      cityName: "City D",
      orderStatus: "Dibatalkan",
      checkinDate: "2022-10-10",
      invoiceNumber: "4321",
      totalPrice: "Rp. 1.000.000",
    },
    {
      id: 5,
      propertyName: "Property E",
      cityName: "City E",
      orderStatus: "Menunggu Pembayaran",
      checkinDate: "2022-12-15",
      invoiceNumber: "8765",
      totalPrice: "Rp. 2.000.000",
    },
    {
      id: 6,
      propertyName: "Property F",
      cityName: "City F",
      orderStatus: "Diproses",
      checkinDate: "2022-11-20",
      invoiceNumber: "2468",
      totalPrice: "Rp. 1.500.000",
    },
    {
      id: 7,
      propertyName: "Property G",
      cityName: "City G",
      orderStatus: "Menunggu Konfirmasi",
      checkinDate: "2022-08-01",
      invoiceNumber: "1357",
      totalPrice: "Rp. 2.500.000",
    },
    {
      id: 8,
      propertyName: "Property H",
      cityName: "City H",
      orderStatus: "Dibatalkan",
      checkinDate: "2022-09-10",
      invoiceNumber: "9753",
      totalPrice: "Rp. 3.000.000",
    },
    {
      id: 9,
      propertyName: "Property I",
      cityName: "City I",
      orderStatus: "Menunggu Pembayaran",
      checkinDate: "2022-10-25",
      invoiceNumber: "8642",
      totalPrice: "Rp. 2.200.000",
    },

    {
      id: 10,
      propertyName: "Property C",
      cityName: "City C",
      orderStatus: "Diproses",
      checkinDate: "2023-04-08",
      invoiceNumber: "4342",
      totalPrice: "Rp. 6.000.000",
    },
    {
      id: 11,
      propertyName: "Property B",
      cityName: "City B",
      orderStatus: "Menunggu Pembayaran",
      checkinDate: "2023-04-09",
      invoiceNumber: "2423",
      totalPrice: "Rp. 3.500.000",
    },
    {
      id: 12,
      propertyName: "Property A",
      cityName: "City A",
      orderStatus: "Menunggu Konfirmasi",
      checkinDate: "2023-04-10",
      invoiceNumber: "9821",
      totalPrice: "Rp. 2.500.000",
    },
    {
      id: 13,
      propertyName: "Property E",
      cityName: "City D",
      orderStatus: "Menunggu Pembayaran",
      checkinDate: "2022-12-23",
      invoiceNumber: "6512",
      totalPrice: "Rp. 1.500.000",
    },
    {
      id: 14,
      propertyName: "Property F",
      cityName: "City E",
      orderStatus: "Diproses",
      checkinDate: "2022-12-24",
      invoiceNumber: "7765",
      totalPrice: "Rp. 5.000.000",
    },
    {
      id: 15,
      propertyName: "Property D",
      cityName: "City D",
      orderStatus: "Dibatalkan",
      checkinDate: "2022-12-25",
      invoiceNumber: "1098",
      totalPrice: "Rp. 4.000.000",
    },
    {
      id: 16,
      propertyName: "Property E",
      cityName: "City D",
      orderStatus: "Diproses",
      checkinDate: "2022-12-26",
      invoiceNumber: "7543",
      totalPrice: "Rp. 3.500.000",
    },
    {
      id: 17,
      propertyName: "Property A",
      cityName: "City A",
      orderStatus: "Menunggu Pembayaran",
      checkinDate: "2022-12-27",
      invoiceNumber: "9342",
      totalPrice: "Rp. 2.500.000",
    },
    {
      id: 18,
      propertyName: "Property B",
      cityName: "City B",
      orderStatus: "Menunggu Konfirmasi",
      checkinDate: "2022-12-28",
      invoiceNumber: "2314",
      totalPrice: "Rp. 4.500.000",
    },
    {
      id: 19,
      propertyName: "Property C",
      cityName: "City C",
      orderStatus: "Diproses",
      checkinDate: "2022-12-29",
      invoiceNumber: "7890",
      totalPrice: "Rp. 3.000.000",
    },
    {
      id: 20,
      propertyName: "Property F",
      cityName: "City E",
      orderStatus: "Menunggu Pembayaran",
      checkinDate: "2022-12-30",
      invoiceNumber: "3456",
      totalPrice: "Rp. 3.000.000",
    },
  ];

  const isMobile = useBreakpointValue({ base: true, md: false });
  const [statusFil, setStatusFil] = useState("All Status");
  const [invoiceFil, setInvoiceFil] = useState("All Invoice");
  const [dateFil, setDateFil] = useState("All Date");
  const [sort, setSort] = useState("Invoice Asc");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const pageNumbers = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <Box maxW={isMobile ? "90%" : "1100px"} mx="auto" mt="5">
      {/* Menu */}
      <Flex justify={isMobile ? "center" : "space-evenly"} alignItems="center">
        {/* Status Dropdown */}
        <Box>
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              size={isMobile ? "xs" : "md"}
            >
              {statusFil}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setStatusFil("All Status")}>
                All Status
              </MenuItem>
              <MenuItem onClick={() => setStatusFil("Menunggu Pembayaran")}>
                Menunggu Pembayaran
              </MenuItem>
              <MenuItem onClick={() => setStatusFil("Dibatalkan")}>
                Dibatalkan
              </MenuItem>
              <MenuItem onClick={() => setStatusFil("Menunggu Konfirmasi")}>
                Menunggu Konfirmasi
              </MenuItem>
              <MenuItem onClick={() => setStatusFil("Diproses")}>
                Diproses
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>

        {/* Invoice Dropdown */}
        <Box>
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              size={isMobile ? "xs" : "md"}
            >
              {invoiceFil}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setInvoiceFil("All Invoice")}>
                All Invoice
              </MenuItem>
              <MenuItem onClick={() => setInvoiceFil(1234)}>1234</MenuItem>
              <MenuItem onClick={() => setInvoiceFil(5678)}>5678</MenuItem>
              <MenuItem onClick={() => setInvoiceFil(9101)}>9101</MenuItem>
              <MenuItem onClick={() => setInvoiceFil(1213)}>1213</MenuItem>
            </MenuList>
          </Menu>
        </Box>

        {/* Date Dropdown */}
        <Box>
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              size={isMobile ? "xs" : "md"}
            >
              {dateFil}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setDateFil("All Date")}>
                All Date
              </MenuItem>
              <MenuItem onClick={() => setDateFil("30 days")}>30 days</MenuItem>
              <MenuItem onClick={() => setDateFil("90 days")}>90 days</MenuItem>
              <MenuItem onClick={() => setDateFil("range")}>
                <form>
                  <input type="date" />
                  <input type="date" />
                  <Button type="submit">Filter</Button>
                </form>
              </MenuItem>
            </MenuList>
          </Menu>
        </Box>

        {/* Order Dropdown */}
        <Box>
          <Menu>
            <MenuButton
              as={Button}
              variant="outline"
              size={isMobile ? "xs" : "md"}
            >
              {sort}
            </MenuButton>
            <MenuList>
              <MenuItem onClick={() => setSort("Invoice Asc")}>
                Invoice Asc
              </MenuItem>
              <MenuItem onClick={() => setSort("Invoice Des")}>
                Invoice Des
              </MenuItem>
              <MenuItem onClick={() => setSort("Date Asc")}>Date Asc</MenuItem>
              <MenuItem onClick={() => setSort("Date Des")}>Date Des</MenuItem>
            </MenuList>
          </Menu>
        </Box>
      </Flex>

      {/* CardList */}
      <Box
        maxW={isMobile ? "100%" : "1100px"}
        bg="white"
        borderRadius="md"
        boxShadow="base"
        p={1}
        mt={3}
      >
        {currentItems.map((item) => (
          <Box
            key={item.id}
            bg="white"
            boxShadow={isMobile ? "md" : "base"}
            borderRadius="md"
            p={2}
            my={5}
            variant="outline"
          >
            {/* A. Top Part */}
            <Flex
              justifyContent="space-between"
              alignItems="center"
              mb={4}
              backgroundColor={"gray.300"}
            >
              <Box>
                <Text fontSize="md" fontWeight="semibold">
                  {item.propertyName}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {item.cityName}
                </Text>
              </Box>
              <Box>
                <Stack direction="column">
                  <Badge
                    colorScheme={
                      item.orderStatus === "Menunggu Pembayaran"
                        ? "orange"
                        : item.orderStatus === "Dibatalkan"
                        ? "red"
                        : item.orderStatus === "Menunggu Konfirmasi"
                        ? "yellow"
                        : "green"
                    }
                    fontWeight="semibold"
                    fontSize="xs"
                    px={6}
                    py={1}
                    borderRadius="full"
                  >
                    {item.orderStatus}
                  </Badge>
                  {item.orderStatus === "Menunggu Pembayaran" && (
                    <Button colorScheme="red" size="xs" mt={2}>
                      Batalkan Pesanan
                    </Button>
                  )}
                </Stack>
              </Box>
            </Flex>

            {/* B. Middle Part */}
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
              <Text fontWeight="semibold" fontSize="md">
                {item.checkinDate}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Invoice {item.invoiceNumber}
              </Text>
            </Flex>

            {/* C. Bottom Part */}
            <Flex justifyContent="space-between" alignItems="center">
              <Text fontWeight="semibold" fontSize="md">
                Total Harga
              </Text>
              <Text fontWeight="semibold" fontSize="md">
                {item.totalPrice}
              </Text>
            </Flex>
          </Box>
        ))}
      </Box>

      {/* Pagination */}
      <Flex justifyContent="center" alignItems="center" mt={5}>
      <Button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>
        <Button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </Flex>
    </Box>
  );
};

export default MyBooking;
