import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net-dt';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import { useNavigate } from "react-router-dom";

const HomePageComp = () => {

    const [userData, setUserData] = useState([]);

    const navigate = useNavigate();
    const tableRef = useRef(null);

    const getAge = (dateString) => {
        var today = new Date();
        var birthDate = new Date(dateString);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }

    const columns = [
        { title: '#', data: '_id' },
        { title: 'Name', data: 'name' },
        {
            title: 'Age/Sex',
            data: 'dob',
            render: (data, row, allData) => {
                const totalAge = getAge(data);
                return `${totalAge}Y / ${allData.gender.charAt(0)}`.toUpperCase();
            },
        },
        { title: 'Mobile', data: 'mobile' },
        {
            title: 'Address',
            data: 'address',
            render: data => {
                let getAddress = ``;
                if (data) {
                    if (data.address) {
                        getAddress += `${data.address}, `
                    }
                    if (data.city) {
                        getAddress += `${data.city}, `
                    }
                    if (data.state) {
                        getAddress += `${data.state}, `
                    }
                    if (data.country) {
                        getAddress += `${data.country}, `
                    }
                    if (data.pin_code) {
                        getAddress += `(${data.pin_code})`
                    }
                }

                return `${getAddress}`.toLowerCase()
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
            },
        },
        {
            title: 'Govt ID',
            data: 'document',
            render: data => {
                return `${data.document_number}`.toUpperCase();
            },
        },
        {
            title: 'Guardian Details',
            data: 'guardian',
            render: data => {
                if (data.guardian_type && data.guardian_name) {
                    return `${data.guardian_name.charAt(0).toUpperCase()}${data.guardian_name.slice(1)} (${data.guardian_type.charAt(0).toUpperCase()}${data.guardian_type.slice(1)})`;
                }
                else return ''
            },
        },
        {
            title: 'Nationality',
            data: 'nationality',
            render: data => {
                return `${data}`.toUpperCase();
            },
        },
        // {
        //     title: "Actions",
        //     orderable: false,
        //     searchable: false,
        //     data: '_id',
        // }
    ]

    const fetchUsersData = async () => {
        const config = {
            headers: {
                "sample-access-key": "sample-access-value"
            },
            timeout: 5000 // 5 seconds
        }

        const result = await axios.get('http://localhost:5000/api/fetch_customers', config)

        if (result.data.error) {
            console.log(result.data.message)
        }
        else {
            setUserData(result.data.customersData)
        }
    };

    const handlePageChange = (e) => {
        const page = $(tableRef.current).DataTable().page() + 1;
        console.log(page)
    };

    useEffect(() => {
        const datatable = $(tableRef.current).DataTable();
        datatable.destroy();

        $(tableRef.current).DataTable({
            paging: true,
            searching: true,
            pageLength: 10,
            lengthMenu: [10, 25, 50, 100],
            data: userData,
            rowCallback: (row, data, index) => {
                $('td:eq(0)', row).html(index + 1);
            },
            columns: columns,
        });

        return () => {
            datatable.destroy(true);
        };

    }, [userData]);

    useEffect(() => {
        $(tableRef.current).on("page.dt", handlePageChange);
        return () => {
            $(tableRef.current).off("page.dt", handlePageChange);
        };
    }, [tableRef]);

    useEffect(() => {
        fetchUsersData()
    }, []);


    return (
        <div className='p-4'>
            <div className='text-end'>
                <button
                    className='btn btn-primary mb-3'
                    onClick={() => {
                        navigate("/add-user");
                    }}
                > Add User </button>
            </div>

            <table ref={tableRef}>
                <thead>
                    <tr>
                        {
                            columns.map((column) => (
                                <th key={column.data}> {column.title}</th>
                            ))
                        }
                    </tr>
                </thead>

                <tbody></tbody>
            </table>
        </div>
    );
};

export default HomePageComp;
