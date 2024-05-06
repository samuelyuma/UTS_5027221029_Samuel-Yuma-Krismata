import dotenv from "dotenv";

dotenv.config();

export const port = 3000;

export function appListener() {
	const runingPort = `gRPC client running on port ${port}`;

	console.log(`\n${runingPort}\n`);
}
