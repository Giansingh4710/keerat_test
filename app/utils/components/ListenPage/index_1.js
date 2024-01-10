"use client";
import Image from "next/image";
import styles from "./index.module.css";
import Header from "./Header/index.js";
import TrackNavigation from "./TrackNav/index.js";
import NavBar from "../NavBar/index.js";
import { useEffect, useRef, useState } from "react";
import { Button, Link } from "@mui/material";


import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import Player from "./Player/index.js";

// <script type="text/javascript" src="/assets/allShabads.js"></script>
export default function ListenPage({ title, tracksObj }) {
  const [TRACK_LINKS, setTrackLinks] = useState(getTrackLinks(tracksObj));
  const [allOpts, setAllOpts] = useState(tracksObj);
  const [shuffle, setShuffle] = useState(false);
  const [tracksHistory, setTracksHistory] = useState({
    curr_ind: -1, //index in links_lst
    links_lst: [], //list of links
    curr_link: "",
  });

  function getTypeOfTrack(link) {
    let trackType = "Unable To Get Info";
    const ind = TRACK_LINKS.indexOf(link);
    if (ind > -1) {
      let totalTrack = 0;
      for (const opt in allOpts) {
        if (allOpts[opt].checked) {
          const len = allOpts[opt].trackLinks.length;
          totalTrack += len;
          if (ind <= totalTrack) {
            trackType = opt;
            break;
          }
        }
      }
    }
    return trackType;
  }

  function nextTrack() {
    let curr_ind;
    let curr_link;
    let links_lst;

    if (tracksHistory.curr_ind === tracksHistory.links_lst.length - 1) {
      if (shuffle) {
        const randNum = Math.floor(Math.random() * TRACK_LINKS.length);
        curr_link = TRACK_LINKS[randNum];
        curr_ind = tracksHistory.links_lst.length;
        links_lst = [...tracksHistory.links_lst, curr_link];
      } else {
        const indOfCurrLink = TRACK_LINKS.indexOf(tracksHistory.curr_link);
        let indOfNextLink = indOfCurrLink + 1;
        indOfNextLink = indOfNextLink > TRACK_LINKS.length - 1
          ? 0
          : indOfNextLink;

        curr_link = TRACK_LINKS[indOfNextLink];
        curr_ind = tracksHistory.curr_ind + 1;
        links_lst = [...tracksHistory.links_lst, curr_link];
      }
    } else {
      curr_ind = tracksHistory.curr_ind + 1;
      curr_link = tracksHistory.links_lst[curr_ind];
      links_lst = tracksHistory.links_lst;
    }

    setTracksHistory({
      curr_ind,
      curr_link,
      links_lst,
    });
    console.log("After Next", { curr_ind, curr_link, links_lst });
  }

  function prevTrack() {
    console.log("Before Prev", tracksHistory);
    let curr_ind;
    let curr_link;
    let links_lst;

    if (tracksHistory.curr_ind === 0) {
      const indOfCurrLink = TRACK_LINKS.indexOf(tracksHistory.curr_link);
      let indOfNextLink = indOfCurrLink - 1;
      indOfNextLink = indOfNextLink < 0
        ? TRACK_LINKS.length - 1
        : indOfNextLink;

      curr_ind = 0;
      curr_link = TRACK_LINKS[indOfNextLink];
      links_lst = [curr_link, ...tracksHistory.links_lst];
    } else if (tracksHistory.curr_ind > 0) {
      curr_ind = tracksHistory.curr_ind - 1;
      curr_link = tracksHistory.links_lst[curr_ind];
      links_lst = tracksHistory.links_lst;
    }

    setTracksHistory({
      curr_ind,
      curr_link,
      links_lst,
    });
    console.log("After Prev", { curr_ind, curr_link, links_lst });
  }

  function playSpecificTrack(link) {
    let ind = tracksHistory.curr_ind;
    ind = ind === -1 ? 0 : ind;

    const linksLst = tracksHistory.links_lst;
    const updated = [...linksLst.slice(0, ind), link, ...linksLst.slice(ind)];
    setTracksHistory({
      curr_ind: ind, //same as old
      curr_link: link,
      links_lst: updated,
    });
  }

  useEffect(() => {
    nextTrack();
    return
    const urlParams = new URLSearchParams(window.location.search);
    const urlInd = parseInt(urlParams.get("trackIndex"));
    const urlArtist = urlParams.get("artist");
    const urlTime = urlParams.get("time");
    const urlSearch = urlParams.get("search");

    if (urlArtist && allOpts[urlArtist].checked === false) {
      setAllOpts({
        ...allOpts,
        [urlArtist]: {
          trackLinks: allOpts[urlArtist].trackLinks,
          checked: true,
        },
      });
    }
    if (urlInd > -1) {
      const the_link = allOpts[urlArtist].trackLinks[urlInd];
      playSpecificTrack(the_link, urlTime);
      // audioRef.current.currentTime = parseInt(urlTime)
      return;
    }
  }, []);

  return (
    <body id={styles.body}>
      <NavBar />
      <Header title={title} />
      <FilterTracks
        tracks={TRACK_LINKS}
        playSpecificTrack={playSpecificTrack}
      />
      <ArtistsOptions
        allOpts={allOpts}
        setAllOpts={setAllOpts}
        setTrackLinks={setTrackLinks}
        numOfTracks={TRACK_LINKS.length}
      />

      <Player 
        artist={getTypeOfTrack(tracksHistory.curr_link)}
        // link={tracksHistory.curr_link}
        link='https://daasstorage13.blob.core.windows.net/ds1/audios/paath/PanjGranthiBhaiJaswantSinghJi/Asa%20Kee%20Vaar.mp3'
        allOpts={allOpts}
        shuffle={shuffle}
        setShuffle={setShuffle}
        nextTrack={nextTrack}
        prevTrack={prevTrack}
      />
      <Button id={styles.saveTrackBtn} variant="contained">
        Save Track Locally
      </Button>

      <hr />
      <div id={styles.saveTrackLocalModal} className={styles.modal}>
        <div id={styles.saveTrackLocalModal_content}>
          <span id={styles.saveTrackLocalModalClose}>&times;</span>
          <label htmlFor="noteForSavedTrack">
            Enter a note if you would like (not needed):
          </label>
          <div>
            <textarea
              placeholder="ex: Amazing Bani at 10:00"
              id={styles.noteForSavedTrack}
            >
            </textarea>
          </div>
          <div>
            <Button className={styles.basicBtn} onClick={() => "saveTrack()"}>
              Save
            </Button>
          </div>
        </div>
      </div>

      <div id={styles.dialog} className={styles.dialog}>
        <div className={styles.dialog_content}>
          <p id={styles.formInfo}></p>
          <form
            id={styles.modal_content}
            // onsubmit='formValidation(event)'
            method="post"
            action="http://45.76.2.28/trackIndex/util/addData.php"
          >
            <span id={styles.closeModal}>&times;</span>
            <div className={styles.userInputItem}>
              <label htmlFor="userDesc">Description:</label>
              <input
                id={styles.userDesc}
                name="description"
                placeholder="bin ek naam ik chit leen"
              >
              </input>
            </div>
            <div className={styles.userInputItem}>
              <div className={styles.displayNone} id={styles.gurbani_line}>
                <button id={styles.only_this_line}></button>
              </div>
              <label htmlFor="usedShabadId">Shabad ID:</label>
              <input
                list="shabadId_list_opts"
                id={styles.usedShabadId}
                name="shabadId"
                placeholder="ਤਕਮਲ"
              // oninput='add_shabad_from_user_input()'
              >
              </input>
              <div id={styles.shabadId_list_opts}></div>
              <details id={styles.sbdDetails} className={styles.displayNone}>
                <summary>Shabad ID</summary>
                <div></div>
              </details>
            </div>
            <div className="userInputItem">
              <label htmlFor="userTimestamp">
                Timestamp of where Description Happened:
              </label>
              <div id={styles.userTimestamp}>
                <input
                  name="hours"
                  id={styles.hours}
                  type="number"
                  min="0"
                  max="59"
                  inputMode="numeric"
                >
                </input>
                :
                <input
                  name="mins"
                  id={styles.mins}
                  type="number"
                  min="0"
                  max="59"
                  inputMode="numeric"
                >
                </input>
                :
                <input
                  name="secs"
                  id={styles.secs}
                  type="number"
                  min="0"
                  max="59"
                  inputMode="numeric"
                >
                </input>
              </div>
              <div id={styles.userTimestamp}>
                <label htmlFor="hours">hours:</label>
                <label htmlFor="mins">minutes:</label>
                <label htmlFor="secs">seconds</label>
              </div>
            </div>

            <button>Add</button>
          </form>
        </div>
      </div>

      <button id={styles.openModal}>Save to Global Database</button>
    </body>
  );
}

