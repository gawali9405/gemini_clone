import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { Context } from "../context/context";

const Middle = () => {
  const {
    onSend,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
  } = useContext(Context);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 px-5">
      {/* ---- Top Bar ---- */}
      <div className="flex justify-between items-center px-6 py-4  bg-gray-50">
        <p className="text-xl font-semibold text-gray-800">Gemini</p>
        <img
          src={assets.user_icon}
          alt="profile"
          className="w-9 h-9 rounded-full cursor-pointer"
        />
      </div>

      {/* ---- Main Content ---- */}
      <div className="flex-1 overflow-y-auto px-50 py-10">
        {!showResult ? (
          <>
            {/* Greeting */}
            <div className="mb-12">
              <p className="text-4xl font-semibold text-gray-800">
                Hello,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Sandip.
                </span>
              </p>
              <p className="text-2xl text-gray-500 mt-2">
                How can I help you today?
              </p>
            </div>

            {/* Suggestions */}
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  text: "Suggest beautiful places to see on an upcoming road trip.",
                  icon: assets.compass_icon,
                },
                {
                  text: "Briefly summarize this concept: urban planning",
                  icon: assets.bulb_icon,
                },
                {
                  text: "Brainstorm team bonding activities for our work retreat",
                  icon: assets.message_icon,
                },
                {
                  text: "Improve the readability of the following code",
                  icon: assets.code_icon,
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center p-5 bg-blue-50 border rounded-xl shadow-sm cursor-pointer hover:shadow-md hover:bg-blue-100 transition"
                >
                  <p className="text-sm text-gray-700">{item.text}</p>
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                    <img
                      src={item.icon}
                      alt="icon"
                      className="w-5 h-5 opacity-80"
                    />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-6">
            {/* User Prompt */}
            <div className="flex items-center gap-3">
              <img
                src={assets.user_icon}
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
              <p className="text-gray-800 text-sm">{recentPrompt}</p>
            </div>

            {/* Gemini Response */}
            <div className="flex gap-3 items-start">
              <img src={assets.gemini_icon} alt="gemini" className="w-8 h-8" />
              {loading ? (
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-1 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-1 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-1 bg-gray-300 rounded animate-pulse"></div>
                </div>
              ) : (
                <p
                  className="text-gray-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: resultData }}
                ></p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ---- Input Box ---- */}
      <div className="px-50 py-6  bg-gray-50">
        <div className="flex items-center gap-3 bg-gray-100 px-4 py-4 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Enter a prompt here..."
            className="flex-1 bg-transparent outline-none text-sm text-gray-700"
          />
          <div className="flex items-center gap-3">
            <img
              src={assets.gallery_icon}
              alt="gallery"
              className="w-5 h-5 cursor-pointer"
            />
            <img
              src={assets.mic_icon}
              alt="mic"
              className="w-5 h-5 cursor-pointer"
            />
            <img
              onClick={() => onSend()}
              src={assets.send_icon}
              alt="send"
              className="w-5 h-5 cursor-pointer"
            />
          </div>
        </div>
        <p className="mt-2 text-xs text-gray-500 text-center">
          Gemini may display inaccurate info, including about people.
          Double-check its responses. Your privacy & safety matter.
        </p>
      </div>
    </div>
  );
};

export default Middle;
