
import React, { useState, useContext, createContext, useEffect} from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import store from "../../redux-store";
import SubmitRecordService from "../../services/SubmitRecordService";
import './PomodoroView.css'


// css modules
const workTimerProps = {
  colors: [["#14B14B", 0.33], ["#6C6CE0", 0.66], ["#E71A1A"]],
  strokeWidth: 8,
  size: 240,
  trailColor: "#F2F3F4",
};

const breakTimerProps = {
  colors: [
    ["#14B14B", 0.33],
    ["#14B14B", 0.33],
    ["#14B14B", 0.33],
  ],
  strokeWidth: 6,
  size: 240,
  trailColor: "#F2F3F4",
};

// js helper functions

function getCurrentTime() {
  let today = new Date();
  let currentHours = today.getHours();
  currentHours = ("0" + currentHours).slice(-2);
  let currentMinutes = today.getMinutes();
  currentMinutes = ("0" + currentMinutes).slice(-2);
  return currentHours + ":" + currentMinutes;
}

function submitRecord(startTime, doAlert = false) {
  //todo: submit the record via some http service to the backend
  let username = store.getState().auth.username;

  let recordData = {
    username: username,
    startTime: startTime,
    endTime: getCurrentTime(),
  };
  console.log(recordData);
  SubmitRecordService.submit_interval(
    recordData.username,
    recordData.startTime,
    recordData.endTime
  );
  if (doAlert) {
    alert(
      `${recordData.username}: ${recordData.startTime} to ${recordData.endTime}`
    );
  }
}

// constext variables through all components

const remainingTimeContext = createContext();

function RemainingTimeContextProvider(props) {
  const [startTime, setStartTime] = useState("");
  const [isUserBreaking, setIsUserBreaking] = useState(false); // define which clock to run
  const [ClockKey, setClockKey] = useState(0);
  const [isClockPlaying, setIsClockPlaying] = useState(false);
  const [workDurationMinutes, setWorkDurationMinutes] = useState(25);
  const [breakDurationMinutes, setBreakDurationMinutes] = useState(5);
  const [minute, setMinute] = useState(25);
  const [second, setSecond] = useState(0);

  useEffect ( () => {
    loadItemFromLocalStorage("startTime", setStartTime, "string")
    loadItemFromLocalStorage("isUserBreaking", setIsUserBreaking, "boolean")
    loadItemFromLocalStorage("ClockKey", setClockKey, "number")
    loadItemFromLocalStorage("isClockPlaying", setIsClockPlaying, "boolean")
    loadItemFromLocalStorage("workDurationMinutes", setWorkDurationMinutes, "number")
    loadItemFromLocalStorage("breakDurationMinutes", setBreakDurationMinutes, "number")
    loadItemFromLocalStorage("Minute", setMinute, "number")
    loadItemFromLocalStorage("Second", setSecond, "number")
    loadItemFromLocalStorage("Second", setSecond, "number") 
  }, [])

  useEffect ( () => {
    localStorage.setItem("startTime", startTime)
    localStorage.setItem("isUserBreaking", isUserBreaking)
    localStorage.setItem("ClockKey", ClockKey)
    localStorage.setItem("isClockPlaying", isClockPlaying)
    localStorage.setItem("workDurationMinutes", workDurationMinutes)
    localStorage.setItem("breakDurationMinutes", breakDurationMinutes)
    localStorage.setItem("Minute", minute)
    localStorage.setItem("Second", second)
  })

  /**
   * Load a item from the local storage with the key itemName and set the item with the itemSetFunc.
   * itemType indicates what type the item should be converted to. Since local storage only stores strings,
   * the item needs to be converted. 
   * @param {*} itemName 
   * @param {*} itemSetFunc 
   * @param {*} itemType ONLY choose from "string", "boolean" and "number"
   */
  function loadItemFromLocalStorage(itemName, itemSetFunc, itemType) {
    const data = localStorage.getItem(itemName)
    if (data) {
      if (itemType == "boolean") {
        itemSetFunc(data == "true")
      } else if (itemType == "number") {
        itemSetFunc(Number(data))
      } else if (itemType == "string") {
        itemSetFunc(data)
      }
    }
  }
  
  return (
    <remainingTimeContext.Provider
      value={{
        startTime,
        setStartTime,
        isUserBreaking,
        setIsUserBreaking,
        ClockKey,
        setClockKey,
        isClockPlaying,
        setIsClockPlaying,
        workDurationMinutes,
        setWorkDurationMinutes,
        breakDurationMinutes,
        setBreakDurationMinutes,
        minute,
        setMinute,
        second,
        setSecond
      }}
    >
      {props.children}
    </remainingTimeContext.Provider>
  );
}

function ClockController() {
  const {
    startTime,
    setStartTime,
    setClockKey,
    setIsClockPlaying,
    isUserBreaking,
    setIsUserBreaking,
    isClockPlaying,
    setMinute,
    setSecond,
    workDurationMinutes
  } = useContext(remainingTimeContext);

  const handleSwitch = (flag) => {
    if(!flag){
      setIsClockPlaying(true);
      setStartTime(getCurrentTime());
    }else{
      if (!isUserBreaking) {
        submitRecord(startTime, true);
      }
      setClockKey((prevKey) => prevKey + 1);
      setIsClockPlaying(false);
      setIsUserBreaking(false);
      setMinute(workDurationMinutes);
      setSecond(0)
    }
  };
  
  return (
    <div className="row justify-content-center">
      <button className="btn btn-success col-lg-1 col-md-2 col-sm-3" onClick={()=>{handleSwitch(isClockPlaying)}}>{isClockPlaying? 'Hold':'Go'}</button>
    </div>
  );
}

