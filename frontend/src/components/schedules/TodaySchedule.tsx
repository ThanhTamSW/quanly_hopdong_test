import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, User, CheckCircle, XCircle, Play } from "lucide-react";
import { scheduleApi } from "@/services/scheduleApi";
import { CheckInOut } from "./CheckInOut";
import { Schedule } from "@/types";

interface TodayScheduleProps {
  trainerId?: string;
}

export function TodaySchedule({ trainerId }: TodayScheduleProps) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({
    totalSessions: 0,
    completedSessions: 0,
    totalHours: 0,
    totalEarnings: 0
  });

  useEffect(() => {
    fetchTodaySchedules();
  }, [trainerId]);

  const fetchTodaySchedules = async () => {
    try {
      setLoading(true);
      const response = await scheduleApi.getMyToday();
      setSchedules(response.data.schedules);
      
      // Calculate stats
      const totalSessions = response.data.schedules.length;
      const completedSessions = response.data.schedules.filter((s: Schedule) => s.status === 'completed').length;
      const totalHours = response.data.schedules.reduce((total: number, s: Schedule) => total + (s.duration / 60), 0);
      const totalEarnings = response.data.schedules
        .filter((s: Schedule) => s.status === 'completed')
        .reduce((total: number, s: Schedule) => total + (s.duration / 60) * 200000, 0); // 200k/hour

      setStats({
        totalSessions,
        completedSessions,
        totalHours: Math.round(totalHours * 10) / 10,
        totalEarnings
      });
    } catch (error: any) {
      setError(error.response?.data?.message || 'Không thể tải lịch dạy');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <div className="space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Đang tải lịch dạy...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>{error}</p>
            <Button onClick={fetchTodaySchedules} className="mt-4">
              Thử lại
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng ca dạy</p>
                <p className="text-2xl font-bold">{stats.totalSessions}</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">{stats.completedSessions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng giờ dạy</p>
                <p className="text-2xl font-bold">{stats.totalHours}h</p>
              </div>
              <Play className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Thu nhập</p>
                <p className="text-2xl font-bold text-green-600">
                  {stats.totalEarnings.toLocaleString('vi-VN')}đ
                </p>
              </div>
              <User className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Lịch dạy hôm nay
          </CardTitle>
        </CardHeader>
        <CardContent>
          {schedules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Không có lịch dạy nào hôm nay</p>
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
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
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
                    
                    <div className="ml-4">
                      <CheckInOut 
                        schedule={schedule} 
                        onStatusChange={fetchTodaySchedules}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
