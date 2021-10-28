import React, { useState } from "react";
import classNames from "../utils/class-names";
import useInterval from "../utils/useInterval";
import {minutesToDuration, secondsToDuration} from "../utils/duration";
import Title from "./Title";


function nextTick(prevState) {
  const timeRemaining = Math.max(0, prevState.timeRemaining - 1);
  return {
    ...prevState,
    timeRemaining,
  };
}


function nextSession(focusDuration, breakDuration) {
  
  return (currentSession) => {
    if (currentSession.label === "Focusing") {
      return {
        label: "On Break",
        timeRemaining: breakDuration * 60,
      };
    }
    return {
      label: "Focusing",
      timeRemaining: focusDuration * 60,
    };
  };
}

function Pomodoro() {
  
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [session, setSession] = useState(null);
  
  const [focusDuration, setFocusDuration] = useState(25);
  const [breakDuration, setFocusDuration] = useState(5);

  
  useInterval(() => {
      if (session.timeRemaining === 0) {
        new Audio("https://bigsoundbank.com/UPLOAD/mp3/1482.mp3").play();
        return setSession(nextSession(focusDuration, breakDuration));
      }
      return setSession(nextTick);
    },
    isTimerRunning ? 1000 : null
  );

  
  function playPause() {
    setIsTimerRunning((prevState) => {
      const nextState = !prevState;
      if (nextState) {
        setSession((prevStateSession) => {
          
          if (prevStateSession === null) {
            return {
              label: "Focusing",
              timeRemaining: focusDuration * 60,
            };
          }
          return prevStateSession;
        });
      }
      return nextState;
    });
  }

  function handleDecreaseFocus() {
    if (focusDuration === 5) return;
    setFocusDuration((duration) => duration - 5);
  }

  function handleIncreaseFocus() {
    if (focusDuration === 60) return;
    setFocusDuration((duration) => duration + 5);
  }

  function handleDecreaseBreak() {
    if (breakDuration === 1) return;
    setBreakDuration((duration) => duration - 1);
  }

  function handleIncreaseBreak() {
    if (breakDuration === 15) return;
    setBreakDuration((duration) => duration + 1);
  }

  function handleStop() {
    setIsTimerRunning(false);
    setSession(null);
  }

  return (
    <div className="pomodoro">
      <div className="row">
        <div className="col">

          <div className="input-group input-group-lg mb-2">
            <span className="input-group-text" data-testid="duration-focus">
              Focus Duration: {minutesToDuration(focusDuration)}
            </span>
            <div className="input-group-append">
              
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="decrease-focus"
                onClick={handleDecreaseFocus}
                disabled={session}
              >
                <span className="oi oi-minus" />
              </button>
              
              <button
                type="button"
                className="btn btn-secondary"
                data-testid="increase-focus"
                onClick={handleIncreaseFocus}
                disabled={session}
              >
                <span className="oi oi-plus" />
              </button>
            </div>
          </div>
        </div>

        <div className="col">
          <div className="float-right">
            <div className="input-group input-group-lg mb-2">
              <span className="input-group-text" data-testid="duration-break">
                
                Break Duration: {minutesToDuration(breakDuration)}
              </span>
              <div className="input-group-append">
                
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="decrease-break"
                  onClick={handleDecreaseBreak}
                  disabled={session}
                >
                  <span className="oi oi-minus" />
                </button>
                
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-testid="increase-break"
                  onClick={handleIncreaseBreak}
                  disabled={session}
                >
                  <span className="oi oi-plus" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col">
          <div
            className="btn-group btn-group-lg mb-2"
            role="group"
            aria-label="Timer controls"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-testid="play-pause"
              title="Start or pause timer"
              onClick={playPause}
            >
              <span
                className={classNames({
                  oi: true,
                  "oi-media-play": !isTimerRunning,
                  "oi-media-pause": isTimerRunning,
                })}
              />
            </button>
            
            <button
              type="button"
              className="btn btn-secondary"
              data-testid="stop"
              title="Stop the session"
              disabled={!session}
              onClick={handleStop}
            >
              <span className="oi oi-media-stop" />
            </button>
          </div>
        </div>
      </div>

      <div>
       <Title
        session={session}
        minutesToDuration={minutesToDuration}
        focusDuration={focusDuration}
        breakDuration={breakDuration}
        secondsToDuration={secondsToDuration}
        nextSession={nextSession}
        />
      </div>
    </div>
  );
}

export default Pomodoro;

