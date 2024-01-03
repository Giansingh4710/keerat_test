import Image from 'next/image'
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
        <Image
          alt='shuffle button'
          src='/imgs/shuffle_icon.png'
          width={20}
          height={20}
        />
        <p>Shuffle: {shuffle ? 'ON' : 'OFF'}</p>
      </button>
      <button className={styles.basicBtn} onClick={nextTrack}>
        Next &rarr;
      </button>
    </div>
  )
}
