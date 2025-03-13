// components/tasks/tag-input.tsx
"use client";
import React, { useState, KeyboardEvent, useEffect, useRef } from "react";
import { X, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";

interface Tag {
  _id: string;
  name: string;
}

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export function TagInput({ value = [], onChange, placeholder = "Add tag..." }: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [filteredTags, setFilteredTags] = useState<Tag[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { user, isLoaded } = useUser();

  // Fetch available tags when the component mounts
  useEffect(() => {
    if (isLoaded && user) {
      fetchTags();
    }
  }, [isLoaded, user]);
  
  // Add click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchTags = async () => {
    try {
      const response = await fetch('/api/task-tags');
      const result = await response.json();
      
      if (result.success) {
        setAvailableTags(result.data);
      } else {
        console.error('Error fetching tags:', result.error);
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  };

  // Update filtered tags when input changes
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = availableTags.filter(tag => 
        tag.name.toLowerCase().includes(inputValue.toLowerCase()) && 
        !value.includes(tag.name)
      );
      setFilteredTags(filtered);
    } else {
      setFilteredTags(availableTags.filter(tag => !value.includes(tag.name)));
    }
  }, [inputValue, availableTags, value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Add tag when pressing Enter or comma
    if ((e.key === "Enter" || e.key === ",") && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    }
  };

  const addTag = (tag: string) => {
    // Don't add if the tag already exists or it's empty
    if (tag.length === 0 || value.includes(tag)) {
      setInputValue("");
      return;
    }

    const newTags = [...value, tag];
    onChange(newTags);
    setInputValue("");
    setIsOpen(false);
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = value.filter(tag => tag !== tagToRemove);
    onChange(newTags);
  };

  // Function to generate a consistent color for a tag (same as in column definition)
  const getTagColor = (tag: string) => {
    const hashCode = tag.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
   
    const h = Math.abs(hashCode % 360);
    const s = 65 + (hashCode % 20);
    const l = 55 + (hashCode % 15);
   
    return `hsl(${h}, ${s}%, ${l}%)`;
  };

  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-1.5 mb-2">
        {value.map((tag, index) => (
          <Badge
            key={`${tag}-${index}`}
            style={{ backgroundColor: getTagColor(tag) }}
            className="text-white border-0 flex items-center gap-1"
          >
            {tag}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent ml-1"
              onClick={() => removeTag(tag)}
            >
              <X className="h-3 w-3 text-white" />
              <span className="sr-only">Remove tag {tag}</span>
            </Button>
          </Badge>
        ))}
      </div>
     
      <div className="flex items-center gap-2" ref={wrapperRef}>
        <div className="flex-1 relative">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-1 pr-10"
            onClick={() => setIsOpen(true)}
            onFocus={() => setIsOpen(true)}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3"
            onClick={() => setIsOpen(!isOpen)}
          >
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
          
          {/* Simple dropdown */}
          {isOpen && (
            <div 
              ref={dropdownRef}
              className="absolute top-full left-0 w-full bg-popover z-50 mt-1 rounded-md border shadow-md"
            >
              <div className="py-2">
                {filteredTags.length === 0 && inputValue.trim() === "" ? (
                  <div className="px-2 py-2 text-sm text-center text-muted-foreground">
                    No tags found
                  </div>
                ) : (
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }} className="p-1">
                    {filteredTags.map((tag) => (
                      <div
                        key={tag._id}
                        onClick={() => addTag(tag.name)}
                        className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      >
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: getTagColor(tag.name) }}
                        />
                        {tag.name}
                      </div>
                    ))}
                    {inputValue.trim() && !availableTags.some(tag => tag.name.toLowerCase() === inputValue.toLowerCase()) && (
                      <div
                        onClick={() => addTag(inputValue.trim())}
                        className="flex items-center gap-2 px-2 py-1.5 text-sm rounded hover:bg-accent hover:text-accent-foreground cursor-pointer italic"
                      >
                        Create "{inputValue}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <Button
          type="button"
          onClick={() => inputValue.trim() && addTag(inputValue.trim())}
          disabled={!inputValue.trim()}
          size="sm"
        >
          Add
        </Button>
      </div>
    </div>
  );
}