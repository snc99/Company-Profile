import { z } from "zod";

export const CreateSocialMediaSchema = z.object({
  platform: z
    .string()
    .min(3, { message: "Platform harus memiliki minimal 3 karakter" }),
  url: z
    .string()
    .url({ message: "URL tidak valid." })
    .nonempty({ message: "URL tidak boleh kosong." }),
  photo: z
    .instanceof(File, { message: "Foto wajib di isi" })
    .refine((file) => file.type.startsWith("image/"), {
      message: "File yang diupload harus berupa gambar",
    })
    .refine((file) => file.size <= 2 * 1024 * 1024, {
      message: "Ukuran foto tidak boleh lebih dari 2 MB",
    }),
});

export const UpdateSocialMediaSchema = z.object({
    platform: z
      .string()
      .min(3, { message: "Platform harus memiliki minimal 3 karakter" }),
    url: z
      .string()
      .url({ message: "URL tidak valid." })
      .nonempty({ message: "URL tidak boleh kosong." }),
    photo: z
      .instanceof(File, { message: "Foto wajib di isi" })
      .refine((file) => file.type.startsWith("image/"), {
        message: "File yang diupload harus berupa gambar",
      })
      .refine((file) => file.size <= 2 * 1024 * 1024, {
        message: "Ukuran foto tidak boleh lebih dari 2 MB",
      })
      .nullable()
      .optional(),
  });
