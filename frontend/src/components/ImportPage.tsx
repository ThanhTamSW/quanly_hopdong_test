import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { Upload, FileSpreadsheet, CheckCircle, AlertCircle } from "lucide-react";
import { Progress } from "./ui/progress";
import { Alert, AlertDescription } from "./ui/alert";

export function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");
  const [uploadMessage, setUploadMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setUploadStatus("idle");

    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setUploadStatus("success");
          setUploadMessage(
            `Đã import thành công ${Math.floor(Math.random() * 50 + 10)} hợp đồng từ file ${file.name}`
          );
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const resetUpload = () => {
    setFile(null);
    setProgress(0);
    setUploadStatus("idle");
    setUploadMessage("");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Import dữ liệu hợp đồng</CardTitle>
          <CardDescription>
            Tải lên file Excel (.xlsx, .xls) chứa thông tin hợp đồng
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors">
            <input
              type="file"
              id="file-upload"
              className="hidden"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              disabled={uploading}
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                {file ? (
                  <FileSpreadsheet className="w-8 h-8 text-primary" />
                ) : (
                  <Upload className="w-8 h-8 text-primary" />
                )}
              </div>
              <div>
                <p className="mb-2">
                  {file ? file.name : "Chọn file hoặc kéo thả vào đây"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Hỗ trợ: .xlsx, .xls (tối đa 10MB)
                </p>
              </div>
            </label>
          </div>

          {/* Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Đang tải lên...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}

          {/* Status Messages */}
          {uploadStatus === "success" && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                {uploadMessage}
              </AlertDescription>
            </Alert>
          )}

          {uploadStatus === "error" && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {uploadMessage}
              </AlertDescription>
            </Alert>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              onClick={handleUpload}
              disabled={!file || uploading || uploadStatus === "success"}
              className="flex-1"
            >
              {uploading ? "Đang tải..." : "Tải lên"}
            </Button>
            {(file || uploadStatus === "success") && (
              <Button
                variant="outline"
                onClick={resetUpload}
                disabled={uploading}
              >
                Đặt lại
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Hướng dẫn định dạng file</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2">Các cột bắt buộc trong file Excel:</h4>
            <div className="bg-muted/30 rounded-lg p-4">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2">Tên cột</th>
                    <th className="text-left py-2">Mô tả</th>
                    <th className="text-left py-2">Ví dụ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-2">id_hopdong</td>
                    <td className="py-2">Mã hợp đồng duy nhất</td>
                    <td className="py-2">HD001</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2">ten_khachhang</td>
                    <td className="py-2">Tên khách hàng</td>
                    <td className="py-2">Nguyễn Văn A</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2">ten_hlv</td>
                    <td className="py-2">Tên huấn luyện viên</td>
                    <td className="py-2">HLV Minh</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2">so_buoi</td>
                    <td className="py-2">Tổng số buổi tập</td>
                    <td className="py-2">20</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2">so_buoi_da_tap</td>
                    <td className="py-2">Số buổi đã hoàn thành</td>
                    <td className="py-2">5</td>
                  </tr>
                  <tr className="border-b border-border">
                    <td className="py-2">ngay_bat_dau</td>
                    <td className="py-2">Ngày bắt đầu (DD/MM/YYYY)</td>
                    <td className="py-2">01/01/2025</td>
                  </tr>
                  <tr>
                    <td className="py-2">ngay_ket_thuc</td>
                    <td className="py-2">Ngày kết thúc (DD/MM/YYYY)</td>
                    <td className="py-2">01/04/2025</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="mb-2 text-blue-900">Lưu ý:</h4>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
              <li>File Excel phải có dòng tiêu đề ở hàng đầu tiên</li>
              <li>Tất cả các cột bắt buộc phải có giá trị</li>
              <li>Định dạng ngày tháng: DD/MM/YYYY</li>
              <li>Số buổi đã tập không được lớn hơn tổng số buổi</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
