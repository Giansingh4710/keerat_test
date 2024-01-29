import ALL_THEMES from '@/utils/themes'
import { Modal } from '@mui/material'
import { useState } from 'react'

import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded'
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered'
import { getNameOfTrack } from '@/utils/helper_funcs'

export default function SaveTrackModal({
  localStorageKey,
  link,
  playSpecificTrack,
}) {
  const [note, setNote] = useState('')
  const [modalOpen, setModal] = useState(false)
  const [showTracks, setShowing] = useState(false)

  function DisplayTracks() {
    if (!showTracks) return <></>

    const listStyles = {
      ol:{
        height: '10em',
        border: '1px solid white',
        borderRadius: '5px',
        overflow: 'scroll',
        paddingBottom: '1em',
      },
      p: {
        display: 'inline-block',
        paddingRight: '1em',
      },
      btn: {},
    }

    let savedTracks = localStorage.getItem(localStorageKey)
    savedTracks = JSON.parse(savedTracks)

    const listItems = []
    for (const link in savedTracks) {
      const trkMsg = savedTracks[link].replaceAll('\n', ' ')
      const trackName = getNameOfTrack(link)
      listItems.push(
        <li>
          <p style={listStyles.p}>{trkMsg}</p>
          <button
            style={listStyles.btn}
            onClick={() => playSpecificTrack(link)}
          >
            {trackName}
          </button>
        </li>
      )
    }
    if (listItems.length === 0) return <p>No Saved Tracks</p>

    return <ol style={listStyles.ol}>{listItems}</ol>
  }

  return (
    <div>
      <div style={styles.main_buttons}>
        <button style={styles.btn} onClick={() => setShowing(!showTracks)}>
          <FormatListNumberedIcon style={styles.icon} />
          <p style={styles.btnTxt}>
            {showTracks ? 'Hide Saved Tracks' : 'Show Saved Tracks'}
          </p>
        </button>
        <button style={styles.btn} onClick={() => setModal(true)}>
          <BookmarkAddedIcon style={styles.icon} />
          <p style={styles.btnTxt}>Save Track Locally</p>
        </button>
      </div>

      <DisplayTracks />

      <Modal
        open={modalOpen}
        onClose={() => setModal(false)}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <div style={styles.modalDiv} className={styles.modal}>
          <button onClick={() => setModal(false)}>
            <span style={styles.modalDivClose}>&times;</span>
          </button>
          <label htmlFor='noteForSavedTrack' style={styles.label}>
            Enter a note if you would like:
          </label>
          <div>
            <textarea
              placeholder='ex: Amazing Bani at 10:00'
              style={styles.textArea}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>
          <div>
            <button
              style={styles.btn}
              onClick={() => {
                putTrackInLocalStorage(link, note, localStorageKey)
                setModal(false)
              }}
            >
              Save
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

function putTrackInLocalStorage(link, note, localStorageKey) {
  let savedItems = localStorage.getItem(localStorageKey)
  if (!savedItems) {
    savedItems = {}
  } else {
    savedItems = JSON.parse(savedItems)
  }

  savedItems[link] = note
  localStorage.setItem(localStorageKey, JSON.stringify(savedItems))
}

const styles = {
  main_buttons: {
    paddingBottom: '2em',
    display: 'flex',
    justifyContent: 'space-evenly',
  },
  btn: {
    fontWeight: 'bold',
    borderRadius: '15px',
    ...ALL_THEMES.theme1.listenPage.SaveTrackModal.btn,
  },
  btnTxt: {
    display: 'inline-block',
    paddingLeft: '10px',
  },
  icon: {
    fontSize: '1rem',
  },
  modalDiv: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: '10px',
    padding: '20px',
    ...ALL_THEMES.theme1.listenPage.SaveTrackModal.modalDiv,
  },
  modalDivClose: {
    fontSize: '28px',
    fontWeight: 'bold',
    ...ALL_THEMES.theme1.listenPage.SaveTrackModal.modalDivClose,
  },
  label: {
    fontSize: '1.2em',
    fontWeight: 'bold',
    ...ALL_THEMES.theme1.listenPage.SaveTrackModal.label,
  },
  textArea: {
    ...ALL_THEMES.theme1.listenPage.SaveTrackModal.textArea,
  },
}
