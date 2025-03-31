import React from 'react'
import styles from '@/app/styles/Footer.module.css'
import Image from 'next/image'
import phone_logo from '@/public/images/Phone.svg'
import whatsapp_logo from '@/public/images/WhatsApp.svg'

export default function Footer() {
  return (
    <footer className={styles.footer_container}>
        <div className={styles.copyright}>
            <p>© EmScripts 2024. All Right Reserved.</p>
        </div>
        <div className={styles.social_media}>
            <Image src={phone_logo} alt='phone-icon' height={20} width={20}/>
            <Image src={whatsapp_logo} alt='whatsapp-icon' height={20} width={20}/>
        </div>
    </footer>
  )
}
