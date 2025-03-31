"use client";
import styles from "@/app/styles/NavLinks.module.css";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

export default function NavLinks() {
  const { id } = useParams();
  const pathname = usePathname();

  const isDoctorProfile =
    /^\/doctors\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      pathname || ""
    );

  // Function to check if a link is active
  const isActive = (path: string): boolean => {
    if (path === "/") {
      return pathname === path;
    }
    return pathname?.startsWith(path) || false;
  };

  return (
    <div className={styles.navLinks_container}>
      <ul>
        <li className={isActive("/") ? styles.active : ""}>
          <Link href="/">Home</Link>
        </li>
        <li
          className={
            isActive("/doctors") && !isDoctorProfile ? styles.active : ""
          }
        >
          <Link href="/doctors">Doctors</Link>
        </li>
        {isDoctorProfile && (
          <>
            <li
              className={
                pathname?.includes("/appointment") ? styles.active : ""
              }
            >
              <Link href={`/doctors/${id}/appointment`}>Appointment</Link>
            </li>
            <li className={pathname?.includes("/reviews") ? styles.active : ""}>
              <Link href={`/doctors/${id}/reviews`}>Reviews</Link>
            </li>
          </>
        )}
        <li className={isActive("/help") ? styles.active : ""}>
          <Link href="/help">Help</Link>
        </li>
      </ul>
    </div>
  );
}
