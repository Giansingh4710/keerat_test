import ALL_THEMES from '@/utils/themes'

import { getTrackLinks } from '@/utils/helper_funcs'
import { useMemo } from 'react'

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

export default function ArtistsOptions({
  allOpts,
  setAllOpts,
  setTrackLinks,
  numOfTracks,
}) {
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

  return (
    <div style={styles.container}>
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
            }}
          >
            <CheckBoxOutlineBlankIcon />
            <p>Uncheck All</p>
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
            <p>Check All</p>
          </button>
        </div>
      </div>
      <TheOptions />
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
    display: 'flex',
    borderRadius: '1em',
  },
  trackNums: {
    flex: 1,
    fontSize: '1.5em',
  },
  checkOptsBtnsDiv: {
    flex: 1,
    margin: '0.5em',
    fontSize: '0.5em',
  },
  checkOptsBtns: {
    padding: '0.5em',
    fontSize: '0.8em',
    fontWeight: 'bold',
    borderRadius: '15px',
    ...ALL_THEMES.theme1.listenPage.ArtistsOptionsModal.checkOptsBtns,
  },
  optionsDiv: {
    display: 'flex',
    flexDirection: 'row',
    borderRadius: '1em',
    overflow: 'scroll',
    padding: '1em',
    border: '1px solid black',
    // backgroundColor: ALL_THEMES.theme1.backgroundColor
  },
  artistOption: {
    alignItems: 'center',
    fontSize: '1em',
    display: 'flex',
    margin: '0.5em',
    padding: '0.5em',
    borderRadius: '15px',
    ...ALL_THEMES.theme1.listenPage.ArtistsOptionsModal.artistOption,
  },
  checkbox: {
    flex: 1,
  },
  label: {
    // flex: 30,
    // overflowWrap: 'break-word',
    // whiteSpace: 'nowrap',
    // overflow: 'scroll',
    // padding: '0.5em',
  },
}
