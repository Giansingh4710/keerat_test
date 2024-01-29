'use client'

import ALL_THEMES from '@/utils/themes'

import ArtistsOptions from './ArtistsOptions/index.js'
import TrackPlayback from './TrackPlayback/index.js'
import NavBar from '../NavBar/index.js'
import SaveTrackModal from './SaveTrackModal/index.js'
import SearchTracks from './SearchTracks/index.js'
import IndexTrackBtnAndModal from './IndexTrackModal/index.js'

import { useEffect, useRef, useState } from 'react'
import { getTrackLinks } from '@/utils/helper_funcs.js'

export default function ListenPage({ title, tracksObj }) {
  const [TRACK_LINKS, setTrackLinks] = useState(getTrackLinks(tracksObj))
  const [allOpts, setAllOpts] = useState(tracksObj)

  const [shuffle, setShuffle] = useState(false) // audio track stuff
  const audioRef = useRef(null)
  const timeToGoTo = useRef(0)


  const [tracksHistory, setTracksHistory] = useState({
    curr_ind: -1, //index in links_lst
    links_lst: [], //list of links
    curr_link: '',
    curr_artist: '',
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

  function playTrack(curr_ind, curr_link, links_lst) {
    const curr_artist = getTypeOfTrack(curr_link)
    setTracksHistory({
      curr_ind,
      curr_link,
      links_lst,
      curr_artist,
    })
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

    playTrack(curr_ind, curr_link, links_lst)
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

    playTrack(curr_ind, curr_link, links_lst)
    console.log('After Prev', { curr_ind, curr_link, links_lst })
  }

  function playSpecificTrack(link) {
    let ind = tracksHistory.curr_ind
    ind = ind === -1 ? 0 : ind

    const linksLst = tracksHistory.links_lst
    const updatedLinksLst = [
      ...linksLst.slice(0, ind),
      link,
      ...linksLst.slice(ind),
    ]

    playTrack(ind, link, updatedLinksLst)
  }

  return (
    <body
      style={{
        backgroundColor: ALL_THEMES.theme1.backgroundColor,
      }}
    >
      <NavBar />
      <SearchTracks
        tracks={TRACK_LINKS}
        playSpecificTrack={playSpecificTrack}
      />
      <SaveTrackModal
        localStorageKey={`SavedTracks: ${title}`}
        link={tracksHistory.curr_link}
        playSpecificTrack={playSpecificTrack}
      />
      <ArtistsOptions
        allOpts={allOpts}
        setAllOpts={setAllOpts}
        setTrackLinks={setTrackLinks}
        numOfTracks={TRACK_LINKS.length}
      />
      <TrackPlayback
        artist={tracksHistory.curr_artist}
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
      <IndexTrackBtnAndModal
        artist={tracksHistory.curr_artist}
        link={tracksHistory.curr_link}
      />
    </body>
  )
}
