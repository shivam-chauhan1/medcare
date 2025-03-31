"use client";

import { useState } from 'react';
import styles from '@/app/styles/CreateDoctor.module.css';

interface DoctorFormData {
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

export default function CreateDoctor() {
  const [formData, setFormData] = useState<DoctorFormData>({
    name: '',
    email: '',
    average_rating: 0,
    experience_year: 0,
    degree: '',
    biography: '',
    photo_url: '',
    location: '',
    specialty: [],
    disease: [],
    gender: '',
  });

  const [specialtyInput, setSpecialtyInput] = useState('');
  const [diseaseInput, setDiseaseInput] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/createDoctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Doctor created successfully!');
        setFormData({
          name: '',
          email: '',
          average_rating: 0,
          experience_year: 0,
          degree: '',
          biography: '',
          photo_url: '',
          location: '',
          specialty: [],
          disease: [],
          gender: '',
        });
      } else {
        setMessage(`Failed to create doctor: ${data.message || 'Please try again.'}`);
      }
    } catch (error) {
      setMessage('Error creating doctor. Please try again.');
    }
  };

  const addSpecialty = () => {
    if (specialtyInput && !formData.specialty.includes(specialtyInput)) {
      setFormData({ ...formData, specialty: [...formData.specialty, specialtyInput] });
      setSpecialtyInput('');
    }
  };

  const addDisease = () => {
    if (diseaseInput && !formData.disease.includes(diseaseInput)) {
      setFormData({ ...formData, disease: [...formData.disease, diseaseInput] });
      setDiseaseInput('');
    }
  };

  const removeSpecialty = (index: number) => {
    setFormData({
      ...formData,
      specialty: formData.specialty.filter((_, i) => i !== index),
    });
  };

  const removeDisease = (index: number) => {
    setFormData({
      ...formData,
      disease: formData.disease.filter((_, i) => i !== index),
    });
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create New Doctor</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Average Rating</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="5"
            value={formData.average_rating}
            onChange={(e) => setFormData({ ...formData, average_rating: parseFloat(e.target.value) })}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Experience (Years)</label>
          <input
            type="number"
            min="0"
            value={formData.experience_year}
            onChange={(e) => setFormData({ ...formData, experience_year: parseInt(e.target.value) })}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Degree</label>
          <input
            type="text"
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Biography</label>
          <textarea
            value={formData.biography}
            onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
            className={styles.textarea}
            rows={3}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Photo URL</label>
          <input
            type="url"
            value={formData.photo_url}
            onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className={styles.input}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Specialties</label>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={specialtyInput}
              onChange={(e) => setSpecialtyInput(e.target.value)}
              className={styles.input}
              placeholder="Add specialty"
            />
            <button
              type="button"
              onClick={addSpecialty}
              className={styles.addButton}
            >
              Add
            </button>
          </div>
          <div className={styles.tagContainer}>
            {formData.specialty.map((specialty, index) => (
              <span key={index} className={styles.tag}>
                {specialty}
                <button
                  type="button"
                  onClick={() => removeSpecialty(index)}
                  className={styles.tagButton}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Diseases</label>
          <div className={styles.inputGroup}>
            <input
              type="text"
              value={diseaseInput}
              onChange={(e) => setDiseaseInput(e.target.value)}
              className={styles.input}
              placeholder="Add disease"
            />
            <button
              type="button"
              onClick={addDisease}
              className={styles.addButton}
            >
              Add
            </button>
          </div>
          <div className={styles.tagContainer}>
            {formData.disease.map((disease, index) => (
              <span key={index} className={styles.tag}>
                {disease}
                <button
                  type="button"
                  onClick={() => removeDisease(index)}
                  className={styles.tagButton}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Gender</label>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            className={styles.input}
            required
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {message && (
          <div className={`${styles.message} ${message.includes('successfully') ? styles.success : styles.error}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          className={styles.submitButton}
        >
          Create Doctor
        </button>
      </form>
    </div>
  );
} 