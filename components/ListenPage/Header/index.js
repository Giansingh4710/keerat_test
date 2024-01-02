import styles from './index.module.css'

export default function Header({ numOfTracks, title }) {
  return (
    <div className={styles.border} id={styles.headingDiv}>
      <h1>{title}</h1>
      <p>Total Tracks in Queue: {numOfTracks}</p>
    </div>
  )
}
