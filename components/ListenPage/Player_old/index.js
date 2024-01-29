import * as React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import PauseRounded from '@mui/icons-material/PauseRounded'
import PlayArrowRounded from '@mui/icons-material/PlayArrowRounded'
import FastForwardRounded from '@mui/icons-material/FastForwardRounded'
import FastRewindRounded from '@mui/icons-material/FastRewindRounded'
import VolumeUpRounded from '@mui/icons-material/VolumeUpRounded'
import VolumeDownRounded from '@mui/icons-material/VolumeDownRounded'

const Widget = styled('div')(({ theme }) => ({
  padding: 16,
  borderRadius: 16,
  width: 343,
  maxWidth: '100%',
  margin: 'auto',
  position: 'relative',
  zIndex: 1,
  backgroundColor:
    theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.4)',
  backdropFilter: 'blur(40px)',
}))

const CoverImage = styled('div')({
  width: 100,
  height: 100,
  objectFit: 'cover',
  overflow: 'hidden',
  flexShrink: 0,
  borderRadius: 8,
  backgroundColor: 'rgba(0,0,0,0.08)',
  '& > img': {
    width: '100%',
  },
})

const TinyText = styled(Typography)({
  fontSize: '0.75rem',
  opacity: 0.38,
  fontWeight: 500,
  letterSpacing: 0.2,
})

export default function MusicPlayerSlider({
  artist,
  link,
  allOpts,
  shuffle,
  setShuffle,
  nextTrack,
  prevTrack,
}) {
  const theme = useTheme()
  const [duration, setDuration] = React.useState(0) // seconds
  const [position, setPosition] = React.useState(0) // seconds
  const [paused, setPaused] = React.useState(false)
  const audioRef = React.useRef(null)

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)')
      if (isDark.matches) {
        theme.palette.mode = 'dark'
      }
    }

    const audio = audioRef.current
    const updateDuration = () => setDuration(audio.duration)
    console.log("Duration: ", audio.duration)
    const updateCurrentTime = () => setPosition(audio.currentTime)
    console.log("Position: ", audio.currentTime)
    const updatePlayingState = () => setPaused(!audio.paused)
    console.log("Position: ", !audio.paused)
    audio.play()

    audio.addEventListener('timeupdate', updateCurrentTime)
    audio.addEventListener('durationchange', updateDuration)
    audio.addEventListener('play', updatePlayingState)
    audio.addEventListener('pause', updatePlayingState)

    // return () => {
    //   // Clean up event listeners
    //   audio.removeEventListener('timeupdate', updateCurrentTime)
    //   audio.removeEventListener('durationchange', updateDuration)
    //   audio.removeEventListener('play', updatePlayingState)
    //   audio.removeEventListener('pause', updatePlayingState)
    // }
  }, [audioRef])

  function formatDuration(value) {
    const minute = Math.floor(value / 60)
    const secondLeft = Math.floor(value - minute * 60)
    return `${minute}:${secondLeft < 10 ? `0${secondLeft}` : secondLeft}`
  }
  const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000'
  const lightIconColor =
    theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)'

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <audio ref={audioRef} src={link} />
      <p>{link}</p>
      <Widget>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <CoverImage>
            <img
              alt="can't win - Chilling Sunday"
              src='/static/images/sliders/chilling-sunday.jpg'
            />
          </CoverImage>
          <Box sx={{ ml: 1.5, minWidth: 0 }}>
            <Typography
              variant='caption'
              color='text.secondary'
              fontWeight={500}
            >
              Jun Pulse
            </Typography>
            <Typography noWrap>
              <b>คนเก่าเขาทำไว้ดี (Can&apos;t win)</b>
            </Typography>
            <Typography noWrap letterSpacing={-0.25}>
              Chilling Sunday &mdash; คนเก่าเขาทำไว้ดี
            </Typography>
          </Box>
        </Box>
        <Slider
          aria-label='time-indicator'
          size='small'
          value={position}
          min={0}
          step={1}
          max={duration}
          onChange={(_, value) => setPosition(value)}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mt: -2,
          }}
        >
          <TinyText>{formatDuration(position)}</TinyText>
          <TinyText>{formatDuration(duration)}</TinyText>
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: -1,
          }}
        >
          <IconButton aria-label='previous song'>
            <FastRewindRounded fontSize='large' htmlColor={mainIconColor} />
          </IconButton>
          <IconButton
            aria-label={paused ? 'play' : 'pause'}
            onClick={() => {
              if(paused){
                audioRef.current.play()
                setPaused(!paused)
              }else{
                audioRef.current.pause()
                setPaused(paused)
              }
            }}
          >
            {paused ? (
              <PlayArrowRounded
                sx={{ fontSize: '3rem' }}
                htmlColor={mainIconColor}
              />
            ) : (
              <PauseRounded
                sx={{ fontSize: '3rem' }}
                htmlColor={mainIconColor}
              />
            )}
          </IconButton>
          <IconButton aria-label='next song'>
            <FastForwardRounded fontSize='large' htmlColor={mainIconColor} />
          </IconButton>
        </Box>
        <Stack
          spacing={2}
          direction='row'
          sx={{ mb: 1, px: 1 }}
          alignItems='center'
        >
          <VolumeDownRounded htmlColor={lightIconColor} />
          <Slider
            aria-label='Volume'
            defaultValue={30}
            sx={{
              color:
                theme.palette.mode === 'dark' ? '#fff' : 'rgba(0,0,0,0.87)',
              '& .MuiSlider-track': {
                border: 'none',
              },
              '& .MuiSlider-thumb': {
                width: 24,
                height: 24,
                backgroundColor: '#fff',
                '&::before': {
                  boxShadow: '0 4px 8px rgba(0,0,0,0.4)',
                },
                '&:hover, &.Mui-focusVisible, &.Mui-active': {
                  boxShadow: 'none',
                },
              },
            }}
          />
          <VolumeUpRounded htmlColor={lightIconColor} />
        </Stack>
      </Widget>
    </Box>
  )
}
