import { useState, useRef, useEffect } from "react";

const StoryCard = ({ holdState }) => {
  const [isHolding, setIsHolding] = useState(holdState);
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const [render, setRender] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

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
    setIsHolding(true);
    timerRef.current = setTimeout(() => {
      videoRef.current?.play();
    }, 500);
  };

  // Tamatkan hold / cancel
  const handlePressEnd = (e) => {
    e.preventDefault && e.preventDefault();
    setIsHolding(false);
    clearTimeout(timerRef.current);
    // pause video ketika lepas
    videoRef.current?.pause();
  };

  // Mencegah menu konteks pada right-click / long-press
  const handleContextMenu = (e) => {
    e.preventDefault();
  };

  // Cegah drag pada video (mengurangi kemungkinan "download")
  const handleDragStart = (e) => {
    e.preventDefault();
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
        className={`customBorder size-[160px] ignielPelangi rounded-[24px] cursor-pointer relative flex justify-center items-center transition-all duration-300 ${
          isHolding ? "z-50" : "z-10"
        }`}
      >
        <section
          className={`video-1 ${
            showVideo ? "animate-previewOpen" : "animate-previewClose"
          } size-[150px] rounded-[20px] absolute overflow-hidden`}
          // nonaktifkan callout / selection untuk mobile
          style={{
            WebkitTouchCallout: "none",
            userSelect: "none",
          }}
        >
          {/* Video element: atribut tambahan */}
          <video
            ref={videoRef}
            src="/video/video.mp4"
            className="size-full object-cover rounded-[20px]"
            playsInline
            muted={true}
            // untuk autoplay on mobile biasanya harus muted
            controls={false} // sembunyikan controls (atau set true jika mau)
            draggable={false}
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
            // controlsList mencegah tombol download pada browser yang support
            controlsList="nodownload noremoteplayback"
          />

          <div
            className="absolute inset-0"
            // mouse events (desktop)
            onMouseDown={handlePressStart}
            onMouseUp={handlePressEnd}
            onMouseLeave={handlePressEnd}
            // touch events (mobile)
            onTouchStart={handlePressStart}
            onTouchEnd={handlePressEnd}
            onTouchCancel={handlePressEnd}
            // cegah contextmenu pada overlay juga
            onContextMenu={handleContextMenu}
            // pastikan overlay di atas video
            style={{ zIndex: 20 }}
          ></div>
        </section>
      </div>
    </>
  );
};

export default StoryCard;
