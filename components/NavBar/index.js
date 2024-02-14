import React, { Children, useState } from 'react'
import { getPrefixForProd } from '@/utils/helper_funcs'

const prefix = getPrefixForProd()

function LinkTag({ href }) {
  const linkStyles = {
    link: {
      backgroundColor: 'yellow',
      display: 'flex',

      justifyContent: 'left',
      padding: '0.1em',
      backgroundColor: '#333',
      fontSize: '1.2em',
    },
    text: {
      color: 'white',
    }
  }

  let hrefToLink  = `${href}`
  if ('http://45.76.2.28/trackIndex' === hrefToLink) {
    hrefToLink  = `${prefix}${href}`
  }

  return (
    <div style={linkStyles.link}>
      <a href={hrefToLink} style={linkStyles.text}>{href.split('/').pop()}</a>
    </div>
  )
}

export default function NavBar({ title }) {
  return (
    <nav style={styles.cont}>
      <BarRow name={title} main={true}>
        <BarRow name={'Keertan'}>
          <LinkTag href='/Keertan/AkhandKeertan' />
          <LinkTag href='/Keertan/DarbarSahibPuratanKeertanSGPC' />
          <LinkTag href='/Keertan/TimeBasedRaagKeertan/' />
          <LinkTag href='/Keertan/AllKeertan' />
        </BarRow>
        <LinkTag href='/Paath/' />
        <LinkTag href='/SantGianiGurbachanSinghJiSGGSKatha/' />
        <LinkTag href='/BhagatJaswantSinghJi/' />
        <LinkTag href='/MiscellaneousTopics' />
        <LinkTag href='/GianiSherSinghJi' />
        <LinkTag href='http://45.76.2.28/trackIndex' />
      </BarRow>
    </nav>
  )
}

function BarRow({ name, main, children }) {
  const [showChildren, setShowChildren] = useState(false)

  function TheChildern() {
    if (showChildren === false) return <></>

    if (children !== undefined) {
      return (
        <div style={styles.childs}>
          {Children.map(children, (child) => {
            return <div style={styles.child}>{child}</div>
          })}
        </div>
      )
    }
    return <></>
  }

  function LeftHome() {
    if (main) {
      return (
        <h1 style={styles.home}>
          <a href={`${prefix}/`} className='active'>
            Home
          </a>
        </h1>
      )
    }
    return <></>
  }

  return (
    <div style={styles.cont}>
      <div style={styles.topRow}>
        <LeftHome />
        <h1 style={styles.title}>{name}</h1>
        <button
          style={styles.burgerIcon}
          className='icon'
          onClick={() => setShowChildren(!showChildren)}
        >
          ☰
        </button>
      </div>
      <TheChildern />
    </div>
  )
}

const styles = {
  cont: {
    width: '100%',
    backgroundColor: '#333',
    borderRadius: '1em',
    border: '1px solid black',
  },
  topRow: {
    height: '50px',
    backgroundColor: '#333',
    borderRadius: '1em',
    display: 'flex',
    alignItems: 'center',
  },
  home: {
    flex: 0.5,
    height: '95%',
    borderRadius: '0.5em',
    backgroundColor: '#eddf6a',

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 3,
    color: 'white',
    fontSize: '1em',
  },
  burgerIcon: {
    borderRadius: '0.5em',
    flex: 0.5,
    height: '95%',
    fontSize: '2em',
  },
  childs: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  child: {
    flex: 1,
    width: '97%',
  },
}

function Old({ title }) {
  return (
    <nav className='topnav'>
      <a href={`${prefix}/`} className='active'>
        Home
      </a>
      <div className='dropdown'>
        <button className='dropbtn'>Keertan &darr;</button>
        <div className='dropdown_content'>
          <a href={`${prefix}/Keertan/AkhandKeertan/`}>Akhand Keertan</a>
          <a href={`${prefix}/Keertan/DarbarSahibPuratanKeertanSGPC`}>
            Darbar Sahib Puratan Keertan
          </a>
          <a href={`${prefix}/Keertan/TimeBasedRaagKeertan/`}>
            Time Based Raag Keertan
          </a>
          <a href={`${prefix}/Keertan/AllKeertan`}>All Keertan</a>
        </div>
      </div>
    </nav>
  )
}
