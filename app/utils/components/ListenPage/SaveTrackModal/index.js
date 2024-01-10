import { Button, Modal } from '@mui/material'
import { useState } from 'react'

export default function SaveTrackModal({ modalOpen, setModal, localStorageKey, link }) {
  const [note, setNote] = useState('')
  return (
    <Modal
      open={modalOpen}
      onClose={() => setModal(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <div style={styles.saveTrackLocalModal} className={styles.modal}>
        <button onClick={() => setModal(false)}>
          <span style={styles.saveTrackLocalModalClose}>&times;</span>
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
          <Button
            onClick={() => {
              putTrackInLocalStorage(link, note, localStorageKey)
              setModal(false)
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
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
  saveTrackLocalModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    backgroundColor: '#fefefe',
    borderRadius: '10px',
    padding: '20px',
  },
  saveTrackLocalModalClose: {
    color: 'black',
    fontSize: '28px',
    fontWeight: 'bold',
  },
  label: {
    color: 'black',
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  textArea: {
    color: 'black',
  },
}
