import { useState, useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import {
    FaBars,
    FaTimes,
    FaUserGraduate,
    FaClipboardCheck,
    FaRegListAlt,
    FaSignOutAlt,
} from "react-icons/fa";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
    const [onCampusOpportunities, setOnCampusOpportunities] = useState([]);
    const [offCampusOpportunities, setOffCampusOpportunities] = useState([]);
    const [totalCompaniesCount, setTotalCompaniesCount] = useState(0);
    const [totalStudentsCount, setTotalStudentsCount] = useState(0);
    const [registeredStudentsCount, setRegisteredStudentsCount] = useState(0);
    const [placedStudentsCount, setPlacedStudentsCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleLogout = async () => {
        try {
            // Retrieve the refreshToken from localStorage
            const refreshToken = localStorage.getItem("refreshToken");
    
            if (!refreshToken) {
                alert("No refresh token found. Please log in again.");
                //navigate("/admin/login");
                return;
            }
    
            // Make an API call to log out the admin
            const response = await axios.post(
                "http://localhost:8000/api/admin/logout",
                { refreshToken }, 
            );
    
            console.log("Logout response:", response.data);
    
            // Clear authentication tokens or user data from localStorage/sessionStorage
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
    
            // Navigate to the login page
            navigate("/admin/login");
    
            // Show a success message
            alert("You have been logged out successfully.");
        } catch (error) {
            console.error("Error during logout:", error.response || error.message);
            alert("Failed to log out. Please try again.");
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [
                    onCampus,
                    offCampus,
                    companies,
                    students,
                    registered,
                    placed,
                ] = await Promise.all([
                    axios.get("http://localhost:5001/api/adminPost/oncampusOpportunity/5"),
                    axios.get("http://localhost:5001/api/adminPost/offcampusOpportunity/5"),
                    axios.get("http://localhost:5001/api/adminPost/companiesList"),
                    axios.get("http://localhost:5001/api/adminPost/studentsListForAdmin"),
                    axios.get("http://localhost:5001/api/adminPost/registeredStudentsCount"),
                    axios.get("http://localhost:5001/api/adminPost/placedStudentsCount"),
                ]);

                setOnCampusOpportunities(onCampus.data);
                setOffCampusOpportunities(offCampus.data);
                setTotalCompaniesCount(companies.data.length);
                setTotalStudentsCount(students.data.length);
                setRegisteredStudentsCount(registered.data.length);
                setPlacedStudentsCount(placed.data.length);
            } catch (error) {
                console.error("Error fetching data:", error);
                //setError("Failed to load data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const chartOptions = {
        cutout: "70%",
    };

    const generateChartData = (data, remainingColor) => ({
        datasets: [
            {
                data: data,
                backgroundColor: ["#4CAF50", remainingColor],
                borderWidth: 2,
            },
        ],
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="loader"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar Toggle for Mobile */}
            <div className="md:hidden fixed top-4 right-4 z-50">
                <button
                    onClick={toggleSidebar}
                    className="text-3xl text-gray-700 hover:text-gray-900 transition"
                >
                    {isSidebarOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                    onClick={toggleSidebar}
                ></div>
            )}

            {/* Mobile Sidebar */}
            <div
                className={`md:hidden fixed top-0 right-0 bottom-0 w-4/5 bg-white shadow-md transition-transform duration-300 z-50 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full">
                    <h2 className="text-center py-6 text-xl font-bold border-b">
                        Welcome Admin
                    </h2>
                    <div className="flex flex-col py-4">
                        <button
                            className="flex items-center px-6 py-4 text-lg text-gray-700 hover:bg-blue-100 border-2 my-1 rounded-lg"
                            onClick={() => navigate("/studentsListForAdmin")}
                        >
                            <FaUserGraduate className="mr-3" />
                            Students
                        </button>
                        <button
                            className="flex items-center px-6 py-4 text-lg text-gray-700 hover:bg-blue-100 border-2 my-1 rounded-lg"
                            onClick={() => navigate("/approvalRequests")}
                        >
                            <FaClipboardCheck className="mr-3" />
                            Requests
                        </button>
                        <button
                            className="flex items-center px-6 py-4 text-lg text-gray-700 hover:bg-blue-100 border-2 my-1 rounded-lg"
                            onClick={() => navigate("/fetchResponsesCompanyList")}
                        >
                            <FaRegListAlt className="mr-3" />
                            Responses
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center px-6 py-4 text-lg text-red-600 hover:bg-red-100 border-2 my-1 rounded-lg"
                        >
                            <FaSignOutAlt className="mr-3" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:flex w-[256px] bg-white fixed top-0 bottom-0 flex-col px-6 py-8 shadow-md border-r">
                <h2 className="text-2xl font-bold mb-8">Welcome Admin</h2>
                <div className="flex flex-col space-y-6">
                    <button
                        className="flex items-center px-4 py-3 rounded-lg text-lg hover:bg-blue-100 transition"
                        onClick={() => navigate("/studentsListForAdmin")}
                    >
                        <FaUserGraduate className="mr-3" />
                        Students
                    </button>
                    <button
                        className="flex items-center px-4 py-3 rounded-lg text-lg hover:bg-blue-100 transition"
                        onClick={() => navigate("/approvalRequests")}
                    >
                        <FaClipboardCheck className="mr-3" />
                        Requests
                    </button>
                    <button
                        className="flex items-center px-4 py-3 rounded-lg text-lg hover:bg-blue-100 transition"
                        onClick={() => navigate("/fetchResponsesCompanyList")}
                    >
                        <FaRegListAlt className="mr-3" />
                        Responses
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex items-center px-4 py-3 rounded-lg text-lg text-red-600 hover:bg-red-100 transition"
                    >
                        <FaSignOutAlt className="mr-3" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="ml-0 md:ml-[256px] flex-1 p-10 overflow-y-auto space-y-12">
                {/* Post Opportunity Section */}
                <div
                    className="flex flex-col items-center bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition"
                    onClick={() => navigate("/AddCompanyProfile")}
                >
                    <img
                        src="/img.png"
                        alt="Post"
                        className="w-40 h-40 object-contain rounded-full shadow-md mb-6"
                    />
                    <button className="text-indigo-800 font-bold text-lg">
                        Post New Opportunity
                    </button>
                </div>

                {/* Charts Section */}
                <div className="flex flex-col items-center md:flex-row md:justify-evenly">
                    {[
                        { label: "Companies", value: totalCompaniesCount, color: "#DDDDDD" },
                        {
                            label: "Students",
                            value: registeredStudentsCount,
                            total: totalStudentsCount,
                            color: "#DDDDDD",
                        },
                        {
                            label: "Placed",
                            value: placedStudentsCount,
                            total: totalStudentsCount,
                            color: "#FFCE56",
                        },
                    ].map(({ label, value, total, color }, index) => (
                        <div key={index} className="relative w-48 mt-4 md:mt-0">
                            <Doughnut
                                data={generateChartData(
                                    [value, total ? total - value : 100 - value],
                                    color
                                )}
                                options={chartOptions}
                            />
                            <div className="absolute inset-0 flex flex-col justify-center items-center text-indigo-800 font-bold">
                                <p className="text-2xl">{value}</p>
                                <p>{label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Opportunities Section */}
                {[
                    { title: "On-Campus Opportunities", data: onCampusOpportunities },
                    { title: "Off-Campus Opportunities", data: offCampusOpportunities },
                ].map(({ title, data }, index) => (
                    <div key={index}>
                        <h4 className="text-lg font-semibold mb-4">{title}</h4>
                        <div className="flex gap-4 overflow-x-auto">
                            {data.map((opportunity, idx) => (
                                <div
                                    key={idx}
                                    className="flex-shrink-0 w-64 p-4 bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition"
                                >
                                    <h6 className="font-bold mb-2 truncate">
                                        {opportunity.companyName}
                                    </h6>
                                    <p className="text-sm text-gray-600 mb-1">
                                        {opportunity.jobProfile || "Not Specified"}
                                    </p>
                                    <a
                                        href={`/opportunity/onCampus/${opportunity.id}`}
                                        className="text-indigo-600 hover:underline"
                                    >
                                        View
                                    </a>
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={() =>
                                navigate(
                                    `/allOpportunities/${title.toLowerCase().replace(/\s+/g, "")}`
                                )
                            }
                            className="text-indigo-600 font-semibold mt-2"
                        >
                            See All
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboard;