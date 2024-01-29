import ALL_THEMES from '@/utils/themes'

import { IconButton, Typography } from '@mui/material'

import { useMemo, useRef, useState } from 'react'
import { formatTime, getNameOfTrack } from '@/utils/helper_funcs'
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
  timeToGoTo,
  album,
  audioRef,
}) {
  const [currentTime, setCurrentTime] = useState('0.0')
  const [paused, setPaused] = useState(true)
  const skipTime = useRef(5)

  function navigatorStuff() {
    const theAudioPlayer = audioRef.current
    navigator.mediaSession.setActionHandler('play', () => theAudioPlayer.play())
    navigator.mediaSession.setActionHandler('pause', () =>
      theAudioPlayer.pause()
    )

    navigator.mediaSession.setActionHandler('seekforward', () => {
      theAudioPlayer.currentTime += skipTime.current
    })
    navigator.mediaSession.setActionHandler(
      'seekbackward',
      () => (theAudioPlayer.currentTime += skipTime.current * -1)
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

    url.searchParams.append('time', parseInt(currentTime))
    url.searchParams.append('artist', artist)
    url.searchParams.append('trackIndex', get_ind_from_artist_tracks(link))
    navigator.clipboard.writeText(url.href)
  }

  function PlayPauseBtn() {
    if (paused) {
      return (
        <button
          style={styles.playbackIcon}
          onClick={() => {
            audioRef.current.play()
            setPaused(false)
          }}
        >
          <img style={styles.playbackImg} src='/playbackImgs/play.svg' />
        </button>
      )
    }

    return (
      <button
        style={styles.playbackIcon}
        onClick={() => {
          audioRef.current.pause()
          setPaused(true)
        }}
      >
        <img style={styles.playbackImg} src='/playbackImgs/pause.svg' />
      </button>
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
        onError={() => {
          alert('Error Loading Track!')
        }}
        onEnded={nextTrack}
        onLoadedData={() => {
          console.log(timeToGoTo.current, audioRef.current.duration)
          audioRef.current.currentTime = parseInt(timeToGoTo.current)
          timeToGoTo.current = 0
          navigatorStuff()
        }}
      ></audio>
    )
  }, [link])

  return (
    <div style={styles.cont}>
      <div style={styles.contLine}>
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
      <div style={styles.contLine}>
        <IconButton>
          <PersonIcon style={styles.musicIcon} />
        </IconButton>
        <TinyText>{artist}</TinyText>
      </div>
      <div style={styles.contLine}>
        <IconButton>
          <AlbumIcon style={styles.musicIcon} />
        </IconButton>
        <TinyText>{album}</TinyText>
      </div>
      <div style={styles.randomRow}>
        <p style={styles.trackTime}>
          {formatTime(currentTime)} / {formatTime(audioRef?.current?.duration)}
        </p>
        <button
          onClick={() => {
            setShuffle(!shuffle)
            localStorage.setItem('shuffle', !shuffle)
          }}
          style={{
            ...styles.btn,
            ...ALL_THEMES.theme1.listenPage.TrackPlayback.colorChangerVal(
              shuffle
            ),
          }}
        >
          <p>Shuffle: {shuffle ? 'ON' : 'OFF'}</p>
        </button>
        <button style={styles.btn} onClick={copyLink}>
          Copy Link
        </button>
      </div>
      <div style={styles.skipIntervelDiv}>
        <label htmlFor='pickSkipInterval'>Skip Interval:</label>
        <select
          style={styles.seekTimeSelect}
          id='pickSkipInterval'
          onChange={(e) => {
            skipTime.current = parseInt(e.target.value)
          }}
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
        <button onClick={prevTrack} style={styles.playbackIcon}>
          <img style={styles.playbackImg} src='/playbackImgs/left.svg' />
        </button>
        <button
          onClick={() => (audioRef.current.currentTime -= skipTime.current)}
          style={styles.playbackIcon}
        >
          <img style={styles.playbackImg} src='/playbackImgs/skip-back.svg' />
        </button>

        <PlayPauseBtn style={styles.playbackIcon} />

        <button
          onClick={() => (audioRef.current.currentTime += skipTime.current)}
          style={styles.playbackIcon}
        >
          <img
            style={styles.playbackImg}
            src='/playbackImgs/skip-forward.svg'
          />
        </button>
        <button onClick={nextTrack} style={styles.playbackIcon}>
          <img style={styles.playbackImg} src='/playbackImgs/right.svg' />
        </button>
      </div>
      {audioComponent}
    </div>
  )
}

const styles = {
  cont: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '0.5em',
    borderRadius: '0.5em',
    height: '40vh',
    marginTop: '1.5em',
    ...ALL_THEMES.theme1.listenPage.TrackPlayback.cont,
  },
  contLine: {
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
    // fontSize: '4rem',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    margin: '0',
    padding: '0.5rem',
    height: '10vh',
  },
  playbackImg: {
    width: '100%',
    height: '100%',
  },
  seekTimeSelect: {
    marginLeft: '0.5em',
    ...ALL_THEMES.theme1.listenPage.TrackPlayback.seekTimeSelect,
  },

  randomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: '0.5em',
    ...ALL_THEMES.theme1.listenPage.TrackPlayback.randomRow,
  },
  trackTime: {
    all: 'unset',
    fontSize: '0.85rem',
    alignSelf: 'center',
    flex: 1,
  },
  btn: {
    margin: '0.5em',
    fontSize: '0.8em',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '0.5em',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    ...ALL_THEMES.theme1.listenPage.TrackPlayback.btn,
  },
}

const TinyText = styled(Typography)({
  fontSize: '0.8rem',
  opacity: 0.7,
  fontWeight: 500,
  letterSpacing: 0.2,
  paddingTop: '0.5em',
})
