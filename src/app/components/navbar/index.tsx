import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import styles from "./navbar.module.css";

const Navbar = () => {
    const pathname = usePathname();

    return (
        <React.Fragment>
            <div className="flex items-center w-full h-20 bg-customBlue text-White">
                <div className="flex justify-start items-center h-full ml-8 mr-8 pr-4">
                    <h2 className="text-2xl font-bold">OML</h2>
                    <div className="ml-8 border-r border-white h-12 my-auto"></div>
                </div>

                <div className="flex row items-center gap-5">
                    <Link href="/" className={`${styles.link} ${pathname === "/" ? styles.active : ""}`}>
                        Início
                    </Link>
                    <Link href="/cadastro" className={`${styles.link} ${pathname === "/cadastro" ? styles.active : ""}`}>
                        Cadastros
                    </Link>
                    <Link href="/consulta" className={`${styles.link} ${pathname === "/consulta" ? styles.active : ""}`}>
                        Consultas
                    </Link>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Navbar;