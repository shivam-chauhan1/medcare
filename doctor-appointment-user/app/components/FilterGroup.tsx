import React, { useState } from 'react'
import styles from '@/app/styles/FilterGroup.module.css'
import RadioItem from './RadioItem'

interface FilterGroupProps {
  groupName: string
  onChange: (value: string) => void
  currentValue: string
}

export default function FilterGroups({ groupName, onChange, currentValue }: FilterGroupProps) {
  const handleRadioChange = (value: string) => {
    onChange(value);
  }

  return (
    <div className={styles.filterGroup_container}>
      {
        (groupName==="Year_of_Experience")?
        <p> Year of Experience</p>
        :
        <p>{groupName}</p>
      }

      {
        (groupName === 'Rating') ?
          <div className={styles.radioGroups_container}>
            <RadioItem radioName='Show all' idName='show_all_rating' name={groupName} onChange={() => handleRadioChange('')} checked={currentValue === ''} />
            <RadioItem radioName='1 star' idName='star1' name={groupName} onChange={() => handleRadioChange('1')} checked={currentValue === '1'} />
            <RadioItem radioName='2 star' idName='star2' name={groupName} onChange={() => handleRadioChange('2')} checked={currentValue === '2'} />
            <RadioItem radioName='3 star' idName='star3' name={groupName} onChange={() => handleRadioChange('3')} checked={currentValue === '3'} />
            <RadioItem radioName='4 star' idName='star4' name={groupName} onChange={() => handleRadioChange('4')} checked={currentValue === '4'} />
            <RadioItem radioName='5 star' idName='star5' name={groupName} onChange={() => handleRadioChange('5')} checked={currentValue === '5'} />
          </div>
          :
          (groupName==='Year_of_Experience')?
          <div className={styles.radioGroups_container}>
            <RadioItem radioName='15+ years' idName='years15' name={groupName} onChange={() => handleRadioChange('15+')} checked={currentValue === '15+'} />
            <RadioItem radioName='10-15 years' idName='years10' name={groupName} onChange={() => handleRadioChange('10-15')} checked={currentValue === '10-15'} />
            <RadioItem radioName='5-10 years' idName='years5' name={groupName} onChange={() => handleRadioChange('5-10')} checked={currentValue === '5-10'} />
            <RadioItem radioName='3-5 years' idName='years3' name={groupName} onChange={() => handleRadioChange('3-5')} checked={currentValue === '3-5'} />
            <RadioItem radioName='1-3 years' idName='years1' name={groupName} onChange={() => handleRadioChange('1-3')} checked={currentValue === '1-3'} />
            <RadioItem radioName='0-1 years' idName='years0' name={groupName} onChange={() => handleRadioChange('0-1')} checked={currentValue === '0-1'} />
          </div>

          : (groupName==='Gender') ?
          <div className={styles.radioGroups_container}>
            <RadioItem radioName='Show all' idName='show_all_gender' name={groupName} onChange={() => handleRadioChange('')} checked={currentValue === ''} />
            <RadioItem radioName='Male' idName='male' name={groupName} onChange={() => handleRadioChange('Male')} checked={currentValue === 'Male'} />
            <RadioItem radioName='Female' idName='female' name={groupName} onChange={() => handleRadioChange('Female')} checked={currentValue === 'Female'} />
          </div>
        :
        ""
      }
    </div>
  )
}
