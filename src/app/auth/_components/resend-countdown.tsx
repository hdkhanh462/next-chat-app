import { useRef, useState } from "react";
import Countdown from "react-countdown";

type Props = {
  onCompleteClick?: () => void;
};

export default function ResendCountdown({ onCompleteClick }: Props) {
  const [isComplete, setIsComplete] = useState(false);
  const targetDateRef = useRef(Date.now() + 59000);

  if (isComplete) {
    return (
      <div
        className="underline cursor-pointer"
        onClick={() => {
          onCompleteClick?.();
          setIsComplete(false);
          targetDateRef.current = Date.now() + 59000;
        }}
      >
        Resend email
      </div>
    );
  }

  return (
    <div>
      Resend email in{" "}
      <Countdown
        date={targetDateRef.current}
        onComplete={() => setIsComplete(true)}
        renderer={({ seconds }) => <span>({seconds}s)</span>}
      />
    </div>
  );
}
