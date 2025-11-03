import Navbar from "../components/Navbar";
import StoryCard from "../components/StoryCard";

const data = [
  {
    id: 1,
    videoSrc: "/video/video.mp4",
    isHolding: false,
  },
  {
    id: 2,
    videoSrc: "/video/video.mp4",
    isHolding: false,
  },
  {
    id: 3,
    videoSrc: "/video/video.mp4",
    isHolding: false,
  }
]

export default function App() {

  return (
    <>
      <Navbar />

      <div className="w-full h-[80px] flex items-center relative">
        <button className="bg-gradient-to-r from-[#9C27B0] via-[#E91E63] to-[#FF9800] w-[134px] h-[39px] text-[16px] font-montserrat text-default rounded-full flex justify-center items-center cursor-pointer font-bold tracking-[1px] absolute right-2.5 p-1">
          <div className="size-full bg-black rounded-full flex justify-center items-center">
            Add Story
          </div>
        </button>
      </div>

      <main className="w-full flex-grow flex flex-col items-center gap-10 p-4">
        {data.map((item) => (
          <StoryCard
            key={item.id}
            holdState={item.isHolding}
          />
        ))}
      </main>

    </>
  );
}
