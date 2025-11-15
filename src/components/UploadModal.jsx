import {useEffect, useState, useRef, useCallback} from "react";
import {createPortal} from "react-dom";
import NotificationToast from "./NotificationToast";
import { insertStory } from "../lib/api";
import useUpload from "../hooks/useUpload";

const MAX_VIDEO_SIZE_BYTES = 40 * 1024 * 1024; // 40 MB

export default function UploadModal({onClose, refetchStories}) {
 
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(true);
  const fileInputRef = useRef(null);
  const anonId = localStorage.getItem("anonId");
  const [notification, setNotification] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [description, setDescription] = useState("");
  const { isSubmitting, uploadFile } = useUpload();
  const [mediaError, setMediaError] = useState("");

  const handleSubmitForAddStory = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (!mediaFile) {
      setMediaError("Please select a valid media file before saving.");
      return;
    }

    setMediaError("");
    const upload = await uploadFile(mediaFile);

    if (upload.success) {
      await insertStory(
        anonId,
        upload.filePath,
        description,
        mediaFile.type.startsWith("video/") ? "video" : "image"
      );
      setNotification({
        type: "success",
        message: "Story uploaded successfully!",
      });
      // Reset form
      setMediaFile(null);
      setDescription("");
      // Refetch stories to show the new story in real-time
      refetchStories();
      // Modal will auto-close with animation via UploadModal's useEffect
    } else {
      setNotification({
        type: "error",
        message: `Upload failed: ${upload.error}`,
      });
    }
  };

  // Trigger opening animation
  useEffect(() => {
    // Small delay to ensure the element is rendered before animating
    const timer = setTimeout(() => {
      setIsOpening(false);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    // Clear notification when closing
    setNotification(null);
    setTimeout(() => {
      onClose?.();
    }, 300); // Match animation duration
  }, [onClose]);

  const handleMediaChange = (event) => {
    const fileList = event.target.files;
    const file = fileList?.[0] ?? null;
    
    // If user cancels file selection (empty fileList), keep the previous file
    // and reset the input value to allow re-selection of the same file
    if (!file) {
      // Reset input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    const isVideo = file.type.startsWith("video/");

    if (isVideo && file.size > MAX_VIDEO_SIZE_BYTES) {
      setMediaError("Video file is too large. Please choose a video under 40MB.");
      // Reset input value on error
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    setMediaError("");
    setMediaFile(file);
    // Reset input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // Auto-hide notification after 3 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  // Auto-close modal with animation after successful upload
  useEffect(() => {
    if (notification?.type === 'success') {
      const timer = setTimeout(() => {
        handleClose();
      }, 1500); // Wait 1.5 seconds to show success message, then close with animation
      return () => clearTimeout(timer);
    }
  }, [notification, handleClose]);

  return (
    <>
      {notification && createPortal(
        <NotificationToast
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />,
        document.body
      )}
      <div className={`fixed inset-0 z-40 overflow-y-auto px-4 py-8 transition-all duration-300 ${
        isClosing || isOpening
          ? 'bg-black/0 backdrop-blur-0' 
          : 'bg-black/70 backdrop-blur-sm'
      }`}>
        <div className={`relative mx-auto my-6 flex w-full max-w-2xl flex-col rounded-3xl border border-white/10 bg-[#111111] text-white shadow-2xl transition-all duration-300 ${
          isClosing 
            ? 'opacity-0 scale-95 translate-y-4' 
            : isOpening
            ? 'opacity-0 scale-95 translate-y-4'
            : 'opacity-100 scale-100 translate-y-0'
        }`}>
        <button
          type="button"
          aria-label="Close add story form"
          className="absolute right-4 top-4 h-9 w-9 rounded-full border border-white/20 bg-black/40 text-lg font-bold text-white transition hover:scale-105 hover:border-white/40 hover:bg-black/70 cursor-pointer"
          onClick={handleClose}
        >
          x
        </button>

        <div className="w-full rounded-t-3xl bg-linear-to-r from-[#9C27B0] via-[#E91E63] to-[#FF9800] pb-8 pt-16 sm:pt-12">
          <div className="px-6 sm:px-8">
            <h2 className="font-montserrat text-2xl font-extrabold tracking-wide text-white drop-shadow-lg sm:text-3xl">
              Add New Story
            </h2>
            <p className="mt-2 max-w-xl font-poppins text-sm text-white/80">
              Upload image or video and describe your moment. You can rearrange or adjust later.
            </p>
          </div>
        </div>

        <form
          className="space-y-8 px-6 pb-10 pt-8 sm:px-8"
          onSubmit={handleSubmitForAddStory}
        >
          <div>
            <h3 className="font-montserrat text-lg font-semibold text-[#FFDEB9]">
              Story Media
            </h3>
            <p className="mt-1 text-sm text-white/60">
              Choose an image or video that captures the moment you want to share.
            </p>

            <label className="mt-6 block cursor-pointer">
              <div className="group flex min-h-44 flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-center transition hover:border-white/40 hover:bg-white/10">
                {mediaFile ? (
                  <MediaPreview file={mediaFile} />
                ) : (
                  <div className="space-y-1">
                    <p className="font-montserrat text-sm font-semibold uppercase tracking-wide text-white/80">
                      Drag & drop or click to browse
                    </p>
                    <p className="text-xs text-white/60">
                      PNG, JPG, GIF or MP4 (max 40MB for video)
                    </p>
                  </div>
                )}
                <span className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-[#9C27B0] via-[#E91E63] to-[#FF9800] px-4 py-1 font-montserrat text-xs font-semibold uppercase tracking-wide text-black">
                  {mediaFile ? "Change File" : "Upload Media"}
                </span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                className="sr-only"
                onChange={handleMediaChange}
              />
              {mediaError && (
                <p className="mt-3 text-sm font-medium text-red-400">
                  {mediaError}
                </p>
              )}
            </label>
          </div>

          <div>
            <label
              className="font-montserrat text-lg font-semibold text-[#FFDEB9]"
              htmlFor="story-description"
            >
              Story Description
            </label>
            <textarea
              id="story-description"
              name="description"
              placeholder="Tell everyone what makes this story special..."
              className="mt-3 h-32 w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-poppins text-sm text-white placeholder:text-white/40 focus:border-[#E91E63] focus:outline-none focus:ring-2 focus:ring-[#E91E63]/40"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col-reverse items-center justify-between gap-4 md:flex-row">
            <button
              type="button"
              className="font-montserrat text-sm font-semibold uppercase tracking-wide text-white/70 transition hover:text-white cursor-pointer"
              onClick={handleClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex items-center gap-3 rounded-full bg-linear-to-r from-[#9C27B0] via-[#E91E63] to-[#FF9800] px-6 py-3 font-montserrat text-sm font-bold uppercase tracking-[2px] text-black transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              <span>{isSubmitting ? "Saving..." : "Save Story"}</span>
            </button>
          </div>
        </form>
        </div>
      </div>
    </>
  );
}

function MediaPreview({file}) {
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  if (!file) return null;

  const isVideo = file.type.startsWith("video/");

  return (
    <div className="w-full max-w-sm">
      {previewUrl ? (
        isVideo ? (
          <video
            src={previewUrl}
            controls
            className="aspect-video w-full rounded-xl border border-white/10 object-cover"
          />
        ) : (
          <img
            src={previewUrl}
            alt={file.name}
            className="aspect-video w-full rounded-xl border border-white/10 object-cover"
          />
        )
      ) : (
        <div className="flex h-32 w-full items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-white/60">
          Preview unavailable
        </div>
      )}
      <p className="mt-3 truncate font-montserrat text-sm font-semibold uppercase tracking-wide text-white/80">
        {file.name}
      </p>
    </div>
  );
}