function ArtistsOptions({ allOpts, setAllOpts, setTrackLinks, numOfTracks }) {
  const [showingOpts, setShowingOpts] = useState(false);

  const artist_options = Object.keys(allOpts).map((artist) => {
    return (
      <div key={artist}>
        <input
          checked={allOpts[artist].checked}
          type="checkbox"
          id={artist}
          name={artist}
          onChange={() => {
            setAllOpts(() => {
              const newObj = {
                ...allOpts,
                [artist]: {
                  trackLinks: allOpts[artist].trackLinks,
                  checked: !allOpts[artist].checked,
                },
              };
              setTrackLinks(getTrackLinks(newObj));
              return newObj;
            });
          }}
        />
        <label htmlFor={artist}>{artist}</label>
      </div>
    );
  });

  return (
    <div id={styles.optionMenu} className={styles.section}>
      <Button
        variant="contained"
        id={styles.toggleShowingOpts}
        onClick={() => setShowingOpts(!showingOpts)}
      >
        {showingOpts ? "Show Options" : "Hide Options"}
      </Button>
      {showingOpts
        ? (
          <div className="sectionDisplay">
            <p>Total Tracks in Queue: {numOfTracks}</p>
            <div id={styles.tracksOpts}>
              <div id={styles.checkBtnsOpts}>
                <button
                  className={styles.basicBtn}
                  onClick={() => {
                    setAllOpts((opts) => {
                      Object.keys(opts).forEach((artist) => {
                        opts[artist].checked = false;
                      });
                      setTrackLinks(getTrackLinks(opts));
                      return opts;
                    });
                  }}
                >
                  Uncheck All Options
                </button>
                <button
                  className={styles.basicBtn}
                  onClick={() => {
                    setAllOpts((opts) => {
                      Object.keys(opts).forEach((artist) => {
                        opts[artist].checked = true;
                      });
                      setTrackLinks(getTrackLinks(opts));
                      return opts;
                    });
                  }}
                >
                  Check All Options
                </button>
              </div>
              {artist_options}
            </div>
          </div>
        )
        : <></>}
    </div>
  );
}

