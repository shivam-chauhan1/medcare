import { useState, useEffect } from 'react';
import styles from '@/app/styles/EditDoctor.module.css';
import searchStyles from '@/app/styles/SearchBar.module.css';
import DoctorCard from './DoctorCard';
import EditModal from './EditModal';
import DoctorSearch from './DoctorSearch';

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

interface EditDoctorProps {
  onDoctorUpdated?: () => void;
}

export default function EditDoctor({ onDoctorUpdated }: EditDoctorProps) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [initialTotalPages, setInitialTotalPages] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Initial load
  useEffect(() => {
    console.log('EditDoctor component mounted');
    fetchDoctors(1);
  }, []);

  const handleDoctorSelect = (doctor: Doctor) => {
    console.log('Opening modal for doctor:', doctor);
    setSelectedDoctor(doctor);
    setShowEditModal(true);
  };

  const handleUpdateDoctor = async (doctorId: string, updatedData: Partial<Doctor>) => {
    try {
      console.log('Updating doctor:', doctorId, updatedData);
      const response = await fetch(`http://localhost:5000/updateDoctor/${doctorId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to update doctor');
      }

      setDoctors(doctors.map(doc => 
        doc.doctor_id === doctorId ? { ...doc, ...updatedData } : doc
      ));

      setShowEditModal(false);
      setSelectedDoctor(null);
      alert('Doctor updated successfully!');
      // Refresh the doctor list after update
      fetchDoctors(currentPage);
      if (onDoctorUpdated) {
        onDoctorUpdated();
      }
    } catch (error) {
      console.error('Error updating doctor:', error);
      alert('Failed to update doctor');
    }
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setShowEditModal(false);
    setSelectedDoctor(null);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Edit Doctor</h2>
      
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
            onSelectDoctor={(doctor) => {
              setSelectedDoctor(doctor);
              setShowEditModal(true);
            }}
          />
        ) : (
          doctors.map((doctor) => (
            <DoctorCard
              key={`edit-${doctor.doctor_id}`}
              doctor={doctor}
              onEdit={() => {
                setSelectedDoctor(doctor);
                setShowEditModal(true);
              }}
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

      {showEditModal && selectedDoctor && (
        <EditModal
          isOpen={showEditModal}
          doctor={selectedDoctor}
          onClose={handleCloseModal}
          onUpdate={handleUpdateDoctor}
        />
      )}
    </div>
  );
} 