import React from 'react'
import styles from '@/app/styles/RadioItem.module.css'

interface RadioItemProps {
    radioName: string;
    idName: string;
    name: string;
    onChange: () => void;
    checked?: boolean;
}

export default function RadioItem({ radioName, idName, name, onChange, checked }: RadioItemProps) {
    return (
        <div className={styles.radio_container}>
            <input
                type="radio"
                id={idName}
                name={name}
                onChange={onChange}
                checked={checked}
            />
            <label htmlFor={idName}>{radioName}</label>
        </div>
    );
}
