import React, { useState, useEffect } from "react";
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
  Input
} from "@chakra-ui/react";
import API_URL from "../helper";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReactPaginate from "react-paginate"

const MyBooking = () => {
  const navigate = useNavigate();
  // auth
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("prw_login") !== null;

    if (!isLoggedIn) {
      navigate("/login");
      return null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //state for generate data
  const [orderData, setOrderData] = useState([])

  // state for responsive
  const isMobile = useBreakpointValue({ base: true, md: false });

  // state for filtering data
  const [statusFil, setStatusFil] = useState("All Status");
  // const [invoiceFil, setInvoiceFil] = useState("All Invoice");
  const [search, setSearch] = useState("")
  const [dateFil, setDateFil] = useState("All Date");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minEndDate, setMinEndDate] = useState("")
  const [showCalendar, setShowCalendar] = useState(false);
  const [sort, setSort] = useState("Invoice Asc");

  // State for pagination
  const [page, setPage] = useState(0)
  const [totalPage, setTotalPage] = useState(0)

  // handle start date filter
  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
    setMinEndDate(addDays(e.target.value, 1)); // Add one day to startDate
  };

  const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result.toISOString().split("T")[0];
  };

  // get selected enddate
  const handleEndDateChange = (event) => {
    if (event.target.value < startDate) {
      alert("End Date must be after Start date")
    } else {
      setEndDate(event.target.value);
    }

  };

  // when filtered by range form is submit
  const handleDateRangeSubmit = (event) => {
    event.preventDefault();
    setDateFil("range");
    setShowCalendar(false)
  };

  // GET ORDERS DATA
  const getOrder = () => {
    let getLocalStorage = localStorage.getItem("prw_login")
    if (getLocalStorage) {
      axios.get(API_URL + `/orders/all?page=${page}&sort=${sort}&status=${statusFil}&datefil=${dateFil}&startdate=${startDate}&enddate=${endDate}&search=${search}`, {
        headers: {
          Authorization: `Bearer ${getLocalStorage}`
        }
      })
        .then((res) => {
          setOrderData(res.data.rows)
          setTotalPage(res.data.totalPage)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  useEffect(() => {
    getOrder()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, sort, statusFil, dateFil, search])

  // Pagination
  const handlePageClick = (data) => {
    setPage(data.selected)
  }

  const onCancelBtn = async (id_order) => {
    try {
      const confirmed = window.confirm("Are you sure you want to cancel this order?");
      if (confirmed) {
        let response = await axios.patch(API_URL + "/orders/cancel", { id_order });
        alert(response.data.message);
        window.location.reload()
      }
    } catch (err) {
      console.log(err.message)
    }
  };

  return (
    <Box ms={[0, null, 60]} borderTopWidth={[0, null, '4px']} borderColor='blue.400'>
      <Box maxW={isMobile ? "90%" : "60%"} mx="auto" mt="5">
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
                <MenuItem onClick={() => setStatusFil("UNPAID")}>
                  UNPAID
                </MenuItem>
                <MenuItem onClick={() => setStatusFil("CANCELED")}>
                  CANCELED
                </MenuItem>
                <MenuItem onClick={() => setStatusFil("PAID")}>
                  PAID
                </MenuItem>
                <MenuItem onClick={() => setStatusFil("CONFIRMED")}>
                  CONFIRMED
                </MenuItem>
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
                <MenuItem onClick={() => setShowCalendar(true)}>Range</MenuItem>
              </MenuList>
            </Menu>
            {showCalendar && (
              <form onSubmit={handleDateRangeSubmit}>
                <label htmlFor="start-date">Start Date:</label>
                <input
                  type="date"
                  id="start-date"
                  value={startDate}
                  min="2000-01-01"
                  onChange={handleStartDateChange}
                />
                <label htmlFor="end-date">End Date:</label>
                <input
                  type="date"
                  id="end-date"
                  value={endDate}
                  // max={new Date().toISOString().split("T")[0]}
                  onChange={handleEndDateChange}
                  min={minEndDate}
                  disabled={!startDate}
                />
                <Button type="submit">Filter</Button>
              </form>
            )}
          </Box>

          {/* Invoice Dropdown */}
          {/* <Box>
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
        </Box> */}
          <Input size={isMobile ? "xs" : "md"} placeholder="Search" onChange={(e) => setSearch(e.target.value)} />

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
          {orderData.map((item) => {
            const months = [
              "Januari",
              "Februari",
              "Maret",
              "April",
              "Mei",
              "Juni",
              "Juli",
              "Agustus",
              "September",
              "Oktober",
              "November",
              "Desember",
            ];
            const date = new Date(item.checkin_date);
            const day = date.getDate();
            const month = months[date.getMonth()];
            const year = date.getFullYear();
            const formattedDate = `${day} ${month} ${year}`;

            return (
              <Box
                key={item.id_order}
                bg="white"
                style={{
                  boxShadow:
                    "rgba(14, 30, 37, 0.12) 0px 2px 4px 0px, rgba(14, 30, 37, 0.32) 0px 2px 16px 0px",
                }}
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
                      {item.property.name}
                    </Text>
                    <Text fontSize="xs" color="gray.500">
                      {item.property.city.name}
                    </Text>
                  </Box>
                  <Box>
                    <Stack direction="column">
                      <Badge
                        colorScheme={
                          item.order_status === "UNPAID"
                            ? "red"
                            : item.order_status === "CANCELED"
                              ? "white"
                              : item.order_status === "PAID"
                                ? "yellow"
                                : "green"
                        }
                        fontWeight="semibold"
                        fontSize="xs"
                        px={6}
                        py={1}
                        borderRadius="full"
                      >
                        {item.order_status}
                      </Badge>
                      {item.order_status === "UNPAID" && (
                        <Button
                          colorScheme="red"
                          size="xs"
                          mt={2}
                          onClick={() => onCancelBtn(item.id_order)}
                        >
                          Cancel Order
                        </Button>
                      )}
                    </Stack>
                  </Box>
                </Flex>

                {/* B. Middle Part */}
                <Flex justifyContent="space-between" alignItems="center" mb={4}>
                  <Text fontWeight="semibold" fontSize="md">
                    {formattedDate}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    Invoice {item.no_invoice}
                  </Text>
                </Flex>

                {/* C. Bottom Part */}
                <Flex justifyContent="space-between" alignItems="center">
                  <Text fontWeight="semibold" fontSize="md">
                    Total Harga
                  </Text>
                  <Text fontWeight="semibold" fontSize="md">
                    {item.total}
                  </Text>
                </Flex>
              </Box>
            );
          })}
        </Box>

        {/* Pagination */}
        <Flex justifyContent="center" alignItems="center" mt={5}>
          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            breakLabel={"..."}
            pageCount={totalPage}
            marginPagesDisplayed={2}
            pageRangeDisplayed={3}
            onPageChange={handlePageClick}
            containerClassName={"pagination justify-content-center"}
            pageClassName={"page-item"}
            pageLinkClassName={"page-link"}
            previousClassName={"page-item"}
            previousLinkClassName={"page-link"}
            nextClassName={"page-item"}
            nextLinkClassName={"page-link"}
            breakClassName={"page-item"}
            breakLinkClassName={"page-link"}
            activeClassName={"active"}
          />
        </Flex>
      </Box>
    </Box>
  );
};

export default MyBooking;
