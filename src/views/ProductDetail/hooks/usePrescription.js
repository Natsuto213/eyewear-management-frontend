import { useFormik } from "formik";
import * as Yup from "yup";
import { DEFAULT_PRESCRIPTION, PRESCRIPTION_FIELDS } from "../utils/constants";
import { useEffect } from "react";

export function usePrescription() {
    // Định nghĩa Schema bằng Yup
    const validationSchema = Yup.object(
        // Tạo schema tự động cho 10 trường (5 thông số x 2 mắt)
        ["left", "right"].reduce((acc, side) => {
            acc[`${side}SPH`] = Yup.number()
                .typeError("Phải là số")
                .min(-20, "Từ -20.00 đến +10.00").max(10, "Từ -20.00 đến +10.00")
                .test("is-025", "Bội số 0.25", val => !val || Math.round(val * 100) % 25 === 0);

            acc[`${side}CYL`] = Yup.number()
                .typeError("Phải là số")
                .min(-6, "Từ -6.00 đến +0.00").max(0, "Từ -6.00 đến +0.00")
                .test("is-025", "Bội số 0.25", val => !val || Math.round(val * 100) % 25 === 0);

            acc[`${side}AXIS`] = Yup.number()
                .typeError("Phải là số")
                .when(`${side}CYL`, {
                    is: (val) => val && val !== 0,
                    then: (schema) => schema.required("Nhập trục").integer("Số nguyên").min(1, "1-180").max(180, "1-180"),
                    otherwise: (schema) => schema.nullable()
                });

            acc[`${side}ADD`] = Yup.number()
                .typeError("Phải là số")
                .min(0).max(3.5, "Tối đa 3.50")
                .test("is-025", "Bội số 0.25", val => !val || Math.round(val * 100) % 25 === 0);

            acc[`${side}PD`] = Yup.number().typeError("Phải là số").max(50);
            return acc;
        }, {})
    );

    const formik = useFormik({
        initialValues: JSON.parse(sessionStorage.getItem("prescription_data")) || DEFAULT_PRESCRIPTION,
        validationSchema,
        onSubmit: (values) => {
            // Logic submit sẽ được gọi gián tiếp từ AddToCartBar
            console.log("Formik Submit Data:", values);
        },
    });

    // Đồng bộ với sessionStorage
    useEffect(() => {
        sessionStorage.setItem("prescription_data", JSON.stringify(formik.values));
    }, [formik.values]);

    return {
        formik,
        resetPrescription: () => {
            sessionStorage.removeItem("prescription_data");
            formik.resetForm({ values: DEFAULT_PRESCRIPTION });
        }
    };
}