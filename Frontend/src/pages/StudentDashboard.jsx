import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTimes, FaBars, FaUserGraduate, FaClipboardCheck, FaSignOutAlt } from 'react-icons/fa';

const StudentDashboard = () => {
    const [onCampusOpportunities, setOnCampusOpportunities] = useState([]);
    const [offCampusOpportunities, setOffCampusOpportunities] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [error, setError] = useState(false);

    const navigate = useNavigate();

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    useEffect(() => {
        const fetchOpportunities = async () => {
            try {
                const [onCampusResponse, offCampusResponse] = await Promise.all([
                    axios.get(`http://localhost:5001/api/adminPost/oncampusOpportunity/5`),
                    axios.get(`http://localhost:5001/api/adminPost/offcampusOpportunity/5`)
                ]);
                setOnCampusOpportunities(onCampusResponse.data);
                setOffCampusOpportunities(offCampusResponse.data);
            } catch (error) {
                console.error('Error fetching opportunities:', error);
                setError(true);
            }
        };
        fetchOpportunities();
    }, []);

    return (
        <div className="flex h-screen bg-gray-50 position-relative">
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
                className={`md:hidden fixed top-0 right-0 bottom-0 w-4/5 h-1/2 rounded-md bg-white shadow-md transition-all duration-300 z-40 transform ${isSidebarOpen ? "translate-x-0" : "translate-x-full "}`}
            >
                <div className="flex flex-col h-full"> 
                    <h2 className="text-center py-6 text-xl font-bold border-b">
                        Welcome Student
                    </h2>
                    <div className="flex flex-col py-4">
                        <button
                            className="flex items-center px-6 py-4 text-lg text-gray-700 hover:bg-blue-100 border-2 my-1 rounded-lg"
                            onClick={() => navigate("/studentsProfilePage")}
                        >
                            <FaUserGraduate className="mr-3" />
                            Profile
                        </button>
                        <button
                            className="flex items-center px-6 py-4 text-lg text-gray-700 hover:bg-blue-100 border-2 my-1 rounded-lg"
                            onClick={() => navigate("/approvalRequests")}
                        >
                            <FaClipboardCheck className="mr-3" />
                            Applied
                        </button>
                        <button
                            onClick={() => navigate('/logout')}
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
                <h2 className="text-2xl font-bold mb-8">Welcome Student</h2>
                <div className="flex flex-col space-y-6">
                    <button
                        className="flex items-center px-4 py-3 rounded-lg text-lg hover:bg-blue-100 transition"
                        onClick={() => navigate("/studentsProfilePage")}
                    >
                        <FaUserGraduate className="mr-3" />
                        Profile
                    </button>
                    <button
                        className="flex items-center px-4 py-3 rounded-lg text-lg hover:bg-blue-100 transition"
                        onClick={() => navigate("/approvalRequests")}
                    >
                        <FaClipboardCheck className="mr-3" />
                        Applied
                    </button>
                    <button
                        onClick={() => navigate('/logout')}
                        className="flex items-center px-4 py-3 rounded-lg text-lg text-red-600 hover:bg-red-100 transition"
                    >
                        <FaSignOutAlt className="mr-3" />
                        Logout
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-10 ml-0 md:ml-[256px] overflow-auto">
                <h1 className="text-3xl font-bold mb-8">Posted Opportunities</h1>

                {error && (
                    <div className="text-red-500 mb-8">
                        Failed to load opportunities. Please try again later.
                    </div>
                )}

                {/* On-Campus Opportunities */}
                <section className="mb-12">
                    <h2 className="text-2xl font-semibold mb-6">On-Campus Opportunities</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {onCampusOpportunities.length > 0 ? (
                            onCampusOpportunities.map((opportunity, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-300 p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition cursor-pointer"
                                >
                                    <h3 className="text-lg font-bold truncate mb-2">
                                        {opportunity.companyName}
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-1">
                                        {opportunity.jobProfile}
                                    </p>
                                    <p className="text-sm text-green-500 font-medium">
                                        {opportunity.ctc}
                                    </p>
                                    <a
                                        href={`/opportunity/onCampus/${opportunity.id}`}
                                        className="text-blue-500 hover:underline block mt-4"
                                    >
                                        View Details
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p>No On-Campus opportunities available.</p>
                        )}
                    </div>
                </section>

                {/* Off-Campus Opportunities */}
                <section>
                    <h2 className="text-2xl font-semibold mb-6">Off-Campus Opportunities</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {offCampusOpportunities.length > 0 ? (
                            offCampusOpportunities.map((opportunity, index) => (
                                <div
                                    key={index}
                                    className="border border-gray-300 p-6 rounded-lg shadow-md bg-white hover:shadow-lg transition cursor-pointer"
                                >
                                    <h3 className="text-lg font-bold truncate mb-2">
                                        {opportunity.companyName}
                                    </h3>
                                    <div className="h-6"></div>
                                    <a
                                        href={`/opportunity/offCampus/${opportunity.id}`}
                                        className="text-blue-500 hover:underline block mt-4"
                                    >
                                        View Details
                                    </a>
                                </div>
                            ))
                        ) : (
                            <p>No Off-Campus opportunities available.</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default StudentDashboard;
