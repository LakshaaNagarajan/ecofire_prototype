import { ColumnDef } from "@tanstack/react-table"

export type Job = {
  id: string;
  title: string;
  businessFunction?: string;
  owner?: string;
  dueDate?: string; // Only accept ISO date string
}

export const columns: ColumnDef<Job>[] = [
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "owner",
    header: "Owner",
  },
  {
    accessorKey: "businessFunction",
    header: "Business Function",
    cell: ({ row }) => {
      const businessFunction = row.getValue("businessFunction") as string | undefined
      return businessFunction || "Not specified"
    }
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => {
      const dueDate = row.getValue("dueDate") as string | undefined;
      if (!dueDate) return "No due date";
      
      return new Date(dueDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  }
]