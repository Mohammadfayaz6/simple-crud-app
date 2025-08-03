import React, { useRef } from 'react'
import { useState, useEffect } from 'react';
import { AddEmployeeAPI, DeleteEmployeeAPI, GetAllEmployeesAPI, UpdateEmployeeDetailsAPI } from '../Apis/Employee';
import toast from 'react-hot-toast';



const EmployeesDetail = () => {
    const [employees, setEmployees] = useState([]);
    const [openEmployeeModal, setOpenEmployeeModal] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [openEmployeeSalaryModal, setOpenEmployeeSalaryModal] = useState(false);
    const [EmployeeData, setEmployeeData] = useState({
        employeeId: null || undefined,
        firstName: '',
        lastName: '',
        email: '',
        location: '',
        dateOfBirth: '',
    });

    useEffect(() => {
        const timer = setTimeout(() => setAnimateIn(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    // const data = [
    //     { id: 1, name: "John Doe", email: "@example.com", mobile: "1234567890", address: "123 Main St", roleType: "1" },
    //     { id: 2, name: "Jane Smith", email: "@example.com", mobile: "0987654321", address: "456 Elm St", roleType: "2" },
    //     { id: 3, name: "Alice Johnson", email: "@example.com", mobile: "5555555555", address: "789 Oak St", roleType: "1" },
    //     { id: 4, name: "Bob Brown", email: "@example.com", mobile: "4444444444", address: "321 Pine St", roleType: "2" },
    //     { id: 5, name: "Charlie Davis", email: "@example.com", mobile: "2222222222", address: "654 Maple, St", roleType: "1" },

    // ]

    const [showSalaryForm, setShowSalaryForm] = useState(false);
    const [salaryDetails, setSalaryDetails] = useState([]);
    const [newSalaryItem, setNewSalaryItem] = useState({
        id: null || undefined,
        payrollItem: '',
        itemType: '',
        name: '',
        value: ''
    });


    const [isEditSalaryDetails, setIsEditSalaryDetails] = useState(false);
    const [hoveredEmployeeId, setHoveredEmployeeId] = useState(null);
    const hoverTimeoutRef = useRef(null);

    const handleMouseEnter = (id) => {
        // Cancel any existing timeout to clear hover
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
            hoverTimeoutRef.current = null;
        }
        setHoveredEmployeeId(id);
    };

    const handleMouseLeave = () => {
        // Delay the hover clear to avoid flicker
        hoverTimeoutRef.current = setTimeout(() => {
            setHoveredEmployeeId(null);
        }, 300); // Adjust delay (ms) as needed
    };

    const cancelHoverClear = () => {
        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    };

    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);



    const fetchEmployeesData = async () => {
        try {
            const response = await GetAllEmployeesAPI();
            console.log("Fetched employees:", response);
            setEmployees(response);
            toast.success("Employees fetched successfully");
        }
        catch (error) {
            console.error("Error fetching employees:", error);
        }
    }

    useEffect(() => {
        fetchEmployeesData();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const totalPages = Math.ceil(employees.length / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const paginatedEmployees = employees.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDeleteClick = async (id) => {
        try {
            const response = await DeleteEmployeeAPI(id);
            console.log("Employee deleted:", response);
            toast.success("Employee deleted successfully");
            fetchEmployeesData();

        } catch (error) {
            console.error("Error deleting employee:", error);
            alert("Failed to delete employee. Please try again.");

        }
    };
    const handleAddClick = () => {
        setOpenEmployeeModal(true);
        setAnimateIn(true);
        setIsEditMode(false);
        setEmployeeData({
            employeeId: null || undefined,
            firstName: '',
            lastName: '',
            email: '',
            location: '',
            dateOfBirth: '',
        });
        setSalaryDetails([]); // Clear salary items
        setNewSalaryItem({
            id: 0,
            payrollItem: '',
            itemType: '',
            name: '',
            value: ''
        });
        setOpenEmployeeSalaryModal(true);
    }

    const handleEditClick = (id) => {
        const employeeToEdit = employees.find(emp => emp.employeeId === id);

        if (!employeeToEdit) {
            console.warn("Employee not yet loaded for editing.");
            return;
        }

        setEmployeeData({
            employeeId: employeeToEdit.employeeId || 0,
            firstName: employeeToEdit.firstName || "",
            lastName: employeeToEdit.lastName || "",
            email: employeeToEdit.email || "",
            location: employeeToEdit.location || "",
            dateOfBirth: employeeToEdit.dateOfBirth || "",
        });

        setSalaryDetails(employeeToEdit.salaryDetails || []);
        setNewSalaryItem({
            payrollItem: '',
            itemType: '',
            name: '',
            value: ''
        });

        setIsEditMode(true);
        setOpenEmployeeModal(true);
        setOpenEmployeeSalaryModal(true);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData(prev => ({
            ...prev,
            [name]: value
        }));
        // console.log(EmployeeData);
    }

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!EmployeeData.firstName || !EmployeeData.lastName || !EmployeeData.email || !EmployeeData.location || !EmployeeData.dateOfBirth) {
            alert("Please fill in all required fields");
            return;
        }
        const payload = {
            EmployeeId: EmployeeData.employeeId,
            FirstName: EmployeeData.firstName,
            LastName: EmployeeData.lastName,
            Email: EmployeeData.email,
            Location: EmployeeData.location,
            DateOfBirth: EmployeeData.dateOfBirth,
            SalaryDetails: salaryDetails.map(item => ({
                Id: item.id || 0,
                EmployeeId: EmployeeData.employeeId, // Optional depending on backend logic
                PayrollItem: item.payrollItem,
                ItemType: item.itemType,
                Name: item.name,
                Value: item.value
            }))
        };

        try {
            if (isEditMode) {
                console.log("Employee updated:", payload);
                await UpdateEmployeeDetailsAPI(payload);
                toast.success("Employee details updated successfully");
            } else {
                await AddEmployeeAPI(payload);
                toast.success("New employee added successfully");
                console.log("New employee added:", payload);
            }

            setOpenEmployeeModal(false);
            setAnimateIn(false);
            setIsEditMode(false);
            setEmployeeData({
                employeeId: null || undefined,
                firstName: '',
                lastName: '',
                email: '',
                location: '',
                dateOfBirth: '',
            });
            setSalaryDetails([]); // Clear salary items
            setNewSalaryItem({
                id: 0,
                payrollItem: '',
                itemType: '',
                name: '',
                value: ''
            });
            fetchEmployeesData(); // Refresh employee list
            setShowSalaryForm(false); // Hide salary form after submission
        }
        catch (error) {
            console.error("Error saving employee data:", error);
            alert("Failed to save employee data. Please try again.");
        }

    };


    const handleCancel = () => {
        setOpenEmployeeModal(false);
        setAnimateIn(false);
        setIsEditMode(false);
        setEmployeeData({
            employeeId: null || undefined,
            firstName: '',
            lastName: '',
            email: '',
            location: '',
            dateOfBirth: '',
        });
        setSalaryDetails([]); // Clear salary items
        setNewSalaryItem({
            id: 0,
            payrollItem: '',
            itemType: '',
            name: '',
            value: ''
        });
    }


    const handleSalaryInputChange = (e) => {
        const { name, value } = e.target;
        setNewSalaryItem(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSalarySubmit = (e) => {
        e.preventDefault();

        if (!newSalaryItem.payrollItem || !newSalaryItem.itemType || !newSalaryItem.name || !newSalaryItem.value) {
            alert("Please fill in all fields");
            return;
        }

        if (isEditSalaryDetails) {
            setSalaryDetails(prev =>
                prev.map(item => item.id === newSalaryItem.id ? newSalaryItem : item)
            );
        } else {
            setSalaryDetails(prev => [...prev, newSalaryItem]); // don't assign fake id
        }

        setNewSalaryItem({
            payrollItem: '',
            itemType: '',
            name: '',
            value: '',
        });
        setIsEditSalaryDetails(false);
        setShowSalaryForm(false); // Hide salary form after submission
    };


    const handleEditSalaryDetails = (item) => {
        console.log("Editing salary item:", item);
        setNewSalaryItem({
            id: item.id,
            payrollItem: item.payrollItem,
            itemType: item.itemType,
            name: item.name,
            value: item.value
        });
        setIsEditSalaryDetails(true);
        setShowSalaryForm(true); // Optional: show the form when editing
    };

    const handleDeleteSalaryDetails = (id) => {
        setSalaryDetails(prev => prev.filter(item => item.id !== id));

    }


    const handleCancelSalaryDetails = () => {
        setNewSalaryItem({

            payrollItem: '',
            itemType: '',
            name: '',
            value: ''
        });
    }



    return (
        <div className="container px-4 mx-auto mt-6">
            <div className="w-3/4">
                <h1 className="text-3xl font-bold text-blue-600 mb-5">Employee Details</h1>
            </div>
            {/* <div className="flex-grow ml-0 w-full mt-10">
                <form className="w-full ">
                    <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Search
                    </label>
                    <div className="relative w-full">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="inline-block min-w-full p-3 ps-10 outline-none text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Search Employees"
                            required
                        />
                        <button
                            type="submit"
                            className="text-white absolute end-1.5 bottom-1.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Search
                        </button>
                    </div>
                </form>
            </div> */}
            {/* <div className="flex-grow ml-0 w-3/4">
                <form className="w-auto"></form>
            </div> */}
            <div className='relative'>
                <div className="flex-grow ml-0 mt-4 w-full">
                    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg mt-6">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-md font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                    >
                                        Edit/Delete
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3.5 px-4 text-md font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                    >
                                        <div className="flex items-center gap-x-3">
                                            <span>First Name</span>
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3.5 px-4 text-md font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                    >
                                        <div className="flex items-center gap-x-3">
                                            <span>Last Name</span>
                                        </div>
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-md font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                    >
                                        <button className="flex items-center gap-x-2">
                                            <span>Email</span>
                                        </button>
                                    </th>

                                    {/* <th
                                    scope="col"
                                    className="px-4 py-3.5 text-md font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                >
                                    <button className="flex items-center gap-x-2">
                                        <span>Mobile</span>
                                    </button>
                                </th> */}

                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-md font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                    >
                                        Location
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-md font-normal text-left rtl:text-right text-gray-500 dark:text-gray-400"
                                    >
                                        DateOfBirth
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                {paginatedEmployees.map((emp) => (
                                    <tr key={emp.employeeId}

                                        onMouseEnter={() => handleMouseEnter(emp.employeeId)}
                                        // onMouseLeave={handleMouseLeave}
                                        className='hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
                                    >
                                        <td className="px-4 py-4 text-sm whitespace-nowrap">
                                            <div className="flex items-center gap-x-6">
                                                <button
                                                    onClick={() => handleDeleteClick(emp.employeeId)}
                                                    className="text-gray-500 transition-colors duration-200 dark:hover:text-red-600 dark:text-gray-300 hover:text-red-500 focus:outline-none"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                        className="w-5 h-5"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                                        />
                                                    </svg>
                                                </button>


                                                <button
                                                    onClick={(e) => {
                                                        handleEditClick(emp.employeeId)
                                                    }}
                                                    className="text-gray-500 transition-colors duration-200 dark:hover:text-yellow-500 dark:text-gray-300 hover:text-yellow-500 focus:outline-none"
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke-width="1.5"
                                                        stroke="currentColor"
                                                        className="w-5 h-5"
                                                    >
                                                        <path
                                                            stroke-linecap="round"
                                                            stroke-linejoin="round"
                                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                        />
                                                    </svg>
                                                </button>

                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm font-medium text-gray-700 whitespace-nowrap">
                                            <div className="inline-flex items-center gap-x-3">
                                                <div className="flex items-center gap-x-2">
                                                    <div>
                                                        <h2 className="  text-sm font-medium text-gray-800 dark:text-white ">
                                                            {emp.firstName}
                                                        </h2>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                            {emp.lastName}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                            {emp.email}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                            {emp.location || "Not Provided"}
                                        </td>
                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                            {emp.dateOfBirth ? new Date(emp.dateOfBirth).toLocaleDateString() : "Not Provided"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center justify-between mt-6">
                        <button
                            onClick={handlePreviousPage}
                            disabled={currentPage === 1}
                            className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="w-5 h-5 rtl:-scale-x-100"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
                                />
                            </svg>

                            <span>previous</span>
                        </button>

                        <div className="items-center hidden lg:flex gap-x-3">
                            {Array.from({ length: totalPages }, (_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageClick(index + 1)}
                                    className={`px-2 py-1 text-sm ${currentPage === index + 1
                                        ? "text-blue-500 bg-blue-100"
                                        : "text-gray-500 hover:bg-gray-100"
                                        } rounded-md`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="flex items-center px-5 py-2 text-sm text-gray-700 capitalize transition-colors duration-200 bg-white border rounded-md gap-x-2 hover:bg-gray-100 dark:bg-gray-900 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-800"
                        >
                            <span>Next</span>

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="w-5 h-5 rtl:-scale-x-100"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="flex-grow ml-0 mt-4 w-0">
                        <button
                            onClick={handleAddClick}
                            className="flex items-center justify-center px-6 py-2 font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                className="w-6 h-6 mr-2 font-bold text-lg"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M12 6v12m6-6H6"
                                />
                            </svg>

                            Employee
                        </button>
                    </div>
                </div>

                {hoveredEmployeeId && (
                    <div
                        className="absolute top-full left-0 w-full mb-12 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-md mt-2 z-50 max-h-[300px] overflow-y-auto rounded-md transition-opacity duration-300"
                        onMouseEnter={cancelHoverClear}
                        onMouseLeave={handleMouseLeave}
                    >
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">PayrollItem</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">ItemType</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Value</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                                {paginatedEmployees
                                    .find((emp) => emp.employeeId === hoveredEmployeeId)
                                    ?.salaryDetails?.map((salary, index) => (
                                        <tr key={salary.id || index}>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{salary.payrollItem}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{salary.itemType}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{salary.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300">{salary.value}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>






            {openEmployeeModal && (
                <div
                    className={`fixed top-0 right-0 h-full w-full sm:w-[560px] bg-white dark:bg-gray-900 z-50 shadow-lg overflow-y-auto transform transition-transform duration-300 ease-in  ${animateIn ? "translate-x-0" : "translate-x-full"
                        }`}
                >
                    <div className="p-6">
                        <button
                            onClick={() => setOpenEmployeeModal(false)}
                            className="text-gray-500 dark:text-gray-300 float-right"
                        >
                            ✕
                        </button>
                        <h1 className="text-2xl font-bold text-blue-600 dark:text-white mb-4">
                            {isEditMode ? "Edit Employee details" : "Add Employee details"}
                        </h1>
                        <form>
                            <div className="mb-6">
                                <label className="text-gray-900 dark:text-gray-200 font-semibold">
                                    First Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    type="text" y
                                    name="firstName"
                                    value={EmployeeData.firstName}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 mt-2  text-gray-800  bg-white border border-gray-400 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-800 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                                    placeholder="First Name"

                                />
                            </div>
                            <div className="mb-6">
                                <label className="text-gray-900 dark:text-gray-200 font-semibold">
                                    Last Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    type="text"
                                    name="lastName"
                                    value={EmployeeData.lastName}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 mt-2  text-gray-800  bg-white border border-gray-400 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-800 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                                    placeholder="Last Name"

                                />
                            </div>
                            <div className="mb-6 w-full">
                                <label className="text-gray-900 dark:text-gray-200 font-semibold">
                                    Email <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    value={EmployeeData.email}
                                    onChange={handleInputChange}
                                    type="email"
                                    className="w-full px-4 py-2 mt-2  text-gray-800  bg-white border border-gray-400 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-800 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                                    placeholder="Enter Email"
                                    name="email"

                                />
                            </div>

                            <div className="mb-6 w-full">
                                <label className="text-gray-900 dark:text-gray-200 font-semibold">
                                    Location <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    name="location"
                                    value={EmployeeData.location}
                                    onChange={handleInputChange}
                                    type="text"
                                    className="w-full px-4 py-2 mt-2  text-gray-800  bg-white border border-gray-400 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-800 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                                    placeholder="Location"
                                />
                            </div>
                            <div className="mb-6 w-full">
                                <label className="text-gray-900 dark:text-gray-200 font-semibold">
                                    Date of Birth <span className="text-red-500">*</span>
                                </label>
                                <input
                                    required
                                    name="dateOfBirth"
                                    type="date"
                                    value={EmployeeData.dateOfBirth}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 mt-2  text-gray-800  bg-white border border-gray-400 rounded-md dark:bg-gray-800 dark:text-gray-300 dark:border-gray-800 focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 dark:focus:border-blue-300 focus:outline-none focus:ring"
                                    placeholder="Date of Birth"
                                />
                            </div>

                            <div className="mb-6 w-40">
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300"
                                    onClick={() => setShowSalaryForm(prev => !prev)}
                                >
                                    {showSalaryForm ? "Hide Salary Details" : "Add Salary Details"}
                                </button>
                            </div>
                            {showSalaryForm && (
                                <div className="border p-4 rounded-lg mt-2 bg-gray-100 dark:bg-gray-800">
                                    <h3 className="text-lg font-semibold mb-2 text-blue-700">Salary Details</h3>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <input
                                            type="text"
                                            name="payrollItem"
                                            value={newSalaryItem.payrollItem}
                                            onChange={handleSalaryInputChange}
                                            placeholder="Payroll Item"
                                            className="px-4 py-2 border rounded-md"
                                        />
                                        <input
                                            type="text"
                                            name="itemType"
                                            value={newSalaryItem.itemType}
                                            onChange={handleSalaryInputChange}
                                            placeholder="Item Type"
                                            className="px-4 py-2 border rounded-md"
                                        />
                                        <input
                                            type="text"
                                            name="name"
                                            value={newSalaryItem.name}
                                            onChange={handleSalaryInputChange}
                                            placeholder="Name"
                                            className="px-4 py-2 border rounded-md"
                                        />
                                        <input
                                            type="number"
                                            name="value"
                                            value={newSalaryItem.value}
                                            onChange={handleSalaryInputChange}
                                            placeholder="Value"
                                            className="px-4 py-2 border rounded-md"
                                        />
                                    </div>
                                    <div className="flex space-x-4">

                                        <button
                                            onClick={handleSalarySubmit}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                                        >
                                            {isEditSalaryDetails ? "Update Salary Item" : "Add Salary Item"}
                                        </button>
                                        <button
                                            onClick={handleCancelSalaryDetails}
                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-500"
                                        >
                                            Cancel
                                        </button>
                                    </div>


                                </div>
                            )}

                            {salaryDetails.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-medium mb-2 text-gray-700 dark:text-gray-300">
                                        Added Salary Items:
                                    </h4>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full border border-gray-300 rounded-md ">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="font-normal border border-gray-300 px-4 py-2">
                                                        Actions
                                                    </th>
                                                    <th className="font-normal border border-gray-300 px-4 py-2">
                                                        payrollItem
                                                    </th>
                                                    <th className="font-normal border border-gray-300 px-4 py-2">
                                                        Item Type
                                                    </th>

                                                    <th className="font-normal border border-gray-300 px-4 py-2">
                                                        Name
                                                    </th>

                                                    <th className="font-normal border border-gray-300 px-4 py-2">
                                                        Value
                                                    </th>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {salaryDetails.map((item, index) => (
                                                    <tr key={item.id} className="border-b">
                                                        <td className="border border-gray-300 px-4 py-2 ">
                                                            <div className="flex justify-center space-x-4">
                                                                <button
                                                                    className="flex item-center space-y-1 text-blue-600 hover:text-blue-800 "
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleEditSalaryDetails(item);
                                                                    }}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth="1.5"
                                                                        stroke="currentColor"
                                                                        className="w-5 h-5"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                                        />
                                                                    </svg>
                                                                </button>

                                                                <button
                                                                    className="flex justify-center text-gray-600 hover:text-gray-800"
                                                                    onClick={(e) => {
                                                                        e.preventDefault();
                                                                        handleDeleteSalaryDetails(item.id);
                                                                    }
                                                                    }
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        strokeWidth="1.5"
                                                                        stroke="currentColor"
                                                                        className="w-6 h-6"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            d="M16.5 9.75v7.5a2.25 2.25 0 01-2.25 2.25h-4.5a2.25 2.25 0 01-2.25-2.25v-7.5m6.75-3.75v-.75a2.25 2.25 0 00-2.25-2.25h-3a2.25 2.25 0 00-2.25 2.25v.75m-3 0h12m-10.5 0h9"
                                                                        />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {item.payrollItem}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {item.itemType}
                                                        </td>
                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {item.name}
                                                        </td>

                                                        <td className="border border-gray-300 px-4 py-2">
                                                            {item.value}
                                                        </td>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            )}

                            <div className="flex space-x-4 mt-6 justify-start">
                                <button
                                    type="submit"
                                    onClick={handleFormSubmit}
                                    className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-gray-600"
                                >
                                    Save And Close
                                </button>
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-8 py-2.5 leading-5 text-white transition-colors duration-300 transform bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:bg-gray-600"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>

                    </div>
                </div>
            )}

        </div>
    );
};

export default EmployeesDetail;