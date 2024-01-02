import styles from './index.module.css'

export default function NavBar() {
  return (
    <nav className={styles.topnav}>
      <a href='/' className={styles.active}>
        Home
      </a>
      <div className={styles.dropdown}>
        <button className={styles.dropbtn}>
          Keertan
          <i class='fa fa-caret-down'></i>
        </button>
        <div className={styles.dropdown_content}>
          <a href='/Keertan/AkhandKeertan/'>Akhand Keertan</a>
          <a href='/Keertan/DarbarSahibPuratanKeertanSGPC'>
            Darbar Sahib Puratan Keertan
          </a>
          <a href='/Keertan/TimeBasedRaagKeertan/'>Time Based Raag Keertan</a>
          <a href='/Keertan/AllKeertan'>All Keertan</a>
        </div>
      </div>
      <a href='/Paath/'>Paath</a>
      <a href='/SantGianiGurbachanSinghJiSGGSKatha/'>
        Sant Giani Gurbachan Singh Ji SGGS Katha
      </a>
      <a href='/BhagatJaswantSinghJi/'>Bhagat Jaswant Singh Ji</a>
      <a href='/MiscellaneousTopics'>Miscellaneous Topics</a>
      <a href='/GianiSherSinghJi'>Giani Sher Singh Ji</a>
      <a href='http://45.76.2.28/trackIndex'>Tracks Indexed</a>
      <a
        href='javascript:void(0);'
        className={styles.icon}
        onclick='toggleDropdown()'
      >
        &#9776;
      </a>
    </nav>
  )
}
