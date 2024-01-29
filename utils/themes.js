const colors = {
  theme1: {
    text1: 'white',
    text2: 'black',
    primany: '#466995',
    // primany: '#001f3f',
    // third: '#4464AD',
    secondary: '#F58F29',
    third: '#1565c0',
    fourth: '#7D4600',
    five: 'skyblue',
  },
}
const theme1 = {
  backgroundColor: colors.theme1.primany,
  optsPages: {
    header: {
      backgroundColor: colors.theme1.secondary,
    },
    opt: {
      backgroundColor: colors.theme1.five,
    },
  },
  listenPage: {
    ArtistsOptionsModal: {
      container: {
        color: colors.theme1.text1,
        backgroundColor: colors.theme1.secondary,
      },
      checkOptsBtns: {
        backgroundColor: colors.theme1.primany,
        color: colors.theme1.text1,
      },
      artistOption: {
        backgroundColor: colors.theme1.secondary,
      },
    },
    SaveTrackModal: {
      btn: {
        color: colors.theme1.text1,
        backgroundColor: colors.theme1.fourth,
      },
      modalDiv: {
        backgroundColor: colors.theme1.primany,
        color: colors.theme1.text1,
      },
      modalDivClose: {
        color: colors.theme1.text2,
      },
      label: {
        color: colors.theme1.text2,
      },
      textArea: {
        color: colors.theme1.text2,
      },
    },
    SearchTracks: {
      searchInput: {
        color: colors.theme1.text2,
      },
      xIcon: {
        color: colors.theme1.text1,
      },
      cont: {
        color: colors.theme1.text1,
      },
    },
    TrackPlayback: {
      cont: {
        backgroundColor: colors.theme1.secondary,
        color: colors.theme1.text1,
      },
      seekTimeSelect: {
        color: colors.theme1.text2,
      },
      randomRow: {
        backgroundColor: colors.theme1.primany,
      },
      btn: {
        color: colors.theme1.text1,
        backgroundColor: colors.theme1.fourth,
      },
      colorChangerVal: (bool) =>
        bool
          ? { backgroundColor: colors.theme1.third }
          : { backgroundColor: colors.theme1.fourth },
    },
    IndexTrackModal: {
      main_btn: {
        color: colors.theme1.text1,
        backgroundColor: '#1565c0',
      },
      cont: {
        backgroundColor: '#ff7f50',
        color: colors.theme1.text1,
      },
      userInputItem: {
        backgroundColor: '#0077be',
      },
      closeModalBtn: {
        color: colors.theme1.text2,
      },
      timeInput: {
        color: colors.theme1.text2,
      },
    },
  },
}

const ALL_THEMES = {
  theme1: theme1,
}

export default ALL_THEMES
