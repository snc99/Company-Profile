import Image from "next/image";
import { Edit, Trash2 } from "lucide-react";

interface SocialMediaItem {
  platform: string;
  url: string;
  photo: string; // atau bisa disesuaikan dengan struktur data foto Anda
}

const SocialMediaTable = ({ data }: { data: SocialMediaItem[] }) => {
  return (
    <div className="overflow-x-auto shadow-lg rounded-lg col-span-2 w-full">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-medium">
              Platform
            </th>
            <th className="px-6 py-3 text-left text-sm font-medium">URL</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Foto</th>
            <th className="px-6 py-3 text-left text-sm font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.map((item, index) => (
            <tr key={index} className="border-t hover:bg-gray-50">
              <td className="px-6 py-4 text-sm">{item.platform}</td>
              <td className="px-6 py-4 text-sm">
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {item.url}
                </a>
              </td>
              <td className="px-6 py-4 text-sm">
                {item.photo ? (
                  <Image
                    src={item.photo}
                    alt={item.platform}
                    className="w-12 h-12 object-cover rounded-full"
                    width={48}
                    height={48}
                    unoptimized
                  />
                ) : (
                  <span>Gambar tidak tersedia</span>
                )}
              </td>
              <td className="px-6 py-4 text-sm">
                <div className="flex">
                  <button className="text-blue-600 hover:text-blue-800 flex items-center mr-2">
                    <Edit className="h-5 w-5 mr-2" />
                  </button>
                  <button className="text-red-600 hover:text-red-800 flex items-center">
                    <Trash2 className="h-5 w-5 mr-2" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SocialMediaTable;
