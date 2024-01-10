import { ToggleButton } from '@mui/material'
import Typography from '@mui/material/Typography'

import { useState } from 'react'
import { formatTime, getNameOfTrack } from '../../../helper_funcs.js'
import { styled, useTheme } from '@mui/material/styles'

import PauseRounded from '@mui/icons-material/PauseRounded'
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded'

import FastForwardIcon from '@mui/icons-material/FastForward'
import FastRewindIcon from '@mui/icons-material/FastRewind'

import SkipNextIcon from '@mui/icons-material/SkipNext'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'

export default function TrackPlayback({
  shuffle,
  setShuffle,
  nextTrack,
  prevTrack,

  link,
  artist,
  allOpts,
  audioRef,
  timeToGoTo,
}) {
  const [currentTime, setCurrentTime] = useState('0.0')
  const [skipTime, setSkipTime] = useState(10)
  const [paused, setPaused] = useState(true)

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

  function PlayPauseBtn() {
    function onclick() {
      if (paused) {
        audioRef.current.play()
        setPaused(false)
      } else {
        audioRef.current.pause()
        setPaused(true)
      }
    }

    if (paused) {
      return <PlayArrowRounded onClick={onclick} style={styles.iconStyle} />
    }

    return <PauseRounded onClick={onclick} style={styles.iconStyle} />
  }

  return (
    <div className='border' style={styles.container}>
      <div style={styles.trackInfo}>
        <div style={styles.trackInfoLine1}>
          <a style={styles.trackNameAtag} target='_blank' href={link}>
            {getNameOfTrack(link)}
          </a>
          <button style={styles.copyTrackBtn} onClick={copyLink}>
            Copy Track Link
          </button>
        </div>
        <TinyText>{artist}</TinyText>
        <div>
          <p style={styles.trackTime}>
            {formatTime(currentTime)} /{' '}
            {formatTime(audioRef?.current?.duration)}
          </p>
        </div>
      </div>

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
      <div style={styles.playBackOptions}>
        <SkipPreviousIcon onClick={prevTrack} style={styles.iconStyle} />
        <FastRewindIcon
          style={styles.iconStyle}
          onClick={() => {
            audioRef.current.currentTime -= skipTime
          }}
        />
        <PlayPauseBtn />
        <FastForwardIcon
          onClick={() => {
            audioRef.current.currentTime += skipTime
          }}
          style={styles.iconStyle}
        />
        <SkipNextIcon onClick={nextTrack} style={styles.iconStyle} />
      </div>
      <audio
        src={link}
        style={styles.audio}
        ref={audioRef}
        controls={true}
        autoPlay={true}
        onPause={() => setPaused(true)}
        onPlay={() => setPaused(false)}
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        onError={() => {}}
        onEnded={nextTrack}
        onLoadedData={() => {
          console.log(timeToGoTo.current, audioRef.current.duration)
          audioRef.current.currentTime = parseInt(timeToGoTo.current)
          timeToGoTo.current = 0
        }}
      ></audio>

      <label htmlFor='pickSkipInterval'>Skip Interval</label>
      <select
        style={styles.seekTimeSelect}
        id={styles.pickSkipInterval}
        onChange={(e) => setSkipTime(parseInt(e.target.value))}
      >
        <option value='5'>5 Seconds</option>
        <option value='10' defaultValue>
          10 Seconds
        </option>
        <option value='30'>30 Seconds</option>
        <option value='60'>60 Seconds</option>
      </select>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  shuffle: {
    backgroundColor: '#1565c0',
    fontSize: '0.5em',
    display: 'flex',
    flexDirection: 'column',
    padding: '2px',
  },
  trackInfo: {
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#E4922C',
    alignItems: 'flex-start',
    padding: '0.5em',
  },
  trackInfoLine1:{ },
  trackNameAtag: {
    // all: "unset",
    wordWrap: 'break-word',
    fontWeight: 'bold',
    fontSize: '1rem',
    fontWeight: 500,
    letterSpacing: 0.2,
    paddingRight: '1em',
  },
  trackTime: {
    all: 'unset',
    fontSize: '0.75rem',
  },
  copyTrackBtn: {
    color: 'black',
  },
  audio: {
    width: '100%',
  },
  playBackOptions: {
    display: 'flex',
  },
  iconStyle: {
    flex: 1,
    fontSize: '3rem',
    // backgroundColor: 'red',
  },
  seekTimeSelect: {
    color: 'black',
  },
}

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
})
