import { Button } from "../ui/button";

interface DeleteButtonProps {
  onDelete: (id: string) => void;
  classname?: string;
  loading: boolean;
  label: string;
  id: string;
}

export const DeleteButton: React.FC<DeleteButtonProps> = ({
  onDelete,
  loading,
  label,
  id,
}) => {
  return (
    <Button
      onClick={() => onDelete(id)}
      disabled={loading}
      variant="destructive"
    >
      {loading ? "Processing..." : label}
    </Button>
  );
};
