"use client";
import { useState, useEffect } from 'react';
import DoctorCard from './DoctorCard';

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

interface DoctorSearchProps {
  searchQuery: string;
  onSelectDoctor?: (doctor_id: string) => void;
}

export default function DoctorSearch({ searchQuery, onSelectDoctor }: DoctorSearchProps) {
  const [loading, setLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);

  useEffect(() => {
    const searchDoctors = async () => {
      if (!searchQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/doctor/search?search=${encodeURIComponent(searchQuery)}`,
          {
            method: 'GET',
            credentials: 'include'
          }
        );
        const data = await response.json();
        setSearchResults(data.data || []);
      } catch (error) {
        console.error('Error searching doctors:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      searchDoctors();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  if (loading) return null;
  if (!searchQuery.trim()) return null;

  return (
    <>
      {searchResults.map((doctor) => {
        console.log('working Doctor data:', doctor);
        console.log('working Doctor id: -------', doctor.doctor_id);
        return (
          <DoctorCard
            key={`search-${doctor.doctor_id}`}
            doctor={doctor}
            onAddSchedule={() => onSelectDoctor?.(doctor.doctor_id)}
          />
        );
      })}
    </>
  );
} 