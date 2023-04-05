import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import API_URL from '../helper';
import { DataTable } from '../components/Datatable';
import { createColumnHelper } from "@tanstack/react-table";
import { useNavigate } from 'react-router-dom';
import { Box, Button, Center, Container, Flex, Heading, Input, Select, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import { useFormik } from "formik";
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';

function OrderList() {
    const navigate = useNavigate();

    const { isTenant,id_user } = useSelector((state) => {
        return {
            id_user: state.userReducer.id_user || null,
            isTenant: state.userReducer.isTenant || false,
        };
    });

    const [page,setPage]= useState(1)
    const [perpage,setPerPage]= useState(10)
    const [total, setTotalItem] = useState(0)
    const [status,setStatus]= useState("")
    const [ordercolumn,setOrderColumn]= useState("id_order")
    const [orderpos,setOrderPos]= useState("desc")
    const [filterText,setFilterText]= useState("")
    const [data,setData] = useState([])

    const loadOrders = ()=>{
        let getLocalStorage = localStorage.getItem("prw_login")
        Axios.get(API_URL + `/orders`,{params:{
            offset:page,
            limit:perpage,
            status,
            ordercolumn,
            orderpos,
            filter:filterText
        },
            headers: {
                Authorization: `Bearer ${getLocalStorage}`
            }
        })
        .then((res) => {
            setData(res.data.data)
            setTotalItem(res.data.total)
        })
        .catch((err) => {
            console.log(err)
            if (!err.response.data.success) {
                alert(err.response.data.message);
            }
            console.log("check error", err)
        });
    }

    const formik = useFormik({
        initialValues:{
            filter:'',
            ordercolumn:'',
            orderpos:'',
            status:''
        },
        onSubmit:(val)=>{
            setStatus(val.status)
            setOrderColumn(val.ordercolumn)
            setOrderPos(val.orderpos)
            setFilterText(val.filter)
        },
        onReset:(val)=>{
            setStatus(val.status)
            setOrderColumn(val.ordercolumn)
            setOrderPos(val.orderpos)
            setFilterText(val.filter)
        }
    })

    useEffect(()=>{
        loadOrders()
    },[status,ordercolumn,orderpos,filterText,page])

    useEffect(()=>{
        console.log(isTenant,id_user)
    },[])

    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor("no_invoice", {
            cell: (info) => info.getValue() || "-",
            header: "No Invoice"
        }),
        columnHelper.accessor("property.name", {
            cell: (info) => info.getValue() || "-",
            header: "property"
        }),
        columnHelper.accessor("user.username", {
            cell: (info) => info.getValue() || "-",
            header: "Pembeli"
        }),
        columnHelper.accessor("order_status", {
            cell: (info) => info.getValue() || "-",
            header: "Status Order"
        }),
        columnHelper.display({
            cell: (props) => {
                return props.row.original.order_status == "PAID" ? <Button onClick={()=>detailOrder(props.row.original.id_order,"process")}>Process Order</Button>:
                props.row.original.order_status == "UNPAID"? <Button onClick={()=>detailOrder(props.row.original.id_order,"reject")}>Reject Order</Button> : "-"
            },
            header: "Action"
        })
    ];

    const detailOrder = (id,action) =>{
        navigate("/admin/order/detail/"+id+"/"+action)
    }

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        setPage(event.selected+1)
    };

    return !isTenant?
            <Box p={10} flex={1}>
                <Center>
                    <Flex direction={'column'}>
                        <Heading>Anda Tidak Memiliki Akses</Heading>
                        <Button onClick={()=>navigate('/')}>Back to Home</Button>
                    </Flex>
                </Center>
            </Box>
            
            :<Box p={10}>
                <style>
                    @import "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css";
                </style>
                <Flex direction={"column"}>
                <Box p={5}>
                    <Heading size={"xl"}>List Order</Heading>
                    <form onSubmit={formik.handleSubmit}>
                        <Flex direction={"row"} gap={5} p={5}>
                            <Select name='ordercolumn' id='ordercolumn' onChange={formik.handleChange} value={formik.values.ordercolumn} placeholder='Kolom'>
                                <option value="id_order">ID</option>
                                <option value="no_invoice">No Invoice</option>
                                <option value="createdAt">Tanggal Order</option>
                            </Select>
                            <Select name='orderpos' id='orderpos' onChange={formik.handleChange} value={formik.values.orderpos} placeholder='Urutan'>
                                <option value="asc">ASC</option>
                                <option value="desc">DESC</option>
                            </Select>
                            <Select name='status' id='status' onChange={formik.handleChange} value={formik.values.status} placeholder='Status Order'>
                                <option value="UNPAID">UNPAID</option>
                                <option value="PAID">PAID</option>
                                <option value="CONFIRMED">CONFIRMED</option>
                                <option value="CANCELED">CANCELED</option>
                            </Select>
                            <Input id='filter' name='filter' onChange={formik.handleChange} value={formik.values.filter}/>
                            <Button type='submit'>Cari</Button>
                            <Button type="reset"  onClick={formik.resetForm}> Reset</Button>
                        </Flex>
                    </form>
                </Box>
                <Spacer/>
                <Box p={5}>
                    <DataTable columns={columns} data={data.data || []}/>
                </Box>
                <Center p={5}>
                    <ReactPaginate
                        onPageChange={handlePageClick}
                        pageCount={Math.ceil(data.total/perpage) || 0}
                        pageRangeDisplayed={3}
                        marginPagesDisplayed={2}
                        nextLabel="next >"
                        previousLabel="< previous"
                        pageClassName="page-item"
                        pageLinkClassName="page-link"
                        previousClassName="page-item"
                        previousLinkClassName="page-link"
                        nextClassName="page-item"
                        nextLinkClassName="page-link"
                        breakLabel="..."
                        breakClassName="page-item"
                        breakLinkClassName="page-link"
                        containerClassName="pagination"
                        activeClassName="active"
                        renderOnZeroPageCount={null}
                    />
                </Center>
            </Flex>
        </Box>
}

export default OrderList;