"use client";
import { IoMdPersonAdd, IoMdTrash, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useState, useRef, useEffect } from "react";
import { createNewGame, addRoll, type BowlingGame } from "../hooks/gameLogic";

export default function Home() {
  const [isInputOpen, setInputOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /*--------- Bowling game state ----------*/
  const [game, setGame] = useState<BowlingGame>(createNewGame());

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

  // Bowling game functions
  const recordRoll = (pins: number) => {
    const newGame = addRoll(game, pins);
    setGame(newGame);
  };

  const resetGame = () => {
    setGame(createNewGame());
  };

  /*--------- diable buttons ----------*/
  const isButtonDisabled = (pins: number): boolean => {
    if (game.isGameComplete) return true;

    const currentFrame = game.frames[game.currentFrame];

    if (game.currentRoll === 1 && game.currentFrame < 9) {
      const firstRollPins = currentFrame.rolls[0].pins || 0;
      return firstRollPins + pins > 10;
    }

    if (game.currentFrame === 9 && game.currentRoll === 1) {
      const roll1 = currentFrame.rolls[0].pins;
      if (roll1 !== null && roll1 !== 10 && roll1 + pins > 10) {
        return true;
      }
    }

    return false;
  };

  /*--------- format roll display ----------*/
  const formatRoll = (frameIndex: number, rollIndex: number): string => {
    const frame = game.frames[frameIndex];
    const roll = frame.rolls[rollIndex];

    if (!roll || roll.pins === null) return "";

    if (frameIndex < 9) {
      // Frames 1-9
      if (rollIndex === 0 && roll.pins === 10) return "X";
      if (rollIndex === 1 && frame.isSpare) return "/";
      if (roll.pins === 0) return "-";
      return roll.pins.toString();
    } else {
      // Frame 10
      if (roll.pins === 10) return "X";
      if (
        rollIndex > 0 &&
        frame.rolls[rollIndex - 1].pins !== 10 &&
        frame.rolls[rollIndex - 1].pins !== null &&
        frame.rolls[rollIndex - 1].pins! + roll.pins === 10
      )
        return "/";
      if (roll.pins === 0) return "-";
      return roll.pins.toString();
    }
  };

  return (
    <div className="flex justify-center sm:h-screen items-center">
      {/*--------- Hero section ----------*/}
      <section className="grid bg-gradient-to-r from-gray-900 to-neutral-900 w-full m-5 sm:mx-20 rounded-2xl overflow-hidden border-2 border-white pt-4">
        <h1 className="text-center font-bold text-white/90">Här ska du räkna dina bowling poäng</h1>
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
                    className="bg-white/20 rounded-md pl-1 py-1 font-semibold text-white outline-1"
                  />
                  <button
                    onClick={addUser}
                    className="bg-green-500 rounded-full p-1 hover:scale-110 hover:bg-green-400 transition-all duration-300 cursor-pointer">
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

          <button
            onClick={resetGame}
            className="flex items-center gap-1 bg-red-600 rounded-md px-3 py-1 text-white hover:bg-red-500 cursor-pointer transition-all duration-300 group hover:scale-103">
            <IoMdTrash className="group-hover:scale-120 group-hover:text-red-300 transition-all duration-300" />
            Nollställ spel
          </button>
        </section>
        {/*--------- loop score container ----------*/}
        <section className="grid sm:flex">
          {game.frames.map((frame, i) => (
            <div className={`grid w-full ${game.currentFrame === i ? "bg-blue-900" : ""}`} key={i}>
              <p className="text-center border border-gray-400 text-white font-semibold">{i + 1}</p>
              <div className="grid bg-gray-800/90 border-l border-b-2 rounded-b-md border-gray-400">
                {i < 9 ? (
                  // Frames 1-9: Two roll boxes
                  <div className="flex justify-center">
                    <p className="w-full flex justify-center items-center text-white font-bold min-h-8">
                      {formatRoll(i, 0)}
                    </p>
                    <p className="w-full border border-r-0 border-t-0 min-h-8 border-gray-400 flex justify-center items-center text-white font-bold">
                      {formatRoll(i, 1)}
                    </p>
                  </div>
                ) : (
                  // Frame 10: Three roll boxes
                  <div className="flex justify-center">
                    <div className="w-full text-center text-white font-bold py-1">{formatRoll(i, 0)}</div>
                    <div className="w-full border border-r-0 border-t-0 border-gray-400 text-center text-white font-bold min-h-8">
                      {formatRoll(i, 1)}
                    </div>
                    <div className="w-full border border-r-0 border-t-0 border-gray-400 text-center text-white font-bold py-1">
                      {formatRoll(i, 2)}
                    </div>
                  </div>
                )}
                <h3 className="flex justify-center items-center text-white font-bold text-lg min-h-10">
                  {frame.score || ""}
                </h3>
              </div>
            </div>
          ))}
        </section>
        {/*--------- Number pad section ----------*/}
        {!game.isGameComplete && (
          <section className="grid mt-10 justify-center">
            <h1 className="text-center font-bold">Totalt poäng hittils: {game.totalScore}</h1>
            <h1 className="font-medium text-white/50 text-center">
              {currentUser &&
                `Hej ${currentUser}! ange antal käglor till frame ${game.currentFrame + 1}, roll ${
                  game.currentRoll + 1
                }`}

              {!currentUser &&
                `Hej! ange antal käglor till frame ${game.currentFrame + 1}, roll ${game.currentRoll + 1}`}
            </h1>
            <div className="sm:flex grid grid-cols-6 p-3 items-center justify-center gap-1 w-fit">
              {/* 0 button */}
              <button
                onClick={() => recordRoll(0)}
                disabled={isButtonDisabled(0)}
                className={`px-4 py-2 rounded-md font-bold font-sans transition-all duration-200 ${
                  isButtonDisabled(0)
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                    : "bg-gray-600 text-white hover:scale-115 hover:bg-gray-400 cursor-pointer"
                }`}>
                0
              </button>
              {/* 1-10 buttons */}
              {Array.from({ length: 10 }).map((_, i) => {
                const pins = i + 1;
                const disabled = isButtonDisabled(pins);
                return (
                  <button
                    onClick={() => recordRoll(pins)}
                    disabled={disabled}
                    className={`px-4 py-2 rounded-md font-bold font-sans transition-all duration-200 ${
                      disabled
                        ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                        : "bg-gray-600 text-white hover:scale-115 hover:bg-gray-400 cursor-pointer"
                    }`}
                    key={i}>
                    {pins}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/*--------- Game complete message  ----------*/}
        {game.isGameComplete && (
          <section className="grid mt-10 justify-center">
            <h1 className="font-bold text-white text-center text-xl pb-2">
              {currentUser && `${currentUser}`}Spel avslutat med totalt {game.totalScore} poäng
            </h1>
          </section>
        )}
      </section>
    </div>
  );
}
