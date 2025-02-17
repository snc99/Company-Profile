import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

async function getFileUrl(publicId: string) {
  const result = await cloudinary.api.resource(publicId);
  console.log(result.secure_url);
}

getFileUrl("uploads/kgbnyow1vdppkxn2lgqa.pdf");
