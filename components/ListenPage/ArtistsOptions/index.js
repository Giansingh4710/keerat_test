import ALL_THEMES from '@/utils/themes'

import { getTrackLinks } from '@/utils/helper_funcs'
import { useState } from 'react'

import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import { IconButton } from '@mui/material'

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

export default function ArtistsOptions({
  allOpts,
  setAllOpts,
  setTrackLinks,
  numOfTracks,
}) {
  const [showOpts, setShowOpts] = useState(false)
  function TheOptions() {
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
    return <div style={styles.optionsDiv}>{artist_options}</div>
  }

  if (!showOpts) {
    return (
      <button
        style={styles.checkOptsBtns}
        onClick={() => {
          setShowOpts(true)
        }}
      >
        <p>Show Options</p>
      </button>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.topRow}>
        <p style={styles.trackNums}>Total Tracks in Queue: {numOfTracks}</p>
        <IconButton style={styles.xIcon} onClick={() => setShowOpts(false)}>
          <HighlightOffIcon />
        </IconButton>
      </div>
      <TheOptions />
      <div style={styles.checkBtnsRow}>
        <button
          style={styles.checkOptsBtns}
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
          <p>Select All</p>
        </button>
        <button
          style={styles.checkOptsBtns}
          onClick={() => {
            setAllOpts((opts) => {
              Object.keys(opts).forEach((artist) => {
                opts[artist].checked = false
              })
              setTrackLinks(getTrackLinks(opts))
              return opts
            })
          }}
        >
          <p>Unselect</p>
        </button>
        <button
          style={styles.checkOptsBtns}
          onClick={() => setShowOpts(false)}
        >
          <p>Close</p>
        </button>
      </div>
    </div>
  )
}

const styles = {
  container: {
    margin: '2em',
    borderRadius: '1em',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.5em',
    padding: '1em',
    ...ALL_THEMES.theme1.listenPage.ArtistsOptionsModal.container,
  },
  topRow: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',

  },
  trackNums: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-start',
    fontSize: '2em',
  },
  xIcon: {
    ...ALL_THEMES.theme1.listenPage.SearchTracks.xIcon,
  },
  checkBtnsRow: {
    display: 'flex',
    borderRadius: '1em',
  },
  checkOptsBtns: {
    margin: '1em',
    // fontSize: '0.8em',
    // fontWeight: 'bold',
    borderRadius: '15px',
    // ...ALL_THEMES.theme1.listenPage.ArtistsOptionsModal.checkOptsBtns,
  },
  optionsDiv: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '1em',
    overflow: 'scroll',
    padding: '1em',
    border: '1px solid black',
    height: '20em',
    // backgroundColor: ALL_THEMES.theme1.backgroundColor
  },
  artistOption: {
    alignItems: 'center',
    padding: '0.5em',
    fontSize: '2em',
    display: 'flex',
    margin: '0.25em',
    borderRadius: '15px',
    ...ALL_THEMES.theme1.listenPage.ArtistsOptionsModal.artistOption,
  },
  checkbox: {
    // flex: 1,
    margin: '0.5em',
  },
  label: {
    // flex: 30,
    // overflowWrap: 'break-word',
    // whiteSpace: 'nowrap',
    // overflow: 'scroll',
    // padding: '0.5em',
  },
}
