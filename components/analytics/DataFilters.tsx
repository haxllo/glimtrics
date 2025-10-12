"use client";

import { useState, memo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface DataFiltersProps {
  columns: string[];
  numericColumns: string[];
  textColumns?: string[];
  onFilterChange: (filters: FilterState) => void;
  statistics?: {
    [column: string]: {
      min: number;
      max: number;
      avg: number;
    };
  };
}

export interface FilterState {
  selectedColumn?: string;
  minValue?: number;
  maxValue?: number;
  categories?: string[];
}

function DataFiltersComponent({ 
  columns, 
  numericColumns, 
  onFilterChange, 
  statistics 
}: DataFiltersProps) {
  const [selectedColumn, setSelectedColumn] = useState<string>();
  const [valueRange, setValueRange] = useState<[number, number]>([0, 100]);
  const [filters, setFilters] = useState<FilterState>({});

  const handleColumnSelect = (column: string) => {
    setSelectedColumn(column);
    
    if (numericColumns.includes(column) && statistics?.[column]) {
      const stats = statistics[column];
      setValueRange([stats.min, stats.max]);
    }
  };

  const handleApplyFilter = () => {
    if (!selectedColumn) return;

    const newFilters: FilterState = {
      selectedColumn,
    };

    if (numericColumns.includes(selectedColumn)) {
      newFilters.minValue = valueRange[0];
      newFilters.maxValue = valueRange[1];
    }

    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSelectedColumn(undefined);
    onFilterChange({});
  };

  const isNumericColumn = selectedColumn && numericColumns.includes(selectedColumn);
  const hasActiveFilters = Object.keys(filters).length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Filter your data by column values</CardDescription>
          </div>
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Column</label>
          <Select value={selectedColumn} onValueChange={handleColumnSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a column" />
            </SelectTrigger>
            <SelectContent>
              {columns.map((col) => (
                <SelectItem key={col} value={col}>
                  {col}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedColumn && isNumericColumn && statistics?.[selectedColumn] && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Value Range</label>
            <div className="px-2">
              <Slider
                value={valueRange}
                onValueChange={(val) => setValueRange(val as [number, number])}
                min={statistics[selectedColumn].min}
                max={statistics[selectedColumn].max}
                step={(statistics[selectedColumn].max - statistics[selectedColumn].min) / 100}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{valueRange[0].toFixed(2)}</span>
              <span>{valueRange[1].toFixed(2)}</span>
            </div>
          </div>
        )}

        {selectedColumn && (
          <Button onClick={handleApplyFilter} className="w-full">
            Apply Filter
          </Button>
        )}

        {hasActiveFilters && filters.selectedColumn && (
          <div className="pt-2 border-t">
            <p className="text-sm font-medium mb-2">Active Filters:</p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {filters.selectedColumn}
                {filters.minValue !== undefined && filters.maxValue !== undefined && (
                  <>: {filters.minValue.toFixed(2)} - {filters.maxValue.toFixed(2)}</>
                )}
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Memoize to prevent unnecessary re-renders
export const DataFilters = memo(DataFiltersComponent);
