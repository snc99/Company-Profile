"use client";

import Swal from "sweetalert2";

// export function showToast(
//   icon: "success" | "error" | "warning" | "info",
//   title: string
// ) {
//   Swal.fire({
//     toast: true,
//     position: "top-end",
//     icon: icon,
//     title: title,
//     showConfirmButton: false,
//     timer: 3000,
//     timerProgressBar: true,
//     didOpen: (toast) => {
//       toast.onmouseenter = Swal.stopTimer;
//       toast.onmouseleave = Swal.resumeTimer;
//     },
//   });
// }

export function showToast(
  icon: "success" | "error" | "warning" | "info",
  title: string
) {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: icon,
    title: title,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
}
