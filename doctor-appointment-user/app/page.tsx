import LandingPage from "./components/HomePage";
import styles from "@/app/page.module.css";

export default function Home() {
  return (
    <div className={styles.page_container}>
      <LandingPage />
    </div>
  );
}
