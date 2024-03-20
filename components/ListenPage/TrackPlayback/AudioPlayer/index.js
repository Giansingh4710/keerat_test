import * as React from 'react'
import { MdVolumeOff, MdVolumeUp } from 'react-icons/md'
import { formatTime } from '@/utils/helper_funcs'

export default function AudioPlayer({ link, audioRef, setPaused, timeToGoTo }) {
  const [buffered, setBuffered] = React.useState(0)
  const [volume, setVolume] = React.useState(0.2)
  const [currentTime, setCurrentTime] = React.useState(0)

  const handleBufferProgress = (e) => {
    const audio = e.currentTarget
    const dur = audio.duration
    setCurrentTime(audio.currentTime)
    if (dur > 0) {
      for (let i = 0; i < audio.buffered.length; i++) {
        if (
          audio.buffered.start(audio.buffered.length - 1 - i) <
          audio.currentTime
        ) {
          const bufferedLength = audio.buffered.end(
            audio.buffered.length - 1 - i,
          )
          setBuffered(bufferedLength)
          break
        }
      }
    }
  }

  const handleMuteUnmute = () => {
    if (!audioRef.current) return

    if (audioRef.current.volume !== 0) {
      audioRef.current.volume = 0
    } else {
      audioRef.current.volume = 1
    }
  }

  const handleVolumeChange = (volumeValue) => {
    if (!audioRef.current) return
    audioRef.current.volume = volumeValue
    setVolume(volumeValue)
  }

  const audioComponent = React.useMemo(() => {
    return (
      <audio
        ref={audioRef}
        key={link}
        autoPlay={true}
        onCanPlay={(e) => {
          e.currentTarget.volume = volume
        }}
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onTimeUpdate={handleBufferProgress}
        onProgress={handleBufferProgress}
        onVolumeChange={(e) => setVolume(e.currentTarget.volume)}
        onLoadedData={() => {
          audioRef.current.currentTime = timeToGoTo.current
          timeToGoTo.current = 0
        }}
        onSeeking={() => {}}
      >
        <source type='audio/mpeg' src={link} />
      </audio>
    )
  }, [link, audioRef])

  return (
    <div style={{ width: '100%' }}>
      {audioComponent}
      <AudioProgressBar
        audioRef={audioRef}
        buffered={buffered}
        currentTime={currentTime}
      />

      <div className='grid grid-cols-3 items-center mt-4'>
        <div className='flex gap-3 items-center justify-self-end'>
          <button
            style={{ borderRadius: '10px' }}
            onClick={handleMuteUnmute}
            aria-label={volume === 0 ? 'unmute' : 'mute'}
          >
            {volume === 0 ? (
              <MdVolumeOff size={20} />
            ) : (
              <MdVolumeUp size={20} />
            )}
          </button>
          <input
            aria-label='volume'
            name='volume'
            type='range'
            min={0}
            step={0.05}
            max={1}
            value={volume}
            className='w-[80px] m-0 h-2 rounded-full accent-amber-600 bg-gray-700 appearance-none cursor-pointer'
            onChange={(e) => {
              handleVolumeChange(e.currentTarget.valueAsNumber)
            }}
          />
        </div>
      </div>
    </div>
  )
}

function AudioProgressBar({ audioRef, buffered, currentTime }) {
  // const currentTime = audioRef?.current?.currentTime || 0
  const duration = audioRef?.current?.duration || 0
  const bufferedWidth = isNaN(buffered / duration)
    ? 0
    : (buffered / duration) * 100

  const handleChange = (event) => {
    const newValue = event.target.value
    audioRef.current.currentTime = newValue
  }

  return (
    <div
      style={{
        width: '100%',
        backgroundColor: 'black',
        padding: '5px',
        borderRadius: '5px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>{formatTime(currentTime)}</span>
        <input
          type='range'
          name='progress'
          style={{
            width: '100%',
            appearance: 'none',
            // padding: '0',
            // margin: '0',
            borderRadius: '5px',
            background: `linear-gradient(to right, #2196F3 ${bufferedWidth}%, #f0f0f0 ${bufferedWidth}% 100%)`,
            // transition: 'background-color 0.3s ease',
          }}
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleChange}
        />
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}
