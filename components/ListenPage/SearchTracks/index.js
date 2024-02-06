import ALL_THEMES from '@/utils/themes'
import { useState } from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import SearchIcon from '@mui/icons-material/Search'

import { IconButton } from '@mui/material'
import { getNameOfTrack } from '@/utils/helper_funcs'

export default function SearchTracks({ tracks, playSpecificTrack }) {
  const [searchInput, setSearchInput] = useState('')

  const styles = {
    cont: {
      padding: '1em',
    },
    topRow: {
      display: 'flex',
      paddingBottom: '0.5em',
    },
    searchInput: {
      flex: 5,
      alignSelf: 'center',
      borderRadius: '5px',
      padding: '5px',
      fontSize: '1em',
      color: ALL_THEMES.theme1.text2,
    },
    xIcon: {
      flex: 1,
      paddingLeft: '1em',
      alignSelf: 'center',
      color: ALL_THEMES.theme1.text1,
    },
  }

  function ShowingOfTracks() {
    if (searchInput === '') {
      return <></>
    }
    const searchWordsLst = searchInput.toLowerCase().split(' ')
    const allLinksWithWordInds = []
    tracks.forEach((link, index) => {
      /* const trackName = getNameOfTrack(link) */
      const trackName = link.toLowerCase()
      let allWordsInTrackName = true
      for (const word of searchWordsLst) {
        if (!trackName.includes(word)) {
          allWordsInTrackName = false
          break
        }
      }
      if (allWordsInTrackName) {
        // allLinksWithWordInds.push(index)
        allLinksWithWordInds.push(link)
      }
    })
    
    const lstStyles = {
      cont:{
        height: '200px',
        overflow: 'scroll',
        border: '1px solid white',
        borderRadius: '5px',
        color: ALL_THEMES.theme1.text1,
      },
      btn: {
        fontSize: '0.5em',
      },
    }

    return (
      <div style={lstStyles.cont}>
        <p>{allLinksWithWordInds.length} Results Found</p>
        <ol>
          {allLinksWithWordInds.map((link, index) => {
            return (
              <li key={index}>
                <button
                  style={lstStyles.btn}
                  onClick={() => {
                    playSpecificTrack(link)
                  }}
                >
                  {getNameOfTrack(link)}
                </button>
              </li>
            )
          })}
        </ol>
      </div>
    )
  }

  return (
    <div style={styles.cont}>
      <div style={styles.topRow}>
        <input
          placeholder='Search for Track:'
          style={styles.searchInput}
          value={searchInput}
          onInput={(e) => setSearchInput(e.target.value)}
        />
        <IconButton style={styles.xIcon} onClick={() => setSearchInput('')}>
          <HighlightOffIcon />
        </IconButton>
      </div>
      <ShowingOfTracks />
    </div>
  )
}
