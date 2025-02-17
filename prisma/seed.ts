import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("irvan2323", 10);

  await prisma.admin.create({
    data: {
      nama: "Irvan Sandy",
      email: "irvansan23@profile.com",
      password: hashedPassword,
    },
  });
}

main()
  .then(() => {
    console.log("Seed data berhasil diisi.");
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
