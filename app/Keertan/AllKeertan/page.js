"use client"
import { useState } from 'react'
import { ALL_OPTS } from './TRACKS.js'
import ListenPage from '../../utils/components/ListenPage/index.js'
import IndexTrackBtnAndModal from './IndexTrackModal/index.js'

export default function ALL() {
  const [trackDetail, setTrackDetail] = useState({
    artist: '',
    link: '',
  })
  return (
    <body>
      <ListenPage
        title='All Keertan'
        tracksObj={ALL_OPTS}
        setTrackDetailForIndex={setTrackDetail}
      />
      <IndexTrackBtnAndModal
        artist={trackDetail.artist}
        link={trackDetail.link}
      />
    </body>
  )
}
