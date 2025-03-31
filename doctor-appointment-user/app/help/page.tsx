"use client";
import styles from "./page.module.css";

export default function HelpRoute() {
  return (
    <div className={styles.helpContainer}>
      <div className={styles.headerSection}>
        <div className={styles.headerIcon}>
          <div className={styles.iconPlaceholder}>
            <span>⚕️</span>
          </div>
        </div>
        <h1>Emergency Help & Contacts</h1>
        <p className={styles.subheading}>
          Quick access to emergency services and urgent care
        </p>
      </div>

      <div className={styles.emergencyCallSection}>
        <div className={styles.emergencyCall}>
          <span className={styles.emergencyLabel}>Emergency Helpline:</span>
          <a href="tel:911" className={styles.emergencyNumber}>
            911
          </a>
        </div>
        <p className={styles.callInfo}>
          For life-threatening emergencies, call 911 immediately
        </p>
      </div>

      <div className={styles.contactCardsContainer}>
        <div className={styles.contactCard}>
          <div className={styles.iconContainer}>
            <span className={styles.emoji}>🚑</span>
          </div>
          <h3>Ambulance Services</h3>
          <a href="tel:999" className={styles.contactNumber}>
            999
          </a>
          <p>Available 24/7 for medical emergencies</p>
        </div>

        <div className={styles.contactCard}>
          <div className={styles.iconContainer}>
            <span className={styles.emoji}>🏥</span>
          </div>
          <h3>Urgent Care Line</h3>
          <a href="tel:18001234567" className={styles.contactNumber}>
            1-800-123-4567
          </a>
          <p>For non-life-threatening but urgent medical concerns</p>
        </div>

        <div className={styles.contactCard}>
          <div className={styles.iconContainer}>
            <span className={styles.emoji}>📞</span>
          </div>
          <h3>MedCare Support</h3>
          <a href="tel:18889876543" className={styles.contactNumber}>
            1-888-987-6543
          </a>
          <p>Technical support and appointment assistance</p>
        </div>
      </div>

      <div className={styles.nearbyHospitalsSection}>
        <h2>Nearby Emergency Facilities</h2>
        <div className={styles.hospitalsList}>
          <div className={styles.hospitalItem}>
            <h4>City General Hospital</h4>
            <p>1234 Main Street, Cityville</p>
            <p>Open 24/7</p>
            <div className={styles.hospitalActions}>
              <a href="tel:15551234567" className={styles.actionButton}>
                Call
              </a>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionButton}
              >
                Directions
              </a>
            </div>
          </div>

          <div className={styles.hospitalItem}>
            <h4>Memorial Medical Center</h4>
            <p>5678 Oak Avenue, Townsburg</p>
            <p>Open 24/7</p>
            <div className={styles.hospitalActions}>
              <a href="tel:15559876543" className={styles.actionButton}>
                Call
              </a>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionButton}
              >
                Directions
              </a>
            </div>
          </div>

          <div className={styles.hospitalItem}>
            <h4>Community Urgent Care</h4>
            <p>910 Pine Boulevard, Villageton</p>
            <p>Hours: 8am - 10pm</p>
            <div className={styles.hospitalActions}>
              <a href="tel:15551112222" className={styles.actionButton}>
                Call
              </a>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.actionButton}
              >
                Directions
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.helpfulTipsSection}>
        <h2>Emergency Preparation Tips</h2>
        <ul className={styles.tipsList}>
          <li>
            Keep important medical information and emergency contacts accessible
          </li>
          <li>Know the location of the nearest emergency room</li>
          <li>Have a basic first aid kit at home</li>
          <li>Learn basic CPR and first aid techniques</li>
          <li>Keep a list of current medications and allergies</li>
        </ul>
      </div>

      <div className={styles.disclaimerSection}>
        <p>
          <strong>Disclaimer:</strong> In case of a medical emergency, please
          call emergency services immediately. This page provides general
          information and should not replace professional medical advice.
        </p>
      </div>
    </div>
  );
}
