"use client";
import React, { useState } from 'react'
import styles from '@/app/styles/Filter.module.css'
import FilterGroups from './FilterGroup'

interface FilterProps {
    onFilterChange: (filters: { [key: string]: string }) => void;
    currentFilters: {
        rating: string;
        experience: string;
        gender: string;
    };
}

export default function Filter({ onFilterChange, currentFilters }: FilterProps) {
    const [resetKey, setResetKey] = useState(0);

    const handleReset = () => {
        onFilterChange({
            gender: '',
            experience: '',
            rating: '',
            specialty: ''
        });
        setResetKey(prev => prev + 1);
    };

    return (
        <div className={styles.filter_container}>
            <div className={styles.reset_container}>
                <h3>Filters By: </h3>
                <button onClick={handleReset}>Reset</button>
            </div>
            <div className={styles.lists_of_filter} key={resetKey}>
                <FilterGroups groupName="Rating" onChange={(value) => onFilterChange({ rating: value })} currentValue={currentFilters.rating} />
                <FilterGroups groupName="Year_of_Experience" onChange={(value) => onFilterChange({ experience: value })} currentValue={currentFilters.experience} />
                <FilterGroups groupName="Gender" onChange={(value) => onFilterChange({ gender: value })} currentValue={currentFilters.gender} />
            </div>
        </div>
    )
}
