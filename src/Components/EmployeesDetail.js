import { useState, useEffect } from 'react';
import { AddEmployeeAPI, DeleteEmployeeAPI, GetAllEmployeesAPI, UpdateEmployeeDetailsAPI } from '../Apis/Employee';
import toast from 'react-hot-toast';



const EmployeesDetail = () => {
    const [employees, setEmployees] = useState([]);
    const [openEmployeeModal, setOpenEmployeeModal] = useState(false);
    const [animateIn, setAnimateIn] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
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
    }

    const handleEditClick = (event, id) => {
        event.preventDefault();
        console.log("employee id to edit:", id);
        const employeeToEdit = employees.find(emp => emp.employeeId === id);
        console.log("Editing employee:", employeeToEdit);

        setEmployeeData({
            employeeId: employeeToEdit.employeeId || 0,
            firstName: employeeToEdit.firstName || "",
            lastName: employeeToEdit.lastName || "",
            email: employeeToEdit.email || "",
            location: employeeToEdit.location || "",
            dateOfBirth: employeeToEdit.dateOfBirth || "",
        });
        setIsEditMode(true);
        setOpenEmployeeModal(true);
    };


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEmployeeData(prev => ({
            ...prev,
            [name]: value
        }));
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

            fetchEmployeesData();

        }
        catch (error) {
            console.error("Error saving employee data:", error);
            alert("Failed to save employee data. Please try again.");
        }

    };


    const handleCancel = () => {
        setOpenEmployeeModal(false);
        setAnimateIn(false);
        setEmployeeData({
            employeeId: null || undefined,
            firstName: '',
            lastName: '',
            email: '',
            location: '',
            dateOfBirth: '',
        });
        setIsEditMode(false);
    }


    return (
        <div className="container px-4 mx-auto mt-6">
            <div className="w-3/4">
                <h1 className="text-3xl font-bold text-blue-600 mb-5">Employee Details</h1>
            </div>
            <div className='relative'>
                <div className="flex-grow ml-0 mt-4 w-full">
                    <div className="overflow-hidden border border-gray-200 dark:border-gray-700 md:rounded-lg mt-6">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-800">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-md font-normal text-left rtl:text-right text-gray-600 dark:text-gray-400"
                                    >
                                        Edit/Delete
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3.5 px-4 text-md font-normal text-left rtl:text-right text-gray-600 dark:text-gray-400"
                                    >
                                        <div className="flex items-center gap-x-3">
                                            <span>First Name</span>
                                        </div>
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3.5 px-4 text-md font-normal text-left rtl:text-right text-gray-600 dark:text-gray-400"
                                    >
                                        <div className="flex items-center gap-x-3">
                                            <span>Last Name</span>
                                        </div>
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-md font-normal text-left rtl:text-right text-gray-600 dark:text-gray-400"
                                    >
                                        <button className="flex items-center gap-x-2">
                                            <span>Email</span>
                                        </button>
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-md font-normal text-left rtl:text-right text-gray-600 dark:text-gray-400"
                                    >
                                        Location
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-4 py-3.5 text-md font-normal text-left rtl:text-right text-gray-600 dark:text-gray-400"
                                    >
                                        DateOfBirth
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200 dark:divide-gray-700 dark:bg-gray-900">
                                {paginatedEmployees.length > 0 ? paginatedEmployees.map((emp) => (
                                    <tr key={emp.employeeId}

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
                                                        handleEditClick(e, emp.employeeId)
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
                                        <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap">
                                            {emp.firstName}
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
                                )) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="px-4 py-4 text-sm text-gray-500 dark:text-gray-300 whitespace-nowrap text-center"
                                        >
                                            No employees found.
                                        </td>
                                    </tr>
                                )}
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
            </div>

            {openEmployeeModal &&
                (
                    <div
                        className={`fixed top-0 right-0 h-full w-full sm:w-[560px] bg-white dark:bg-gray-900 z-50 shadow-lg overflow-y-auto transform transition-transform duration-500 ease-in  ${animateIn ? "translate-x-0" : "translate-x-full"
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
                                {isEditMode ? "Edit Employee details" : "Add New Employee"}
                            </h1>
                            <form>
                                <div className="mb-6">
                                    <label className="text-gray-900 dark:text-gray-200 font-semibold">
                                        First Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        type="text"
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