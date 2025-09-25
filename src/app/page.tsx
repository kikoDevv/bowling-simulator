"use client";
import { IoMdPersonAdd, IoMdTrash, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [isInputOpen, setInputOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /*--------- Focus input when opened ----------*/
  useEffect(() => {
    if (isInputOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isInputOpen]);

  /*--------- add user name ----------*/
  const addUser = () => {
    const trimmedName = userName.trim();
    if (trimmedName) {
      setCurrentUser(trimmedName);
      setUserName("");
      setInputOpen(false);
    }
  };

  /*--------- delete user name ----------*/
  const deleteUser = () => {
    setCurrentUser(null);
  };

  /*--------- enter key press should fire the add user func ----------*/
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addUser();
    }
  };

  return (
    <div className="flex justify-center sm:h-screen items-center">
      {/*--------- Hero section ----------*/}
      <section className="grid bg-gradient-to-r from-gray-900 to-neutral-900 w-full m-5 sm:mx-20 rounded-2xl overflow-hidden border-2 border-white pt-4">
        <h1 className="text-center font-bold text-white/90">Här ska du räkna dina bowling pöengar</h1>
        {/*--------- add user section ----------*/}
        <section className="sm:flex grid gap-4 sm:justify-between justify-center items-center p-2">
          {!currentUser ? (
            <>
              {!isInputOpen ? (
                <button
                  onClick={() => setInputOpen(true)}
                  className="flex items-center gap-1 bg-gray-600 rounded-md px-3 py-1 text-white hover:bg-gray-500 cursor-pointer transition-all duration-300 group hover:scale-103">
                  <IoMdPersonAdd className="group-hover:scale-120 group-hover:text-sky-400 transition-all duration-300" />
                  Lägg till användare
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    ref={inputRef}
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Skriv ditt namn här"
                    className="bg-white/20 rounded-md pl-2 placeholder:font-semibold font-bold text-white outline-1"
                  />
                  <button
                    onClick={addUser}
                    className="bg-green-500 ml-2 rounded-full p-1 hover:scale-110 hover:bg-green-400 transition-all duration-300 cursor-pointer">
                    <IoMdCheckmarkCircleOutline className="text-xl" />
                  </button>
                </div>
              )}
            </>
          ) : (
            /*--------- Show delete button & user name ----------*/
            <>
              <button
                onClick={deleteUser}
                className="flex items-center gap-1 bg-red-600 rounded-md px-3 py-1 text-white hover:bg-red-500 cursor-pointer transition-all duration-300 group hover:scale-103">
                <IoMdTrash className="group-hover:scale-120 group-hover:text-red-300 transition-all duration-300" />
                Ta bort användare
              </button>

              <span className="text-white font-semibold text-lg text-center">{currentUser}</span>
            </>
          )}

          <button className="flex items-center gap-1 bg-gray-600 rounded-md px-3 py-1 text-white hover:bg-gray-500 cursor-pointer transition-all duration-300 group hover:scale-103">
            <IoMdTrash className="group-hover:scale-120 group-hover:text-red-500 transition-all duration-300" />
            Tabort listan
          </button>
        </section>
        {/*--------- loop score container ----------*/}
        <section className="grid sm:flex">
          {Array.from({ length: 10 }).map((_, i) => (
            <div className="grid w-full" key={i}>
              <p className="text-center border border-gray-400">{i + 1}</p>
              <div className="grid bg-gray-800/90 border-l border-b-2 rounded-b-md border-gray-400">
                <div className="flex justify-center">
                  <h1 className="w-full text-center">1</h1>
                  <h1 className="w-full border border-r-0 border-t-0 border-gray-400 text-center">2</h1>
                </div>
                <h1 className="text-center py-3">Total</h1>
              </div>
            </div>
          ))}
        </section>
        {/*--------- Number pad section ----------*/}
        <section className="grid mt-10 justify-center">
          <h1 className="font-medium text-white/50 text-center">Här kan du ange vad du fick för pöeng</h1>
          <div className="sm:flex grid grid-cols-5 p-3 items-center justify-center gap-1 w-fit">
            {Array.from({ length: 10 }).map((_, i) => (
              <h1
                className="px-4 py-2 rounded-md bg-gray-600 font-bold font-sans hover:scale-115 hover:bg-gray-400 transition-all duration-200 cursor-pointer"
                key={i}>
                {i + 1}
              </h1>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
