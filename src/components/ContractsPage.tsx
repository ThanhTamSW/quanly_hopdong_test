import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Badge } from "./ui/badge";

interface Contract {
  id: string;
  customerId: string;
  customerName: string;
  trainerId: string;
  trainerName: string;
  totalSessions: number;
  completedSessions: number;
  startDate: string;
  endDate: string;
}

const mockContracts: Contract[] = [
  {
    id: "HD001",
    customerId: "KH001",
    customerName: "Nguyễn Văn A",
    trainerId: "HLV01",
    trainerName: "HLV Minh",
    totalSessions: 20,
    completedSessions: 5,
    startDate: "2025-01-05",
    endDate: "2025-04-05",
  },
  {
    id: "HD002",
    customerId: "KH002",
    customerName: "Trần Thị B",
    trainerId: "HLV02",
    trainerName: "HLV Hương",
    totalSessions: 30,
    completedSessions: 28,
    startDate: "2024-12-01",
    endDate: "2025-03-01",
  },
  {
    id: "HD003",
    customerId: "KH003",
    customerName: "Lê Văn C",
    trainerId: "HLV03",
    trainerName: "HLV Tuấn",
    totalSessions: 15,
    completedSessions: 8,
    startDate: "2025-01-10",
    endDate: "2025-03-10",
  },
  {
    id: "HD004",
    customerId: "KH004",
    customerName: "Phạm Thị D",
    trainerId: "HLV01",
    trainerName: "HLV Minh",
    totalSessions: 25,
    completedSessions: 25,
    startDate: "2024-11-15",
    endDate: "2025-02-15",
  },
  {
    id: "HD005",
    customerId: "KH005",
    customerName: "Hoàng Văn E",
    trainerId: "HLV04",
    trainerName: "HLV Lan",
    totalSessions: 20,
    completedSessions: 12,
    startDate: "2025-01-01",
    endDate: "2025-04-01",
  },
];

export function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>(mockContracts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredContracts = contracts.filter(
    (contract) =>
      contract.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.trainerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAdd = () => {
    setEditingContract(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (contract: Contract) => {
    setEditingContract(contract);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa hợp đồng này?")) {
      setContracts(contracts.filter((c) => c.id !== id));
    }
  };

  const getRemainingStatus = (contract: Contract) => {
    const remaining = contract.totalSessions - contract.completedSessions;
    const percentage = (remaining / contract.totalSessions) * 100;
    
    if (percentage === 0) return { text: "Hoàn thành", variant: "default" as const };
    if (percentage <= 20) return { text: "Sắp hết", variant: "destructive" as const };
    return { text: "Đang tập", variant: "secondary" as const };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách hợp đồng</CardTitle>
            <Button onClick={handleAdd}>
              <Plus className="w-4 h-4 mr-2" />
              Thêm hợp đồng
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã HĐ, tên khách hàng hoặc HLV..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mã HĐ</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead>HLV</TableHead>
                  <TableHead>Tổng buổi</TableHead>
                  <TableHead>Đã tập</TableHead>
                  <TableHead>Còn lại</TableHead>
                  <TableHead>Ngày BĐ</TableHead>
                  <TableHead>Ngày KT</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredContracts.map((contract) => {
                  const status = getRemainingStatus(contract);
                  return (
                    <TableRow key={contract.id}>
                      <TableCell>{contract.id}</TableCell>
                      <TableCell>{contract.customerName}</TableCell>
                      <TableCell>{contract.trainerName}</TableCell>
                      <TableCell>{contract.totalSessions}</TableCell>
                      <TableCell>{contract.completedSessions}</TableCell>
                      <TableCell>
                        {contract.totalSessions - contract.completedSessions}
                      </TableCell>
                      <TableCell>{contract.startDate}</TableCell>
                      <TableCell>{contract.endDate}</TableCell>
                      <TableCell>
                        <Badge variant={status.variant}>{status.text}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(contract)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(contract.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ContractDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        contract={editingContract}
        onSave={(contract) => {
          if (editingContract) {
            setContracts(
              contracts.map((c) => (c.id === contract.id ? contract : c))
            );
          } else {
            setContracts([...contracts, contract]);
          }
          setIsDialogOpen(false);
        }}
      />
    </div>
  );
}

function ContractDialog({
  open,
  onOpenChange,
  contract,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  contract: Contract | null;
  onSave: (contract: Contract) => void;
}) {
  const [formData, setFormData] = useState<Contract>(
    contract || {
      id: "",
      customerId: "",
      customerName: "",
      trainerId: "",
      trainerName: "",
      totalSessions: 0,
      completedSessions: 0,
      startDate: "",
      endDate: "",
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {contract ? "Chỉnh sửa hợp đồng" : "Thêm hợp đồng mới"}
          </DialogTitle>
          <DialogDescription>
            Điền thông tin hợp đồng huấn luyện
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="id">Mã hợp đồng</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) =>
                  setFormData({ ...formData, id: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerName">Tên khách hàng</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trainerName">HLV</Label>
              <Select
                value={formData.trainerName}
                onValueChange={(value) =>
                  setFormData({ ...formData, trainerName: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn HLV" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HLV Minh">HLV Minh</SelectItem>
                  <SelectItem value="HLV Hương">HLV Hương</SelectItem>
                  <SelectItem value="HLV Tuấn">HLV Tuấn</SelectItem>
                  <SelectItem value="HLV Lan">HLV Lan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalSessions">Tổng số buổi</Label>
              <Input
                id="totalSessions"
                type="number"
                value={formData.totalSessions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    totalSessions: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="completedSessions">Số buổi đã tập</Label>
              <Input
                id="completedSessions"
                type="number"
                value={formData.completedSessions}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    completedSessions: parseInt(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit">Lưu</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
