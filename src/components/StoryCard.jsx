import { useState, useRef, useEffect } from "react";

const StoryCard = ({ holdState, url }) => {
  const [isHolding, setIsHolding] = useState(holdState);
  const timerRef = useRef(null);
  const videoRef = useRef(null);
  const overlayRef = useRef(null);
  const holdingRef = useRef(false);
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
    holdingRef.current = true;

    // mulai play setelah delay
    timerRef.current = setTimeout(() => {
      if (holdingRef.current) videoRef.current?.play();
    }, 500);

    // pasang listener global, biar gak ke-reset saat re-render
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
        className={`customBorder size-40 ignielPelangi rounded-3xl cursor-pointer relative flex justify-center items-center transition-all duration-300 ${
          isHolding ? "z-50" : "z-10"
        }`}
        onContextMenu={handleContextMenu}
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
            src={url}
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
            ref={overlayRef}
            className="absolute inset-0"
            onPointerDown={handlePressStart}
            onContextMenu={(e) => e.preventDefault()}
            style={{ zIndex: 20 }}
          ></div>
        </section>
      </div>
    </>
  );
};

export default StoryCard;
