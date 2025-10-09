import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { FileText, CheckCircle, Clock, Users } from "lucide-react";
import { Badge } from "./ui/badge";

const statsData = [
  {
    title: "Tổng hợp đồng",
    value: "156",
    icon: FileText,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Đã hoàn thành",
    value: "42",
    icon: CheckCircle,
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    title: "Còn hiệu lực",
    value: "98",
    icon: Clock,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    title: "HLV đang hoạt động",
    value: "12",
    icon: Users,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

const recentContracts = [
  {
    id: "HD001",
    customer: "Nguyễn Văn A",
    trainer: "HLV Minh",
    sessions: 20,
    completed: 5,
    startDate: "2025-01-05",
    status: "active",
  },
  {
    id: "HD002",
    customer: "Trần Thị B",
    trainer: "HLV Hương",
    sessions: 30,
    completed: 28,
    startDate: "2024-12-01",
    status: "ending",
  },
  {
    id: "HD003",
    customer: "Lê Văn C",
    trainer: "HLV Tuấn",
    sessions: 15,
    completed: 8,
    startDate: "2025-01-10",
    status: "active",
  },
  {
    id: "HD004",
    customer: "Phạm Thị D",
    trainer: "HLV Minh",
    sessions: 25,
    completed: 25,
    startDate: "2024-11-15",
    status: "completed",
  },
];

const activeTrainers = [
  { name: "HLV Minh", clients: 15, sessions: 45 },
  { name: "HLV Hương", clients: 12, sessions: 38 },
  { name: "HLV Tuấn", clients: 10, sessions: 30 },
  { name: "HLV Lan", clients: 8, sessions: 24 },
];

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <h3 className="text-3xl mt-2">{stat.value}</h3>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Contracts */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Hợp đồng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentContracts.map((contract) => (
                <div
                  key={contract.id}
                  className="flex items-center justify-between p-4 bg-muted/30 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-sm text-muted-foreground">
                        {contract.id}
                      </span>
                      <h4>{contract.customer}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {contract.trainer} • Bắt đầu: {contract.startDate}
                    </p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-sm">
                      {contract.completed}/{contract.sessions} buổi
                    </p>
                    <div className="w-24 h-2 bg-secondary rounded-full mt-1">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{
                          width: `${(contract.completed / contract.sessions) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                  <Badge
                    variant={
                      contract.status === "completed"
                        ? "default"
                        : contract.status === "ending"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {contract.status === "completed"
                      ? "Hoàn thành"
                      : contract.status === "ending"
                      ? "Sắp hết"
                      : "Đang tập"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Trainers */}
        <Card>
          <CardHeader>
            <CardTitle>HLV đang hoạt động</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeTrainers.map((trainer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                >
                  <div>
                    <h4>{trainer.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {trainer.clients} học viên
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{trainer.sessions}</p>
                    <p className="text-xs text-muted-foreground">buổi/tháng</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
