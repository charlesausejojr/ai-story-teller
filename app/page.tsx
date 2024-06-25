import StoryWriter from "./ui/story-writer";

export default function Home() {
  return (
    <main className="flex flex-col">
      <div className="flex flex-col justify-center items-center">
        <p className="flex text-slate-300 text-6xl font-bold m-auto py-3 z-10 mb-8">
          AI Story Teller
        </p>
        <div className="flex w-full z-10">
          <StoryWriter/>
        </div>
      </div>
    </main>
  );
}
