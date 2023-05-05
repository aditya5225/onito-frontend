import React from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
    name: yup.string().required('Required!'),
    dob: yup.date().required('Required!').max(new Date(), 'Date of birth cannot be in the future'),
    gender: yup.string().required('Required!'),
    mobile: yup.string().matches(/^[6-9]\d{9}$/, 'Invalid mobile number'),
    emrg_num: yup.string().matches(/^[6-9]\d{9}$/, 'Invalid mobile number'),
    document_type: yup.string(),
    document_number: yup.string()
        .when("document_type", {
            is: (value) => {
                return value == 'pan_card'
            },
            then: () => {
                return yup.string().matches(/^(?=.*[A-Za-z])(?=.*\d).{10}$/, 'Invalid Pan number')
            },
        })
        .when("document_type", {
            is: (value) => {
                return value == 'aadhaar_card'
            },
            then: () => {
                return yup.string().matches(/^\d{12}$/, 'Invalid Aadhaar number')
            },
        })
});

const AddDetailsComp = () => {
    const { register, reset, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const navigate = useNavigate();

    const onSubmit = async (data) => {
        const postData = {
            ...data
        }

        const config = {
            headers: {
                "sample-access-key": "sample-access-value"
            },
            timeout: 5000 // 5 seconds
        }

        const result = await axios.post('http://localhost:5000/api/add_customers', postData, config)

        if (result.data.error) {
            console.log(result.data.message)
        }
        else {
            alert('Submited')
            reset()
        }
    };

    return (
        <div className="container mt-4 mb-5">
            <div className='text-end'>
                <button
                    className='btn btn-primary mb-3'
                    onClick={() => {
                        navigate("/");
                    }}
                > Show Users </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row g-3">
                    <h5> Personal Details </h5>
                    <div className="col-md-4">
                        <label htmlFor="name" className="form-label"> Name<span className='text-danger'>*</span> </label>
                        <input {...register("name")} type="text" className={`form-control ${errors.name ? "is-invalid" : ""}`} />
                        {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="dob" className="form-label">Date of Birth<span className='text-danger'>*</span></label>
                        <input {...register("dob")} type="date" className={`form-control ${errors.dob ? "is-invalid" : ""}`} />
                        {errors.dob && <div className="invalid-feedback">{errors.dob.message}</div>}
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="gender" className="form-label"> Sex<span className='text-danger'>*</span> </label>
                        <select {...register("gender")} className={`form-select ${errors.gender ? "is-invalid" : ""}`}>
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.gender && <div className="invalid-feedback">{errors.gender.message}</div>}
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="mobile" className="form-label">Mobile</label>
                        <input {...register("mobile")} type="tel" className={`form-control ${errors.mobile ? "is-invalid" : ""}`} />
                        {errors.mobile && <div className="invalid-feedback">{errors.mobile.message}</div>}
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="document_type" className="form-label">Govt Issued ID</label>
                        <div className='d-flex'>
                            <select {...register("document_type")} className={`form-select w-50`}>
                                <option value="">Select Document</option>
                                <option value="pan_card"> Pan Card </option>
                                <option value="aadhaar_card"> Aadhaar Card </option>
                            </select>
                            <input {...register("document_number")} type="text" className={`form-control ${errors.document_number ? "is-invalid" : ""}`} placeholder='Enter Govt ID' />
                            {errors.document_number && <div className="invalid-feedback">{errors.document_number.message}</div>}
                        </div>
                    </div>
                </div>

                <div className="row g-3 mt-4">
                    <h5> Contact Details </h5>

                    <div className="col-md-4">
                        <label htmlFor="guardian_type" className="form-label">Govt Issued ID</label>
                        <div className='d-flex'>
                            <select {...register("guardian_type")} className={`form-select w-50`}>
                                <option value="">Select Guardian</option>
                                <option value="father"> Father </option>
                                <option value="mother"> Mother </option>
                            </select>
                            <input {...register("guardian_name")} type="text" className={`form-control`} placeholder='Enter Guardian Name' />
                        </div>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input {...register("email")} type="email" className={`form-control`} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="emrg_num" className="form-label">Emergency Contact Number</label>
                        <input {...register("emrg_num")} type="tel" className={`form-control ${errors.emrg_num ? "is-invalid" : ""}`} />
                        {errors.emrg_num && <div className="invalid-feedback">{errors.emrg_num.message}</div>}
                    </div>
                </div>

                <div className="row g-3 mt-4">
                    <h5> Address Details </h5>

                    <div className="col-md-4">
                        <label htmlFor="address" className="form-label"> Address </label>
                        <input {...register("address")} type="text" className={`form-control`} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="state" className="form-label">State</label>
                        <select {...register("state")} className={`form-select`}>
                            <option value="">Select State</option>
                            <option value="maharashtra"> Maharashtra </option>
                            <option value="uttar_pradesh"> Uttar Pradesh </option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="city" className="form-label">City</label>
                        <select {...register("city")} className={`form-select`}>
                            <option value="">Select City</option>
                            <option value="mumbai"> Mumbai </option>
                            <option value="varanasi"> Varanasi </option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="country" className="form-label">Country</label>
                        <select {...register("country")} className={`form-select`}>
                            <option value="">Select Country</option>
                            <option value="india"> India </option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="pin_code" className="form-label"> Pincode </label>
                        <input {...register("pin_code")} type="text" className={`form-control`} />
                    </div>
                </div>

                <div className="row g-3 mt-4">
                    <h5> Address Details </h5>

                    <div className="col-md-4">
                        <label htmlFor="occupation" className="form-label"> Occupation </label>
                        <input {...register("occupation")} type="text" className={`form-control`} />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="religion" className="form-label">Religion</label>
                        <select {...register("religion")} className={`form-select`}>
                            <option value="">Select Religion</option>
                            <option value="hinduism">Hinduism</option>
                            <option value="islam">Islam</option>
                            <option value="christianity">Christianity</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="marital_status" className="form-label">Marital Status</label>
                        <select {...register("marital_status")} className={`form-select`}>
                            <option value="">Select Marital Status</option>
                            <option value="single">Single</option>
                            <option value="married">Married</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="blood_group" className="form-label">Blood Group</label>
                        <select {...register("blood_group")} className={`form-select`}>
                            <option value="">Select Blood Group</option>
                            <option value="o_positive">O Positive</option>
                            <option value="a_negative">A Negative</option>
                        </select>
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="nationality" className="form-label">Nationality</label>
                        <select {...register("nationality")} className={`form-select`}>
                            <option value="">Select Nationality</option>
                            <option value="indian"> Indian </option>
                        </select>
                    </div>
                </div>

                <div className="col-12 mt-4">
                    <button type="submit" className="btn btn-primary">Submit</button>
                </div>
            </form>
        </div>
    );
}

export default AddDetailsComp;
