import { useState, useEffect } from 'react';
import styles from '@/app/styles/EditModal.module.css';

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

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor;
  onUpdate: (doctorId: string, updatedData: Partial<Doctor>) => void;
}

export default function EditModal({ isOpen, onClose, doctor, onUpdate }: EditModalProps) {
  const [formData, setFormData] = useState<Partial<Doctor>>({
    name: '',
    email: '',
    experience_year: 0,
    degree: '',
    biography: '',
    photo_url: '',
    location: '',
    specialty: [],
    disease: [],
    gender: ''
  });

  const [newSpecialty, setNewSpecialty] = useState('');
  const [newDisease, setNewDisease] = useState('');

  useEffect(() => {
    if (doctor) {
      setFormData({
        name: doctor.name || '',
        email: doctor.email || '',
        experience_year: doctor.experience_year || 0,
        degree: doctor.degree || '',
        biography: doctor.biography || '',
        photo_url: doctor.photo_url || '',
        location: doctor.location || '',
        specialty: doctor.specialty || [],
        disease: doctor.disease || [],
        gender: doctor.gender || ''
      });
    }
  }, [doctor]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(doctor.doctor_id, formData);
  };

  const handleAddSpecialty = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSpecialty.trim() && !formData.specialty?.includes(newSpecialty.trim())) {
      setFormData(prev => ({
        ...prev,
        specialty: [...(prev.specialty || []), newSpecialty.trim()]
      }));
      setNewSpecialty('');
    }
  };

  const handleAddDisease = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDisease.trim() && !formData.disease?.includes(newDisease.trim())) {
      setFormData(prev => ({
        ...prev,
        disease: [...(prev.disease || []), newDisease.trim()]
      }));
      setNewDisease('');
    }
  };

  const handleRemoveSpecialty = (specialtyToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      specialty: prev.specialty?.filter(s => s !== specialtyToRemove) || []
    }));
  };

  const handleRemoveDisease = (diseaseToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      disease: prev.disease?.filter(d => d !== diseaseToRemove) || []
    }));
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2>Edit Doctor Details</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={styles.input}
                placeholder="Enter doctor's name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={styles.input}
                placeholder="Enter doctor's email"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="degree">Degree</label>
              <input
                type="text"
                id="degree"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className={styles.input}
                placeholder="Enter doctor's degree"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="experience">Years of Experience</label>
              <input
                type="number"
                id="experience"
                value={formData.experience_year}
                onChange={(e) => setFormData({ ...formData, experience_year: Number(e.target.value) })}
                className={styles.input}
                placeholder="Enter years of experience"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className={styles.input}
                placeholder="Enter doctor's location"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className={styles.input}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="biography">Biography</label>
            <textarea
              id="biography"
              value={formData.biography}
              onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
              className={styles.textarea}
              rows={4}
              placeholder="Enter doctor's biography"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Specialties</label>
            <div className={styles.tagInputContainer}>
              <div className={styles.tagInputWrapper}>
                <input
                  type="text"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  className={styles.tagInput}
                  placeholder="Add a specialty and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSpecialty(e);
                    }
                  }}
                />
                <button 
                  type="button"
                  onClick={(e) => handleAddSpecialty(e)}
                  className={styles.addButton}
                >
                  Add
                </button>
              </div>
              <div className={styles.tagList}>
                {formData.specialty?.map((spec) => (
                  <span key={spec} className={styles.tag}>
                    {spec}
                    <button
                      type="button"
                      onClick={() => handleRemoveSpecialty(spec)}
                      className={styles.removeTag}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Diseases Treated</label>
            <div className={styles.tagInputContainer}>
              <div className={styles.tagInputWrapper}>
                <input
                  type="text"
                  value={newDisease}
                  onChange={(e) => setNewDisease(e.target.value)}
                  className={styles.tagInput}
                  placeholder="Add a disease and press Enter"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDisease(e);
                    }
                  }}
                />
                <button 
                  type="button"
                  onClick={(e) => handleAddDisease(e)}
                  className={styles.addButton}
                >
                  Add
                </button>
              </div>
              <div className={styles.tagList}>
                {formData.disease?.map((dis) => (
                  <span key={dis} className={styles.tag}>
                    {dis}
                    <button
                      type="button"
                      onClick={() => handleRemoveDisease(dis)}
                      className={styles.removeTag}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.modalFooter}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 