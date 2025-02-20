import { z } from "zod";

export const CreateSkillSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nama skill minimal 2 karakter" })
    .nonempty({ message: "Nama skill wajib diisi" }),
  photo: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "File harus berupa gambar (JPG/PNG)",
      }
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Ukuran gambar maksimal 5MB",
    }),
});

export const UpdateSkillSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Nama skill minimal 2 karakter" })
    .nonempty({ message: "Nama skill wajib diisi" }),
  photo: z
    .instanceof(File)
    .refine(
      (file) => ["image/jpeg", "image/png", "image/jpg"].includes(file.type),
      {
        message: "File harus berupa gambar (JPG/PNG)",
      }
    )
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Ukuran gambar maksimal 5MB",
    })
    .nullable()
    .optional(),
});
