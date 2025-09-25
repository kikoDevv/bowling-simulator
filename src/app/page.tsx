export default function Home() {
  return (
    <div className="flex h-screen justify-center items-center">
      <section className="grid bg-gradient-to-r from-gray-900 to-neutral-900 w-full mx-20 rounded-2xl overflow-hidden border-2 border-white">
        <h1 className="text-center font-bold text-white/90">Här ska du räkna dina bowling pöengar</h1>
        <div className="flex">
          {Array.from({ length: 10 }).map((_, i) => (
            <div className="grid w-full" key={i}>
              <p className="text-center border border-gray-400">{i + 1}</p>
              <div className="grid bg-gray-800/90 border-l border-gray-400">
                <div className="flex justify-center">
                  <h1 className="w-full text-center">1</h1>
                  <h1 className="w-full border border-r-0 border-t-0 border-gray-400 text-center">2</h1>
                </div>
                <h1 className="text-center py-3">Total</h1>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
