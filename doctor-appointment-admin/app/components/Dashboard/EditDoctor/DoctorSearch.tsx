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
  onSelectDoctor?: (doctor: Doctor) => void;
  isRemoveMode?: boolean;
}

export default function DoctorSearch({ searchQuery, onSelectDoctor, isRemoveMode }: DoctorSearchProps) {
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
        
        // Map the data to include both _id and doctor_id
        const mappedDoctors = data.data.map((doctor: any) => ({
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
        }));
        
        setSearchResults(mappedDoctors);
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
      {searchResults.map((doctor) => (
        <DoctorCard
          key={`search-${doctor.doctor_id}`}
          doctor={doctor}
          onEdit={() => onSelectDoctor?.(doctor)}
          isRemoveMode={isRemoveMode}
        />
      ))}
    </>
  );
} 