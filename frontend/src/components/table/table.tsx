import { Avatar } from "@radix-ui/react-avatar";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { EmployeeWithId } from "@/types/Employee";

import { AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { CellAction } from "./cell-action";

const headers = [
	{
		id: 1,
		title: "Profile",
	},
	{
		id: 2,
		title: "Email",
	},
	{
		id: 3,
		title: "Phone",
	},
	{
		id: 4,
		title: "Role",
	},
	{
		id: 5,
		title: "Position",
	},
	{
		id: 6,
		title: "Status",
	},
];

export default function TableSection() {
	const { data: data } = useQuery({
		queryKey: ["employee"],
		queryFn: async () => {
			const response = await api.get("/employee/");
			return response?.data;
		},
	});

	const employeeData = data?.employees;

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						{headers.map((header) => (
							<TableHead key={header.id} className={cn(header.id === 1 ? "px-10 w-[300px]" : "")}>
								{header.title}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{employeeData?.map((employee: EmployeeWithId) => (
						<TableRow key={employee._id}>
							<TableCell className="flex items-center px-10 py-4">
								<Avatar>
									<AvatarImage className="h-10 w-10 rounded-full" src={employee.avatar} alt={employee.name} />
									<AvatarFallback>{employee.name}</AvatarFallback>
								</Avatar>
								<p className="text-sm font-medium leading-none ml-4">{employee.name}</p>
							</TableCell>
							<TableCell>{employee.email}</TableCell>
							<TableCell>{employee.phone}</TableCell>
							<TableCell>{employee.role}</TableCell>
							<TableCell>{employee.position}</TableCell>
							<TableCell>
								<TooltipProvider>
									<Tooltip>
										<TooltipTrigger>
											<Badge>{employee.status}</Badge>
										</TooltipTrigger>
										<TooltipContent>
											{employee.status === "Permanent" ? "Permanent employee" : employee.status === "Contract" ? "Contract employee" : "Internship employee"}
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
							</TableCell>
							<TableCell>
								<CellAction id={employee._id} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
