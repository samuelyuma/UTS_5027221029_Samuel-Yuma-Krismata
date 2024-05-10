"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { api } from "@/lib/api";
import { Employee } from "@/types/Employee";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "../ui/alert-dialog";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useToast } from "../ui/use-toast";

type EmployeeID = {
	id: string;
};

type FieldItem = {
	id: "name" | "role" | "avatar" | "email" | "phone" | "position" | "status";
	label: string;
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

export const CellAction = ({ id }: EmployeeID) => {
	const [updateModal, setUpdateModal] = useState(false);
	const [deleteModal, setDeleteModal] = useState(false);

	const queryClient = useQueryClient();

	const { toast } = useToast();

	const handleDeleteEmployee = useMutation({
		mutationFn: (dataId: string) => {
			return api.delete(`/employee/${dataId}`);
		},
		onSuccess: () => {
			queryClient.invalidateQueries();
			toast({
				description: "Employee successfully deleted!",
			});
		},
		onError: () => {
			toast({
				description: "Failed to deleted employee!",
			});
		},
	});

	const { data: existingEmployee } = useQuery({
		queryKey: ["employee", id],
		queryFn: async () => {
			const response = await api.get(`/employee/${id}`);
			return response.data?.employee;
		},
	});

	const { mutate: handleCreateEmployee } = useMutation<Employee, unknown, FormData>({
		mutationFn: (data) => api.patch(`/employee/${id}`, data),
		onSuccess: () => {
			queryClient.invalidateQueries();
			toast({
				description: "Employee successfully updated!",
			});
		},
		onError: () => {
			toast({
				description: "Failed to update employee!",
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
		<>
			{/* Update Section */}
			<Dialog open={updateModal} onOpenChange={setUpdateModal}>
				<DialogContent className="sm:max-w-[425px]">
					<form onSubmit={handleSubmit(onSubmit)}>
						<DialogHeader>
							<DialogTitle>Edit Existing Employee Data</DialogTitle>
							<DialogDescription>Update the employee data here.</DialogDescription>
						</DialogHeader>
						<div className="grid gap-4 py-4">
							{field.map((item) => (
								<div key={item.id} className="grid grid-cols-4 items-center gap-4">
									<Label htmlFor={item.id} className="text-right">
										{item.label}
									</Label>
									<Input id={item.id} className="col-span-3" defaultValue={existingEmployee ? existingEmployee[item.id] : ""} {...register(item.id, { required: true })} />
								</div>
							))}
						</div>
						<DialogFooter>
							<DialogClose asChild>
								<Button type="submit">Update Data</Button>
							</DialogClose>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>
			{/* Delete Section */}
			<AlertDialog open={deleteModal} onOpenChange={setDeleteModal}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
						<AlertDialogDescription>This action cannot be undone. This will permanently delete the data and remove the data from database.</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction onClick={() => handleDeleteEmployee.mutate(id)}>Delete Data</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
			{/* Dropdown Section */}
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="h-8 w-8 p-0">
						<span className="sr-only">Open menu</span>
						<MoreHorizontal className="h-4 w-4" />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>Actions</DropdownMenuLabel>

					<DropdownMenuItem onClick={() => setUpdateModal(true)}>
						<Edit className="mr-2 h-4 w-4" /> Update
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => setDeleteModal(true)}>
						<Trash className="mr-2 h-4 w-4" /> Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
