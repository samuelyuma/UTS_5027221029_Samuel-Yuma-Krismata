import path from "path";
import dotenv from "dotenv";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

import DBConnection from "./config/database";

import { getEmployee, getAllEmployee, createEmployee, updateEmployee, deleteEmployee } from "./controllers/employee";

dotenv.config();
DBConnection();

const protoPath = path.join(__dirname, "../proto/employee.proto");

const employeeProto = protoLoader.loadSync(protoPath);
const { employeePackage } = grpc.loadPackageDefinition(employeeProto) as any;

const server = new grpc.Server();
server.addService(employeePackage.EmployeeService.service, {
	getEmployee,
	getAllEmployee,
	createEmployee,
	updateEmployee,
	deleteEmployee,
});

server.bindAsync("localhost:3001", grpc.ServerCredentials.createInsecure(), (error, port) => {
	if (error) {
		console.error(error.message);
	} else {
		console.log(`\ngRPC server is running on port ${port}`);
		server;
	}
});
