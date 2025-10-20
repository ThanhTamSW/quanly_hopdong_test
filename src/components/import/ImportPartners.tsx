import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Upload, FileSpreadsheet, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { importApi } from "@/services/importApi";

interface ImportData {
  code: string;
  name: string;
  type: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

interface ValidationError {
  row: number;
  field: string;
  message: string;
}

export function ImportPartners() {
  const [file, setFile] = useState<File | null>(null);
  const [previewData, setPreviewData] = useState<ImportData[]>([]);
  const [validation, setValidation] = useState<{
    validRows: number;
    invalidRows: number;
    errors: ValidationError[];
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    imported: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewData([]);
      setValidation(null);
      setImportResult(null);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      await importApi.downloadTemplate('partners');
    } catch (error) {
      console.error('Error downloading template:', error);
    }
  };

  const handlePreview = async () => {
    if (!file) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'partners');

      const response = await importApi.previewImport(formData);
      setPreviewData(response.data.preview);
      setValidation({
        validRows: response.data.validRows,
        invalidRows: response.data.invalidRows,
        errors: response.data.errors
      });
    } catch (error: any) {
      console.error('Preview error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async () => {
    if (!file) return;

    try {
      setImporting(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await importApi.importPartners(formData);
      setImportResult({
        imported: response.data.imported,
        failed: response.data.failed,
        errors: response.data.errors
      });
    } catch (error: any) {
      console.error('Import error:', error);
    } finally {
      setImporting(false);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreviewData([]);
    setValidation(null);
    setImportResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Import Đối tác
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Download Template */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bước 1: Tải template</h3>
            <p className="text-sm text-gray-600">
              Tải file template Excel để điền thông tin đối tác
            </p>
            <Button onClick={handleDownloadTemplate} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Tải template Excel
            </Button>
          </div>

          {/* Step 2: Upload File */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bước 2: Upload file</h3>
            <div className="space-y-2">
              <Label htmlFor="file">Chọn file Excel</Label>
              <Input
                id="file"
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {file && (
                <p className="text-sm text-green-600">
                  Đã chọn: {file.name}
                </p>
              )}
            </div>
          </div>

          {/* Step 3: Preview */}
          {file && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Bước 3: Xem trước dữ liệu</h3>
              <Button onClick={handlePreview} disabled={loading}>
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Xem trước dữ liệu
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Validation Results */}
          {validation && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Kết quả kiểm tra</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{validation.validRows}</p>
                  <p className="text-sm text-gray-600">Dòng hợp lệ</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{validation.invalidRows}</p>
                  <p className="text-sm text-gray-600">Dòng lỗi</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <AlertCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-blue-600">{validation.errors.length}</p>
                  <p className="text-sm text-gray-600">Lỗi chi tiết</p>
                </div>
              </div>

              {validation.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Chi tiết lỗi:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {validation.errors.map((error, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertDescription>
                          Dòng {error.row}: {error.message}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preview Table */}
          {previewData.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dữ liệu xem trước (5 dòng đầu)</h3>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã đối tác</TableHead>
                      <TableHead>Tên</TableHead>
                      <TableHead>Loại</TableHead>
                      <TableHead>Người liên hệ</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Số điện thoại</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewData.slice(0, 5).map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>{row.code}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.type}</TableCell>
                        <TableCell>{row.contactPerson}</TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.phone}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          {/* Import Button */}
          {validation && validation.validRows > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Bước 4: Import dữ liệu</h3>
              <Button 
                onClick={handleImport} 
                disabled={importing}
                className="w-full"
              >
                {importing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Đang import...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Import {validation.validRows} đối tác
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Import Results */}
          {importResult && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Kết quả import</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-green-600">{importResult.imported}</p>
                  <p className="text-sm text-gray-600">Import thành công</p>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-red-600">{importResult.failed}</p>
                  <p className="text-sm text-gray-600">Import thất bại</p>
                </div>
              </div>

              {importResult.errors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Lỗi import:</h4>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {importResult.errors.map((error, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Button onClick={resetForm} variant="outline">
                  Import file khác
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Xem danh sách đối tác
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
