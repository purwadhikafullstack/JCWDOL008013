import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import API_URL from '../helper';
import { DataTable } from '../components/Datatable';
import { createColumnHelper } from "@tanstack/react-table";
import { Box, Button, Center, Container, Flex, Heading, Input, Select, Spacer, Text } from '@chakra-ui/react';
import { useFormik } from "formik";
import ReactPaginate from 'react-paginate';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {RangeDatepicker} from 'chakra-dayzed-datepicker'
import { Select as CustomSelect } from "chakra-react-select";


function ReportList() {
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
    const [ordercolumn,setOrderColumn]= useState("id_order")
    const [orderpos,setOrderPos]= useState("desc")
    const [filterinvoice,setFilterInvoice]= useState("")
    const [filterprop,setFilterProp]= useState("")
    const [filteruser,setFilterUser]= useState("")
    const [data,setData] = useState([])
    const [totalamount,setTotalAmount] = useState([])
    const [selectproperty,setSelectProperty] = useState([])
    const [selectuser,setSelectUser] = useState([])
    const [selectedDates, setSelectedDates] = useState([]);
    const [startdate, setStartdate] = useState([]);
    const [enddate, setEnddate] = useState([]);

    const loadReport = ()=>{
        let getLocalStorage = localStorage.getItem("prw_login");
        Axios.get(API_URL + `/orders/report`,{
            headers: {Authorization: `Bearer ${getLocalStorage}`},
            params:{
                offset:page,
                limit:perpage,
                ordercolumn,
                orderpos,
                filterinvoice,
                filterprop,
                filteruser,
                startdate,
                enddate
            }
        })
        .then((res) => {
            setData(res.data.data)
            setTotalItem(res.data.total)
            let selectdata = []
            res.data.selectproperty.map(x=>{
                selectdata.push({label:x.name,value:x.id_property})
            })
            setSelectProperty(selectdata)
            selectdata = []
            res.data.selectuser.map(x=>{
                selectdata.push({label:x.username,value:x.id_user})
            })
            setSelectUser(selectdata)
            setTotalAmount(res.data.totalamount)
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
            property:'',
            user:'',
            type:'',
            daterange:[]
        },
        onSubmit:(val)=>{
            if(val.type == 'user'){
                val.property = ""
                val.filter = ""
            }else if( val.type == 'property'){
                val.user = ""
                val.filter = ""
            }else if (val.type == 'invoice'){
                val.property = ""
                val.user = ""
            }
            setFilterInvoice(val.filter)
            setFilterProp(val.property)
            setFilterUser(val.user)
            setOrderColumn(val.ordercolumn)
            setOrderPos(val.orderpos)
            setStartdate(selectedDates[0]??"")
            setEnddate(selectedDates[1]??"")
        },
        onReset:(val)=>{
            setOrderColumn("id_order")
            setOrderPos("desc")
            setFilterInvoice("")
            setFilterProp("")
            setFilterUser("")
            setStartdate("")
            setEnddate("")
            setSelectedDates([])
        }
    })

    useEffect(()=>{
        loadReport()
    },[ordercolumn,orderpos,page,filterinvoice,filterprop,filteruser,startdate,enddate])

    


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
        columnHelper.accessor("createdAt", {
            cell: (info) => {
                if(info.getValue() == "") {
                    return "-"
                }else {
                    const pad = (n)=> {return n < 10 ? "0"+n : n;}
                    let dateobj = new Date(info.getValue())
                    return pad(dateobj.getDate())+"/"+pad(dateobj.getMonth()+1)+"/"+dateobj.getFullYear();
                }
            },
            header: "Tanggal Order"
        }),
        columnHelper.accessor("total", {
            cell: (info) => info.getValue().toLocaleString('id',{ style: 'currency', currency: 'IDR' }) || "-",
            header: "Nilai Transaksi"
        }),
    ];

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
                        <option value="total">Total</option>
                        <option value="createdAt">Tanggal Order</option>
                    </Select>
                    <Select name='orderpos' id='orderpos' onChange={formik.handleChange} value={formik.values.orderpos} placeholder='Urutan'>
                        <option value="asc">ASC</option>
                        <option value="desc">DESC</option>
                    </Select>
                    <Select name='type' id='type' onChange={formik.handleChange} value={formik.values.type} placeholder='Type'>
                        <option value="property">Property</option>
                        <option value="user">User</option>
                        <option value="invoice">Invoice</option>
                    </Select>
                    {formik.values.type == "user" ? <CustomSelect 
                        name="user"
                        id="user"
                        options={selectuser}
                        placeholder="Select User"
                        onChange={e=>formik.setFieldValue('user',e.value)}
                    />: formik.values.type == "property"?<CustomSelect 
                        name="property"
                        id="property"
                        options={selectproperty}
                        placeholder="Select Property"
                        onChange={e=>formik.setFieldValue('property',e.value)}
                    /> :<Input id='filter' name='filter' onChange={formik.handleChange} value={formik.values.filter}/>}
                    
                    <RangeDatepicker
                        name='daterange'
                        id='daterange'
                        selectedDates={selectedDates}
                        onDateChange={setSelectedDates}
                        closeOnSelect={true}
                        propsConfigs={{
                            inputProps: {
                            placeholder: "Start Date - End Date"
                            },
                        }}
                    />
                    
                    <Button type='submit'>Cari</Button>
                    <Button type="reset"  onClick={formik.resetForm}> Reset</Button>
                </Flex>
            </form>
        </Box>
        <Spacer/>
        <Box p={5}>
            <DataTable columns={columns} data={data.data || []}/>
        </Box>
        <Flex p={5} justifyContent={"space-between"}>
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
            <Text>Total Transaksi : {totalamount?.toLocaleString('id',{ style: 'currency', currency: 'IDR' })}</Text>
        </Flex>
    </Flex>
    </Box>
}

export default ReportList;