import React, { useContext, useState, useRef } from "react";
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

  const [listening, setListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true); // 🔊 toggle
  const recognitionRef = useRef(null);

  // 🎤 Setup speech recognition
  const handleMicClick = () => {
    if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
      alert("Speech recognition not supported in this browser.");
      return;
    }

    if (recognitionRef.current == null) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onstart = () => setListening(true);
      recognitionRef.current.onend = () => setListening(false);

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        onSend(transcript);
      };
    }

    if (!listening) {
      recognitionRef.current.start();
    } else {
      recognitionRef.current.stop();
    }
  };

  // 🔊 Text-to-Speech for Gemini response
  const speakResponse = (text) => {
    if ("speechSynthesis" in window && voiceEnabled) {
      const synth = window.speechSynthesis;
      synth.cancel(); // stop ongoing speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
      utterance.rate = 1;
      utterance.pitch = 1;
      synth.speak(utterance);
    }
  };

  // 🛠️ Trigger voice when Gemini response is ready
  React.useEffect(() => {
    if (!loading && resultData && voiceEnabled) {
      const plainText = resultData.replace(/<[^>]+>/g, ""); // strip HTML
      speakResponse(plainText);
    }
  }, [loading, resultData, voiceEnabled]);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50">
      {/* ---- Top Bar ---- */}
      <div className="flex justify-between items-center px-4 sm:px-6 md:px-8 py-3 bg-gray-50 shadow-sm">
        <p className="text-lg sm:text-xl font-semibold text-gray-800">Gemini</p>

        <div className="flex items-center gap-4">
          {/* 🔊 / 🔇 Toggle */}
          <button
            onClick={() => setVoiceEnabled((prev) => !prev)}
            className="text-xl cursor-pointer"
          >
            {voiceEnabled ? "🔊" : "🔇"}
          </button>

          <img
            src={assets.user_icon}
            alt="profile"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full cursor-pointer"
          />
        </div>
      </div>

      {/* ---- Main Content ---- */}
      <div className="flex-1 overflow-y-auto px-4 md:px-50 py-6 md:py-10">
        {!showResult ? (
          <>
            {/* Greeting */}
            <div className="mb-8 md:mb-12">
              <p className="text-3xl sm:text-4xl font-semibold text-gray-800">
                Hello,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Sandip.
                </span>
              </p>
              <p className="text-lg sm:text-2xl text-gray-500 mt-1 sm:mt-2">
                How can I help you today?
              </p>
            </div>

            {/* Suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  onClick={() => onSend(item.text)}
                  key={idx}
                  className="flex justify-between items-center p-4 sm:p-5 bg-blue-50 border rounded-xl shadow-sm cursor-pointer hover:shadow-md hover:bg-blue-100 transition"
                >
                  <p className="text-sm sm:text-base text-gray-700">
                    {item.text}
                  </p>
                  <div className="w-10 h-10 flex items-center justify-center bg-gray-100 rounded-lg">
                    <img
                      src={item.icon}
                      alt="icon"
                      className="w-5 h-5 sm:w-6 sm:h-6 opacity-80"
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
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
              />
              <p className="text-gray-800 text-sm sm:text-base">
                {recentPrompt}
              </p>
            </div>

            {/* Gemini Response */}
            <div className="flex gap-3 items-start">
              <img
                src={assets.gemini_icon}
                alt="gemini"
                className="w-7 h-7 sm:w-8 sm:h-8"
              />
              {loading ? (
                <div className="flex flex-col gap-2 w-full">
                  <div className="h-2 sm:h-3 bg-blue-300 rounded animate-pulse"></div>
                  <div className="h-2 sm:h-3 bg-blue-300 rounded animate-pulse"></div>
                  <div className="h-2 sm:h-3 bg-blue-300 rounded animate-pulse"></div>
                </div>
              ) : (
                <p
                  className="text-gray-700 leading-relaxed text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: resultData }}
                ></p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ---- Input Box ---- */}
      <div className="px-4 md:px-50 py-4 md:py-6 bg-gray-50">
        <div className="flex items-center gap-2 sm:gap-3 bg-blue-50 px-3 sm:px-4 py-3 sm:py-4 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            type="text"
            placeholder="Enter a prompt here..."
            className="flex-1 bg-transparent outline-none text-sm sm:text-base text-gray-700"
          />
          <div className="flex items-center gap-2 sm:gap-3">
            <img
              src={assets.gallery_icon}
              alt="gallery"
              className="w-4 sm:w-5 h-4 sm:h-5 cursor-pointer"
            />
            <img
              onClick={handleMicClick}
              src={assets.mic_icon}
              alt="mic"
              className={`w-4 sm:w-5 h-4 sm:h-5 cursor-pointer ${
                listening ? "animate-pulse" : ""
              }`}
            />
            <img
              onClick={() => onSend()}
              src={assets.send_icon}
              alt="send"
              className="w-4 sm:w-5 h-4 sm:h-5 cursor-pointer"
            />
          </div>
        </div>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 text-center">
          Gemini may display inaccurate info, including about people.
          Double-check its responses. Your privacy & safety matter.
        </p>
      </div>
    </div>
  );
};

export default Middle;
