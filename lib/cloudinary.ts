import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload file ke Cloudinary
 * @param {File} file - File yang akan diupload
 * @param {string} folder - Nama folder di Cloudinary (opsional)
 * @returns {Promise<string>} URL file yang sudah diupload
 */

export async function uploadToCloudinary(
  file: File,
  folder?: string
): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise<string>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: "auto",
          folder: folder || undefined,
          public_id: file.name.split(".")[0], // Menggunakan nama asli file (tanpa ekstensi)
        },
        (error, result) => {
          if (error) {
            reject(new Error(`Upload gagal: ${error.message}`));
          } else {
            resolve(result?.secure_url || "");
          }
        }
      );
      uploadStream.end(buffer);
    });
  } catch (error) {
    throw new Error(`Terjadi kesalahan saat mengupload file: ${error}`);
  }
}

/**
 * Hapus file dari Cloudinary
 * @param {string} url - URL file yang ingin dihapus
 * @returns {Promise<any>} Response dari Cloudinary
 */
export async function deleteFromCloudinary(url: string) {
  try {
    const parts = url.split("/"); // Pecah URL menjadi array berdasarkan "/"
    const filenameWithExtension = parts.pop(); // Ambil nama file
    const publicId = filenameWithExtension?.split(".")[0]; // Hapus ekstensi file

    // Temukan index 'upload' lalu ambil hanya bagian setelahnya sebagai folder
    const uploadIndex = parts.indexOf("upload");
    const folderParts = uploadIndex !== -1 ? parts.slice(uploadIndex + 2) : []; // Skip timestamp versi

    const folder = folderParts.join("/"); // Gabungkan kembali menjadi string folder

    if (!publicId) {
      throw new Error("Public ID tidak ditemukan! Pastikan URL valid.");
    }

    const publicIdPath = folder ? `${folder}/${publicId}` : publicId; // Format Public ID dengan folder

    const result = await cloudinary.uploader.destroy(publicIdPath);

    return result;
  } catch (error) {
    console.error("Gagal menghapus file dari Cloudinary:", error);
    throw new Error(`Gagal menghapus file dari Cloudinary: ${error}`);
  }
}

/**
 * Update file di Cloudinary (hapus file lama, lalu upload baru)
 * @param {string} oldUrl - URL file lama yang ingin dihapus
 * @param {File} newFile - File baru yang akan diupload
 * @param {string} folder - Folder tempat file tersimpan (opsional)
 * @returns {Promise<string>} URL file yang baru diupload
 */
export async function updateCloudinaryFile(
  oldUrl: string,
  newFile: File,
  folder?: string
) {
  try {
    await deleteFromCloudinary(oldUrl);
    return await uploadToCloudinary(newFile, folder);
  } catch (error) {
    throw new Error(`Gagal memperbarui file di Cloudinary: ${error}`);
  }
}
