import * as grpc from "@grpc/grpc-js";
import EmployeeModel from "../models/employee";

export const getEmployee = async (call: any, callback: any) => {
	try {
		const id = call.request.id;

		const employee = await EmployeeModel.findById(id);

		if (!employee) return callback({ code: grpc.status.NOT_FOUND, message: "EMPLOYEE_NOT_FOUND" });

		callback(null, employee);
	} catch (error) {
		callback(error, null);
	}
};

export const getAllEmployee = async (call: any, callback: any) => {
	try {
		const employees = await EmployeeModel.find();

		if (!employees) return callback({ code: grpc.status.INTERNAL, message: "FAILED_GET_EMPLOYEES" });

		callback(null, { employees });
	} catch (error) {
		callback(error, null);
	}
};

export const createEmployee = async (call: any, callback: any) => {
	try {
		const employee = call.request;

		const newEmployee = await EmployeeModel.create(employee);

		if (!newEmployee) return callback({ code: grpc.status.INTERNAL, message: "FAILED_CREATE_EMPLOYEE" });

		callback(null, newEmployee);
	} catch (error) {
		callback(error, null);
	}
};

export const updateEmployee = async (call: any, callback: any) => {
	try {
		const employee = call.request;

		const updatedEmployee = await EmployeeModel.findByIdAndUpdate({ _id: employee._id }, { $set: employee });

		if (!updatedEmployee) return callback({ code: grpc.status.INTERNAL, message: "FAILED_UPDATE_EMPLOYEE" });

		const employeeData = await EmployeeModel.findById(employee._id);

		callback(null, employeeData);
	} catch (error) {
		callback(error, null);
	}
};

export const deleteEmployee = async (call: any, callback: any) => {
	try {
		const id = call.request.id;

		const deletedResult = await EmployeeModel.findByIdAndDelete({ _id: id });

		if (!deletedResult?.$isDeleted) return callback({ code: grpc.status.INTERNAL, message: "FAILED_DELETE_EMPLOYEE" });

		callback(null, { message: "SUCCESS_DELETE_EMPLOYEE" });
	} catch (error) {
		callback(error, null);
	}
};
