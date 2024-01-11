'use client'

import styles from './index.module.css'
import ArtistsOptions from './ArtistsOptions/index.js'
import TrackPlayback from './TrackPlayback/index.js'
import NavBar from '../NavBar/index.js'
import SaveTrackModal from './SaveTrackModal/index.js'
import IndexTrackModal from './IndexTrackModal/index.js'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@mui/material'
import { getNameOfTrack, getTrackLinks } from '../../helper_funcs.js'

export default function ListenPage({ title, tracksObj }) {
  const [TRACK_LINKS, setTrackLinks] = useState(getTrackLinks(tracksObj))
  const [allOpts, setAllOpts] = useState(tracksObj)
  const [saveTracksModal, setSaveTracksModal] = useState(false)
  const [indexTracksModal, setIndexTrackModal] = useState(!false)
  const [showingOpts, setShowingOpts] = useState(false)

  const [shuffle, setShuffle] = useState(false) // audio track stuff
  const audioRef = useRef(null)
  const timeToGoTo = useRef(0)

  const [tracksHistory, setTracksHistory] = useState({
    curr_ind: -1, //index in links_lst
    links_lst: [], //list of links
    curr_link: '',
  })

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const urlInd = parseInt(urlParams.get('trackIndex'))
    const urlArtist = urlParams.get('artist')
    const urlTime = urlParams.get('time')
    const urlSearch = urlParams.get('search')

    if (urlArtist && allOpts[urlArtist].checked === false) {
      setAllOpts({
        ...allOpts,
        [urlArtist]: {
          trackLinks: allOpts[urlArtist].trackLinks,
          checked: true,
        },
      })
    }

    if (urlInd > -1) {
      const the_link = allOpts[urlArtist].trackLinks[urlInd]

      playSpecificTrack(the_link)

      if (urlTime) {
        timeToGoTo.current = parseInt(urlTime)
      }
      return
    }
    nextTrack()
  }, [])

  function getTypeOfTrack(link) {
    let trackType = 'Unable To Get Info'
    const ind = TRACK_LINKS.indexOf(link)
    if (ind > -1) {
      let totalTrack = 0
      for (const opt in allOpts) {
        if (allOpts[opt].checked) {
          const len = allOpts[opt].trackLinks.length
          totalTrack += len
          if (ind <= totalTrack) {
            trackType = opt
            break
          }
        }
      }
    }
    return trackType
  }

  function nextTrack() {
    let curr_ind
    let curr_link
    let links_lst

    if (tracksHistory.curr_ind === tracksHistory.links_lst.length - 1) {
      if (shuffle) {
        const randNum = Math.floor(Math.random() * TRACK_LINKS.length)
        curr_link = TRACK_LINKS[randNum]
        curr_ind = tracksHistory.links_lst.length
        links_lst = [...tracksHistory.links_lst, curr_link]
      } else {
        const indOfCurrLink = TRACK_LINKS.indexOf(tracksHistory.curr_link)
        let indOfNextLink = indOfCurrLink + 1
        indOfNextLink =
          indOfNextLink > TRACK_LINKS.length - 1 ? 0 : indOfNextLink

        curr_link = TRACK_LINKS[indOfNextLink]
        curr_ind = tracksHistory.curr_ind + 1
        links_lst = [...tracksHistory.links_lst, curr_link]
      }
    } else {
      curr_ind = tracksHistory.curr_ind + 1
      curr_link = tracksHistory.links_lst[curr_ind]
      links_lst = tracksHistory.links_lst
    }

    setTracksHistory({
      curr_ind,
      curr_link,
      links_lst,
    })
    console.log('After Next', { curr_ind, curr_link, links_lst })
  }

  function prevTrack() {
    console.log('Before Prev', tracksHistory)
    let curr_ind
    let curr_link
    let links_lst

    if (tracksHistory.curr_ind === 0) {
      const indOfCurrLink = TRACK_LINKS.indexOf(tracksHistory.curr_link)
      let indOfNextLink = indOfCurrLink - 1
      indOfNextLink = indOfNextLink < 0 ? TRACK_LINKS.length - 1 : indOfNextLink

      curr_ind = 0
      curr_link = TRACK_LINKS[indOfNextLink]
      links_lst = [curr_link, ...tracksHistory.links_lst]
    } else if (tracksHistory.curr_ind > 0) {
      curr_ind = tracksHistory.curr_ind - 1
      curr_link = tracksHistory.links_lst[curr_ind]
      links_lst = tracksHistory.links_lst
    }

    setTracksHistory({
      curr_ind,
      curr_link,
      links_lst,
    })
    console.log('After Prev', { curr_ind, curr_link, links_lst })
  }

  function playSpecificTrack(link) {
    let ind = tracksHistory.curr_ind
    ind = ind === -1 ? 0 : ind

    const linksLst = tracksHistory.links_lst
    const updated = [...linksLst.slice(0, ind), link, ...linksLst.slice(ind)]
    setTracksHistory({
      curr_ind: ind, //same as old
      curr_link: link,
      links_lst: updated,
    })
  }

  return (
    <body id={styles.body}>
      <NavBar />
      <FilterTracks
        tracks={TRACK_LINKS}
        playSpecificTrack={playSpecificTrack}
        localStorageKey={title}
      />
      <Button variant='contained' onClick={() => setShowingOpts(!showingOpts)}>
        {showingOpts ? 'Show Options' : 'Hide Options'}
      </Button>
      <ArtistsOptions
        allOpts={allOpts}
        setAllOpts={setAllOpts}
        setTrackLinks={setTrackLinks}
        numOfTracks={TRACK_LINKS.length}
        showingOpts={showingOpts}
        setShowingOpts={setShowingOpts}
      />
      <TrackPlayback
        artist={getTypeOfTrack(tracksHistory.curr_link)}
        link={tracksHistory.curr_link}
        allOpts={allOpts}
        audioRef={audioRef}
        shuffle={shuffle}
        setShuffle={setShuffle}
        nextTrack={nextTrack}
        prevTrack={prevTrack}
        timeToGoTo={timeToGoTo}
        album={title}
      />

      <Button variant='contained' onClick={() => setSaveTracksModal(true)}>
        Save Track Locally
      </Button>
      <SaveTrackModal
        modalOpen={saveTracksModal}
        setModal={setSaveTracksModal}
        localStorageKey={`SavedTracks: ${title}`}
        link={tracksHistory.curr_link}
      />
      <br />
      <hr />
      <IndexTrackModal
        modalOpen={indexTracksModal}
        setModal={setIndexTrackModal}
        artist={getTypeOfTrack(tracksHistory.curr_link)}
        link={tracksHistory.curr_link}
      />
      <Button variant='contained' onClick={() => setIndexTrackModal(true)}>
        Save to Global Database
      </Button>
    </body>
  )
}

