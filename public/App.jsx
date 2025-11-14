import {useState, useEffect} from "react";
import Navbar from "../components/Navbar";
import StoryCard from "../components/StoryCard";
import useStories from "../hooks/useStories";

export default function App() {
  const data = useStories((story) => ({ ...story, isHolding: false }));

  return (
    <>
      <Navbar />

      <div className="w-full h-20 flex items-center relative z-10">
        <button
          className="bg-linear-to-r from-[#9C27B0] via-[#E91E63] to-[#FF9800] w-[134px] h-[39px] text-[16px] font-montserrat text-default rounded-full flex justify-center items-center cursor-pointer font-bold tracking-[1px] absolute right-2.5 p-1"
          onClick={() => alert("Add Story functionality not implemented yet.")}
        >
          <div className="size-full bg-black rounded-full flex justify-center items-center">
            Add Story
          </div>
        </button>
      </div>

      {data.length === 0 && (
        <div className="w-full min-h-screen absolute flex items-center justify-center z-5">
          <div className="wrapper relative w-full h-fit flex flex-col justify-center items-center">
            <div className="head size-[120px] bg-[#FFDEB9] rounded-full relative">
              <div className="eyeBall1 w-10 h-5 bg-white rounded-[50%] flex justify-center items-center absolute top-[30%] left-[12%] eyeAnim">
                <div className="eyeBlack w-4 h-4 bg-black rounded-full absolute bottom-2"></div>
              </div>
              <div className="eyeBall2 w-10 h-5 bg-white rounded-[50%] flex justify-center items-center absolute top-[30%] right-[12%] eyeAnim">
                <div className="eyeBlack w-4 h-4 bg-black rounded-full absolute bottom-2"></div>
              </div>
            </div>

            <TypingMessage />
          </div>
        </div>
      )}

      {data.length > 0 && (
        <main className="w-full grow flex flex-col items-center gap-10 p-4">
          {data.map((item) => (
            <StoryCard key={item.id} holdState={item.isHolding} />
          ))}
        </main>
      )}
    </>
  );
}

const messages = [
"Looks like you don't have any stories yet.",
"Wanna add one?",
];

function TypingMessage() {
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

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (deleting ? -1 : 1));
    }, deleting ? 40 : 80);

    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index]);

  useEffect(() => {
    setText(messages[index].substring(0, subIndex));
  }, [subIndex, index]);

  return (
    <div className="w-full min-h-screen absolute flex items-center z-5">
      <div className="wrapper relative w-full h-fit flex flex-col justify-center items-center">
        <div className="head size-[120px] bg-[#FFDEB9] rounded-full relative">
          <div className="eyeBall1 w-10 h-5 bg-white rounded-[50%] flex justify-center items-center absolute top-[30%] left-[12%] eyeAnim">
            <div className="eyeBlack w-4 h-4 bg-black rounded-full absolute bottom-2"></div>
          </div>
          <div className="eyeBall2 w-10 h-5 bg-white rounded-[50%] flex justify-center items-center absolute top-[30%] right-[12%] eyeAnim">
            <div className="eyeBlack w-4 h-4 bg-black rounded-full absolute bottom-2"></div>
          </div>
        </div>

        <div className="message rounded-full rounded-bl-none w-[150px] h-[100px] flex flex-col justify-center items-center bg-white absolute left-[55%] top-[-70%] p-5">
          <h2 className="text-[12px] max-w-[120px] font-montserrat font-bold text-black">
            {text}
            <span className="animate-pulse">|</span>
          </h2>

          {showButton && (
            <button
              onClick={() => alert("Add Story clicked!")}
              className="mt-2 px-3 py-1 bg-[#E91E63] text-white text-[10px] rounded-full font-bold hover:bg-[#FF9800] transition"
            >
              Yes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}