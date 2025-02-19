// app/dashboard/business-functions/columns.tsx

import { ColumnDef } from "@tanstack/react-table"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

export type BusinessFunction = {
  id: string;
  name: string;
  isDefault?: boolean;
}

export const columns = (
  onDelete: (id: string) => void
): ColumnDef<BusinessFunction>[] => [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const isDefault = row.original.isDefault;
      return (
        <div className="flex items-center justify-between">
          {row.getValue("name")}
          {isDefault && (
            <Badge variant="secondary">Default</Badge>
          )}
        </div>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const businessFunction = row.original;

      if (businessFunction.isDefault) {
        return null;
      }

      return (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete the business function
                "{businessFunction.name}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(businessFunction.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    }
  }
];