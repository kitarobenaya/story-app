export default function App() {
    return (
        <>
            <header className="w-full h-auto">
                <h1 className="text-2xl font-bold underline font-poppins text-[#F4F6F8] text-center mt-4">
                    24 hr Story App by Kitaro
                </h1>
            </header>

            <main>
                <section className="story-container w-[80%] h-[400px] bg-gray-200 mx-auto mt-10 rounded-lg flex justify-center p-4">
                    <article className="w-[120px] h-[120px] bg-[#E76F51] rounded-full">
                        <div className="line1"></div>
                        <div className="line2"></div>
                    </article>
                </section>
            </main>
        </>
    )
}