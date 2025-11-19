import { useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
const StoryPlayer = ({ story_type, story_url, setIsPlaying }) => {
  const [isTouchDevice, setIsTouchDevice] = useState(
    () => window.matchMedia("(hover: none) and (pointer: coarse)").matches
  );

  const videoRef = useRef(null);
  const timerRef = useRef(null);
  const [isHolding, setIsHolding] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const handleMediaChange = (e) => {
      setIsTouchDevice(e.matches);
    };

    const mediaQuery = window.matchMedia("(hover: none) and (pointer: coarse)");
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  const handlePressStart = () => {
    if (isTouchDevice) {
      timerRef.current = setTimeout(() => {
        setIsHolding(true);
        setIsPaused(true);
      }, 100);
    }
  };

  const handlePressEnd = () => {
    if (isTouchDevice) {
      clearTimeout(timerRef.current);
      setIsHolding(false);
      setIsPaused(false);
    }
  };

  useEffect(() => {
    if (isHolding && isPaused) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [isHolding, isPaused]);

  const preventDefault = (e) => {
    e.preventDefault();
  };

  // state untuk mengontrol suara
  const [isMuted, setIsMuted] = useState(false);

  // hitung jumlah story
  const [stories, setStories] = useState(0);
  useEffect(() => {
    setStories(document.querySelectorAll(".story-card").length);
  }, []);

  return (
    <div
      className="wrapper absolute size-full overflow-hidden flex justify-center items-center bg-black z-20"
      onPointerDown={handlePressStart}
      onPointerUp={handlePressEnd}
      onContextMenu={preventDefault}
      onDragStart={preventDefault}
      onPointerLeave={handlePressEnd}
    >
      <section className="video-player relative size-full flex items-center justify-center flex-col">
        {/* progress bar */}
        <div className="progress-bar-wrapper w-full h-2 flex justify-center items-center absolute top-2 gap-x-2 px-1">
          {
            <>
              {Array.from({ length: stories }, (_, index) => (
                <div
                key={index}
                  className={`progress-bar w-[${Math.round(
                    100 / stories
                  )}%] h-full rounded-full bg-gray-500 relative overflow-hidden`}
                >
                  <div className="absolute top-0 left-0 w-[30%] h-full bg-white"></div>
                </div>
              ))}
            </>
          }
        </div>

        <div className="button-wrapper size-fit absolute right-6 top-10 flex justify-center items-center flex-row gap-x-4">
          {/* button close story player */}
          <button
            onClick={() => setIsPlaying(false)}
            className="size-fit cursor-pointer"
          >
            <Icon
              icon={"material-symbols:close-rounded"}
              style={{
                fontSize: "30px",
                color: "white",
                stroke: "white",
                strokeWidth: "1px",
              }}
            />
          </button>

          {/* button untuk play / pause video */}
          {!isTouchDevice && (
            <button onClick={() => setIsPaused(!isPaused)}>
              <Icon
                icon={`${isPaused ? "fe:pause" : "fe:play"}`}
                style={{ fontSize: "30px", color: "white" }}
              />
            </button>
          )}

          {/* button untuk mengontrol suara */}
          {story_type === "video" && (
            <button onClick={() => setIsMuted(!isMuted)}>
              <Icon
                icon={`lets-icons:${
                  isMuted ? "sound-mute-fill" : "sound-max-fill"
                }`}
                style={{
                  fontSize: "30px",
                  color: "white",
                  stroke: "white",
                  strokeWidth: "0.5px",
                }}
              />
            </button>
          )}
        </div>

        {story_type === "video" ? (
          <video
            ref={videoRef}
            className="size-fit bg-cover"
            src={story_url}
            autoPlay
            muted={isMuted}
            loop
            controlsList="nodownload noremoteplayback"
          ></video>
        ) : (
          <img className="size-fit bg-cover" src={story_url} alt={story_type} />
        )}
      </section>
    </div>
  );
};

export default StoryPlayer;
