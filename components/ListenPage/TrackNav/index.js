import styles from './index.module.css'

export default function TrackNavigation({
  shuffle,
  setShuffle,
  nextTrack,
  prevTrack,
}) {
  return (
    <div>
      <button className={styles.basicBtn} onClick={prevTrack}>
        &#8592; Back
      </button>
      <button
        id={styles.shuffleBtn}
        className={styles.basicBtn}
        onClick={() => setShuffle(!shuffle)}
      >
        <img src='/imgs/shuffle_icon.png' />
        <p>Shuffle: {shuffle ? 'ON' : 'OFF'}</p>
      </button>
      <button className={styles.basicBtn} onClick={nextTrack}>
        Next &rarr;
      </button>
    </div>
  )
}
