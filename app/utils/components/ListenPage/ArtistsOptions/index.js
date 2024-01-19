import { IconButton, Modal } from '@mui/material'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { getTrackLinks } from '../../../helper_funcs.js'
import { useState } from 'react'

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount'

export default function ArtistsOptions({
  allOpts,
  setAllOpts,
  setTrackLinks,
  numOfTracks,
  modalOpen,
  setModal,
}) {
  const artist_options = Object.keys(allOpts).map((artist) => {
    return (
      <div key={artist} style={styles.artistOption}>
        <input
          checked={allOpts[artist].checked}
          style={styles.checkbox}
          type='checkbox'
          id={artist}
          onChange={() => {
            setAllOpts(() => {
              const newObj = {
                ...allOpts,
                [artist]: {
                  trackLinks: allOpts[artist].trackLinks,
                  checked: !allOpts[artist].checked,
                },
              }
              setTrackLinks(getTrackLinks(newObj))
              return newObj
            })
          }}
        />
        <label style={styles.label} htmlFor={artist}>
          {artist}
        </label>
      </div>
    )
  })

  function TheModal() {
    return (
      <Modal open={modalOpen} onClose={() => setModal(false)}>
        <div style={styles.sectionDisplay}>
          <div style={styles.topRow}>
            <div style={styles.checkOptsBtnsDiv}>
              <button
                style={styles.checkOptsBtns}
                variant='contained'
                onClick={() => {
                  setAllOpts((opts) => {
                    Object.keys(opts).forEach((artist) => {
                      opts[artist].checked = false
                    })
                    setTrackLinks(getTrackLinks(opts))
                    return opts
                  })
                  setModal(true)
                }}
              >
                <CheckBoxOutlineBlankIcon />
                Uncheck All
              </button>
            </div>
            <p style={styles.trackNums}>Total Tracks in Queue: {numOfTracks}</p>
            <div style={styles.checkOptsBtnsDiv}>
              <button
                style={styles.checkOptsBtns}
                variant='contained'
                onClick={() => {
                  setAllOpts((opts) => {
                    Object.keys(opts).forEach((artist) => {
                      opts[artist].checked = true
                    })
                    setTrackLinks(getTrackLinks(opts))
                    return opts
                  })
                }}
              >
                <CheckBoxIcon />
                Check All
              </button>
            </div>
            <IconButton onClick={() => setModal(false)}>
              <HighlightOffIcon />
            </IconButton>
          </div>
          <div style={styles.optionsDiv}>{artist_options}</div>
        </div>
      </Modal>
    )
  }

  return (
    <>
      <div style={btnStyles.cont}>
        <button style={btnStyles.btn} onClick={() => setModal(!modalOpen)}>
          <SwitchAccountIcon style={btnStyles.icon} />
          <p style={btnStyles.p}>
            {modalOpen ? 'Hide Options' : 'Show Options'}
          </p>
        </button>
      </div>
      <TheModal />
    </>
  )
}

const btnStyles = {
  cont: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    display: 'flex',
    fontWeight: 'bold',
    borderRadius: '15px',
    marginTop: '2em',
    backgroundColor: '#1565c0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {},
  p: {},
}

const styles = {
  sectionDisplay: {
    margin: '1em',
    borderRadius: '1em',
    backgroundColor: 'navy',
    color: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    // height: '10em',
  },
  topRow: {
    display: 'flex',
    backgroundColor: '#E4952D',
    borderRadius: '1em',
  },
  trackNums: {
    flex: 1,
    fontSize: '1.0em',
  },
  checkOptsBtnsDiv: {
    flex: 1,
    margin: '0.5em',
    fontSize: '0.5em',
  },
  checkOptsBtns: {
    margin: '1em',
    padding: '0.5em',
    fontSize: '0.8em',
    color: 'black',
    fontWeight: 'bold',
    borderRadius: '15px',
    backgroundColor: '#1565c0',
  },
  optionsDiv: {
    display: 'flex',
    margin: '1em',
    borderRadius: '1em',
    flexDirection: 'column',
    height: '50vh',
    overflow: 'scroll',
  },
  artistOption: {
    flex: 3,
    fontSize: '1em',
    display: 'flex',
    backgroundColor: '#E4952D',
  },
  checkbox: {
    flex: 1,
  },
  label: {
    flex: 30,
    overflowWrap: 'break-word',
    whiteSpace: 'nowrap',
    overflow: 'scroll',
    padding: '0.5em',
  },
}
