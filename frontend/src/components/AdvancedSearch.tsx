import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Calendar, User, FileText } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { SearchFilters } from "@/types";

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  searchType: 'schedules' | 'contracts' | 'trainers' | 'global';
}

interface FilterOptions {
  search: string;
  dateRange: { from: Date; to: Date } | undefined;
  status: string[];
  trainerSpecialties: string[];
  location: string;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

const statusOptions = [
  { value: 'scheduled', label: 'Đã lên lịch' },
  { value: 'in_progress', label: 'Đang thực hiện' },
  { value: 'completed', label: 'Hoàn thành' },
  { value: 'cancelled', label: 'Đã hủy' }
];

const specialtyOptions = [
  { value: 'yoga', label: 'Yoga' },
  { value: 'gym', label: 'Gym' },
  { value: 'cardio', label: 'Cardio' },
  { value: 'strength', label: 'Tập tạ' },
  { value: 'pilates', label: 'Pilates' },
  { value: 'swimming', label: 'Bơi lội' }
];

const sortOptions = [
  { value: 'date', label: 'Ngày' },
  { value: 'trainer', label: 'Huấn luyện viên' },
  { value: 'client', label: 'Khách hàng' },
  { value: 'duration', label: 'Thời lượng' },
  { value: 'status', label: 'Trạng thái' }
];

export function AdvancedSearch({ onSearch, searchType }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    dateRange: undefined,
    status: [],
    trainerSpecialties: [],
    location: '',
    sortBy: 'date',
    sortOrder: 'asc'
  });

  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleStatusToggle = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status]
    }));
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFilters(prev => ({
      ...prev,
      trainerSpecialties: prev.trainerSpecialties.includes(specialty)
        ? prev.trainerSpecialties.filter(s => s !== specialty)
        : [...prev.trainerSpecialties, specialty]
    }));
  };

  const handleSearch = () => {
    const searchFilters = {
      search: filters.search,
      dateRange: filters.dateRange,
      status: filters.status,
      trainerSpecialties: filters.trainerSpecialties,
      location: filters.location,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    };

    // Update active filters for display
    const active = [];
    if (filters.search) active.push(`Tìm kiếm: ${filters.search}`);
    if (filters.dateRange) active.push('Khoảng thời gian');
    if (filters.status.length > 0) active.push(`Trạng thái: ${filters.status.length}`);
    if (filters.trainerSpecialties.length > 0) active.push(`Chuyên môn: ${filters.trainerSpecialties.length}`);
    if (filters.location) active.push(`Địa điểm: ${filters.location}`);
    
    setActiveFilters(active);
    onSearch(searchFilters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      dateRange: undefined,
      status: [],
      trainerSpecialties: [],
      location: '',
      sortBy: 'date',
      sortOrder: 'asc'
    });
    setActiveFilters([]);
    onSearch({});
  };

  const removeFilter = (index: number) => {
    const newActive = activeFilters.filter((_, i) => i !== index);
    setActiveFilters(newActive);
    
    // Reset corresponding filter
    if (index === 0) setFilters(prev => ({ ...prev, search: '' }));
    if (index === 1) setFilters(prev => ({ ...prev, dateRange: undefined }));
    if (index === 2) setFilters(prev => ({ ...prev, status: [] }));
    if (index === 3) setFilters(prev => ({ ...prev, trainerSpecialties: [] }));
    if (index === 4) setFilters(prev => ({ ...prev, location: '' }));
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Bộ lọc
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tìm kiếm nâng cao</DialogTitle>
              <DialogDescription>
                Sử dụng các bộ lọc để tìm kiếm chính xác hơn
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Date Range */}
              <div className="space-y-2">
                <Label>Khoảng thời gian</Label>
                <DatePickerWithRange
                  date={filters.dateRange}
                  onDateChange={(date) => handleFilterChange('dateRange', date)}
                />
              </div>

              {/* Status Filter */}
              {searchType === 'schedules' && (
                <div className="space-y-2">
                  <Label>Trạng thái</Label>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={filters.status.includes(option.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStatusToggle(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Trainer Specialties */}
              {searchType === 'trainers' && (
                <div className="space-y-2">
                  <Label>Chuyên môn</Label>
                  <div className="flex flex-wrap gap-2">
                    {specialtyOptions.map((option) => (
                      <Button
                        key={option.value}
                        variant={filters.trainerSpecialties.includes(option.value) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleSpecialtyToggle(option.value)}
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Location */}
              <div className="space-y-2">
                <Label>Địa điểm</Label>
                <Input
                  placeholder="Nhập địa điểm..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                />
              </div>

              {/* Sort Options */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Sắp xếp theo</Label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value) => handleFilterChange('sortBy', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Thứ tự</Label>
                  <Select
                    value={filters.sortOrder}
                    onValueChange={(value) => handleFilterChange('sortOrder', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Tăng dần</SelectItem>
                      <SelectItem value="desc">Giảm dần</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={handleClearFilters}>
                Xóa bộ lọc
              </Button>
              <Button onClick={handleSearch}>
                Tìm kiếm
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Filters */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.map((filter, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {filter}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => removeFilter(index)}
              />
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
}

