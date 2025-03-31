"use client"
import Image from 'next/image'
import React from 'react'
import styles from '@/app/styles/Header.module.css'
import frame_logo from '@/public/images/Frame.svg'
import hamburger_logo from '@/public/images/hamburger.svg'
import NavButtons from './NavButtons'
import NavLinks from './NavLinks'
import { useState } from 'react'
export default function Header() {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <header className={styles.header}>
            <nav className={styles.nav}>
                <div className={styles.nav_links}>
                    <div className={styles.nav_links_logo}>
                        <Image src={frame_logo} alt='logo' height={40} width={40} />
                        <p>MedCare</p>
                    </div>
                    <div className={styles.navLinks_component}>
                        <NavLinks />
                    </div>
                </div>
                <div className={styles.navButton_component}>
                    <NavButtons />
                </div>

                <div className={styles.hamburger} onClick={() => setIsOpen(true)}>
                    <div className={styles.navButton_component}>
                        <NavButtons />
                    </div>
                    <Image src={hamburger_logo} alt="hamburger" height={40} width={40} />
                </div>

            </nav>

            {isOpen && (
                <div className={styles.overlay} onClick={() => setIsOpen(false)}>
                    <aside className={styles.sidebar} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.crossBtn} onClick={() => setIsOpen(false)}>X</button>

                        <div className={styles.navLinks_component}>
                            <NavLinks />
                        </div>
                        <div className={styles.navButton_component}>
                            <NavButtons />
                        </div>
                    </aside>
                </div>
            )}

        </header>
    )
}
