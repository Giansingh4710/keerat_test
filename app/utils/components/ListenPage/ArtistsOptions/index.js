import { Button } from '@mui/material'
import { getTrackLinks } from '../../../helper_funcs.js'

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'
import CheckBoxIcon from '@mui/icons-material/CheckBox'

export default function ArtistsOptions({
  allOpts,
  setAllOpts,
  setTrackLinks,
  numOfTracks,
  showingOpts,
}) {
  if (!showingOpts) return <></>

  const artist_options = Object.keys(allOpts).map((artist) => {
    return (
      <div key={artist} style={styles.artistOption}>
        <input
          checked={allOpts[artist].checked}
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
        <label htmlFor={artist}>{artist}</label>
      </div>
    )
  })

  return (
    <div style={styles.sectionDisplay}>
      <div style={styles.topRow}>
        <div style={styles.checkOptsBtnsDiv}>
          <Button
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
            Uncheck All
          </Button>
        </div>
        <p style={styles.trackNums}>Total Tracks in Queue: {numOfTracks}</p>
        <div style={styles.checkOptsBtnsDiv}>
          <Button
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
          </Button>
        </div>
      </div>
      <div style={styles.optionsDiv}>{artist_options}</div>
    </div>
  )
}

const styles = {
  sectionDisplay: {
    margin: '1em',
    borderRadius: '1em',
    backgroundColor: 'navy',
    color: 'white',
  },
  topRow: {
    display: 'flex',
    backgroundColor: '#E4952D',
    borderRadius: '1em',
  },
  trackNums: {
    flex: 1,
    fontSize: '1.0em',
    // backgroundColor: 'white',
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
  },

  optionsDiv: {
    display: 'flex',
    alignItems: 'flex-start',
    marginLeft: '5em',
    overflowY: 'scroll',
    overflowX: 'scroll',
    flexDirection: 'column',
    height: '10em',
  },
  artistOption: {
    flex: 1,
  },
}
