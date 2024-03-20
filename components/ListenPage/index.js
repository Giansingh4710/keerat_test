'use client'

import ALL_THEMES from '@/utils/themes'

import NavBar from '../NavBar/index.js'
import Sidebar from '../Sidebar/index.js'

import ArtistsOptions from './ArtistsOptions/index.js'
import TrackPlayback from './TrackPlayback/index.js'
import SaveTrackModal from './SaveTrackModal/index.js'
import SearchTracks from './SearchTracks/index.js'
import ChangeColorsModal from './ChangeColorsModal/index.js'
import IndexTrackBtnAndModal from './IndexTrackModal/index.js'

import { Suspense, useEffect, useRef, useState } from 'react'
import {
  formatTime,
  getNameOfTrack,
  getTrackLinks,
} from '@/utils/helper_funcs.js'

export default function ListenPage({ title, tracksObj }) {
  const [TRACK_LINKS, setTrackLinks] = useState(getTrackLinks(tracksObj))
  const [allOpts, setAllOpts] = useState(tracksObj)

  const [shuffle, setShuffle] = useState(false) // audio track stuff
  const timeToGoTo = useRef(0)
  const audioRef = useRef(null)
  const skipTime = useRef(10)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = nextTrack
    }
  }, [audioRef?.current])

  const [tracksHistory, setTracksHistory] = useState({
    curr_ind: -1, //index in links_lst
    links_lst: [], //list of links
    curr_link: '',
    curr_artist: '',
  })

  useEffect(() => {
    function urlStuff() {
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
        if (urlTime) timeToGoTo.current = parseInt(urlTime)
        return true
      }
      return false
    }

    function getTrackLocalStorage() {
      const link = localStorage.getItem(`LastPlayed: ${title}`)
      const time = localStorage.getItem(`LastTime: ${title}`)
      // localStorage.getItem("LastPlayed: Classic Akhand Keertan")
      console.log('link: ', link)
      console.log('time: ', time)

      if (!link || typeof link != String) return false

      playSpecificTrack(link)
      if (time) timeToGoTo.current = parseInt(time)
      return true
    }

    function getShuffle() {
      if (localStorage.getItem('shuffle') === 'true') setShuffle(true)
    }

    getShuffle()
    if (!urlStuff()) {
      if (!getTrackLocalStorage()) {
        // nextTrack()
        randTrack()
      }
    }

    window.onbeforeunload = saveTrackInLocalStorage
  }, [])

  //to get rid of next.js Hydration error
  const [showChild, setShowChild] = useState(false)
  useEffect(() => {
    setShowChild(true)
  }, [])
  if (!showChild) return <body />

  function getLongestTrack() {
    let longestLink = ""
    for(let i=0; i<TRACK_LINKS.length; i++) {
      longestLink = TRACK_LINKS[i].length > longestLink.length ? TRACK_LINKS[i] : longestLink
    }
    console.log('longestLink: ', longestLink)
    return longestLink
  }

  function saveTrackInLocalStorage(link, time) {
    if (!link) {
      link = tracksHistory.curr_link
    }
    if (!time) {
      time = audioRef.current.currentTime
    }
    localStorage.setItem(`LastPlayed: ${title}`, link)
    localStorage.setItem(`LastTime: ${title}`, time)
    console.log('saved localStorage: ', link, time)
    return null
  }

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

  function navigatorStuff(link, artist) {
    navigator.mediaSession.setActionHandler('play', () =>
      audioRef.current.play(),
    )
    navigator.mediaSession.setActionHandler('pause', () =>
      audioRef.current.pause(),
    )

    navigator.mediaSession.setActionHandler('seekforward', () => {
      audioRef.current.currentTime += skipTime.current
    })
    navigator.mediaSession.setActionHandler(
      'seekbackward',
      () => (audioRef.current.currentTime += skipTime.current * -1),
    )
    navigator.mediaSession.setActionHandler('previoustrack', prevTrack)
    navigator.mediaSession.setActionHandler('nexttrack', nextTrack)

    navigator.mediaSession.setActionHandler('seekto', function (event) {
      audioRef.current.currentTime = event.seekTime
    })

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: getNameOfTrack(link),
        artist: artist,
        album: title,
      })
    }
  }

  function playTrack(curr_ind, curr_link, links_lst) {
    const curr_artist = getTypeOfTrack(curr_link)
    setTracksHistory({
      curr_ind,
      curr_link,
      links_lst,
      curr_artist,
    })
    navigatorStuff(curr_link, curr_artist)
    saveTrackInLocalStorage(curr_link, '0')
  }

  function randTrack() {
    const randNum = Math.floor(Math.random() * TRACK_LINKS.length)
    const curr_link = TRACK_LINKS[randNum]
    const curr_ind = tracksHistory.links_lst.length
    const links_lst = [...tracksHistory.links_lst, curr_link]
    playTrack(curr_ind, curr_link, links_lst)
  }

  function nextTrack() {
    let curr_ind
    let curr_link
    let links_lst

    if (tracksHistory.curr_ind === tracksHistory.links_lst.length - 1) {
      if (shuffle) {
        randTrack()
        return
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
        backgroundColor: ALL_THEMES.theme1.primary,
      }}
    >
      <NavBar title={title} />
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
      <Suspense fallback={<div>Getting Track...</div>}>
        <TrackPlayback
          artist={tracksHistory.curr_artist}
          link={tracksHistory.curr_link}
          allOpts={allOpts}
          shuffle={shuffle}
          setShuffle={setShuffle}
          nextTrack={nextTrack}
          prevTrack={prevTrack}
          timeToGoTo={timeToGoTo}
          audioRef={audioRef}
          skipTime={skipTime}
        />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
        <IndexTrackBtnAndModal
          artist={tracksHistory.curr_artist}
          link={tracksHistory.curr_link}
        />
      </Suspense>
      <ChangeColorsModal />
    </body>
  )
}
