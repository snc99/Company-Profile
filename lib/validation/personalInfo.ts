import { z } from "zod";

export const CreatePersonalInfoSchema = z.object({
  motto: z
    .string()
    .min(3, "Motto minimal 3 karakter")
    .max(1000, "Motto maksimal 1000 karakter")
    .refine((value) => value.trim() !== "", {
      message: "Motto wajib diisi",
    }),

  cv: z
    .instanceof(File, { message: "File CV wajib diunggah" })
    .refine((file) => file instanceof File, {
      message: "File CV harus diunggah",
    })
    .refine((file) => file.type === "application/pdf", {
      message: "Format file tidak valid! Harus berupa PDF.", // 🔥 Ubah pesan di sini!
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: "Ukuran file terlalu besar! Maksimal 5MB.",
    }),
});

export const UpdatePersonalInfoSchema = z.object({
  motto: z.string().min(3, "Motto harus memiliki minimal 3 karakter"),
  cv: z
    .instanceof(File)
    .optional()
    .nullable()
    .refine((file) => !file || file.type === "application/pdf", {
      message: "File harus berupa PDF",
    })
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "File maksimal 5MB",
    }),
});
