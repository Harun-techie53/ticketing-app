import React, { useEffect, useState } from "react";

const ExpirationCountdown = ({ expiresAt }: { expiresAt: Date }) => {
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const expiration = new Date(expiresAt).getTime();
    const difference = expiration - now;

    const totalSeconds = Math.floor(difference / 1000);
    if (totalSeconds <= 0) {
      return {
        minutes: 0,
        seconds: 0,
        isRunningOut: false,
      };
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return { minutes, seconds, isRunningOut: totalSeconds < 120 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [expiresAt]);

  return (
    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
      <div className="flex items-end gap-3">
        <div className="flex flex-col">
          <span className="countdown font-mono text-lg">
            <span
              style={{ "--value": timeLeft.minutes } as React.CSSProperties}
              aria-label={`${timeLeft.minutes} minutes`}
            >
              {timeLeft.minutes}
            </span>
          </span>
          min
        </div>
        :
        <div className="flex flex-col">
          <span className="countdown font-mono text-lg">
            <span
              style={{ "--value": timeLeft.seconds } as React.CSSProperties}
              aria-label={`${timeLeft.seconds} seconds`}
            >
              {timeLeft.seconds}
            </span>
          </span>
          sec
        </div>
        <p className="text-gray-500">Left</p>
      </div>
      {timeLeft.isRunningOut && (
        <p className="text-xs text-red-500 mt-1 text-center font-semibold">
          ⏳ Hurry! Less than 2 minutes remaining
        </p>
      )}
    </div>
  );
};

export default ExpirationCountdown;