function getTrackLinks(tracksObj) {
  const links = [];
  Object.keys(tracksObj).forEach((artist) => {
    if (tracksObj[artist].checked) {
      links.push(...tracksObj[artist].trackLinks);
    }
  });
  return links;
}

function FilterTracks({ tracks, playSpecificTrack }) {
  const [searchInput, setSearchInput] = useState("");
  const [searchedTracks, setTracks] = useState([]);
  const [showTracks, setShowing] = useState(false);

  const styles = {
    searchInput: {
      color: "black",
      width: "95%",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      fontSize: "1em",
      textAlign: "center",
    },
  };

  function ShowingOfTracks() {
    if (!showTracks) return <></>;
    const styles = {
      btn: {
        color: "black",
      },
    };
    return (
      <div className="sectionDisplay">
        <p>{searchedTracks.length} Results Found</p>
        <ol>
          {searchedTracks.map((link, index) => {
            return (
              <li key={index}>
                <button
                  style={styles.btn}
                  onClick={() => {
                    playSpecificTrack(link);
                  }}
                >
                  {getNameOfTrack(link)}
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    );
  }
  return (
    <div>
      <input
        placeholder="Search for Track:"
        style={styles.searchInput}
        value={searchInput}
        onInput={(e) => {
          setSearchInput(e.target.value);
          if (e.target.value === "") {
            setTracks([]);
            setShowing(false);
            return;
          }
          const searchWordsLst = e.target.value.toLowerCase().split(" ");
          const allLinksWithWordInds = [];
          tracks.forEach((link, index) => {
            /* const trackName = getNameOfTrack(link) */
            const trackName = link.toLowerCase();
            let allWordsInTrackName = true;
            for (const word of searchWordsLst) {
              if (!trackName.includes(word)) {
                allWordsInTrackName = false;
                break;
              }
            }
            if (allWordsInTrackName) {
              // allLinksWithWordInds.push(index)
              allLinksWithWordInds.push(link);
            }
          });
          setTracks(allLinksWithWordInds);
          setShowing(true);
        }}
      />
      <Button onClick={() => "showSavedTracks()"} variant="outlined">
        Show Saved Tracks
      </Button>
      <Button
        variant="outlined"
        onClick={() => {
          setSearchInput("");
          setTracks([]);
          setShowing(false);
        }}
      >
        Clear Results
      </Button>
      <ShowingOfTracks />
    </div>
  );
}

function TrackPlayback({ link, artist, allOpts, audioRef }) {
  const [currentTime, setCurrentTime] = useState("0.0");
  const [skipTime, setSkipTime] = useState(10);
  const [playPauseImg, setPlayPauseImg] = useState("/imgs/pause.png");

  if (!link) return <></>;

  function copyLink() {
    const url = new URL(window.location.href.split("?")[0].split("#")[0]);

    function get_ind_from_artist_tracks(the_link) {
      const allLinks = allOpts[artist].trackLinks;
      for (let link of allLinks) {
        if (link === the_link) return allLinks.indexOf(link);
      }
      return -1;
    }

    url.searchParams.append("time", currentTime);
    url.searchParams.append("artist", artist);
    url.searchParams.append("trackIndex", get_ind_from_artist_tracks(link));
    navigator.clipboard.writeText(url.href);
  }

  function formatTime(timeInSeconds) {
    function str_pad_left(string, pad, length) {
      return (new Array(length + 1).join(pad) + string).slice(-length);
    }
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds - minutes * 60);
    const currentTime = str_pad_left(minutes, "0", 2) + ":" +
      str_pad_left(seconds, "0", 2);
    return currentTime;
  }

  function action(a) {
    console.log(a)
  }

  return (
    <AudioPlayer
      onAbort={action("onAbort")}
      onCanPlay={action("onCanPlay")}
      onCanPlayThrough={action("onCanPlayThrough")}
      onEnded={action("onEnded")}
      onPlaying={action("onPlaying")}
      onSeeking={action("onSeeking")}
      onSeeked={action("onSeeked")}
      onLoadStart={action("onLoadStart")}
      onLoadedMetaData={action("onLoadedMetaData")}
      onLoadedData={action("onLoadedData")}
      onError={action("onError")}
      onListen={action("onListen")}
      onVolumeChange={action("onVolumeChange")}
      onPause={action("onPause")}
      onPlay={action("onPlay")}
      onClickPrevious={action("onClickPrevious")}
      onClickNext={action("onClickNext")}
      volume={0.8}
      showSkipControls
      progressUpdateInterval={100}
      src={link}
    />
  )
  return (
    <div className="trackInfo border">
      <h4 id={styles.trackFromWhichOpt}>{artist}</h4>
      <p>{formatTime(currentTime)}</p>
      <a className="trackNameAtag" target="_blank" href={link}>
        {getNameOfTrack(link)}
      </a>
      <button className={styles.copyTrackBtn} onClick={copyLink}>
        Copy Track Link
      </button>
      <audio
        // src={link}
        onended="playNextTrack()"
        onerror=""
        id={styles.audio}
        controls
        autoplay="true"
        onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
        ref={audioRef}
      >
      </audio>
      <div id={styles.playBackOptions}>
        <button
          onClick={() => {
            audioRef.current.currentTime -= skipTime;
          }}
          className={styles.skip10btn}
        >
          <Image
            alt="Back Button"
            src="/imgs/back10.png"
            width={30}
            height={30}
          />
        </button>
        <button
          onClick={() => {
            if (audioRef.current.paused) {
              audioRef.current.play();
              setPlayPauseImg("/imgs/pause.png");
            } else {
              audioRef.current.pause();
              setPlayPauseImg("/imgs/play.png");
            }
          }}
          className={styles.skip10btn}
        >
          <Image
            alt="Play Pause Button"
            src={playPauseImg}
            width={30}
            height={30}
          />
        </button>
        <button
          onClick={() => {
            audioRef.current.currentTime += skipTime;
          }}
          className={styles.skip10btn}
        >
          <Image
            alt="Forward Button"
            src="/imgs/forward10.png"
            width={30}
            height={30}
          />
        </button>
      </div>

      <label htmlFor="pickSkipInterval">Skip Interval</label>
      <select
        id={styles.pickSkipInterval}
        onChange={(e) => setSkipTime(parseInt(e.target.value))}
      >
        <option value="5">5 Seconds</option>
        <option value="10" selected>
          10 Seconds
        </option>
        <option value="15">15 Seconds</option>
        <option value="30">30 Seconds</option>
        <option value="60">60 Seconds</option>
      </select>
    </div>
  );
}

function getNameOfTrack(link) {
  const title = link.split("/").slice(-1)[0];
  return decodeURIComponent(decodeURIComponent(title));
}
