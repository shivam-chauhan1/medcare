"use client";

import { useState, useEffect } from 'react';
import styles from '@/app/styles/RemoveDoctor.module.css';
import searchStyles from '@/app/styles/SearchBar.module.css';
import DoctorCard from '../EditDoctor/DoctorCard';
import DoctorSearch from '../EditDoctor/DoctorSearch';

interface Doctor {
  _id?: string;
  doctor_id: string;
  name: string;
  email: string;
  average_rating: number;
  experience_year: number;
  degree: string;
  biography: string;
  photo_url: string;
  location: string;
  specialty: string[];
  disease: string[];
  gender: string;
}

interface DoctorResponse {
  doctor_id: string;
  name: string;
  email: string;
  average_rating: number;
  experience_year: number;
  degree: string;
  biography: string;
  photo_url: string;
  location: string;
  disease: string[];
  specialty: string[];
  gender: string;
}

interface ApiResponse {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  data: DoctorResponse[];
}

export default function RemoveDoctor() {
  const [searchQuery, setSearchQuery] = useState('');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [initialTotalPages, setInitialTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchDoctors = async (page: number = 1) => {
    setLoading(true);
    try {
      console.log('Fetching all doctors, page:', page);
      const response = await fetch(
        `http://localhost:5000/doctor/search?pageNo=${page}`,
        {
          method: 'GET',
          credentials: 'include'
        }
      );
      const data: ApiResponse = await response.json();
      console.log('Fetch API Response:', data);
      
      if (data?.data) {
        console.log('Mapping doctors data:', data.data);
        const mappedDoctors = data.data.map((doctor: DoctorResponse) => {
          console.log('Mapping doctor:', doctor);
          return {
            _id: doctor.doctor_id,
            doctor_id: doctor.doctor_id,
            name: doctor.name,
            email: doctor.email,
            average_rating: doctor.average_rating,
            experience_year: doctor.experience_year,
            degree: doctor.degree,
            biography: doctor.biography,
            photo_url: doctor.photo_url,
            location: doctor.location,
            specialty: doctor.specialty,
            disease: doctor.disease,
            gender: doctor.gender
          };
        });
        console.log('Mapped doctors result:', mappedDoctors);
        setDoctors(mappedDoctors);
        
        // Store initial totalPages only on first load
        if (page === 1) {
          setInitialTotalPages(data.totalPages);
        }
      } else {
        console.log('No data in fetch response');
        setDoctors([]);
      }
      
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
      alert('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    console.log('RemoveDoctor component mounted');
    fetchDoctors(1);
  }, []);

  const handleRemoveDoctor = async (doctor: Doctor) => {
    if (!confirm(`Are you sure you want to remove ${doctor.name}?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/removeDoctor/${doctor.doctor_id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to remove doctor');
      }

      // Refresh the doctor list
      fetchDoctors(1);
    } catch (error) {
      console.error('Error removing doctor:', error);
      alert('Failed to remove doctor');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Remove Doctor</h2>
      
      <div className={searchStyles.searchContainer}>
        <span className={searchStyles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder="Search doctors by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={searchStyles.searchInput}
        />
      </div>

      <div className={styles.doctorGrid}>
        {searchQuery ? (
          <DoctorSearch 
            searchQuery={searchQuery}
            onSelectDoctor={handleRemoveDoctor}
            isRemoveMode={true}
          />
        ) : (
          doctors.map((doctor) => (
            <DoctorCard
              key={`remove-${doctor.doctor_id}`}
              doctor={doctor}
              onEdit={() => handleRemoveDoctor(doctor)}
              isRemoveMode={true}
            />
          ))
        )}
      </div>

      {!searchQuery && initialTotalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: initialTotalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => fetchDoctors(page)}
              className={`${styles.pageButton} ${
                currentPage === page ? styles.active : ''
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 