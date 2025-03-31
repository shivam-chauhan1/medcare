import { useState, useEffect } from 'react';
import styles from '@/app/styles/AddSchedule.module.css';
import DoctorCard from './DoctorCard';
import DoctorSearch from './DoctorSearch';
import ScheduleForm from './ScheduleForm';

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

export default function AddSchedule() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [initialTotalPages, setInitialTotalPages] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchDoctors = async (page: number = 1) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/doctor/search?pageNo=${page}`,
        {
          method: 'GET',
          credentials: 'include'
        }
      );
      const data: ApiResponse = await response.json();
      
      if (data?.data) {
        const mappedDoctors = data.data.map((doctor: DoctorResponse) => ({
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
        setDoctors(mappedDoctors);
        
        // Store initial totalPages only on first load
        if (page === 1) {
          setInitialTotalPages(data.totalPages);
        }
      } else {
        setDoctors([]);
      }
      
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setDoctors([]);
      alert('Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors(1);
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Add Doctor Schedule</h2>
      
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search doctors by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={styles.searchInput}
        />
      </div>

      <div className={styles.doctorGrid}>
        {searchQuery ? (
          <DoctorSearch 
            searchQuery={searchQuery}
            onSelectDoctor={(doctor_id) => {
              const doctor = doctors.find(d => d.doctor_id === doctor_id);
              if (doctor) {
                setSelectedDoctor(doctor);
                setShowScheduleForm(true);
              }
            }}
          />
        ) : (
          doctors.map((doctor) => (
            <DoctorCard
              key={`schedule-${doctor.doctor_id}`}
              doctor={doctor}
              onAddSchedule={() => {
                setSelectedDoctor(doctor);
                setShowScheduleForm(true);
              }}
            />
          ))
        )}
      </div>

      {initialTotalPages > 1 && (
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

      {showScheduleForm && selectedDoctor && (
        <ScheduleForm
          doctor={selectedDoctor}
          onClose={() => {
            setShowScheduleForm(false);
            setSelectedDoctor(null);
          }}
          onSuccess={() => {
            setShowScheduleForm(false);
            setSelectedDoctor(null);
            fetchDoctors(currentPage);
          }}
        />
      )}
    </div>
  );
} 