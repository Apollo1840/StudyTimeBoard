import React, { Component, useState, useContext, createContext } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";

const remainingTimeContext = createContext();

function RemainingTimeContextProvider(props) {
  const [remainingTime, setRemainingTime] = useState(0);

  return (
    <remainingTimeContext.Provider
      value={{
        remainingTime,
        setRemainingTime,
      }}
    >
      {props.children}
    </remainingTimeContext.Provider>
  );
}

function RenderTime({ remainingTime }) {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  const { setRemainingTime } = useContext(remainingTimeContext);
  setRemainingTime(parseInt(remainingTime));
  return <div style={{ fontSize: 81 }}>{`${minutes}:${seconds}`}</div>;
}

function ButtonStop({ setKey, setIsPlaying }) {
  const { remainingTime } = useContext(remainingTimeContext);
  return (
    <button
      onClick={() => {
        alert(remainingTime);
        setKey((prevKey) => prevKey + 1);
        setIsPlaying(false);
      }}
    >
      Hold
    </button>
  );
}

const timerWrapper = {
  display: "flex",
  justifyContent: "center",
};
const timerProps = {
  colors: [
    ["#FE6F6B", 0.33],
    ["#FE6F6B", 0.33],
    ["#FE6F6B", 0.33],
  ],
  strokeWidth: 6,
  size: 220,
  trailColor: "#151932",
};

function PomodoroClock({ durationMinutes = 1 }) {
  const [key, setKey] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <RemainingTimeContextProvider>
      <div className="mt-5 mb-5" style={timerWrapper}>
        <CountdownCircleTimer
          {...timerProps}
          key={key}
          isPlaying={isPlaying}
          duration={durationMinutes * 60}
          onComplete={() => {
            //stopAimate();
          }}
        >
          {RenderTime}
        </CountdownCircleTimer>
      </div>
      <div className="row">
        <button onClick={() => setIsPlaying(true)}>GO</button>
        <ButtonStop setKey={setKey} setIsPlaying={setIsPlaying} />
      </div>
    </RemainingTimeContextProvider>
  );
}

export default PomodoroClock;
