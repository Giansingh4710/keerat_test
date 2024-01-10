import { Button, ToggleButton } from '@mui/material'
import { useEffect, useRef, useState } from "react";
import { getNameOfTrack } from "../../../helper_funcs.js";
import Image from "next/image";


export default function TrackPlayback({
  shuffle,
  setShuffle,
  nextTrack,
  prevTrack,

  link, artist, allOpts, audioRef
}) {
  const [currentTime, setCurrentTime] = useState('0.0')
  const [skipTime, setSkipTime] = useState(10)
  const [playPauseImg, setPlayPauseImg] = useState('/imgs/pause.png')

  if (!link) return <></>

  function copyLink() {
    const url = new URL(window.location.href.split('?')[0].split('#')[0])

    function get_ind_from_artist_tracks(the_link) {
      const allLinks = allOpts[artist].trackLinks
      for (let link of allLinks) {
        if (link === the_link) return allLinks.indexOf(link)
      }
      return -1
    }

    url.searchParams.append('time', currentTime)
    url.searchParams.append('artist', artist)
    url.searchParams.append('trackIndex', get_ind_from_artist_tracks(link))
    navigator.clipboard.writeText(url.href)
  }

  function formatTime(timeInSeconds) {
    function str_pad_left(string, pad, length) {
      return (new Array(length + 1).join(pad) + string).slice(-length)
    }
    const minutes = Math.floor(timeInSeconds / 60)
    const seconds = Math.floor(timeInSeconds - minutes * 60)
    const currentTime =
      str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2)
    return currentTime
  }

  function NextImg() {
    const removeStyles = {
      all: 'unset',
    }
    if (shuffle) {
      return <p style={removeStyles}>Next &#8633;</p>
    }
    return <p style={removeStyles}>Next &rarr;</p>
  }

  return (
    <>
      <div className='border' style={styles.trackInfo}>
        <h4>{artist}</h4>
        <p>{formatTime(currentTime)}</p>
        <a style={styles.trackNameAtag} target='_blank' href={link}>
          {getNameOfTrack(link)}
        </a>
        <button style={styles.copyTrackBtn} onClick={copyLink}>
          Copy Track Link
        </button>
        <audio
          src={link}
          style={styles.audio}
          ref={audioRef}
          controls={true}
          autoPlay={true}
          onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
          onended='playNextTrack()'
          onerror=''
        ></audio>
        <div style={styles.playBackOptions}>
          <button
            onClick={() => {
              audioRef.current.currentTime -= skipTime
            }}
            style={styles.skip10btn}
          >
            <Image
              alt='Back Button'
              src='/imgs/back10.png'
              width={30}
              height={30}
            />
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
            style={styles.skip10btn}
          >
            <Image
              alt='Play Pause Button'
              src={playPauseImg}
              width={30}
              height={30}
            />
          </button>
          <button
            onClick={() => {
              audioRef.current.currentTime += skipTime
            }}
            style={styles.skip10btn}
          >
            <Image
              alt='Forward Button'
              src='/imgs/forward10.png'
              width={30}
              height={30}
            />
          </button>
        </div>

        <label htmlFor='pickSkipInterval'>Skip Interval</label>
        <select
          style={styles.seekTimeSelect}
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

      <Button variant="contained">
        Save Track Locally
      </Button>
      <div style={styles.containerStyle}>
        <ToggleButton
          value='shuffleButton'
          onClick={() => {
            setShuffle(!shuffle)
          }}
          size='small'
          style={{
            ...styles.shuffle,
            backgroundColor: !shuffle ? '#1565c0' : '#c07015',
          }}
        >
          <p>Shuffle: {shuffle ? 'ON' : 'OFF'}</p>
        </ToggleButton>
        <div>
          <Button onClick={prevTrack} variant='contained'>
            &#8592; Back
          </Button>
          <Button onClick={nextTrack} variant='contained'>
            <NextImg />
          </Button>
        </div>
      </div>
    </>
  )
}

const styles = {
  containerStyle: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px', // Adjust the overall padding as needed
  },
  shuffle: {
    backgroundColor: '#1565c0',
    fontSize: '0.5em',
    display: 'flex',
    flexDirection: 'column',
    padding: '2px',
  },

  trackInfo: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  trackNameAtag: {
    // all: "unset",
    width: "90%",
    wordWrap: "break-word",
    fontWeight: "bold",
    // margin: "1em",
  },
  copyTrackBtn: {
    color: "black",
  },
  audio: {
    width: "100%",
  },
  playBackOptions: {
    display: "flex", 
    justifyContent: "space-around"
  },
  skip10btn: { borderRadius: "50%", margin: "1em" },
  seekTimeSelect:{
    color: "black",
  }

}

