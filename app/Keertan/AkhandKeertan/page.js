import {
  ANJAAN_JI_LINKS,
  BHAI_JEEVAN_SINGH_JI_LINKS,
  BHAI_MEHAR_SINGH_LINKS,
  DULLAJI_LINKS,
  GIANI_AMOLAK_TRACK_LINKS,
  GURINDER_S_LINKS,
  HPS_TRACK_LINKS,
  SDO_TRACK_LINKS,
  TALWARAJI_TRACK_LINKS,
} from './TRACKS.js'

import ListenPage from '../../utils/components/ListenPage/index.js'

export default function akj() {
  const ALL_OPTS = {
    'Bhai Mohinder Singh Ji SDO': {
      checked: true,
      trackLinks: SDO_TRACK_LINKS,
    },
    'Bhai Tejinderpal Singh Ji Dulla': {
      checked: true,
      trackLinks: DULLAJI_LINKS,
    },
    'Giani Amolak Singh Ji': {
      checked: true,
      trackLinks: GIANI_AMOLAK_TRACK_LINKS,
    },
    'Bhai Sahib Jeevan Singh Ji': {
      checked: true,
      trackLinks: BHAI_JEEVAN_SINGH_JI_LINKS,
    },
    'Bhai Joginder Singh Ji Talwara': {
      checked: true,
      trackLinks: TALWARAJI_TRACK_LINKS,
    },
    'Bhai Mehar Singh Ji': {
      checked: true,
      trackLinks: BHAI_MEHAR_SINGH_LINKS,
    },
    'Dr.Preetam Singh Ji Anjaan': {
      checked: true,
      trackLinks: ANJAAN_JI_LINKS,
    },
    'Bhai Harpreet Singh Ji Toronto': {
      checked: true,
      trackLinks: HPS_TRACK_LINKS,
    },
    'Bhai Gurinder Singh Ji CA': {
      checked: true,
      trackLinks: GURINDER_S_LINKS,
    },
  }
  return <ListenPage title='Classic Akhand Keertan' tracksObj={ALL_OPTS} />
}
