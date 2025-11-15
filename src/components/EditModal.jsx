import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { updateStory } from "../lib/api";
import NotificationToast from "./NotificationToast";

const MAX_VIDEO_SIZE_BYTES = 40 * 1024 * 1024; // 40 MB

const EditModal = ({ story, onClose, onSave }) => {
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(true);
  const [notification, setNotification] = useState(null);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaError, setMediaError] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpening(false), 10);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (story) setDescription(story.description || "");
  }, [story]);

  const handleMediaChange = (event) => {
    const fileList = event.target.files;
    const file = fileList?.[0] ?? null;

    if (!file) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    const isVideo = file.type.startsWith("video/");

    if (isVideo && file.size > MAX_VIDEO_SIZE_BYTES) {
      setMediaError(
        "Video file is too large. Please choose a video under 40MB."
      );
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setMediaError("");
    setMediaFile(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = useCallback(() => {
    setIsClosing(true);
    // Clear notification when closing
    setNotification(null);
    setTimeout(() => {
      onClose?.();
    }, 300); // Match animation duration
  }, [onClose]);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 3000);
    return () => clearTimeout(timer);
  }, [notification]);

  useEffect(() => {
    if (notification?.type !== "success") return;
    const timer = setTimeout(() => handleClose(), 1500);
    return () => clearTimeout(timer);
  }, [notification, handleClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const updates = { description };

      if (mediaFile) {
        await updateStory(
          story.id,
          updates,
          story.file_path,
          mediaFile.type.startsWith("video/") ? "video" : "image",
          mediaFile
        );
      }

      setNotification({
        type: "success",
        message: "Story updated successfully!",
      });
      setMediaFile(null);
      setTimeout(() => onSave?.(), 500);
    } catch (error) {
      setNotification({
        type: "error",
        message: `Failed to update: ${error.message}`,
      });
      setIsSubmitting(false);
    }
  };

  if (!story) return null;

  return (
    <>
      {notification &&
        createPortal(
          <NotificationToast
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification(null)}
          />,
          document.body
        )}

      <div
        className={`fixed inset-0 z-40 overflow-y-auto px-4 py-8 transition-all duration-300 ${
          isClosing || isOpening
            ? "bg-black/0 backdrop-blur-0"
            : "bg-black/70 backdrop-blur-sm"
        }`}
      >
        <div
          className={`relative mx-auto my-6 flex w-full max-w-2xl flex-col rounded-3xl border border-white/10 bg-[#111111] text-white shadow-2xl transition-all duration-300 ${
            isClosing
              ? "opacity-0 scale-95 translate-y-4"
              : isOpening
              ? "opacity-0 scale-95 translate-y-4"
              : "opacity-100 scale-100 translate-y-0"
          }`}
        >
          <button
            type="button"
            aria-label="Close edit story form"
            className="absolute right-4 top-4 h-9 w-9 rounded-full border border-white/20 bg-black/40 text-lg font-bold text-white transition hover:scale-105 hover:border-white/40 hover:bg-black/70 cursor-pointer"
            onClick={handleClose}
          >
            x
          </button>

          <div className="w-full rounded-t-3xl bg-linear-to-r from-[#9C27B0] via-[#E91E63] to-[#FF9800] pb-8 pt-16 sm:pt-12">
            <div className="px-6 sm:px-8">
              <h2 className="font-montserrat text-2xl font-extrabold tracking-wide text-white drop-shadow-lg sm:text-3xl">
                Edit Story
              </h2>
              <p className="mt-2 max-w-xl font-poppins text-sm text-white/80">
                Update your story description and keep your moment fresh.
              </p>
            </div>
          </div>

          <form
            className="space-y-8 px-6 pb-10 pt-8 sm:px-8"
            onSubmit={handleSubmit}
          >
            <div>
              <h3 className="font-montserrat text-lg font-semibold text-[#FFDEB9]">
                Story Media
              </h3>
              <p className="mt-1 text-sm text-white/60">
                View and change your story media (optional).
              </p>

              <label className="mt-6 block cursor-pointer">
                <div className="group flex min-h-44 flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-white/15 bg-white/5 p-6 text-center transition hover:border-white/40 hover:bg-white/10">
                  {mediaFile ? (
                    <MediaPreview file={mediaFile} />
                  ) : (
                    <div className="w-full max-w-sm">
                      {story.story_type === "video" ? (
                        <video
                          src={story.url}
                          controls
                          className="aspect-video w-full rounded-xl border border-white/10 object-cover"
                        />
                      ) : (
                        <img
                          src={story.url}
                          alt={story.description}
                          className="aspect-video w-full rounded-xl border border-white/10 object-cover"
                        />
                      )}
                    </div>
                  )}
                  <span className="inline-flex items-center justify-center rounded-full bg-linear-to-r from-[#9C27B0] via-[#E91E63] to-[#FF9800] px-4 py-1 font-montserrat text-xs font-semibold uppercase tracking-wide text-black">
                    Change Media
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
                onChange={(e) => setDescription(e.target.value)}
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
                <span>{isSubmitting ? "updating..." : "Update Story"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

function MediaPreview({ file } ) {
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
      {previewUrl || file.url ? (
        isVideo ? (
          <video
            src={previewUrl || file.url}
            controls
            className="aspect-video w-full rounded-xl border border-white/10 object-cover"
          />
        ) : (
          <img
            src={previewUrl || file.url}
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

export default EditModal;
