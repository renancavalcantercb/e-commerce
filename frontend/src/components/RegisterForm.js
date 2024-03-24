import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { formatCPF, isValid } from "../utils/utils";

import API_CONFIG from '../config/index.js';

const formFields = [
    {
        label: "Email",
        type: "email",
        name: "email",
        placeholder: "Enter your email",
    }, {
        label: "Full name",
        type: "text",
        name: "name",
        placeholder: "Enter your full name",
    },
    {
        label: "Password",
        type: "password",
        name: "password",
        placeholder: "Enter your password",
    },
    {
        label: "Confirm Password",
        type: "password",
        name: "password_confirmation",
        placeholder: "Confirm your password",
    },
    {
        label: "CPF",
        type: "text",
        name: "cpf",
        placeholder: "Enter your CPF",
    },
    {
        label: "Birth Date",
        type: "date",
        name: "birth_date",
        placeholder: "Enter your birth date",
    },
    {
        label: "Phone",
        type: "tel",
        name: "phone",
        placeholder: "Enter your phone number",
    },
];


export default function Registration() {
    const [formData, setFormData] = useState({
        email: "",
        name: "",
        password: "",
        password_confirmation: "",
        cpf: "",
        birth_date: "",
        phone: "",
    });

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        if (name === "cpf") {
            let formattedCPF = isValid(value) ? formatCPF(value) : value;

            setFormData((prevData) => ({
                ...prevData,
                [name]: formattedCPF,
            }));
        } else {
            setFormData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        for (const field in formData) {
            if (formData[field] === "") {
                toast.warning("Please fill all fields");
                return;
            }
        }

        if (formData.password !== formData.password_confirmation) {
            toast.warning("Passwords don't match");
            return;
        }
        if (!isValid(formData.cpf)) {
            toast.warning("Invalid CPF");
            return;
        }
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const { message, status } = await response.json();
            if (status === 201) {
                toast.success(message);
                setFormData({
                    email: "",
                    name: "",
                    password: "",
                    password_confirmation: "",
                    cpf: "",
                    birth_date: "",
                    phone: "",
                });
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
                                to="/login"
                            >
                                Already registered?
                            </Link>
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 ml-4 text-xs font-semibold tracking-widest text-white uppercase transition duration-150 ease-in-out bg-[#5046e6] border border-transparent rounded-md active:bg-[#5046e6]"
                            >
                                Register
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
