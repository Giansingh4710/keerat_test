import styles from './index.module.css'

export default function NavBar() {
  const dev = !true
  const prefix = dev ? '' : '/keerat_test'
  return (
    <nav className={styles.topnav}>
      <a href={`${prefix}/`} className={styles.active}>
        Home
      </a>
      <div className={styles.dropdown}>
        <button className={styles.dropbtn}>Keertan &darr;</button>
        <div className={styles.dropdown_content}>
          <a href={`${prefix}/Keertan/AkhandKeertan/`}>Akhand Keertan</a>
          <a href={`${prefix}/Keertan/DarbarSahibPuratanKeertanSGPC`}>
            Darbar Sahib Puratan Keertan
          </a>
          <a href={`${prefix}/Keertan/TimeBasedRaagKeertan/`}>
            Time Based Raag Keertan
          </a>
          <a href={`${prefix}/Keertan/AllKeertan`}>All Keertan</a>
        </div>
      </div>
      <a href={`${prefix}/Paath/`}>Paath</a>
      <a href={`${prefix}/SantGianiGurbachanSinghJiSGGSKatha/`}>
        Sant Giani Gurbachan Singh Ji SGGS Katha
      </a>
      <a href={`${prefix}/BhagatJaswantSinghJi/`}>Bhagat Jaswant Singh Ji</a>
      <a href={`${prefix}/MiscellaneousTopics`}>Miscellaneous Topics</a>
      <a href={`${prefix}/GianiSherSinghJi`}>Giani Sher Singh Ji</a>
      <a href='http://45.76.2.28/trackIndex'>Tracks Indexed</a>
    </nav>
  )
}
