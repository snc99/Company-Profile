import { z } from "zod";

const FileSchema = z
  .instanceof(File)
  .refine((file) => file.size <= 5 * 1024 * 1024, "Ukuran gambar maksimal 5MB")
  .refine(
    (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
    "Format gambar harus jpg/png/webp"
  );

export const CreateProjectSchema = z.object({
  title: z
    .string()
    .min(1, "Judul wajib diisi")
    .max(100, "Judul maksimal 100 karakter"),
  description: z
    .string()
    .min(10, "Deskripsi minimal 10 karakter")
    .max(1000, "Deskripsi maksimal 1000 karakter"),
  link: z
    .string()
    .url("Harus berupa URL yang valid")
    .or(z.literal(""))
    .optional(),
  projectImage: z.union([FileSchema, z.null()]).optional(),
  skills: z
    .array(z.string().uuid("ID skill harus berupa UUID"))
    .min(1, "Minimal satu skill harus dipilih"),
});
