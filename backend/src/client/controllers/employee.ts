import path from "path";
import * as protoLoader from "@grpc/proto-loader";
import * as grpc from "@grpc/grpc-js";
import { NextFunction, Response } from "express";

const protoPath = path.join(__dirname, "../../proto/employee.proto");

const options = {
	keepCase: true,
	longs: String,
	enums: String,
	defaults: true,
	oneofs: true,
};

const employeeProto = protoLoader.loadSync(protoPath, options);
const { employeePackage } = grpc.loadPackageDefinition(employeeProto) as any;

const employeeClient = new employeePackage.EmployeeService(process.env.EMPLOYEE_SERVICE_URL, grpc.credentials.createInsecure());

export const getEmployee = async (req: any, res: Response, next: NextFunction) => {
	await employeeClient.GetEmployee({ id: req.params.id }, (error: grpc.ServiceError, data: any) => {
		if (error) return next(error);

		res.status(200).json({
			status: true,
			code: 200,
			message: "Employee found!",
			employee: data,
		});
	});
};

export const getAllEmployee = async (req: any, res: Response, next: NextFunction) => {
	await employeeClient.GetAllEmployee({}, (error: grpc.ServiceError, data: any) => {
		if (error) return next(error);

		res.status(200).json({
			status: true,
			code: 200,
			message: "Employees found!",
			employees: data.employees,
		});
	});
};

export const createEmployee = async (req: any, res: Response, next: NextFunction) => {
	try {
		if (!req.body.tags) req.body.tags = [];

		await employeeClient.CreateEmployee(req.body, (error: grpc.ServiceError, data: any) => {
			if (error) return next(error);

			delete req.body.tags;

			res.status(201).json({
				status: true,
				code: 201,
				message: "Employee created successfully!",
				employee: data,
			});
		});
	} catch (error) {
		next(error);
	}
};

export const updateEmployee = async (req: any, res: Response, next: NextFunction) => {
	try {
		if (!req.body.tags) req.body.tags = [];

		const dataParams = req.params;
		const dataBody = req.body;

		const employee = {
			_id: dataParams.id,
			...dataBody,
		};

		await employeeClient.UpdateEmployee(employee, (error: grpc.ServiceError, data: any) => {
			if (error) return next(error);

			res.status(200).json({
				status: true,
				code: 200,
				message: "Employee updated successfully!",
				updatedData: data,
			});
		});
	} catch (error) {
		next(error);
	}
};

export const deleteEmployee = async (req: any, res: Response, next: NextFunction) => {
	try {
		const dataParams = req.params;

		await employeeClient.DeleteEmployee({ id: dataParams.id }, (error: grpc.ServiceError, data: any) => {
			if (error) return next(error);

			res.status(200).json({
				status: true,
				code: 200,
				message: "Employee deleted successfully!",
			});
		});
	} catch (error) {
		next(error);
	}
};
