import { z } from "zod";

export const WorkExperienceSchema = z
  .object({
    companyName: z
      .string()
      .min(3, "Nama perusahaan harus memiliki minimal 3 karakter")
      .max(100, "Nama perusahaan tidak boleh lebih dari 100 karakter"),
    position: z
      .string()
      .min(3, "Posisi harus memiliki minimal 3 karakter")
      .max(100, "Posisi tidak boleh lebih dari 100 karakter"),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
    endDate: z
      .union([
        z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD"),
        z.null(),
      ])
      .optional(),
    description: z
      .string()
      .min(3, "Deskripsi harus memiliki minimal 3 karakter")
      .max(500, "Deskripsi tidak boleh lebih dari 500 karakter")
      .optional()
      .nullable(),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);

      if (end < start) {
        ctx.addIssue({
          path: ["endDate"],
          message:
            "Tanggal selesai harus setelah atau sama dengan tanggal mulai",
          code: "custom",
        });
      }

      if (end > today) {
        ctx.addIssue({
          path: ["endDate"],
          message: "Tanggal selesai tidak boleh lebih dari hari ini",
          code: "custom",
        });
      }
    }
  });
