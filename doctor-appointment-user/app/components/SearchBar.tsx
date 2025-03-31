import React, { useState } from "react";
import styles from "@/app/styles/SearchBar.module.css";
import Image from "next/image";
import searchIcon from "@/public/images/search_icon.svg";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  onReset?: () => void;
}

export default function SearchBar({ onSearch, onReset }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleReset = () => {
    setSearchTerm("");
    if (onReset) {
      onReset();
    }
  };

  return (
    <div className={styles.searchBar_container}>
      <h3>Find a doctor at your own ease</h3>
      <div className={styles.searchBar_wrapper}>
        <div className={styles.icon_serachBar}>
          <Image src={searchIcon} alt="serach-icon" height={20} width={20} />
          <input
            type="search"
            placeholder="search doctors"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              onSearch(e.target.value);
            }}
          />
        </div>
        <button onClick={handleReset}>Search</button>
      </div>
    </div>
  );
}
