import mongoose, { Schema, Document } from "mongoose";

export interface IEmployee extends Document {
	avatar: string;
	name: string;
	email: string;
	phone: string;
	role: string;
	position: string;
	status: string;
}

const EmployeeSchema: Schema = new Schema(
	{
		avatar: { type: String, required: true },
		name: { type: String, required: true },
		email: { type: String, required: true },
		phone: { type: String, required: true },
		role: { type: String, required: true },
		position: { type: String, required: true },
		status: { type: String, required: true },
	},
	{
		versionKey: false,
	}
);

const EmployeeModel = mongoose.model<IEmployee>("Employee", EmployeeSchema);

export default EmployeeModel;
