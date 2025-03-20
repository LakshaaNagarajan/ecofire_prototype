"use client";

import React, { useState, useEffect } from 'react';
import { FocusLevel, JoyLevel } from '@/lib/models/task.model';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, ChevronDown, Clock, Target, Smile, Users, Briefcase } from "lucide-react";
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface FilterComponentProps {
  onFilterChange: (filters: Record<string, any>) => void;
  businessFunctions?: { id: string; name: string }[];
  owners?: { _id: string; name: string }[];
  initialFilters?: Record<string, any>;
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  onFilterChange,
  businessFunctions = [],
  owners = [],
  initialFilters = {}
}) => {
  const [filters, setFilters] = useState<Record<string, any>>(initialFilters);
  const [hoursRange, setHoursRange] = useState<[number, number]>([0, 10]);
  const [date, setDate] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (Object.keys(initialFilters).length > 0) {
      setFilters(initialFilters);
      
      // Set hours if they exist in initialFilters
      if (initialFilters.minHours !== undefined && initialFilters.maxHours !== undefined) {
        setHoursRange([initialFilters.minHours, initialFilters.maxHours]);
      }
      
      // Set date if it exists in initialFilters
      if (initialFilters.dueDate) {
        setDate(new Date(initialFilters.dueDate));
      }
    }
  }, [initialFilters]);

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters };
    
    if (value === null || value === undefined || value === "any") {
      delete newFilters[key];
    } else {
      newFilters[key] = value;
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleHoursChange = (value: [number, number]) => {
    setHoursRange(value);
    const newFilters = { ...filters };
    newFilters.minHours = value[0];
    newFilters.maxHours = value[1];
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleDateChange = (date: Date | undefined) => {
    setDate(date);
    const newFilters = { ...filters };
    
    if (date) {
      newFilters.dueDate = date.toISOString();
    } else {
      delete newFilters.dueDate;
    }
    
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {/* Hours Required Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-10 gap-1 bg-gray-100">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Hours Req.</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-sm">Hours Required</h4>
              <span className="text-sm text-muted-foreground">
                {hoursRange[0]} - {hoursRange[1]}h
              </span>
            </div>
            <Slider
              min={0}
              max={20}
              step={1}
              value={hoursRange}
              onValueChange={(value) => setHoursRange(value as [number, number])}
              onValueCommit={handleHoursChange}
              className="mt-6"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0h</span>
              <span>20h</span>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Focus Level Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-10 gap-1 bg-gray-100">
            <Target className="h-4 w-4 text-gray-500" />
            <span>Focus Level</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="flex flex-col">
            <Button 
              variant={filters.focusLevel === "High" ? "default" : "ghost"} 
              size="sm" 
              className="justify-start mb-1"
              onClick={() => handleFilterChange('focusLevel', filters.focusLevel === "High" ? null : "High")}
            >
              High
            </Button>
            <Button 
              variant={filters.focusLevel === "Medium" ? "default" : "ghost"} 
              size="sm" 
              className="justify-start mb-1"
              onClick={() => handleFilterChange('focusLevel', filters.focusLevel === "Medium" ? null : "Medium")}
            >
              Medium
            </Button>
            <Button 
              variant={filters.focusLevel === "Low" ? "default" : "ghost"} 
              size="sm" 
              className="justify-start"
              onClick={() => handleFilterChange('focusLevel', filters.focusLevel === "Low" ? null : "Low")}
            >
              Low
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Joy Level Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-10 gap-1 bg-gray-100">
            <Smile className="h-4 w-4 text-gray-500" />
            <span>Joy Level</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="flex flex-col">
            <Button 
              variant={filters.joyLevel === "High" ? "default" : "ghost"} 
              size="sm" 
              className="justify-start mb-1"
              onClick={() => handleFilterChange('joyLevel', filters.joyLevel === "High" ? null : "High")}
            >
              High
            </Button>
            <Button 
              variant={filters.joyLevel === "Medium" ? "default" : "ghost"} 
              size="sm" 
              className="justify-start mb-1"
              onClick={() => handleFilterChange('joyLevel', filters.joyLevel === "Medium" ? null : "Medium")}
            >
              Medium
            </Button>
            <Button 
              variant={filters.joyLevel === "Low" ? "default" : "ghost"} 
              size="sm" 
              className="justify-start"
              onClick={() => handleFilterChange('joyLevel', filters.joyLevel === "Low" ? null : "Low")}
            >
              Low
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      {/* Business Function Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-10 gap-1 bg-gray-100">
            <Briefcase className="h-4 w-4 text-gray-500" />
            <span>Business Func.</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="flex flex-col max-h-72 overflow-y-auto">
            {businessFunctions.map((bf) => (
              <Button 
                key={bf.id}
                variant={filters.businessFunctionId === bf.id ? "default" : "ghost"} 
                size="sm" 
                className="justify-start mb-1"
                onClick={() => handleFilterChange('businessFunctionId', filters.businessFunctionId === bf.id ? null : bf.id)}
              >
                {bf.name}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Owner Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-10 gap-1 bg-gray-100">
            <Users className="h-4 w-4 text-gray-500" />
            <span>Owner</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-2">
          <div className="flex flex-col max-h-72 overflow-y-auto">
            {owners.map((owner) => (
              <Button 
                key={owner._id}
                variant={filters.owner === owner._id ? "default" : "ghost"} 
                size="sm" 
                className="justify-start mb-1"
                onClick={() => handleFilterChange('owner', filters.owner === owner._id ? null : owner._id)}
              >
                {owner.name}
              </Button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Due Date Filter */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-10 gap-1 bg-gray-100">
            <CalendarIcon className="h-4 w-4 text-gray-500" />
            <span>Due Date</span>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateChange}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      {/* Clear All Filters Button - Only show if filters are applied */}
      {Object.keys(filters).length > 0 && (
        <Button
          variant="outline"
          size="sm"
          className="h-10"
          onClick={() => {
            setFilters({});
            setHoursRange([0, 10]);
            setDate(undefined);
            onFilterChange({});
          }}
        >
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default FilterComponent;