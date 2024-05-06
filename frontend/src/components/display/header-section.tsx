import { useMutation } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";

import { api } from "@/lib/api";

import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Heading } from "../ui/heading";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";

type FieldItem = {
	id: "name" | "role" | "avatar" | "email" | "phone" | "position" | "status";
	label: string;
};

type Employee = {
	avatar: string;
	name: string;
	email: string;
	phone: string;
	role: string;
	position: string;
	status: string;
};

const field: FieldItem[] = [
	{
		id: "avatar",
		label: "Avatar",
	},
	{
		id: "name",
		label: "Name",
	},
	{
		id: "email",
		label: "Email",
	},
	{
		id: "phone",
		label: "Phone",
	},
	{
		id: "role",
		label: "Role",
	},
	{
		id: "position",
		label: "Position",
	},
	{
		id: "status",
		label: "Status",
	},
];

export default function HeaderSection() {
	const { toast } = useToast();

	const { mutate: handleCreateEmployee } = useMutation<Employee, unknown, FormData>({
		mutationFn: (data) => api.post("/employee", data),
		onSuccess: () => {
			toast({
				description: "Employee successfully created!",
			});
		},
		onError: () => {
			toast({
				description: "Failed to create employee!",
			});
		},
	});

	const { register, handleSubmit } = useForm<Employee>();

	const onSubmit: SubmitHandler<Employee> = (data: Employee) => {
		const formData = new FormData();
		for (const key in data) {
			formData.append(key, data[key as keyof Employee]);
		}
		handleCreateEmployee(formData);
	};

	return (
		<section className="flex justify-between items-center">
			<Heading title="Dashboard Admin" description="Here's a list of employees data in the company" />
			<Dialog>
				<DialogTrigger asChild>
					<Button>
						<Plus className="mr-2 h-4 w-4" /> Add New Employee
					</Button>
				</DialogTrigger>
				<DialogContent className="sm:max-w-[425px]">
					<form onSubmit={handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>Add New Employee</DialogTitle>
							<DialogDescription>Input the employee data here.</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							{field.map((item) => (
								<div key={item.id} className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor={item.id} className="text-right">
										{item.label}
									</Label>
									<Input id={item.id} className="col-span-3" {...register(item.id, { required: true })} />
								</div>
							))}
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="submit">Add Employee</Button>
							</DialogClose>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
		</section>
	);
}
