import React, { Component, useState, useContext, createContext } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const remainingTimeContext = createContext();

function RemainingTimeContextProvider(props) {
  const [isBreaking, setIsBreaking] = useState(false);
  const [key, setKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [workDurationMinutes, setWorkDurationMinutes] = useState(0.2);
  const [breakDurationMinutes, setBreakDurationMinutes] = useState(0.1);
  const [remainingTime, setRemainingTime] = useState(0);

  return (
    <remainingTimeContext.Provider
      value={{
        isBreaking,
        setIsBreaking,
        key,
        setKey,
        isPlaying,
        setIsPlaying,
        workDurationMinutes,
        setWorkDurationMinutes,
        breakDurationMinutes,
        setBreakDurationMinutes,
        remainingTime,
        setRemainingTime,
      }}
    >
      {props.children}
    </remainingTimeContext.Provider>
  );
}

function RenderTimeWork({ remainingTime }) {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const { setRemainingTime } = useContext(remainingTimeContext);
  setRemainingTime(parseInt(remainingTime));
  return (
    <div>
      <div className="text-center"> work </div>
      <div style={{ fontSize: 81 }}>{`${minutes}:${seconds}`}</div>
    </div>
  );
}
function RenderTimeBreak({ remainingTime }) {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const { setRemainingTime } = useContext(remainingTimeContext);
  setRemainingTime(parseInt(remainingTime));
  return (
    <div>
      <div className="text-center"> break </div>
      <div style={{ fontSize: 81 }}>{`${minutes}:${seconds}`}</div>
    </div>
  );
}
function Controller() {
  const { remainingTime, setKey, setIsPlaying, setIsBreaking } = useContext(
    remainingTimeContext
  );
  return (
    <div className="row">
      <button onClick={() => setIsPlaying(true)}>GO</button>
      <button
        onClick={() => {
          alert(remainingTime);
          setKey((prevKey) => prevKey + 1);
          setIsPlaying(false);
          setIsBreaking(false);
        }}
      >
        Hold
      </button>
    </div>
  );
}

function Settings() {
  const [workMinutes, setWorkMinutes] = useState(20);
  const [breakMinutes, setBreakMinutes] = useState(2);
  const {
    setKey,
    setIsPlaying,
    setWorkDurationMinutes,
    setBreakDurationMinutes,
  } = useContext(remainingTimeContext);

  const handleChange = (variableSetter) => {
    return (event) => variableSetter(event.target.value);
  };

  return (
    <div>
      <div>set work duration</div>
      <input
        className="input"
        type="number"
        name="minutes"
        onChange={handleChange(setWorkMinutes)}
        value={workMinutes}
      />

      <div>set break duration</div>
      <input
        className="input"
        type="number"
        name="minutes"
        onChange={handleChange(setBreakMinutes)}
        value={breakMinutes}
      />
      <button
        onClick={() => {
          setWorkDurationMinutes(workMinutes);
          setBreakDurationMinutes(breakMinutes);
          setKey((prevKey) => prevKey + 1);
          setIsPlaying(false);
        }}
      >
        Set Timer
      </button>
    </div>
  );
}

const timerWrapper = {
  display: "flex",
  justifyContent: "center",
};

const workTimerProps = {
  colors: [
    ["#49DD78", 0.33],
    ["#FE6F6B", 0.33],
    ["#E71A1A", 0.33],
  ],
  strokeWidth: 8,
  size: 240,
  trailColor: "#151932",
};

const breakTimerProps = {
  colors: [
    ["#49DD78", 0.33],
    ["#49DD78", 0.33],
    ["#49DD78", 0.33],
  ],
  strokeWidth: 6,
  size: 220,
  trailColor: "#151932",
};

function PomodoroClock() {
  const {
    isBreaking,
    setIsBreaking,
    key,
    workDurationMinutes,
    breakDurationMinutes,
    isPlaying,
    setIsPlaying,
  } = useContext(remainingTimeContext);

  const audio_endbreak = new Audio(
    "https://www.fesliyanstudios.com/musicfiles/2016-08-23_-_News_Opening_4_-_David_Fesliyan.mp3"
  );
  const audio_endwork = new Audio(
    "https://www.fesliyanstudios.com/musicfiles/2016-08-23_-_News_Opening_5_-_David_Fesliyan.mp3"
  );

  return (
    <>
      <div className="mt-5 mb-5" style={timerWrapper}>
        {isBreaking ? (
          <CountdownCircleTimer
            {...breakTimerProps}
            key={100 + key}
            isPlaying={isPlaying}
            duration={breakDurationMinutes * 60}
            onComplete={() => {
              audio_endbreak.play();
              setIsBreaking(false);
              setIsPlaying(true); // playing breakingTimer
              //return [true, 0];
            }}
          >
            {RenderTimeBreak}
          </CountdownCircleTimer>
        ) : (
          <CountdownCircleTimer
            {...workTimerProps}
            key={key}
            isPlaying={isPlaying}
            duration={workDurationMinutes * 60}
            onComplete={() => {
              audio_endwork.play();
              setIsBreaking(true);
              setIsPlaying(true);
            }}
          >
            {RenderTimeWork}
          </CountdownCircleTimer>
        )}
      </div>
      <Controller />
      <Settings />
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

export default PomodoroClockApp;
