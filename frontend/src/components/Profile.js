import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatCPF } from "../utils/utils";
import { useAuth } from "../contexts/AuthContext";

import API_CONFIG from '../config/index.js';

const formFields = [
    {
        label: "Name",
        type: "text",
        name: "name",
    },
    {
        label: "Email",
        type: "email",
        name: "email",
    },
    {
        label: "CPF",
        type: "text",
        name: "CPF",
    },
    {
        label: "Birth Date",
        type: "date",
        name: "birth_date",
    },
    {
        label: "Phone",
        type: "text",
        name: "phone"
    }
];


function Profile() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        CPF: "",
        birth_date: "",
        phone: ""
    });

    const [originalFormData, setOriginalFormData] = useState(null);
    const [isModified, setIsModified] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const { logout } = useAuth();

    const token = localStorage.getItem("token");

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    };

    const renderFormFields = () => {
        return formFields.map((field, index) => (
            <div className={index !== 0 ? "mt-4" : ""} key={index}>
                <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                >
                    {field.label}
                </label>
                <div className="flex flex-col items-start">
                    <input
                        type={field.type}
                        name={field.name}
                        placeholder={field.placeholder}
                        className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        value={formData[field.name]}
                        onChange={handleInputChange}
                        disabled={field.name === "CPF"}
                    />
                </div>
            </div>
        ));
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${API_CONFIG.BASE_URL}/profile`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                setProfileData(data);
                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    CPF: formatCPF(data.cpf) || "",
                    birth_date: data.birth_date || "",
                    phone: data.phone || ""
                });
                setOriginalFormData({
                    name: data.name || "",
                    email: data.email || "",
                    CPF: formatCPF(data.cpf) || "",
                    birth_date: data.birth_date || "",
                    phone: data.phone || ""
                });
            } catch (error) {
                console.error("Fetching profile failed", error);
                toast.error("Failed to load profile data.");
            }
        };

        fetchProfile();
    }, [token]);

    useEffect(() => {
        if (originalFormData) {
            const modified = Object.keys(originalFormData).some(
                key => originalFormData[key] !== formData[key]
            );
            setIsModified(modified);
        }
    }, [formData, originalFormData]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/profile/edit`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            toast.success('Profile Updated Successfully!');
            setOriginalFormData(formData);
            setIsModified(false);
            logout();
        } catch (error) {
            console.error("Updating profile failed", error);
            toast.error("Failed to update profile data.");
        }
    };

    return (
        <div>
            {profileData ? (
                <div>
                    <div className="flex flex-col items-center pt-6 sm:justify-center sm:pt-0">
                        <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg">
                            <form onSubmit={handleSubmit}>
                                {renderFormFields()}
                                <div className="flex items-center justify-end mt-4">
                                    <button
                                        type="submit"
                                        className={`inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out ${isModified ? 'bg-[#5046e6]' : 'bg-gray-300'} border border-transparent rounded-md active:bg-[#5046e6]`}
                                        disabled={!isModified}
                                    >
                                        Update
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <div className="flex items-center justify-center h-screen">
                        <div role="status">
                            <svg aria-hidden="true" class="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Profile;
