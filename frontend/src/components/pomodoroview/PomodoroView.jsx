
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
  const [m, setM] = useState(25);
  const [s, setS] = useState(0);

  useEffect ( () => {
    setData((data) => setStartTime(data), "startTime")
    setData((data) => setIsUserBreaking(data == "true"), "isUserBreaking")
    setData((data) => setClockKey(Number(data)), "ClockKey")
    setData((data) => setIsClockPlaying(data == "true"), "isClockPlaying")
    setData((data) => setWorkDurationMinutes(Number(data)), "workDurationMinutes")
    setData((data) => setBreakDurationMinutes(Number(data)), "breakDurationMinutes")
    setData((data) => setM(Number(data)), "M")
    setData((data) => setS(Number(data)), "S")
  }, [])

  useEffect ( () => {
    localStorage.setItem("startTime", startTime)
    localStorage.setItem("isUserBreaking", isUserBreaking)
    localStorage.setItem("ClockKey", ClockKey)
    localStorage.setItem("isClockPlaying", isClockPlaying)
    localStorage.setItem("workDurationMinutes", workDurationMinutes)
    localStorage.setItem("breakDurationMinutes", breakDurationMinutes)
    localStorage.setItem("M", m)
    localStorage.setItem("S", s)
  })

  function setData(func, key) {
    const data = localStorage.getItem(key)
    if (data) {
      func(data)
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
        m,
        setM,
        s,
        setS
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
    setM,
    setS,
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
      setM(workDurationMinutes);
      setS(0)
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
    setM,
    setS
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
          setM(workMinutes);
          setS(0);
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
  const {setM, setS, breakDurationMinutes} = useContext(remainingTimeContext);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  setM(minutes);
  setS(seconds);
  if (minutes == 0 & seconds == 0) {
    setM(breakDurationMinutes)
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
  const {setM, setS, workDurationMinutes} = useContext(remainingTimeContext);
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  setM(minutes);
  setS(seconds);
  if (minutes == 0 & seconds == 0) {
    setM(workDurationMinutes)
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
    m,
    s,
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
            initialRemainingTime={m * 60 + s}
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
            initialRemainingTime={m * 60 + s}
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

