"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import styles from "@/app/styles/DisplayDoctor.module.css";
import SearchBar from "./SearchBar";
import DoctorCard from "./DoctorCard";
import Filter from "./Filter";
import Footer from "./Footer";

interface Doctor {
  doctor_id: string;
  name: string;
  average_rating: number;
  experience_year: number;
  degree: string;
  photo_url: string;
  location: string;
  specialty: string[];
  disease: string[];
  gender: string;
}

interface FilterState {
  gender: string;
  experience: string;
  rating: string;
  doctor_name: string;
  specialty: string;
}

interface PaginationInfo {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
}

// Custom debounce function
const useDebounce = (callback: (value: string) => void, delay: number) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (value: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      callback(value);
    }, delay);
  };
};

export default function DisplayDoctor() {
  const [isOpen, setIsOpen] = useState(false);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    gender: "",
    experience: "",
    rating: "",
    doctor_name: "",
    specialty: "",
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalRecords: 0,
    totalPages: 1,
    currentPage: 1,
  });

  const fetchDoctors = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        setError(null);

        const queryParams = new URLSearchParams({
          pageNo: page.toString(),
          ...(filters.gender && { gender: filters.gender }),
          ...(filters.experience && { experience: filters.experience }),
          ...(filters.rating && { rating: filters.rating }),
          ...(filters.doctor_name && { search: filters.doctor_name }),
          ...(filters.specialty && { specialty: filters.specialty }),
        });

        const url = `http://localhost:5000/doctor/search?${queryParams}`;
        console.log("Query Parameters:", Object.fromEntries(queryParams));
        console.log("Full URL:", url);

        const response = await fetch(url, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch doctors");
        }

        const data = await response.json();
        setDoctors(data.data);
        setPagination(prev => ({
          totalRecords: page === 1 ? data.totalRecords : prev.totalRecords,
          totalPages: page === 1 ? data.totalPages : prev.totalPages,
          currentPage: data.currentPage,
        }));
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  // Custom debounced search function
  const debouncedSearch = useDebounce((searchTerm: string) => {
    setFilters((prev) => ({ ...prev, doctor_name: searchTerm }));
  }, 500);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    fetchDoctors(newPage);
  };

  const handleReset = () => {
    setFilters({
      gender: "",
      experience: "",
      rating: "",
      doctor_name: "",
      specialty: "",
    });
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className={styles.displayDoctor_container}>
      <div className={styles.searchBar_component_div}>
        <SearchBar onSearch={debouncedSearch} onReset={handleReset} />
      </div>

      <section className={styles.doctor_result}>
        <h3>{pagination.totalRecords} doctors available</h3>
        <p>
          Book appointments with minimum wait-time & verified doctor details
        </p>
      </section>

      <button className={styles.filter_btn} onClick={() => setIsOpen(true)}>
        Filters
      </button>

      <div className={styles.filter_cards}>
        <div className={styles.filter_component_div}>
          <Filter onFilterChange={handleFilterChange} currentFilters={filters} />
        </div>
        <div className={styles.cards_and_pagination}>
          <article className={styles.cards_container}>
            {loading ? (
              <div className={styles.loading}>Loading...</div>
            ) : error ? (
              <div className={styles.error}>{error}</div>
            ) : (
              <>
                {doctors.map((doctor) => (
                  <DoctorCard key={doctor.doctor_id} doctor={doctor} />
                ))}
              </>
            )}
          </article>
          {pagination.totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={styles.pagination_button}
              >
                Previous
              </button>
              <span className={styles.page_info}>
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={styles.pagination_button}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      <Footer />

      {isOpen && (
        <div className={styles.overlay} onClick={() => setIsOpen(false)}>
          <aside
            className={styles.sidebar}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.crossBtn}
              onClick={() => setIsOpen(false)}
            >
              X
            </button>
            <div className={styles.filter_component_div_sidebar}>
              <Filter onFilterChange={handleFilterChange} currentFilters={filters} />
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
