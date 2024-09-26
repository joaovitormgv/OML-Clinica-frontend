"use client";

import NavBar from "../navbar/index";
import { usePathname } from "next/navigation";

export default function NavBarWrapper() {
  const pathname = usePathname();

  return pathname !== "/pages/cargo" &&
    pathname !== "/pages/admin/cadastro" &&
    pathname !== "/pages/admin/login" &&
    pathname !== "/pages/login/paciente" ? (
    <NavBar />
  ) : null;
}
