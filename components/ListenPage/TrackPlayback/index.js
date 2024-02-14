import ALL_THEMES from '@/utils/themes'
import { getPrefixForProd } from '@/utils/helper_funcs'

import { IconButton, Typography } from '@mui/material'

import { useMemo, useRef, useState } from 'react'
import { formatTime, getNameOfTrack } from '@/utils/helper_funcs'
import { styled } from '@mui/material/styles'

import toast, { Toaster } from 'react-hot-toast'

import AudiotrackIcon from '@mui/icons-material/Audiotrack'
import PersonIcon from '@mui/icons-material/Person'
import AccessTimeIcon from '@mui/icons-material/AccessTime'

const prefix = getPrefixForProd()

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
    toast.success(`Link with timestamp: ${formatTime(currentTime)} Copied`)
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
          <img
            src={`${prefix}/playbackImgs/play.svg`}
            style={styles.playbackImg}
          />
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
        <img
          src={`${prefix}/playbackImgs/pause.svg`}
          style={styles.playbackImg}
        />
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
          toast.error('Error Loading Track!')
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

  const shuffleImg = useMemo(() => {
    let imgSrc = `${prefix}/playbackImgs/inorder.svg`
    if (shuffle) {
      imgSrc = `${prefix}/playbackImgs/shuffle.svg`
    }
    return <img src={imgSrc} style={styles.randomRowBtns} />
  }, [shuffle])

  const playPauseBtn = useMemo(() => <PlayPauseBtn />, [paused])

  return (
    <div style={styles.cont}>
      <Toaster position='top-left' reverseOrder={true} />
      <div style={styles.trackInfo}>
        <div style={styles.contLine}>
          <IconButton
            onClick={async () => {
              await navigator.clipboard.writeText(link)
              toast.success('Copied Raw Link to Clipboard!')
            }}
          >
            <AudiotrackIcon style={styles.musicIcon} />
          </IconButton>
          <a style={styles.trackNameAtag} target='_blank' href={link}>
            {getNameOfTrack(link)}
          </a>
        </div>
        <div style={styles.contLine}>
          <IconButton
            onClick={() => {
              toast.success(`Dhan ${artist}!`)
            }}
          >
            <PersonIcon style={styles.musicIcon} />
          </IconButton>
          <TinyText>{artist}</TinyText>
        </div>
        <div style={styles.contLine}>
          <IconButton
            onClick={() => {
              toast.success(`At ${formatTime(currentTime)} = ${currentTime}!`)
            }}
          >
            <AccessTimeIcon style={styles.musicIcon} />
          </IconButton>
          <TinyText>
            {formatTime(currentTime)} /{' '}
            {formatTime(audioRef?.current?.duration)}
          </TinyText>
        </div>
      </div>
      {audioComponent}
      <div style={styles.randomRow}>
        <button
          onClick={() => {
            setShuffle(!shuffle)
            localStorage.setItem('shuffle', !shuffle)
            toast.success('Shuffle ' + (!shuffle ? 'Enabled' : 'Disabled'))
          }}
          style={styles.btn}
        >
          {shuffleImg}
        </button>

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
        <button style={styles.btn} onClick={copyLink}>
          <img src={`${prefix}/playbackImgs/copy.svg`} style={styles.randomRowBtns} />
        </button>
      </div>
      <div style={styles.playBackOptions}>
        <button onClick={prevTrack} style={styles.playbackIcon}>
          <img
            src={`${prefix}/playbackImgs/left.svg`}
            style={styles.playbackImg}
          />
        </button>
        <button
          onClick={() => (audioRef.current.currentTime -= skipTime.current)}
          style={styles.playbackIcon}
        >
          <img
            src={`${prefix}/playbackImgs/skip-back.svg`}
            style={styles.playbackImg}
          />
        </button>

        {playPauseBtn}

        <button
          onClick={() => (audioRef.current.currentTime += skipTime.current)}
          style={styles.playbackIcon}
        >
          <img
            src={`${prefix}/playbackImgs/skip-forward.svg`}
            style={styles.playbackImg}
          />
        </button>
        <button onClick={nextTrack} style={styles.playbackIcon}>
          <img
            src={`${prefix}/playbackImgs/right.svg`}
            style={styles.playbackImg}
          />
        </button>
      </div>
    </div>
  )
}

const styles = {
  cont: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '0.5em',
    // height: '40vh',
    // marginTop: '1.5em',
    backgroundColor: ALL_THEMES.theme1.third,
    color: ALL_THEMES.theme1.text2,

    border: "3px solid #34568b",
    borderRadius: '1.5em',
  },
  trackInfo: {
    flex: 4,
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
    color: ALL_THEMES.theme1.text2,
  },
  seekTimeSelect: {
    marginLeft: '0.5em',
    color: ALL_THEMES.theme1.text1,
  },
  audio: {
    width: '100%',
    height: '100%',
    margin: '1em 0',
  },
  playBackOptions: {
    display: 'flex',
    width: '100%',
  },
  playbackIcon: {
    flex: 1,
    border: 'none',
    background: 'none',
    cursor: 'pointer',
    margin: '0',
    padding: '0.5rem',
    height: '7vh',
  },
  playbackImg: {
    width: '100%',
    height: '100%',
  },
  randomRow: {
    flex: 2,
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    borderRadius: '0.5em',
    // marginButtom: '1.5em',
    backgroundColor: ALL_THEMES.theme1.primary,
  },
  randomRowBtns: {
    width: '100%',
    height: '220%',
  },
  btn: {
    // border: 'none',
    padding: '0.5rem',
    height: '4vh',
    margin: '0.5em',

    fontSize: '0.8em',
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '0.5em',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    color: ALL_THEMES.theme1.text2,
    backgroundColor: ALL_THEMES.theme1.third,
  },
}

const TinyText = styled(Typography)({
  fontSize: '0.8rem',
  opacity: 0.7,
  fontWeight: 500,
  letterSpacing: 0.2,
  paddingTop: '0.5em',
})