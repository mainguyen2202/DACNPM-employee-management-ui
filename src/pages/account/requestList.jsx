import { Layout } from "@/components/account";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';

import DataTable from "react-data-table-component";

// import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import dynamic from 'next/dynamic';

export default function RequestList() {
    const DataTableExtensions = dynamic(() => import('react-data-table-component-extensions'), {
        ssr: false
    })
    const [requestList, setRequestList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [userInfo, setUserInfo] = useState({});
    let userId = 0;
    if (typeof window !== 'undefined') {

        userId = sessionStorage.getItem('userId');
    }
    useEffect(() => {
        fetch(`https://employee-leave-api.onrender.come-api.onrender.com/api/employees/${userId}`).then((response) => response.json()).then((data) => {
            setUserInfo(data);
            console.log(data);
        }).catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const response = await fetch(`https://employee-leave-api.onrender.com/api/leave-applications/get-by-handle-by/${userId}`);
                const data = await response.json();
                setRequestList(data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchLeaveRequests();
    }, [userId]);

    const dataTableColumns = [
        { name: 'ID', selector: row => row.id, sortable: true },
        { name: 'Reason', selector: row => row.reason, sortable: true },
        { name: 'From', selector: row => row.from, sortable: true },
        { name: 'To', selector: row => row.to, sortable: true },
        {
            name: "Status",
            selector: "status",
            sortable: true,
            cell: (row) => (
              <div
                className={`px-3 py-1 rounded-md font-bold ${
                  row.status === 1
                    ? "bg-green-100 text-green-700"
                    : row.status === 0
                    ? "bg-red-100 text-red-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {row.status === 1
                  ? "Approved"
                  : row.status === 0
                  ? "Rejected"
                  : "Pending"}
              </div>
            ),
          },
        {
            name: "Reason",
            selector: "reasonReject",
            sortable: true,
            cell: (row) => (
                <div
                    style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        backgroundColor: row.status === 1 ? "#d1f7c4" : "#ffcdd2",
                        color: row.status === 1 ? "#2e7d32" : "#c62828",
                        fontWeight: "bold",
                        display: "inline-block"
                    }}
                >
                    {row.status === 1 ? "" : row.reasonReject}
                </div>
            )
        },


        {
            name: "Action",
            selector: "action",
            cell: (row) => (
                <div>
                    <button
                        onClick={() => handleDelete(row.id)}
                        style={{
                            padding: "5px 10px",
                            backgroundColor: "#c62828",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        <i className="fa fa-trash">Delete</i>

                    </button>
                    <button
                        onClick={() => handleView(row.id)}
                        style={{
                            padding: "5px 10px",
                            backgroundColor: "#2e7d32",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        <i className="fas fa-eye">View</i>
                    </button>
                </div>
            )
        }
    ];

    const tableData = {
        columns: dataTableColumns,
        data: requestList,
    };
    const [showModal, setShowModal] = useState(false);

    const handleDelete = () => {
        // Implement delete logic here
        console.log('Delete row:', row.id);
    };

    const handleView = async (idLeave) => {
        try {
            const response = await fetch(`https://employee-leave-api.onrender.com/api/leave-applications/${idLeave}`);
            let employeeData = {};
            if (response.ok) {
                itinerarieData = await response.json();
                employeeData = itinerarieData.employee;
                console.log("hfhhf" + itinerarieData);
                setId(itinerarieData.id);
                setFullName(employeeData.fullName); // Assign the value to name state variables
                setPosition(employeeData.position); // Assign the value to content state variable
                setDateStart(itinerarieData.from); // Assign the value to dateStart state variable
                setDateEnd(itinerarieData.to); // Assign the value to dateEnd state variable
                setReason(itinerarieData.reason);
                setReasonBoss(itinerarieData.reason_reject);
                setStatus(itenerarieData.status);

            } else {
                console.log('Failed to fetch itinerary data');
            }
        } catch (error) {
            console.log('Error:', error);
        }
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };


    const closePopup = () => setIsPopupOpen(false);
    const [fullName, setFullName] = useState('');
    const [position, setPosition] = useState('');
    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [reason, setReason] = useState('');
    const [reasonBoss, setReasonBoss] = useState('');
    const [status, setStatus] = useState();
    const [id, setId] = useState();
    let [itinerarieData, setItinerarieData] = useState({});
    const [statusChanged, setStatusChanged] = useState(false);


    useEffect(() => {
        if (statusChanged) {
            window.location.reload()
        }

    }), [statusChanged]


    const handleReject = async (idLeave, reasonBoss) => {

        console.log(idLeave);
        try {
            const response = await fetch(`https://employee-leave-api.onrender.com/api/leave-applications/approve/${idLeave}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    reasonReject: reasonBoss,
                    status: 0,
                }),
            });

            if (response.ok) {
                setStatusChanged(true);
                const data = await response.json();
                console.log(data);

                closePopup();
                alert("Đơn đã được từ chối.");
                if (data.status === 0) {
                    toast.success(data.message);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            console.log('Error:', error);
        }
    };

    const handleApprove = async (idleave, reasonBoss) => {
        try {
            const response = await fetch(`https://employee-leave-api.onrender.com/api/leave-applications/approve/${idleave}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status: 1,
                    reasonReject: reasonBoss
                })
            });

            if (response.ok) {
                setStatusChanged(true);
                const data = await response.json();
                console.log(data);
                alert("Đơn đã được duyệt thành công.");
                closePopup();
            } else {
                console.log('Approval failed');
                alert("Đã xảy ra lỗi khi duyệt đơn. Vui lòng thử lại sau.");
            }
        } catch (error) {
            console.log('Error:', error);
            alert("Đã xảy ra lỗi khi duyệt đơn. Vui lòng thử lại sau.");
        }
    };


    return (
        <Layout>
            <Nav />
            <div className="flex bg-blue-50">
                <h1 className="text-2xl font-semibold text-center">Request List</h1>
            </div>
            <div className="flex my-10 h-screen bg-blue-50 dark:bg-zinc-800">
                <div className="container mx-auto">
                    <DataTableExtensions {...tableData}>
                        <DataTable
                            columns={dataTableColumns}
                            data={requestList}
                            noHeader
                            defaultSortField="id"
                            defaultSortAsc={true}
                            pagination
                            highlightOnHover
                            dense
                        >
                        </DataTable>
                    </DataTableExtensions>
                    {showModal && (
                        <div className="modal modal-bg fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                            <div className="modal-content modal p-4 bg-white rounded-lg w-[500px]">
                                <span className="close-button" onClick={closeModal}>
                                    &times;
                                </span>

                                <h2 className="text-center text-4xl font-semibold "> Chi tiết đơn nghỉ phép </h2>
                                <form >
                                    <div className="form-group flex justify-between m-4">
                                        <label htmlFor="fullName" className="my-auto">
                                            Họ tên:
                                        </label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={fullName}
                                            className="border-1 outline-none bg-gray-300 pl-2 h-10 rounded-lg w-64 pr-2"
                                            readOnly
                                        />
                                    </div>

                                    <div className="form-group flex justify-between m-4">
                                        <label htmlFor="department" className="my-auto">
                                            Chức vụ:
                                        </label>
                                        <input
                                            type="text"
                                            id="role"
                                            name="role"
                                            value={position}
                                            className="border-1 outline-none bg-gray-300 pl-2 h-10 rounded-lg w-64 pr-2"
                                            readOnly
                                        />
                                    </div>

                                    <div className="form-group flex justify-between m-4">
                                        <label htmlFor="leaveDates" className="my-auto">
                                            Ngày bắt đầu: </label>

                                        <input
                                            type="date"

                                            style={{ outline: "none" }}
                                            value={dateStart}
                                            className="border-1 outline-none bg-gray-300 pl-2 h-10 rounded-lg w-64 pr-2"
                                            readOnly

                                        />

                                    </div>
                                    <div className="form-group flex justify-between m-4">
                                        <label htmlFor="leaveDates" className="my-auto">Ngày kết thúc: </label>

                                        <input
                                            type="date"
                                            value={dateEnd}
                                            className="border-1 outline-none bg-gray-300 pl-2 h-10 rounded-lg w-64 pr-2"
                                            readOnly
                                        />

                                    </div>
                                    <div className="form-group flex justify-between m-4">
                                        <label htmlFor="reason" className="my-auto">
                                            Lý do xin nghỉ:
                                        </label>
                                        <textarea
                                            id="reason"
                                            name="reason"
                                            rows="4"
                                            value={reason} // Giá trị cụ thể
                                            className="border-1 outline-none bg-gray-300 pl-2 pt-2 h-16 rounded-lg w-64 pr-2"
                                            maxLength={100}
                                            readOnly // Để trường này chỉ hiển thị dữ liệu, không cho phép sửa
                                        ></textarea>
                                    </div>
                                    <div className="form-group flex justify-between m-4">
                                        <label htmlFor="message" className="my-auto">
                                            Lý do từ chối đơn nghỉ (boss)
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows="4"
                                            className="border-1 outline-none bg-gray-300 pl-2 pt-2 h-16 rounded-lg w-64 pr-2"
                                            maxLength={100}
                                            value={reasonBoss}
                                        // onChange={handleBossAction}
                                        ></textarea>
                                    </div>
                                    <div className="form-buttons flex justify-center gap-4">


                                        <button type="button" onClick={() => handleReject(id, reasonBoss)} className="btn bg-red-500 px-4 py-2 rounded-lg text-white">
                                            Từ chối
                                        </button>
                                        <button type="button" onClick={() => handleApprove(id, reasonBoss)} className="btn bg-blue-500 px-4 py-2 rounded-lg text-white">
                                            Chấp nhận
                                        </button>
                                    </div>

                                </form>
                                {/* Add your view details content here */}
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </Layout>
    )
        ;
}