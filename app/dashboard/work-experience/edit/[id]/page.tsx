"use client";

import useSWR from "swr";
import { useRouter, useParams } from "next/navigation";
import EditFormWorkExperience from "@/components/custom-ui/EditFormWorkExperience";
import { ToastNotification } from "@/components/Toast-Sweetalert2/Toast";
import Loading from "@/components/custom-ui/Loading";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch data");
  return res.json();
};

export default function EditWorkExperiencePage() {
  const router = useRouter();
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const endpoint = id ? `/api/work-experience/${id}` : null;
  const { data, error, isLoading, mutate } = useSWR(endpoint, fetcher);

  const handleUpdate = async (formData: FormData) => {
    try {
      const updatedData = Object.fromEntries(formData.entries());

      mutate({ data: { ...data?.data, ...updatedData } }, false);

      const res = await fetch(`/api/work-experience/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(await res.text());
      }

      ToastNotification("success", "Work experience updated successfully");

      await mutate();
      router.push("/dashboard/work-experience");
    } catch (error) {
      console.error("Update Error:", error);
      ToastNotification("error", "Something went wrong");
    }
  };

  if (!id) {
    return <p className="text-center text-red-500">Invalid ID</p>;
  }

  if (error)
    return <p className="text-center text-red-500">Error fetching data</p>;
  if (isLoading) return <Loading />;

  return (
    <div className="w-full">
      {error ? (
        <p className="text-center text-red-500">Error fetching data</p>
      ) : (
        <EditFormWorkExperience
          onSubmit={handleUpdate}
          loading={isLoading}
          initialDataId={data.data}
          isEdit={true}
          mutate={mutate}
        />
      )}
    </div>
  );
}
