'use client' // This is a client component
import Image from 'next/image'
import styles from './index.module.css'
import Header from './Header/index.js'
import TrackNavigation from './TrackNav/index.js'
import NavBar from '../NavBar/index.js'
import { useRef, useState } from 'react'

// <script type="text/javascript" src="/assets/allShabads.js"></script>
export default function ListenPage({ title, tracksObj }) {
  const [TRACK_LINKS, setTrackLinks] = useState(getTrackLinks(tracksObj))
  const [allOpts, setAllOpts] = useState(tracksObj)
  const [shuffle, setShuffle] = useState(false)
  const [tracksHistory, setTracksHistory] = useState({
    curr_ind: -1, //index in links_lst
    links_lst: [], //list of links
    curr_link: '',
  })

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

  return (
    <body id={styles.body}>
      <NavBar />
      <Header title={title} numOfTracks={TRACK_LINKS.length} />
      <FilterTracks tracks={TRACK_LINKS} />
      <ArtistsOptions
        allOpts={allOpts}
        setAllOpts={setAllOpts}
        setTrackLinks={setTrackLinks}
      />
      <TrackPlayback
        artist={getTypeOfTrack(tracksHistory.curr_link)}
        link={tracksHistory.curr_link}
        allOpts={allOpts}
      />

      <button id={styles.saveTrackBtn}>Save Track Locally</button>
      <TrackNavigation
        shuffle={shuffle}
        setShuffle={setShuffle}
        nextTrack={nextTrack}
        prevTrack={prevTrack}
      />

      <hr />
      <div id={styles.saveTrackLocalModal} className={styles.modal}>
        <div id={styles.saveTrackLocalModal_content}>
          <span id={styles.saveTrackLocalModalClose}>&times;</span>
          <label for='noteForSavedTrack'>
            Enter a note if you would like (not needed):
          </label>
          <div>
            <textarea
              multiline
              placeholder='ex: Amazing Bani at 10:00'
              id={styles.noteForSavedTrack}
            ></textarea>
          </div>
          <div>
            <button className={styles.basicBtn} onclick='saveTrack()'>
              Save
            </button>
          </div>
        </div>
      </div>

      <div id={styles.dialog} className={styles.dialog}>
        <div className={styles.dialog_content}>
          <p id={styles.formInfo}></p>
          <form
            id={styles.modal_content}
            onsubmit='formValidation(event)'
            method='post'
            action='http://45.76.2.28/trackIndex/util/addData.php'
          >
            <span id={styles.closeModal}>&times;</span>
            <div className={styles.userInputItem}>
              <label for='userDesc'>Description:</label>
              <input
                id={styles.userDesc}
                name='description'
                placeholder='bin ek naam ik chit leen'
              ></input>
            </div>
            <div className={styles.userInputItem}>
              <div className={styles.displayNone} id={styles.gurbani_line}>
                <button id={styles.only_this_line}></button>
              </div>
              <label for='usedShabadId'>Shabad ID:</label>
              <input
                list='shabadId_list_opts'
                id={styles.usedShabadId}
                name='shabadId'
                placeholder='ਤਕਮਲ'
                oninput='add_shabad_from_user_input()'
              ></input>
              <div id={styles.shabadId_list_opts}></div>
              <details id={styles.sbdDetails} className={styles.displayNone}>
                <summary>Shabad ID</summary>
                <div></div>
              </details>
            </div>
            <div class='userInputItem'>
              <label for='userTimestamp'>
                Timestamp of where Description Happened:
              </label>
              <div id={styles.userTimestamp}>
                <input
                  name='hours'
                  id={styles.hours}
                  type='number'
                  min='0'
                  max='59'
                  inputmode='numeric'
                ></input>
                :
                <input
                  name='mins'
                  id={styles.mins}
                  type='number'
                  min='0'
                  max='59'
                  inputmode='numeric'
                ></input>
                :
                <input
                  name='secs'
                  id={styles.secs}
                  type='number'
                  min='0'
                  max='59'
                  inputmode='numeric'
                ></input>
              </div>
              <div id={styles.userTimestamp}>
                <label for='hours'>hours:</label>
                <label for='mins'>minutes:</label>
                <label for='secs'>seconds</label>
              </div>
            </div>

            <button>Add</button>
          </form>
        </div>
      </div>

      <button id={styles.openModal}>Save to Global Database</button>
    </body>
  )
}

