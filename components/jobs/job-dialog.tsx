// components/jobs/job-dialog.tsx

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState, useEffect } from "react"
import { Job } from "./table/columns"

interface BusinessFunction {
  id: string;
  name: string;
}

interface JobDialogProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (job: Partial<Job>) => void;
  initialData?: Job;
}

export function JobDialog({ 
  mode, 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData 
}: JobDialogProps) {
  const [formData, setFormData] = useState<Partial<Job>>(() => {
    if (initialData) {
      return {
        ...initialData,
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : ''
      };
    }
    return {
      title: '',
      owner: '',
      businessFunction: '',
      dueDate: ''
    };
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = { ...formData };
    
    if (submissionData.dueDate) {
      // Add time to the date to ensure consistent timezone handling
      submissionData.dueDate = `${submissionData.dueDate}T00:00:00.000Z`;
    }
    
    onSubmit(submissionData);
    onOpenChange(false);
  };

  const [businessFunctions, setBusinessFunctions] = useState<BusinessFunction[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Create New Job' : 'Edit Job'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="owner" className="text-right">
                Owner
              </Label>
              <Input
                id="owner"
                value={formData.owner}
                onChange={(e) => setFormData({...formData, owner: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="businessFunction" className="text-right">
                Business Function
              </Label>
              <div className="col-span-3">
                <Select
                  disabled={loading}
                  value={formData.businessFunction}
                  onValueChange={(value) => 
                    setFormData({...formData, businessFunction: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a business function" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessFunctions.map((bf) => (
                      <SelectItem key={bf.id} value={bf.name}>
                        {bf.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate || ''}
                onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {mode === 'create' ? 'Create' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}