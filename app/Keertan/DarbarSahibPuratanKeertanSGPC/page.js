import {
  AjitSinghAlankary,
  AvtarSingh,
  BahadurSinghJi,
  BalbirSingh,
  BhaiRandhirSingh,
  BhakshishSingh,
  chatersingh,
  DALBIRSINGH,
  DarshanSinghSohal,
  devindersingh,
  DharamSinghZakhme,
  DilbaghSinghGulbaghSingh,
  DyalSingh,
  GhulamMohammedChand,
  GianSinghAlmast,
  GOPALSINGH,
  GurmejSingh,
  GyanSInghJogi,
  kanwarpalsingh,
  nirmalsingh,
  NirmalSinghNagpuri,
  PARAMJOTSINGH,
  PARKASHSINGH,
  pirthipalsinghmohanpalsingh,
  PremSingh,
  RaiSingh,
  SalokKabirji,
  SamundSingh,
  SantaSingh,
  SHAMSHERSINGH,
  SudhSinghPradanSinghJi,
  SurjitSingh,
  TakhatSinghJee,
  UnknownArtist,
} from './TRACKS.js'

import ListenPage from '../../utils/components/ListenPage/index.js'

export default function akj() {
  const ALL_OPTS = {
    "Bhai Randhir Singh":{
      checked: true,
      trackLinks: BhaiRandhirSingh,
    },
    "Ajit Singh Alankary": {
      checked: true,
      trackLinks: AjitSinghAlankary,
    },
    "Avtar Singh": {
      checked: true,
      trackLinks: AvtarSingh,
    },
    "Bahadur Singh Ji": {
      checked: true,
      trackLinks: BahadurSinghJi,
    },
    "Balbir Singh": {
      checked: true,
      trackLinks: BalbirSingh,
    },
    "Bhakshish Singh": {
      checked: true,
      trackLinks: BhakshishSingh,
    },
    "Chater Singh": {
      checked: true,
      trackLinks: chatersingh,
    },
    "Dalbir Singh": {
      checked: true,
      trackLinks: DALBIRSINGH,
    },
    "Darshan Singh Sohal": {
      checked: true,
      trackLinks: DarshanSinghSohal,
    },
    "Devinder Singh": {
      checked: true,
      trackLinks: devindersingh,
    },
    "Dharam Singh Zakhme": {
      checked: true,
      trackLinks: DharamSinghZakhme,
    },
    "Dilbagh Singh Gulbagh Singh": {
      checked: true,
      trackLinks: DilbaghSinghGulbaghSingh,
    },
    "Dyal Singh": {
      checked: true,
      trackLinks: DyalSingh,
    },
    "Ghulam Mohammed Chand": {
      checked: true,
      trackLinks: GhulamMohammedChand,
    },
    "Gian Singh Almast": {
      checked: true,
      trackLinks: GianSinghAlmast,
    },
    "Gopal Singh": {
      checked: true,
      trackLinks: GOPALSINGH,
    },
    "Gurmej Singh": {
      checked: true,
      trackLinks: GurmejSingh,
    },
    "Gyan Singh Jogi": {
      checked: true,
      trackLinks: GyanSInghJogi,
    },
    "Kanwarpal Singh": {
      checked: true,
      trackLinks: kanwarpalsingh,
    },
    "Nirmal Singh": {
      checked: true,
      trackLinks: nirmalsingh,
    },
    "Nirmal Singh Nagpuri": {
      checked: true,
      trackLinks: NirmalSinghNagpuri,
    },
    "Paramjot Singh": {
      checked: true,
      trackLinks: PARAMJOTSINGH,
    },
    "Parkash Singh": {
      checked: true,
      trackLinks: PARKASHSINGH,
    },
    "Prithpal Singh Mohanpal Singh": {
      checked: true,
      trackLinks: pirthipalsinghmohanpalsingh,
    },
    "Prem Singh": {
      checked: true,
      trackLinks: PremSingh,
    },
    "Rai Singh": {
      checked: true,
      trackLinks: RaiSingh,
    },
    "Salok Kabir Ji": {
      checked: true,
      trackLinks: SalokKabirji,
    },
    "Samund Singh": {
      checked: true,
      trackLinks: SamundSingh,
    },
    "Santa Singh": {
      checked: true,
      trackLinks: SantaSingh,
    },
    "Shamsher Singh": {
      checked: true,
      trackLinks: SHAMSHERSINGH,
    },
    "Sudh Singh Pradan Singh Ji": {
      checked: true,
      trackLinks: SudhSinghPradanSinghJi,
    },
    "Surjit Singh": {
      checked: true,
      trackLinks: SurjitSingh,
    },
    "Takhat Singh Jee": {
      checked: true,
      trackLinks: TakhatSinghJee,
    },
    "Unknown Artist": {
      checked: true,
      trackLinks: UnknownArtist,
    },
  }
  return <ListenPage title='Darbar Sahib Keertan' tracksObj={ALL_OPTS} />
}
