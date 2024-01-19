import { Button, IconButton, Typography } from '@mui/material'

import { useMemo, useState } from 'react'
import { formatTime, getNameOfTrack } from '../../../helper_funcs.js'
import { styled } from '@mui/material/styles'

import AudiotrackIcon from '@mui/icons-material/Audiotrack'
import PersonIcon from '@mui/icons-material/Person'
import AlbumIcon from '@mui/icons-material/Album'

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
  album,
}) {
  const [currentTime, setCurrentTime] = useState('0.0')
  const [skipTime, setSkipTime] = useState(10)
  const [paused, setPaused] = useState(true)

  function navigatorStuff() {
    function skipTrackTime(direction) {
      theAudioPlayer.currentTime += skipTime * direction
    }
    const theAudioPlayer = audioRef.current
    navigator.mediaSession.setActionHandler('play', () => theAudioPlayer.play())
    navigator.mediaSession.setActionHandler('pause', () =>
      theAudioPlayer.pause()
    )

    navigator.mediaSession.setActionHandler('seekforward', () =>
      skipTrackTime(1)
    )
    navigator.mediaSession.setActionHandler('seekbackward', () =>
      skipTrackTime(-1)
    )
    navigator.mediaSession.setActionHandler('previoustrack', prevTrack)
    navigator.mediaSession.setActionHandler('nexttrack', nextTrack)

    navigator.mediaSession.setActionHandler('seekto', function (event) {
      theAudioPlayer.currentTime = event.seekTime
    })

    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: getNameOfTrack(link),
        artist: artist,
        album: album,
      })
    }
  }

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

  function PlayPauseBtn({ style }) {
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
      return (
        <IconButton onClick={onclick} style={style}>
          <PlayArrowRounded style={style} />
        </IconButton>
      )
    }

    return (
      <IconButton onClick={onclick} style={style}>
        <PauseRounded style={style} />
      </IconButton>
    )
  }

  const audioComponent = useMemo(() => {
    return (
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
          navigatorStuff()
        }}
      ></audio>
    )
  }, [])

  return (
    <div style={styles.trackInfo}>
      <div style={styles.trackInfoLine}>
        <IconButton
          onClick={async () => {
            await navigator.clipboard.writeText(link)
            alert('Copied Raw Link to Clipboard:')
          }}
        >
          <AudiotrackIcon style={styles.musicIcon} />
        </IconButton>
        <a style={styles.trackNameAtag} target='_blank' href={link}>
          {getNameOfTrack(link)}
        </a>
      </div>
      <div style={styles.trackInfoLine}>
        <IconButton>
          <PersonIcon style={styles.musicIcon} />
        </IconButton>
        <TinyText>{artist}</TinyText>
      </div>
      <div style={styles.trackInfoLine}>
        <IconButton>
          <AlbumIcon style={styles.musicIcon} />
        </IconButton>
        <TinyText>{album}</TinyText>
      </div>
      <div style={styles.randomRow}>
        <p style={styles.trackTime}>
          {formatTime(currentTime)} / {formatTime(audioRef?.current?.duration)}
        </p>
        <Button
          onClick={() => {
            setShuffle(!shuffle)
          }}
          style={{
            ...styles.btn,
            backgroundColor: !shuffle ? '#1565c0' : '#c07015',
          }}
        >
          <p>Shuffle: {shuffle ? 'ON' : 'OFF'}</p>
        </Button>
        <Button variant='contained' style={styles.btn} onClick={copyLink}>
          Copy Link
        </Button>
      </div>
      <div style={styles.skipIntervelDiv}>
        <label htmlFor='pickSkipInterval'>Skip Interval:</label>
        <select
          style={styles.seekTimeSelect}
          id='pickSkipInterval'
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
      <div style={styles.playBackOptions}>
        <IconButton onClick={prevTrack} style={styles.playbackIcon}>
          <SkipPreviousIcon style={styles.playbackIcon} />
        </IconButton>

        <IconButton
          onClick={() => (audioRef.current.currentTime -= skipTime)}
          style={styles.playbackIcon}
        >
          <FastRewindIcon style={styles.playbackIcon} />
        </IconButton>

        <PlayPauseBtn style={styles.playbackIcon} />

        <IconButton
          onClick={() => (audioRef.current.currentTime += skipTime)}
          style={styles.playbackIcon}
        >
          <FastForwardIcon style={styles.playbackIcon} />
        </IconButton>

        <IconButton onClick={nextTrack} style={styles.playbackIcon}>
          <SkipNextIcon style={styles.playbackIcon} />
        </IconButton>
      </div>
      {audioComponent}
    </div>
  )
}

const styles = {
  trackInfo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',

    backgroundColor: '#E4922C',
    padding: '0.5em',
    borderRadius: '0.5em',
    height: '40vh',
    marginTop: '1.5em',
  },
  trackInfoLine: {
    display: 'flex',
    paddingTop: '0.5em',
  },
  musicIcon: {
    fontSize: '1rem',
    paddingRight: '0.5em',
  },
  trackNameAtag: {
    // all: "unset",
    wordBreak: 'break-all',
    fontWeight: 500,
    letterSpacing: 0.2,
    fontSize: '0.85rem',
    paddingTop: '0.5em',
  },
  skipIntervelDiv: {
    display: 'flex',
    alignSelf: 'center',
    justifyContent: 'center',
    padding: '0.5em',
  },
  audio: {
    width: '100%',
  },
  playBackOptions: {
    display: 'flex',
    width: '100%',
  },
  playbackIcon: {
    flex: 1,
    fontSize: '3rem',
  },
  seekTimeSelect: {
    color: 'black',
    marginLeft: '0.5em',
  },

  randomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'navy',
    borderRadius: '0.5em',
  },
  trackTime: {
    all: 'unset',
    fontSize: '0.85rem',
    alignSelf: 'center',
    flex: 1,
    // backgroundColor: '#1565c0',
  },
  btn: {
    margin: '0.5em',
    fontSize: '0.5em',
    display: 'flex',
    flexDirection: 'column',
    padding: '2px',
    flex: 1,
  },
}

const TinyText = styled(Typography)({
  fontSize: '0.8rem',
  opacity: 0.7,
  fontWeight: 500,
  letterSpacing: 0.2,
  paddingTop: '0.5em',
})
