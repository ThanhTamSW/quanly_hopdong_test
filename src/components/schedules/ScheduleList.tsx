import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, MapPin, User, Search, Filter } from "lucide-react";
import { scheduleApi } from "@/services/scheduleApi";
import { Schedule } from "@/types";

interface ScheduleListProps {
  trainerId?: string;
  showFilters?: boolean;
}

export function ScheduleList({ trainerId, showFilters = true }: ScheduleListProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    dateFrom: "",
    dateTo: ""
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchSchedules();
  }, [filters, pagination.page]);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };
      
      const response = await scheduleApi.getSchedules(params);
      setSchedules(response.data.schedules);
      setPagination(response.data.pagination);
    } catch (error: any) {
      setError(error.response?.data?.message || 'Không thể tải danh sách lịch dạy');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      dateFrom: "",
      dateTo: ""
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'scheduled': return 'Đã lên lịch';
      case 'in_progress': return 'Đang thực hiện';
      case 'completed': return 'Hoàn thành';
      case 'cancelled': return 'Đã hủy';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading && schedules.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải danh sách lịch dạy...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Bộ lọc
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tìm kiếm</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Tên khách hàng, địa điểm..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Trạng thái</label>
                <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Tất cả trạng thái</SelectItem>
                    <SelectItem value="scheduled">Đã lên lịch</SelectItem>
                    <SelectItem value="in_progress">Đang thực hiện</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Từ ngày</label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Đến ngày</label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Schedule List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách lịch dạy</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-8 text-red-600">
              <p>{error}</p>
              <Button onClick={fetchSchedules} className="mt-4">
                Thử lại
              </Button>
            </div>
          ) : schedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Không có lịch dạy nào</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div key={schedule._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{schedule.clientName}</h3>
                        <Badge className={getStatusColor(schedule.status)}>
                          {getStatusText(schedule.status)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(schedule.date)}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{schedule.startTime} - {schedule.endTime}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{schedule.location}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{schedule.duration} phút</span>
                        </div>
                      </div>
                      
                      {schedule.notes && (
                        <p className="mt-2 text-sm text-gray-600 italic">
                          "{schedule.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
              >
                Trước
              </Button>
              
              <span className="text-sm text-gray-600">
                Trang {pagination.page} / {pagination.pages}
              </span>
              
              <Button
                variant="outline"
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
              >
                Sau
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
