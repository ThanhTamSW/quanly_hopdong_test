import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdvancedSearch } from "@/components/AdvancedSearch";
import { SearchFilters } from "@/types";

const sessions = [
  {
    date: "2025-10-09",
    time: "06:00",
    customer: "Nguyễn Văn A",
    trainer: "HLV Minh",
    type: "Tăng cơ",
  },
  {
    date: "2025-10-09",
    time: "08:00",
    customer: "Trần Thị B",
    trainer: "HLV Hương",
    type: "Yoga",
  },
  {
    date: "2025-10-09",
    time: "10:00",
    customer: "Lê Văn C",
    trainer: "HLV Tuấn",
    type: "CrossFit",
  },
  {
    date: "2025-10-10",
    time: "07:00",
    customer: "Phạm Thị D",
    trainer: "HLV Minh",
    type: "Giảm cân",
  },
  {
    date: "2025-10-10",
    time: "09:00",
    customer: "Hoàng Văn E",
    trainer: "HLV Lan",
    type: "Pilates",
  },
  {
    date: "2025-10-11",
    time: "06:00",
    customer: "Ngô Thị F",
    trainer: "HLV Hương",
    type: "Cardio",
  },
  {
    date: "2025-10-11",
    time: "14:00",
    customer: "Đặng Văn G",
    trainer: "HLV Tuấn",
    type: "HIIT",
  },
  {
    date: "2025-10-12",
    time: "08:00",
    customer: "Vũ Thị H",
    trainer: "HLV Lan",
    type: "Dance",
  },
];

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 9)); // Oct 9, 2025
  const [searchFilters, setSearchFilters] = useState<any>({});

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const { daysInMonth, startingDayOfWeek, year, month } =
    getDaysInMonth(currentDate);

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getSessionsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    return sessions.filter((s) => s.date === dateStr);
  };

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const dayNames = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  // Get today's sessions
  const todaySessions = sessions.filter((s) => s.date === "2025-10-09");

  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    // Apply filters to sessions
    console.log('Search filters applied:', filters);
  };

  return (
    <div className="space-y-6">
      {/* Advanced Search */}
      <AdvancedSearch onSearch={handleSearch} searchType="schedules" />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>
                {monthNames[month]} {year}
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="icon" onClick={previousMonth}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextMonth}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center text-sm text-muted-foreground p-2"
                >
                  {day}
                </div>
              ))}

              {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                <div key={`empty-${index}`} className="p-2" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const daySessions = getSessionsForDate(day);
                const isToday = day === 9; // Oct 9, 2025

                return (
                  <div
                    key={day}
                    className={`min-h-24 p-2 border rounded-lg ${
                      isToday
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    } transition-colors`}
                  >
                    <div
                      className={`text-sm mb-1 ${
                        isToday ? "text-primary" : ""
                      }`}
                    >
                      {day}
                    </div>
                    <div className="space-y-1">
                      {daySessions.map((session, idx) => (
                        <div
                          key={idx}
                          className="text-xs bg-primary/10 text-primary px-1 py-0.5 rounded truncate"
                          title={`${session.time} - ${session.customer}`}
                        >
                          {session.time}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch hôm nay</CardTitle>
            <p className="text-sm text-muted-foreground">Thứ Năm, 9/10/2025</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todaySessions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Không có buổi tập nào
                </p>
              ) : (
                todaySessions.map((session, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-muted/30 rounded-lg space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm">{session.time}</span>
                      <Badge variant="secondary">{session.type}</Badge>
                    </div>
                    <div>
                      <p className="text-sm">{session.customer}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.trainer}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Buổi tập sắp tới</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sessions.slice(0, 5).map((session, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">
                      {new Date(session.date).getDate()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {monthNames[new Date(session.date).getMonth()]}
                    </div>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div>
                    <p className="mb-1">{session.customer}</p>
                    <p className="text-sm text-muted-foreground">
                      {session.trainer} • {session.time}
                    </p>
                  </div>
                </div>
                <Badge>{session.type}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
