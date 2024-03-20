import React from 'react'

export default function AudioProgressBar({
  audioRef,
  currentTime,
  buffered,
  onSeek,
  ...rest
}) {
  const handleChange = (event) => {
    const newValue = event.target.value
    onSeek(newValue)
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(
      2,
      '0',
    )}`
  }

  const duration = audioRef?.current?.duration || 0
  const progressBarWidth = isNaN(currentTime / duration)
    ? 0
    : (currentTime / duration) * 100
  const bufferedWidth = isNaN(buffered / duration)
    ? 0
    : (buffered / duration) * 100

  return (
    <div
      style={{
        backgroundColor: 'black',
        padding: '10px',
        borderRadius: '5px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'left',
        }}
      >
        <span>{formatTime(currentTime)}</span>
        <input
          type='range'
          name='progress'
          style={{
            width: '100%',
            alignSelf: 'left',
            appearance: 'none',
            padding: '0',
            margin: '0',
            borderRadius: '5px',
            background: `linear-gradient(to right, #2196F3 ${bufferedWidth}%, #f0f0f0 ${bufferedWidth}% 100%)`,
            transition: 'background-color 0.3s ease',
          }}
          min={0}
          max={duration}
          value={currentTime}
          onChange={handleChange}
          {...rest}
        />
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  )
}

function OtherStyles() {
  return (
    <style jsx>
      {`
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 10px;
          height: 10px;
          background: #2196f3;
          border-radius: 50%;
          transition: background-color 0.3s ease;
        }

        input[type='range']::-moz-range-thumb {
          width: 10px;
          height: 10px;
          background: #2196f3;
          border: none;
          border-radius: 50%;
          transition: background-color 0.3s ease;
        }

        input[type='range']:focus {
          outline: none;
        }
      `}
    </style>
  )
}
