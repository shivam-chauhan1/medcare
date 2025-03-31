import { useState, useEffect } from 'react';
import styles from '@/app/styles/ApprovalList.module.css';
import FilterBar from './FilterBar';
import AppointmentList from './AppointmentList';
import Pagination from './Pagination';

interface Appointment {
  appointment_id: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  booking_type: 'virtual' | 'in-person';
  patient_name: string;
  patient_age: number;
  health_description: string;
  doctor_name: string;
}

interface Filters {
  date: string;
  doctor_name: string;
  shift: 'morning' | 'evening' | '';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
}

export default function ApprovalList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    date: '',
    doctor_name: '',
    shift: '',
    status: 'pending'
  });

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        pageNo: currentPage.toString(),
        ...filters
      });

      const response = await fetch(
        `http://localhost:5000/approval?${queryParams.toString()}`,
        { 
          method: 'GET',
          credentials: 'include'
        }
      );
      const data = await response.json();
      
      setAppointments(data.data);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      alert('Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [currentPage, filters]);

  const handleStatusUpdate = async (appointmentId: string, newStatus: string) => {
    try {
      const appointment = appointments.find(apt => apt.appointment_id === appointmentId);
      if (!appointment) return;

      const requestBody = newStatus === 'cancelled' 
        ? {
            status: newStatus,
            start_time: appointment.start_time.replace(/^0+(\d+):(\d+):00$/, '$1:$2')
          }
        : {
            status: newStatus
          };

      const response = await fetch(
        `http://localhost:5000/approval/${appointmentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
          credentials: 'include'
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update appointment status');
      }

      // Update local state
      setAppointments(appointments.map(apt => 
        apt.appointment_id === appointmentId
          ? { ...apt, status: newStatus as Appointment['status'] }
          : apt
      ));

      alert('Appointment status updated successfully');
    } catch (error) {
      console.error('Error updating appointment status:', error);
      alert('Failed to update appointment status');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Appointment Approval List</h2>
      
      <FilterBar 
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
        }}
      />

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <>
          <AppointmentList
            appointments={appointments}
            onStatusUpdate={handleStatusUpdate}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
} 