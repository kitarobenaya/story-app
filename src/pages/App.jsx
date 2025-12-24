import { useState, useEffect } from "react";
import useStories from "../hooks/useStories";
import useStoryExpiration from "../hooks/useStoryExpiration";
import Navbar from "../components/Navbar";
import StoryCard from "../components/StoryCard";
import UploadModal from "../components/UploadModal";
import EditModal from "../components/EditModal";
import Loading from "../components/Loading";
import StoryPlayer from "../components/StoryPlayer";

export default function App() {
  const { stories, message, deleteStory, refetchStories } = useStories(
    localStorage.getItem("anonId")
  );
  useStoryExpiration(stories);
  const isLoading = message === "Fetching...";
  const [mascot, setMascot] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isClosingModal, setIsClosingModal] = useState(false);
  const [editingStory, setEditingStory] = useState(null);
  const [isPlaying, setIsPlaying] = useState({ bool: false });

  const handleOpenAddForm = () => {
    setShowAddForm(true);
    setIsClosingModal(false);
    setMascot(false);
  };

  const handleCloseAddForm = () => {
    setIsClosingModal(true);
    // Wait for animation to complete before unmounting
    setTimeout(() => {
      setShowAddForm(false);
      setIsClosingModal(false);
    }, 300); // Match animation duration
  };

  const handleEditStory = (story) => {
    setEditingStory(story);
  };

  const handleDeleteStory = async (id, file_path) => {
    await deleteStory(id, file_path);
  };

  const handleEditSave = () => {
    setEditingStory(null);
    refetchStories();
  };

  return (
    <>
      <Navbar />

      <div className="button-story w-full h-20 flex items-center relative z-20">
        <button
          className="bg-linear-to-r from-[#9C27B0] via-[#E91E63] to-[#FF9800] w-[134px] h-[39px] text-[16px] font-montserrat text-default rounded-full flex justify-center items-center cursor-pointer font-bold tracking-[1px] absolute right-2.5 p-1"
          onClick={handleOpenAddForm}
        >
          <div className="size-full bg-black rounded-full flex justify-center items-center">
            Add Story
          </div>
        </button>
      </div>

      {(showAddForm || isClosingModal) && (
        <UploadModal
          onClose={handleCloseAddForm}
          refetchStories={refetchStories}
        />
      )}

      {/* Edit Modal */}
      {editingStory && (
        <EditModal
          story={editingStory}
          onClose={() => setEditingStory(null)}
          onSave={handleEditSave}
        />
      )}

      {/* Show Loading when fetching */}
      {isLoading && !showAddForm && <Loading />}

      {/* Show Mascot when mascot state is true */}
      {!isLoading && mascot && !showAddForm && (
        <Mascot
          styleBg="bg-black/70"
          styleMascot="animate-mascotAddStory"
          styleEye="animate-mascotEye"
        >
          <MascotMessage message={"Let's add your first storyy!!!"} />
        </Mascot>
      )}

      {/* show up when data is empty */}
      {!isLoading && stories.length === 0 && !mascot && !showAddForm && (
        <Mascot styleBg={""} styleMascot={""} styleEye={""}>
          <TypingMessage setMascot={setMascot} />
        </Mascot>
      )}

      {/* show up when data is not empty */}
      {!isLoading && stories.length > 0 && (
        <main className="w-full grow flex flex-col items-center gap-10 p-4">
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              id={story.id}
              url={story.url}
              file_path={story.file_path}
              story_type={story.file_type}
              description={story.description}
              created_at={story.created_at}
              onEdit={handleEditStory}
              onDelete={handleDeleteStory}
              setIsPlaying={setIsPlaying}
            />
          ))}
        </main>
      )}

      {isPlaying.bool && (
        <StoryPlayer
          story_type={isPlaying.story_type}
          story_url={isPlaying.url}
          setIsPlaying={setIsPlaying}
        />
      )}
    </>
  );
}

function Mascot({ children, styleBg, styleMascot, styleEye }) {
  return (
    <>
      <div
        className={`w-full min-h-screen absolute flex items-center justify-center z-10 ${styleBg}`}
      >
        <div className="mascot-road min-h-screen w-full relative">
          <div
            className={`wrapper absolute w-fit h-fit flex flex-col justify-center items-center left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${styleMascot}`}
          >
            <div className="head size-[120px] bg-[#FFDEB9] rounded-full relative">
              <div className="eyeBall1 w-10 h-5 bg-white rounded-[50%] flex justify-center items-center absolute top-[30%] left-[12%] eyeAnim">
                <div
                  className={`eyeBlack w-4 h-4 bg-black rounded-full absolute ${
                    styleEye !== "" ? styleEye : "bottom-2"
                  }`}
                ></div>
              </div>
              <div className="eyeBall2 w-10 h-5 bg-white rounded-[50%] flex justify-center items-center absolute top-[30%] right-[12%] eyeAnim">
                <div
                  className={`eyeBlack w-4 h-4 bg-black rounded-full absolute ${
                    styleEye !== "" ? styleEye : "bottom-2"
                  }`}
                ></div>
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    </>
  );
}

const messages = [
  "Looks like you don't have any stories yet.",
  "Wanna add one?",
];

function TypingMessage({ setMascot }) {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (index >= messages.length) return;

    // kalau semua karakter udah ditulis
    if (subIndex === messages[index].length + 1 && !deleting) {
      if (index === 1) {
        // kalau di "Wanna add one?", tunggu 2 detik baru balik
        setShowButton(true);
        setTimeout(() => setDeleting(true), 4000);
      } else {
        setTimeout(() => setDeleting(true), 1000);
      }
      return;
    }

    // kalau semua karakter udah dihapus, pindah ke kalimat berikutnya
    if (subIndex === 0 && deleting) {
      setDeleting(false);
      setShowButton(false);
      setIndex((prev) => (prev === messages.length - 1 ? 0 : prev + 1));
      return;
    }

    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (deleting ? -1 : 1));
      },
      deleting ? 30 : 70
    );

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index]);

  useEffect(() => {
    setText(messages[index].substring(0, subIndex));
  }, [subIndex, index]);

  return (
    <div className="message rounded-full rounded-bl-none w-[150px] h-[100px] flex flex-col justify-center items-center bg-white absolute left-[50%] top-[-60%] p-5">
      <h2 className="text-[12px] max-w-[120px] font-montserrat font-bold text-black">
        {text}
        <span className="animate-pulse">|</span>
      </h2>

      {showButton && (
        <button
          onClick={() => setMascot(true)}
          className="mt-2 px-3 py-1 bg-[#E91E63] text-white text-[10px] rounded-full font-bold hover:bg-[#FF9800] transition"
        >
          Yes
        </button>
      )}
    </div>
  );
}

function MascotMessage({ message }) {
  const [text, setText] = useState("");
  const [subIndex, setSubIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + 1);
    }, 80);

    return () => clearTimeout(timeout);
  }, [subIndex]);

  useEffect(() => {
    setText(message.substring(0, subIndex));
  }, [subIndex, message]);

  return (
    <div className="message rounded-full rounded-bl-none w-[150px] h-[100px] flex flex-col justify-center items-center bg-white absolute left-[50%] top-[-60%] p-5">
      <h2 className="text-[12px] max-w-[120px] font-montserrat font-bold text-black">
        {text}
        <span className="animate-pulse">|</span>
      </h2>
    </div>
  );
}
