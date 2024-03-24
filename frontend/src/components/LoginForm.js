import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

import API_CONFIG from '../config/index.js';

const formFields = [
    {
        label: "Email",
        type: "email",
        name: "email",
        placeholder: "Enter your email",
    },
    {
        label: "Password",
        type: "password",
        name: "password",
        placeholder: "Enter your password",
    },
];


export default function Login() {
    console.log(API_CONFIG.BASE_URL)
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleInputChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        for (const field in formData) {
            if (formData[field] === "") {
                toast.warning("Please fill all fields");
                return;
            }
        }

        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const { message, status, token } = await response.json();
            if (status === 200) {
                login(token)
                navigate("/")
                toast.success(message);
            }
            if (status === 400 || status === 500) {
                toast.warning(message);
            }
        } catch (error) {
            console.log(error);
        }
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
                    />
                </div>
            </div>
        ));
    };

    return (
        <div>
            <div className="flex flex-col items-center pt-6 sm:justify-center sm:pt-0">
                <div className="w-full px-6 py-4 mt-6 overflow-hidden bg-white shadow-md sm:max-w-md sm:rounded-lg">
                    <form onSubmit={handleFormSubmit}>
                        {renderFormFields()}
                        <div className="flex items-center justify-end mt-4">
                            <Link
                                className="text-sm text-gray-600 underline hover:text-gray-900"
                                to="/register"
                            >
                                Don't have an account?
                            </Link>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-[#5046e6] border border-transparent rounded-md"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