function ArtistsOptions({ allOpts, setAllOpts, setTrackLinks }) {
  const [showingOpts, setShowingOpts] = useState(true)
  const [text, setText] = useState('Hide Options')

  const artist_options = Object.keys(allOpts).map((artist) => {
    return (
      <div>
        <input
          checked={allOpts[artist].checked}
          type='checkbox'
          id={artist}
          name={artist}
          onClick={() => {
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
        <label for={artist}>{artist}</label>
      </div>
    )
  })

  return (
    <div id={styles.optionMenu} className={styles.section}>
      <button
        id={styles.toggleShowingOpts}
        onClick={() => {
          if (!showingOpts) {
            setText('Hide Options')
          } else {
            setText('Show Options')
          }

          setShowingOpts(!showingOpts)
        }}
      >
        {text}
      </button>
      {showingOpts ? (
        <div className={styles.sectionDisplay}>
          <div id={styles.tracksOpts}>
            <div id={styles.checkBtnsOpts}>
              <button
                className={styles.basicBtn}
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
                Uncheck All Options
              </button>
              <button
                className={styles.basicBtn}
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
                Check All Options
              </button>
            </div>
            {artist_options}
          </div>
        </div>
      ) : (
        <></>
      )}
    </div>
  )
}

function getTrackLinks(tracksObj) {
  const links = []
  Object.keys(tracksObj).forEach((artist) => {
    if (tracksObj[artist].checked) {
      links.push(...tracksObj[artist].trackLinks)
    }
  })
  return links
}

function FilterTracks({ tracks }) {
  const [searchInput, setSearchInput] = useState('')
  const [searchedTracks, setTracks] = useState([])
  const [showTracks, setShowing] = useState(false)

  function ShowingOfTracks() {
    if (!showTracks) return <></>
    return (
      <div className={styles.sectionDisplay} id={styles.searchResults}>
        <p>{searchedTracks.length} Results Found</p>
        <ol>
          {searchedTracks.map((link, index) => {
            return (
              <li key={index}>
                <button>{getNameOfTrack(link)}</button>
              </li>
            )
          })}
        </ol>
      </div>
    )
  }
  return (
    <div className={styles.rand}>
      <input
        placeholder='Search for Track:'
        id={styles.searchInput}
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
      <button onclick='showSavedTracks()' id={styles.showSavedTrksBtn}>
        Show Saved Tracks
      </button>
      <button
        onClick={() => {
          setSearchInput('')
          setTracks([])
          setShowing(false)
        }}
      >
        Clear Results
      </button>
      <ShowingOfTracks />
    </div>
  )
}

function TrackPlayback({ link, artist, allOpts }) {
  if (!link) return <></>
  const [currentTime, setCurrentTime] = useState('00:00')
  const [skipTime, setSkipTime] = useState(10)
  const [playPauseImg, setPlayPauseImg] = useState('/imgs/pause.png')
  const audioRef = useRef(null)

  function copyLink() {
    const url = new URL(window.location.href.split('?')[0].split('#')[0])

    function get_ind_from_artist_tracks(the_link) {
      const allLinks = allOpts[artist].trackLinks
      for (let link of allLinks) {
        if (link === the_link) return allLinks.indexOf(link)
      }
      return -1
    }

    url.searchParams.append('time', parseInt(theAudioPlayer.currentTime))
    url.searchParams.append('artist', artist)
    url.searchParams.append(
      'trackIndex',
      get_ind_from_artist_tracks(currentLink)
    )
    navigator.clipboard.writeText(url.href)
  }

  function timeUpdate(event) {
    function str_pad_left(string, pad, length) {
      return (new Array(length + 1).join(pad) + string).slice(-length)
    }
    const minutes = Math.floor(event.target.currentTime / 60)
    const seconds = Math.floor(event.target.currentTime - minutes * 60)
    const currentTime =
      str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2)
    setCurrentTime(currentTime)
  }

  return (
    <div id={styles.trackInfo} className={styles.border}>
      <h4 id={styles.trackFromWhichOpt}>{artist}</h4>
      <p>{currentTime}</p>
      <a id={styles.trackNameAtag} target='_blank' href={link}>
        {getNameOfTrack(link)}
      </a>
      <button id={styles.copyTrackBtn} onClick={copyLink}>
        Copy Track Link
      </button>
      <audio
        src={link}
        onended='playNextTrack()'
        onerror=''
        id={styles.audio}
        controls
        autoplay='true'
        onTimeUpdate={timeUpdate}
        ref={audioRef}
      ></audio>
      <div id={styles.playBackOptions}>
        <button
          onClick={() => {
            audioRef.current.currentTime -= skipTime
          }}
          className={styles.skip10btn}
        >
          <Image src='/imgs/back10.png' width={30} height={30} />
        </button>
        <button
          onClick={() => {
            if (audioRef.current.paused) {
              audioRef.current.play()
              setPlayPauseImg('/imgs/pause.png')
            } else {
              audioRef.current.pause()
              setPlayPauseImg('/imgs/play.png')
            }
          }}
          className={styles.skip10btn}
        >
          <Image src={playPauseImg} width={30} height={30} />
        </button>
        <button
          onClick={() => {
            audioRef.current.currentTime += skipTime
          }}
          className={styles.skip10btn}
        >
          <Image src='/imgs/forward10.png' width={30} height={30} />
        </button>
      </div>

      <label for='pickSkipInterval'>Skip Interval</label>
      <select
        id={styles.pickSkipInterval}
        onChange={(e) => setSkipTime(parseInt(e.target.value))}
      >
        <option value='5'>5 Seconds</option>
        <option value='10' selected>
          10 Seconds
        </option>
        <option value='15'>15 Seconds</option>
        <option value='30'>30 Seconds</option>
        <option value='60'>60 Seconds</option>
      </select>
    </div>
  )
}

function getNameOfTrack(link) {
  const title = link.split('/').slice(-1)[0]
  return decodeURIComponent(decodeURIComponent(title))
}
