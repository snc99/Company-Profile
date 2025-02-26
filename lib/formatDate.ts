// utils/formatDate.ts
export const formatDateToIndonesia = (date: string) => {
  const options: Intl.DateTimeFormatOptions = {
    // weekday: "long", // "Monday"
    year: "numeric", // "2023"
    month: "long", // "December"
    day: "numeric", // "20"
  };

  const indonesiaDate = new Date(date).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta", // Zona waktu Indonesia
    ...options,
  });

  return indonesiaDate;
};
