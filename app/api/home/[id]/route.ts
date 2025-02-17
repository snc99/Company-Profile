// <<<<<<< HEAD
import { prisma } from "@/lib/prisma";
import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { z } from "zod";

const HomeSchema = z.object({
  motto: z
    .string()
    .min(3, "Motto minimal 3 karakter")
    .max(1000, "Motto maksimal 1000 karakter")
    .refine((value) => value.trim() !== "", {
      message: "Motto wajib diisi",
    }),

  cv: z
    .custom<File | null>((file) => {
      if (!file) return true;
      if (!(file instanceof File)) return false;
      if (file.type !== "application/pdf") return false;
      if (file.size > 5 * 1024 * 1024) return false;
      return true;
    }, "File harus berupa PDF dan maksimal 5MB")
    .optional(),
});

function sanitizeFileName(originalName: string) {
  const sanitized = originalName.replace(/[^a-zA-Z0-9.-]/g, "_").slice(-50);
  const extension = ".pdf";

  if (sanitized.toLowerCase().endsWith(extension)) {
    return sanitized;
  }

  return sanitized + extension;
}

async function uploadToCloudinary(file: File) {
  const sanitizedFileName = sanitizeFileName(file.name);
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "cv_files",
        public_id: sanitizedFileName,
        access_mode: "public",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result?.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = await context.params;
    // console.log("Params:", context.params);
    if (!id) {
      return NextResponse.json({ message: "ID tidak valid" }, { status: 400 });
    }

    const existingData = await prisma.home.findUnique({ where: { id } });
    if (!existingData) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    const formData = await req.formData();
    // console.log("Form Data:", formData);
    const motto = formData.get("motto") as string;
    const cvFile = formData.get("cv") as File | null;

    const result = HomeSchema.safeParse({ motto, cv: cvFile });

    if (!result.success) {
      return NextResponse.json(
        { message: result.error.errors.map((e) => e.message).join(", ") },
        { status: 400 }
      );
    }

    if (existingData.motto.trim() === motto.trim()) {
      return NextResponse.json(
        { message: "Motto tidak berubah" },
        { status: 200 }
      );
    }

    let cvUrl: string | undefined;
    if (cvFile) {
      cvUrl = (await uploadToCloudinary(cvFile)) as string;
    }

    const updatedHome = await prisma.home.update({
      where: { id },
      data: {
        motto,
        cvLink: cvUrl || existingData.cvLink,
      },
    });

    return NextResponse.json(updatedHome, { status: 200 });
  } catch (error) {
    console.error("Error updating home data:", error);
    return NextResponse.json(
      { message: "Gagal mengupdate data", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const homeData = await prisma.home.delete({
      where: { id },
    });

    return NextResponse.json(homeData, { status: 200 });
  } catch (error) {
    console.error("Error deleting data:", error);
    return NextResponse.json(
      { message: "Gagal menghapus data", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { message: "ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const homeData = await prisma.home.findUnique({
      where: { id },
    });

    if (!homeData) {
      return NextResponse.json(
        { message: "Data tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(homeData);
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}
// =======
// import { prisma } from "@/lib/prisma";
// import { NextResponse, NextRequest } from "next/server";
// import { v2 as cloudinary } from "cloudinary";

// // Cek variabel lingkungan Cloudinary
// const cloudinaryConfig = {
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// };

// if (
//   !cloudinaryConfig.cloud_name ||
//   !cloudinaryConfig.api_key ||
//   !cloudinaryConfig.api_secret
// ) {
//   console.error(
//     "Cloudinary environment variables are missing:",
//     cloudinaryConfig
//   );
//   throw new Error("Cloudinary environment variables are missing");
// }

// cloudinary.config({
//   cloud_name: cloudinaryConfig.cloud_name,
//   api_key: cloudinaryConfig.api_key,
//   api_secret: cloudinaryConfig.api_secret,
// });

// // Fungsi upload ke Cloudinary
// async function uploadToCloudinary(file: File) {
//   const arrayBuffer = await file.arrayBuffer();
//   const buffer = Buffer.from(arrayBuffer);

//   return new Promise((resolve, reject) => {
//     const uploadStream = cloudinary.uploader.upload_stream(
//       {
//         resource_type: "raw",
//         folder: "cv_files",
//         format: "pdf",
//       },
//       (error, result) => {
//         if (error) reject(error);
//         else resolve(result?.secure_url);
//       }
//     );

//     uploadStream.end(buffer);
//   });
// }

// export async function PUT(
//   req: NextRequest,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     const { id } = await params;

//     if (!id) {
//       return NextResponse.json({ message: "Invalid ID" }, { status: 400 });
//     }

//     const formData = await req.formData();
//     const motto = formData.get("motto") as string;
//     const cvFile = formData.get("cv");

//     let cvUrl: string | undefined;

//     if (cvFile && cvFile instanceof File) {
//       if (cvFile.type !== "application/pdf") {
//         return NextResponse.json(
//           { message: "Hanya file PDF yang diperbolehkan" },
//           { status: 400 }
//         );
//       }

//       cvUrl = (await uploadToCloudinary(cvFile)) as string;
//     }

//     const updatedHome = await prisma.home.update({
//       where: { id },
//       data: {
//         motto,
//         cvLink: cvUrl || undefined, // Jika tidak ada file, jangan ubah cvLink
//       },
//     });

//     return NextResponse.json(updatedHome, { status: 200 });
//   } catch (error) {
//     console.error("Error updating home data:", error);
//     return NextResponse.json(
//       { message: "Gagal mengupdate data", error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> } // Sesuai Next.js 15, params adalah Promise
// ) {
//   try {
//     const { id } = await context.params; // Gunakan `await` untuk mengambil params

//     if (!id) {
//       return NextResponse.json({ message: "ID is required" }, { status: 400 });
//     }

//     const homeData = await prisma.home.delete({
//       where: { id },
//     });

//     return NextResponse.json(homeData, { status: 200 });
//   } catch (error) {
//     console.error("Error deleting data:", error);
//     return NextResponse.json(
//       { message: "Gagal menghapus data", error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }

// export async function GET(
//   req: NextRequest,
//   context: { params: Promise<{ id: string }> } // `params` adalah Promise
// ) {
//   try {
//     const { id } = await context.params; // Pakai await di sini

//     if (!id) {
//       return NextResponse.json(
//         { message: "ID tidak ditemukan" },
//         { status: 400 }
//       );
//     }

//     const homeData = await prisma.home.findUnique({
//       where: { id },
//     });

//     if (!homeData) {
//       return NextResponse.json(
//         { message: "Data tidak ditemukan" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(homeData);
//   } catch (error) {
//     console.error("Terjadi kesalahan:", error);
//     return NextResponse.json(
//       { message: "Terjadi kesalahan server" },
//       { status: 500 }
//     );
//   }
// }
// >>>>>>> 7345024b9077eb224df0c942e66c3ec97f934740
