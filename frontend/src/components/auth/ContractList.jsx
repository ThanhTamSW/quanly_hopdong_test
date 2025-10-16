import { useState, useEffect } from 'react';
import { contractApi } from '@/services/contractApi';
import { toast } from 'sonner';

export default function ContractList() {
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });

  useEffect(() => {
    fetchContracts();
  }, [pagination.page]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const response = await contractApi.getContracts({
        page: pagination.page,
        limit: pagination.limit
      });
      setContracts(response.data.contracts);
      setPagination(prev => ({
        ...prev,
        total: response.data.pagination.total
      }));
    } catch (error) {
      toast.error('Không thể tải danh sách hợp đồng');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Bạn có chắc muốn xóa hợp đồng này?')) return;

    try {
      await contractApi.deleteContract(id);
      toast.success('Xóa hợp đồng thành công');
      fetchContracts();
    } catch (error) {
      toast.error('Không thể xóa hợp đồng');
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <h1>Danh sách Hợp đồng</h1>
      <table>
        <thead>
          <tr>
            <th>Số HĐ</th>
            <th>Tiêu đề</th>
            <th>Đối tác</th>
            <th>Giá trị</th>
            <th>Trạng thái</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map(contract => (
            <tr key={contract._id}>
              <td>{contract.contractNumber}</td>
              <td>{contract.title}</td>
              <td>{contract.partner?.name}</td>
              <td>{contract.value.toLocaleString()} {contract.currency}</td>
              <td>{contract.status}</td>
              <td>
                <button onClick={() => handleDelete(contract._id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}