function ClockSettings() {
  const [workMinutes, setWorkMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const {
    setClockKey,
    setIsClockPlaying,
    setIsUserBreaking,
    setWorkDurationMinutes,
    setBreakDurationMinutes,
    setMinute,
    setSecond
  } = useContext(remainingTimeContext);
  const handleDown = (value,variableSetter) =>{
    return ()=>{
      if(value <= 0) return
      variableSetter(value-1)
    }
  }
  const handleUp = (value,variableSetter) =>{
    return ()=>{
      variableSetter(value+1)
    }
  }
  const handleChange = (variableSetter) => {    // change value
    return (event) => variableSetter(Number(event.target.value));
  };

  return (
    <div style={{textAlign:'center'}} className="row justify-content-center">
      <div className="setWork">  
        <div><span className="title">set work duration</span></div>
        <button className="iconfont changeValueBtn" onClick={handleDown(workMinutes,setWorkMinutes)}>&#xe68a;</button>
        <input
          className="input"
          type="number"
          name="minutes"
          onChange={handleChange(setWorkMinutes)}
          value={workMinutes}
        />
        <button className="iconfont changeValueBtn" onClick={handleUp(workMinutes,setWorkMinutes)}>&#xe62b;</button>
      </div>
      <div className="setBreak">
        <div><span className="title">set break duration</span></div>
        <button className="iconfont changeValueBtn" onClick={handleDown(breakMinutes,setBreakMinutes)}>&#xe68a;</button>
        <input
          className="input"
          type="number"
          name="minutes"
          onChange={handleChange(setBreakMinutes)}
          value={breakMinutes}
        />
        <button className="iconfont changeValueBtn" onClick={handleUp(breakMinutes,setBreakMinutes)}>&#xe62b;</button>
      </div>
      
     <div className="align-self-end setTimer">
     <button
        onClick={() => {
          setWorkDurationMinutes(workMinutes);
          setBreakDurationMinutes(breakMinutes);
          setMinute(workMinutes);
          setSecond(0);
          setIsUserBreaking(false);
          setIsClockPlaying(false);
          setClockKey((prevKey) => prevKey + 1);
        }} 
        className ="btn btn-success"
      >
        Set Timer
      </button>
     </div>
    </div>
  );
}

function RenderTimeWork({ remainingTime }) {
  const {setMinute, setSecond, breakDurationMinutes} = useContext(remainingTimeContext);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  setMinute(minutes);
  setSecond(seconds);
  if (minutes == 0 & seconds == 0) {
    setMinute(breakDurationMinutes)
  }
  return (
    <div>
      <div className="text-center"> work </div>
      <div style={{ fontSize: 81 }}>{`${minutes}:${seconds}`}</div>
    </div>
  );
}

// in the future might be different with RenderTimeWork, now is the same
function RenderTimeBreak({ remainingTime }) {
  const {setMinute, setSecond, workDurationMinutes} = useContext(remainingTimeContext);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  setMinute(minutes);
  setSecond(seconds);
  if (minutes == 0 & seconds == 0) {
    setMinute(workDurationMinutes)
  }
  return (
    <div>
      <div className="text-center"> break </div>
      <div style={{ fontSize: 81 }}>{`${minutes}:${seconds}`}</div>
    </div>
  );
}

function PomodoroClock() {
  //todo: useEffect: on component dismount == click hold

  const {
    startTime,
    setStartTime,
    isUserBreaking,
    setIsUserBreaking,
    ClockKey,
    workDurationMinutes,
    breakDurationMinutes,
    isClockPlaying,
    setIsClockPlaying,
    minute,
    second,
  } = useContext(remainingTimeContext);

  // todo: make a soundService
  const audio_endbreak = new Audio(
    "https://www.fesliyanstudios.com/musicfiles/2016-08-23_-_News_Opening_4_-_David_Fesliyan.mp3"
  );
  const audio_endwork = new Audio(
    "https://www.fesliyanstudios.com/musicfiles/2016-08-23_-_News_Opening_5_-_David_Fesliyan.mp3"
  );

  const workCompleteHandler = () => {
    audio_endwork.play();
    setIsUserBreaking(true);
    setIsClockPlaying(true);
    submitRecord(startTime);
  };

  const breakCompleteHandler = () => {
    audio_endbreak.play();
    setIsUserBreaking(false);
    setIsClockPlaying(true); // todo: seems to be redundant
    setStartTime(getCurrentTime());
  };

  return (
    <>
      <div className="mt-5 mb-5 timerWrapper">
        {isUserBreaking ? (
          <CountdownCircleTimer
            {...breakTimerProps}
            key={100 + ClockKey}
            isPlaying={isClockPlaying}
            initialRemainingTime={minute * 60 + second}
            duration={breakDurationMinutes * 60}
            onComplete={breakCompleteHandler}
          >
            {RenderTimeBreak}
          </CountdownCircleTimer>
        ) : (
          <CountdownCircleTimer
            {...workTimerProps}
            key={ClockKey}
            isPlaying={isClockPlaying}
            initialRemainingTime={minute * 60 + second}
            duration={workDurationMinutes * 60}
            onComplete={workCompleteHandler}
          >
            {RenderTimeWork}
          </CountdownCircleTimer>
        )}
      </div>
      <ClockController />
      <ClockSettings />
    </>
  );
}

function PomodoroClockApp() {
  return (
    <RemainingTimeContextProvider>
      <PomodoroClock />
    </RemainingTimeContextProvider>
  );
}

function PomodoroView() {
  return (
    <div className="container">
      <PomodoroClockApp />
    </div>
  );
}

export default PomodoroView;

