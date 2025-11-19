import { useState, useRef, useEffect } from "react";

const StoryCard = ({
  url,
  file_path,
  story_type,
  id,
  description,
  onEdit,
  onDelete,
  setIsPlaying
}) => {
  const [isHolding, setIsHolding] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(
    () => window.matchMedia("(hover: none) and (pointer: coarse)").matches
  );
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const holdingRef = useRef(false);
  const recentlyHeldRef = useRef(false);
  const [render, setRender] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const handleMediaChange = (e) => {
      setIsTouchDevice(e.matches);
    };

    const mediaQuery = window.matchMedia("(hover: none) and (pointer: coarse)");
    mediaQuery.addEventListener("change", handleMediaChange);

    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  // Hide actions when holding/preview is active
  useEffect(() => {
    if (isHolding) {
      setRender(true);
      setShowVideo(true);
    } else {
      setShowVideo(false);
      // Tunggu animasi close selesai sebelum unmount
      const timeout = setTimeout(() => {
        setRender(false);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [isHolding]);

  // Mulai hitung long-press
  const handlePressStart = () => {
    holdingRef.current = true;

    // mulai play setelah delay
    timerRef.current = setTimeout(() => {
      setIsHolding(true);
      if (holdingRef.current) videoRef.current?.play();
    }, 500);

    window.addEventListener("pointerup", handleGlobalPointerUp);
    window.addEventListener("pointercancel", handleGlobalPointerUp);
  };

  const handleGlobalPointerUp = () => {
    holdingRef.current = false;
    setIsHolding(false);
    clearTimeout(timerRef.current);
    videoRef.current?.pause();

    // hapus listener biar gak numpuk
    window.removeEventListener("pointerup", handleGlobalPointerUp);
    window.removeEventListener("pointercancel", handleGlobalPointerUp);
    // mark that long-press happened, so click doesn't also open player
    recentlyHeldRef.current = true;
    setTimeout(() => (recentlyHeldRef.current = false), 500);
  };

  // Mencegah menu konteks pada right-click / long-press
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  // Cegah drag pada video (mengurangi kemungkinan "download")
  const handleDragStart = (e) => {
    e.preventDefault();
  };

  const handleMouseEnter = () => {
    setShowActions(true);
  };

  const handleMouseLeave = () => {
    setShowActions(false);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    onEdit({ id, description, url, file_path, story_type });
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this story?")) {
      console.log(file_path);
      onDelete(id, file_path);
    }
  };

  return (
    <>
      {render && (
        <div
          className={`background-preview bg-[rgba(0,0,0,0.9)] absolute top-0 size-full z-20 ${
            showVideo ? "animate-bgPreviewOpen" : "animate-bgPreviewClose"
          }`}
        ></div>
      )}

      <div
        ref={cardRef}
        className={`story-card customBorder size-40 ignielPelangi rounded-3xl cursor-pointer relative flex justify-center items-center transition-all duration-300 ${
          isHolding ? "z-50" : "z-10"
        }`}
        onContextMenu={handleContextMenu}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <section
          className={`video-1 ${
            render
              ? showVideo
                ? "animate-previewOpen"
                : "animate-previewClose"
              : ""
          } size-[150px] rounded-[20px] absolute overflow-hidden`}
          // nonaktifkan callout / selection untuk mobile
          style={{
            WebkitTouchCallout: "none",
            userSelect: "none",
          }}
        >
          {story_type === "video" ? (
            <video
              ref={videoRef}
              src={url}
              className="size-full object-cover rounded-[20px]"
              playsInline
              muted={true}
              controls={false} // sembunyikan controls
              draggable={false}
              onContextMenu={handleContextMenu}
              onDragStart={handleDragStart}
              // controlsList mencegah tombol download pada browser yang support
              controlsList="nodownload noremoteplayback"
            />
          ) : (
            <img
              src={url}
              className="size-full object-cover rounded-[20px]"
              alt=""
            />
          )}

          <div
            ref={overlayRef}
            className="absolute inset-0"
            onPointerDown={handlePressStart}
            onClick={() => {
              if (!isHolding) {
                setIsPlaying((prev) => ({url, story_type, bool: !prev.bool }));
              }
            }}
            onContextMenu={(e) => e.preventDefault()}
            style={{ zIndex: 20 }}
          ></div>
        </section>

        {/* Action Buttons - always show on touch devices, hover on desktop */}
        {(showActions || isTouchDevice) && isHolding === false && (
          <div className="absolute top-2 right-2 flex gap-2 z-30 bg-black/60 rounded-lg p-2 backdrop-blur-sm">
            <button
              onClick={handleEditClick}
              className="p-1.5 bg-[#E91E63] hover:bg-[#FF9800] rounded-md transition-colors duration-200"
              title="Edit"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={handleDeleteClick}
              className="p-1.5 bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-200"
              title="Delete"
            >
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default StoryCard;
