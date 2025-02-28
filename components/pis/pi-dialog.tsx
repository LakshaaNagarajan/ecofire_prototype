// components/pis/pi-dialog.tsx

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
import { PI } from "./table/columns"

interface Institution {
  id: string;
  name: string;
}

interface PIDialogProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (pi: Partial<PI>) => void;
  initialData?: PI;
}

export function PIDialog({ 
  mode, 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData 
}: PIDialogProps) {
  const [formData, setFormData] = useState<Partial<PI>>(() => {
    if (initialData) {
      return {
        ...initialData,
        dateJoined: initialData.dateJoined ? new Date(initialData.dateJoined).toISOString().split('T')[0] : ''
      };
    }
    return {
      firstName: '',
      lastName: '',
      email: '',
      institution: '',
      department: '',
      researchArea: [],
      dateJoined: ''
    };
  });

  useEffect(() => {
    async function fetchInstitutions() {
      try {
        const response = await fetch('/api/institutions');
        if (!response.ok) {
          throw new Error('Failed to fetch institutions');
        }
        const result = await response.json();
        
        if (result.success) {
          setInstitutions(result.data.map((inst: any) => ({
            id: inst._id,
            name: inst.name
          })));
        } else {
          throw new Error(result.error || 'Failed to fetch institutions');
        }
      } catch (error) {
        console.error('Error fetching institutions:', error);
        setInstitutions([]);
      }
      setLoading(false);
    }

    fetchInstitutions();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submissionData = { ...formData };
    
    if (submissionData.dateJoined) {
      submissionData.dateJoined = `${submissionData.dateJoined}T00:00:00.000Z`;
    }
    
    onSubmit(submissionData);
    onOpenChange(false);
  };

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {mode === 'create' ? 'Create New PI' : 'Edit PI'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="firstName" className="text-right">
                First Name
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastName" className="text-right">
                Last Name
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="institution" className="text-right">
                Institution
              </Label>
              <div className="col-span-3">
                <Select
                  disabled={loading}
                  value={formData.institution}
                  onValueChange={(value) => 
                    setFormData({...formData, institution: value})
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an institution" />
                  </SelectTrigger>
                  <SelectContent>
                    {institutions.map((inst) => (
                      <SelectItem key={inst.id} value={inst.name}>
                        {inst.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="department" className="text-right">
                Department
              </Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="researchArea" className="text-right">
                Research Area
              </Label>
              <Input
                id="researchArea"
                value={formData.researchArea?.join(', ')}
                onChange={(e) => setFormData({...formData, researchArea: e.target.value.split(', ')})}
                className="col-span-3"
                placeholder="Separate areas with commas"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dateJoined" className="text-right">
                Date Joined
              </Label>
              <Input
                id="dateJoined"
                type="date"
                value={formData.dateJoined || ''}
                onChange={(e) => setFormData({...formData, dateJoined: e.target.value})}
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
