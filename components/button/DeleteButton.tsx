import { Button } from "../ui/button";

interface DeleteButtonProps {
  onDelete: (id: string) => void;
  classname?: string;
  loading: boolean;
  label: string;
  id: string; // Tambahkan properti `id` untuk menerima ID yang ingin dihapus
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onDelete,
  loading,
  label,
  id, // Ambil id dari props
}) => {
  return (
    <Button
      onClick={() => onDelete(id)} // Kirim id ke onDelete saat tombol di-klik
      disabled={loading}
      variant="destructive"
    >
      {loading ? "Processing..." : label}
    </Button>
  );
};
