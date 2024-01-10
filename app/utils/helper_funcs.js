export function getNameOfTrack(link) {
  const title = link.split('/').slice(-1)[0]
  return decodeURIComponent(decodeURIComponent(title))
}

function formatTime3(timeInSeconds) {
  function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length)
  }
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = Math.floor(timeInSeconds - minutes * 60)
  const formatedTime =
    str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2)
  return formatedTime
}

export function formatTime(timeInSeconds) {
  if(!timeInSeconds) return ''
  function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length)
  }

  let hours = Math.floor(timeInSeconds / 3600)
  let minutes = Math.floor((timeInSeconds % 3600) / 60)
  let seconds = Math.floor(timeInSeconds % 60)

  hours = str_pad_left(hours, '0', 2) 
  minutes = str_pad_left(minutes, '0', 2)
  seconds = str_pad_left(seconds, '0', 2)

  let formattedTime = ''
  if (hours === '00') {
    formattedTime = `${minutes}:${seconds}`
  }else{
    formattedTime = `${hours}:${minutes}:${seconds}`
  }

  return formattedTime
}
