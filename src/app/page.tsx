import { IoMdPersonAdd, IoMdTrash } from "react-icons/io";

export default function Home() {
  return (
    <div className="flex justify-center sm:h-screen items-center">
      <section className="grid bg-gradient-to-r from-gray-900 to-neutral-900 w-full mx-20 rounded-2xl overflow-hidden border-2 border-white">
        <h1 className="text-center font-bold text-white/90">Här ska du räkna dina bowling pöengar</h1>
        {/*--------- add user section ----------*/}
        <section className="flex justify-between items-center p-2">
          <button className="flex items-center gap-1 bg-gray-600 rounded-md px-3 py-1 text-white hover:bg-gray-500 cursor-pointer transition-all duration-300 group">
            <IoMdPersonAdd className="group-hover:scale-120 group-hover:text-sky-400 transition-all duration-300" />
            Lägg till användare
          </button>

          <button className="flex items-center gap-1 bg-gray-600 rounded-md px-3 py-1 text-white hover:bg-gray-500 cursor-pointer transition-all duration-300 group">
            <IoMdTrash className="group-hover:scale-120 group-hover:text-red-500 transition-all duration-300" /> Tabort
            listan
          </button>
        </section>
        {/*--------- loop score container ----------*/}
        <div className="grid sm:flex">
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