function FilterTracks({ tracks, playSpecificTrack, localStorageKey }) {
  const [searchInput, setSearchInput] = useState('')
  const [searchedTracks, setTracks] = useState([])
  const [showTracks, setShowing] = useState(false)

  const styles = {
    searchInput: {
      color: 'black',
      width: '95%',
      padding: '10px',
      border: '1px solid #ccc',
      borderRadius: '10px',
      fontSize: '1em',
      textAlign: 'center',
    },
  }

  function ShowingOfTracks() {
    if (!showTracks) return <></>
    const styles = {
      btn: {
        color: 'black',
      },
    }
    return (
      <div className='sectionDisplay'>
        <p>{searchedTracks.length} Results Found</p>
        <ol>
          {searchedTracks.map((link, index) => {
            return (
              <li key={index}>
                <button
                  style={styles.btn}
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
    <div>
      <input
        placeholder='Search for Track:'
        style={styles.searchInput}
        value={searchInput}
        onInput={(e) => {
          setSearchInput(e.target.value)
          if (e.target.value === '') {
            setTracks([])
            setShowing(false)
            return
          }
          const searchWordsLst = e.target.value.toLowerCase().split(' ')
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
          setTracks(allLinksWithWordInds)
          setShowing(true)
        }}
      />
      <Button
        onClick={() => {
          let savedTracks = localStorage.getItem(
            `SavedTracks: ${localStorageKey}`
          )
          savedTracks = JSON.parse(savedTracks)

          const links = []
          for (const link in savedTracks) {
            const trkMsg = savedTracks[link].replaceAll('\n', ' ')
            links.push(link)
          }
          setTracks(links)
          setShowing(true)
        }}
        variant='outlined'
      >
        Show Saved Tracks
      </Button>
      <Button
        variant='outlined'
        onClick={() => {
          setSearchInput('')
          setTracks([])
          setShowing(false)
        }}
      >
        Clear Results
      </Button>
      <ShowingOfTracks />
    </div>
  )
}
