import { Layout } from "@/components/account";
import { useEffect, useState } from "react";
import { Nav } from "@/components/Nav.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faEye, faTrash } from "@fortawesome/free-solid-svg-icons";
import Link from 'next/link';
import DataTable from "react-data-table-component";
import { toast, ToastContainer, Zoom } from 'react-toastify';
import "@fortawesome/fontawesome-free/css/all.css";

// import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import dynamic from 'next/dynamic';

export default function LeaveList() {
    const DataTableExtensions = dynamic(() => import('react-data-table-component-extensions'), {
        ssr: false
    })
    const [leaveList, setLeaveList] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [userInfo, setUserInfo] = useState({});
    let userId = 0;
    if (typeof window !== 'undefined') {

        userId = sessionStorage.getItem('userId');
    }

    useEffect(() => {
        fetch(`https://employee-leave-api.onrender.com/api/employees/${userId}`).then((response) => response.json()).then((data) => {
            setUserInfo(data);
            console.log(data);
        }).catch((error) => console.error("Error fetching data:", error));
    }, []);

    useEffect(() => {
        fetch(`https://employee-leave-api.onrender.com/api/leave-applications/get-by-employee-id/${userId}`)
            .then((response) => {
                console.log(response);
                return response.json()
            })
            .then((data) => {
                console.log(data + "data");
                setLeaveList(data);
                console.log(" leaveList after set" + leaveList);


            })
            .catch((error) => console.error("Error fetching data:", error));
    }, []);


    const [dateStart, setDateStart] = useState('');
    const [dateEnd, setDateEnd] = useState('');
    const [reason, setReason] = useState('');
    const [reasonBoss, setReasonBoss] = useState('');
    const [status, setStatus] = useState();


    const columns = [
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
                    className={`px-3 py-1 rounded-md font-bold ${row.status === 1
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
                        <i className="fa fa-trash"></i>

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
                        <i className="fas fa-eye"></i>
                    </button>
                </div>
            )
        }
    ];

    const tableData = {
        columns,
        data: leaveList,
    };

    const [showModal, setShowModal] = useState(false);

    const handleDelete = async (idLeave) => {
        try {
          const response = await fetch(
            `https://employee-leave-api.onrender.com/api/leave-applications/${idLeave}`,
            {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
      
          if (response.status === 200) {
            const data = await response.json();
      
            if (data.status === 1) {
              toast.success(data.message);
              window.location.reload(); // Tải lại trang
              // Update the leaveList state by filtering out the deleted item
              setLeaveList((prevList) => prevList.filter((item) => item.id !== idLeave));
            } else {
              toast.error(data.message);
            }
          } else {
            console.log('Deletion failed');
          }
        } catch (error) {
          console.error('Error deleting leave application:', error);
          toast.error('Failed to delete leave application');
        }
      };
    const handleView = async (idLeave) => {
        try {
            const response = await fetch(`https://employee-leave-api.onrender.com/api/leave-applications/${idLeave}`);

            if (response.ok) {
                const itinerarieData = await response.json();
                console.log("itinerarieData:", itinerarieData);

                setDateStart(itinerarieData.from);
                setDateEnd(itinerarieData.to);
                setReason(itinerarieData.reason);
                setReasonBoss(itinerarieData.reasonReject);
                setStatus(itinerarieData.status);
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


    // dăng ký nghỉ
    const [currentPage, setcurrentPage] = useState('leaveList');
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => setIsPopupOpen(true);
    const closePopup = () => setIsPopupOpen(false);
    const [formData, setFormData] = useState({
        fullName: "",
        role: "",
    });
    const [dayOffRemaining, setDayOffRemaining] = useState();
    useEffect(() => {
        const fetchEmployeeData = async () => {
            try {
                // Lấy ID từ localStorage
                // const storedId = localStorage.getItem('employeeId');
                // if (!storedId) {
                //     throw new Error('Employee ID not found in localStorage');
                // }
                const storedId = sessionStorage.getItem('userId');
                if (!storedId) {
                    throw new Error('Employee ID not found in localStorage');
                }


                // Gọi API với ID từ localStorage
                const response = await fetch(`https://employee-leave-api.onrender.com/api/employees/${storedId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch employee data');
                }

                const data = await response.json();
                console.log(data); // Kiểm tra dữ liệu được trả về từ API

                // Set data to form fields
                setFormData({
                    fullName: data.fullName,
                    role: data.position,
                });
                // Update dayOffRemaining state
                setDayOffRemaining(data.dayOffRemaining);


            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchEmployeeData();
    }, []);
    function calculateDaysBetweenDates(startDate, endDate) {
        const oneDay = 24 * 60 * 60 * 1000; // Hours * Minutes * Seconds * Milliseconds
        const diffDays = Math.round(Math.abs((startDate - endDate) / oneDay));
        return diffDays + 1; // Add 1 to include the last day
    }
    // Nhấn gửi đơn
    const handleSubmit = (event) => {
        event.preventDefault();

        const storedId = sessionStorage.getItem('userId');
        if (!storedId) {
            throw new Error('Employee ID not found in localStorage');
        }

        if (!startDate || !endDate) {
            alert("Please select the leave dates before submitting!");
            return;
        } else {
            const numDaysOff = calculateDaysBetweenDates(new Date(startDate), new Date(endDate));
            console.log('numDaysOff', numDaysOff);
            console.log('numDaysOff', dayOffRemaining);


            // Check if the number of days off is less than or equal to the remaining days off
            if (parseInt(numDaysOff) <= parseInt(dayOffRemaining)) {
                const requestData = {
                    reason: event.target.reason.value,
                    from: startDate,
                    to: endDate
                };

                // Send the data
                fetch(`https://employee-leave-api.onrender.com/api/leave-applications/save?employeeId=${storedId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)
                })
                    .then(response => {
                        if (response.ok) {
                            console.log('Data submitted successfully!');
                            closePopup();
                            alert("You have successfully submitted the leave application.");
                            toast.success('');
                            setStartDate("");
                            setEndDate("");
                        } else {
                            console.error('Error submitting data.');
                            // Handle error if needed
                        }
                    })
                    .catch(error => console.error('Error:', error));
            } else {
                alert("The number of days off requested exceeds your remaining days off.");
                console.log('kết thúc');
            }
        }
    };

    const [startDate, setStartDate] = useState('');
    const handleStartDateChange = (event) => {
        const selectedDate = event.target.value;
        const today = new Date();
        const selected = new Date(selectedDate);

        if (selected < today) {
            alert('Bạn không thể chọn ngày đã kết thúc.');
        } else {
            setStartDate(selectedDate);
        }
    };
    const [endDate, setEndDate] = useState('');
    const handleEndDateChange = (event) => {
        const selectedDate = event.target.value;
        const today = new Date();
        const selected = new Date(selectedDate);

        if (selected < today) {
            alert('Bạn không thể chọn ngày đã kết thúc.');
        } else if (selected < new Date(startDate)) {
            alert('Ngày kết thúc phải sau ngày bắt đầu.');
        } else {
            setEndDate(selectedDate);
        }
    };


    const closePopupWithConfirmation = () => {
        const isConfirmed = window.confirm("Bạn có chắc chắn muốn đóng không?");
        if (isConfirmed) {
            closePopup();
        }
    };
    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate() + 1).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    return (
        <Layout>
            <Nav />
            <div class="flex justify-between items-center bg-blue-50 p-4">
                <h1 class="text-2xl font-semibold">Leave List</h1>
                <button class="px-4 py-2 bg-blue-500 text-white rounded-md"
                    onClick={openPopup}
                >
                    Register Leave
                </button>

                {isPopupOpen && (
                    <div className="popup">
                        <div className="popup-inner p-4 rounded-lg flex bg-blue-50 justify-center">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group flex justify-between my-2">
                                    <label htmlFor="fullName" className="my-auto">Họ tên:</label>
                                    <input
                                        type="text"
                                        id="fullName"
                                        name="fullName"
                                        value={formData.fullName}
                                        className="border-1 outline-none bg-gray-300 pl-2 h-10 rounded-lg w-64 pr-2"
                                    />
                                </div>
                                <div className="form-group flex justify-between my-2">
                                    <label htmlFor="department" className="my-auto">Chức vụ:</label>
                                    <input
                                        type="text"
                                        id="role"
                                        name="role"
                                        value={formData.role}
                                        className="border-1 outline-none bg-gray-300 pl-2 h-10 rounded-lg w-64 pr-2 ml-16"
                                    />
                                </div>
                                <div className="form-group flex justify-between my-2">
                                    <label htmlFor="department" className="my-auto">Số ngày nghỉ còn lại:</label>
                                    <input
                                        type="text"
                                        id="role"
                                        name="role"
                                        value={dayOffRemaining}
                                        className="border-1 outline-none bg-gray-300 pl-2 h-10 rounded-lg w-64 pr-2 ml-16"
                                        disabled
                                    />
                                </div>
                                <div className="form-group flex justify-between my-2">
                                    <label htmlFor="leaveDates" className="my-auto">Ngày bắt đầu: </label>

                                    <input
                                        type="date"
                                        className="border-1 outline-none bg-gray-300 pl-2 h-10 rounded-lg w-64 pr-2 ml-16"
                                        style={{ outline: "none" }}
                                        value={startDate} // Đặt giá trị của input bằng giá trị của trạng thái
                                        onChange={handleStartDateChange}
                                        min={getCurrentDate()}
                                    />

                                </div>
                                <div className="form-group flex justify-between my-2">
                                    <label htmlFor="leaveDates" className="my-auto">Ngày kết thúc: </label>

                                    <input
                                        type="date"
                                        className="border-1 outline-none bg-gray-300 pl-2 h-10 rounded-lg w-64 pr-2 ml-16"
                                        style={{ outline: "none" }}
                                        value={endDate} // Đặt giá trị của input bằng giá trị của trạng thái
                                        onChange={handleEndDateChange}
                                        min={getCurrentDate()}
                                    />

                                </div>
                                <div className="form-group flex justify-between my-2">
                                    <label htmlFor="reason" className="my-auto">Lý do xin nghỉ:</label>
                                    <textarea
                                        id="reason"
                                        name="reason"
                                        rows="4"
                                        className="border-1 outline-none bg-gray-300 pl-2 pt-2 h-16 rounded-lg w-64 pr-2 ml-16"
                                        maxLength={100}
                                    ></textarea>
                                </div>
                                <div className="form-buttons flex justify-center gap-4 pt-4">
                                    <button type="button" onClick={closePopupWithConfirmation}
                                        className="btn bg-red-500 px-4 py-2 rounded-lg text-white"> Hủy
                                    </button>
                                    <button type="submit"
                                        className="btn bg-blue-500 px-4 py-2 rounded-lg text-white"> Gửi
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex my-10 h-screen bg-blue-50 dark:bg-zinc-800">
                <div className="container mx-auto">
                    <DataTableExtensions {...tableData}>
                        <DataTable
                            columns={columns}
                            data={leaveList}
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

                                </form>
                                <ToastContainer
                                    className="toast-container"
                                    toastClassName="toast"
                                    bodyClassName="toast-body"
                                    progressClassName="toast-progress"
                                    theme='colored'
                                    transition={Zoom}
                                    autoClose={5}
                                    hideProgressBar={true}
                                ></ToastContainer>
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