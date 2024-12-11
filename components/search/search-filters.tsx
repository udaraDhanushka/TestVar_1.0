'use client';

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface SearchFiltersProps {
  filters: {
    type: string;
    tags: string[];
    sortBy: string;
    sortOrder: string;
  };
  onChange: (filters: any) => void;
}

export function SearchFilters({ filters, onChange }: SearchFiltersProps) {
  const handleTagRemove = (tagToRemove: string) => {
    onChange({
      ...filters,
      tags: filters.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <Card className="p-4 space-y-6">
      <div>
        <h3 className="font-medium mb-3">Content Type</h3>
        <RadioGroup
          value={filters.type}
          onValueChange={(value) => onChange({ ...filters, type: value })}
        >
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all">All</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="collections" id="collections" />
              <Label htmlFor="collections">Collections</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flashcardSets" id="flashcardSets" />
              <Label htmlFor="flashcardSets">Flashcard Sets</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="flashcards" id="flashcards" />
              <Label htmlFor="flashcards">Flashcards</Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div>
        <h3 className="font-medium mb-3">Sort By</h3>
        <Select
          value={filters.sortBy}
          onValueChange={(value) => onChange({ ...filters, sortBy: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date Created</SelectItem>
            <SelectItem value="name">Name</SelectItem>
            <SelectItem value="updatedAt">Last Updated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <h3 className="font-medium mb-3">Sort Order</h3>
        <Select
          value={filters.sortOrder}
          onValueChange={(value) => onChange({ ...filters, sortOrder: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort order..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="desc">Descending</SelectItem>
            <SelectItem value="asc">Ascending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filters.tags.length > 0 && (
        <div>
          <h3 className="font-medium mb-3">Active Tags</h3>
          <div className="flex flex-wrap gap-2">
            {filters.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
                <button
                  onClick={() => handleTagRemove(tag)}
                  className="ml-1 hover:text-red-500"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}