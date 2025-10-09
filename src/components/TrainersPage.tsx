import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Users, TrendingUp, Calendar } from "lucide-react";

const trainers = [
  {
    id: "HLV01",
    name: "Nguyễn Văn Minh",
    specialty: "Tăng cơ, Giảm cân",
    clients: 15,
    experience: "5 năm",
    rating: 4.8,
    schedule: ["T2", "T3", "T5", "T7"],
    sessions: 45,
  },
  {
    id: "HLV02",
    name: "Trần Thị Hương",
    specialty: "Yoga, Cardio",
    clients: 12,
    experience: "4 năm",
    rating: 4.9,
    schedule: ["T2", "T4", "T6", "CN"],
    sessions: 38,
  },
  {
    id: "HLV03",
    name: "Lê Quốc Tuấn",
    specialty: "CrossFit, HIIT",
    clients: 10,
    experience: "6 năm",
    rating: 4.7,
    schedule: ["T3", "T5", "T6", "T7"],
    sessions: 30,
  },
  {
    id: "HLV04",
    name: "Phạm Thị Lan",
    specialty: "Pilates, Dance",
    clients: 8,
    experience: "3 năm",
    rating: 4.6,
    schedule: ["T2", "T4", "T7", "CN"],
    sessions: 24,
  },
];

export function TrainersPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng HLV</p>
                <h3 className="text-3xl mt-2">{trainers.length}</h3>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Học viên</p>
                <h3 className="text-3xl mt-2">
                  {trainers.reduce((sum, t) => sum + t.clients, 0)}
                </h3>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Buổi tập/tháng</p>
                <h3 className="text-3xl mt-2">
                  {trainers.reduce((sum, t) => sum + t.sessions, 0)}
                </h3>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đánh giá TB</p>
                <h3 className="text-3xl mt-2">
                  {(
                    trainers.reduce((sum, t) => sum + t.rating, 0) /
                    trainers.length
                  ).toFixed(1)}
                </h3>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {trainers.map((trainer) => (
          <Card key={trainer.id}>
            <CardHeader>
              <div className="flex items-start gap-4">
                <Avatar className="w-16 h-16">
                  <AvatarFallback className="bg-primary text-white text-xl">
                    {trainer.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{trainer.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {trainer.id}
                      </p>
                    </div>
                    <Badge variant="secondary">
                      ⭐ {trainer.rating}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Chuyên môn</p>
                  <p className="mt-1">{trainer.specialty}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Kinh nghiệm</p>
                  <p className="mt-1">{trainer.experience}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Học viên</p>
                  <p className="mt-1">{trainer.clients} người</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Buổi/tháng</p>
                  <p className="mt-1">{trainer.sessions} buổi</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Lịch dạy</p>
                <div className="flex gap-2 flex-wrap">
                  {trainer.schedule.map((day) => (
                    <Badge key={day} variant="outline">
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
