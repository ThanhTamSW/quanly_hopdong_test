const [contracts, setContracts] = useState([]);

useEffect(() => {
  contractApi.getContracts({ page, limit }).then(res => {
    setContracts(res.data.contracts);
  });
}, [page]);

const handleDelete = async (id) => {
  await contractApi.deleteContract(id);
  // Refresh list
};