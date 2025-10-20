const handleDownloadTemplate = async () => {
  const blob = await importApi.downloadTemplate('contracts');
  // Download file
};

const handlePreview = async () => {
  const result = await importApi.preview(file, 'contracts');
  setPreview(result.data);
};

const handleImport = async () => {
  await importApi.importContracts(file);
  toast.success('Import thành công');
};