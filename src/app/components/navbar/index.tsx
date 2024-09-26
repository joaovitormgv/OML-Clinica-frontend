import React, {useEffect, useState} from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./navbar.module.css";
import LogoutButton from "../logout/logout";

const Navbar = () => {
    const pathname = usePathname();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        setIsLoggedIn(!!token);
    }, []);

    return (
        <React.Fragment>
            <div className="flex items-center w-full h-20 bg-customBlue text-White">
                <div className="flex justify-start items-center h-full ml-8 mr-8 pr-4">
                    <h2 className="text-2xl font-bold">OML</h2>
                    <div className="ml-8 border-r border-white h-12 my-auto"></div>
                </div>

                <div className="flex row items-center gap-5">
                    <Link href="/pages/cargo" className={`${styles.link} ${pathname === "/pages/cargo" ? styles.active : ""}`}>
                        Início
                    </Link>
                    <Link href="/pages/admin/adicionarUsuarios" className={`${styles.link} ${pathname === "/pages/admin/adicionarUsuarios" ? styles.active : ""}`}>
                        Cadastros
                    </Link>
                    <Link href="/pages/consultas/autorizados" className={`${styles.link} ${pathname === "/pages/consultas/autorizados" ? styles.active : ""}`}>
                        Consultas
                    </Link>
                </div>
                <div className="ml-auto mr-8">
                    { isLoggedIn ? (
                    <LogoutButton/>
                    ) : (
                    <Link href="/pages/admin/login">
                        Login
                    </Link>
                    )
                }
                </div>
            </div>
        </React.Fragment>
    );
};

export default Navbar;