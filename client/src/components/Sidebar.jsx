import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { Context } from "../context/context";

const Sidebar = () => {
  const [extended, setExtended] = useState(true);
  const { onSend, prevPrompts, setRecentPrompt, newChat } = useContext(Context);

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt);
    await onSend(prompt);
  };

  return (
    <div
      className={`h-screen bg-blue-50 border-r border-gray-200 flex flex-col justify-between 
      transition-all duration-300 ease-in-out 
      ${extended ? "w-64" : "w-16"}`}
    >
      {/* ---- Top Section ---- */}
      <div>
        {/* Menu Icon */}
        <div className="flex items-center mb-6 px-3 pt-4">
          <img
            onClick={() => setExtended((prev) => !prev)}
            src={assets.menu_icon}
            alt="menu"
            className="w-6 h-6 cursor-pointer hover:opacity-70 transition"
          />
        </div>

        {/* New Chat */}
        <div
          onClick={newChat}
          className="flex items-center gap-3 px-3 py-2 cursor-pointer 
          hover:bg-blue-100 rounded-lg transition"
        >
          <img src={assets.plus_icon} alt="plus" className="w-5 h-5" />
          {extended && <p className="text-sm font-medium text-gray-700">New Chat</p>}
        </div>

        {/* Recent Prompts */}
        {extended && (
          <div className="mt-6 px-3">
            <p className="text-gray-500 text-xs font-semibold mb-2">Recent</p>
            <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              {prevPrompts.map((item, index) => (
                <div
                  key={index}
                  onClick={() => loadPrompt(item)}
                  className="flex items-center gap-2 px-2 py-2 rounded-lg cursor-pointer 
                  hover:bg-blue-100 transition"
                >
                  <img src={assets.message_icon} alt="msg" className="w-4 h-4 opacity-70" />
                  <p className="text-sm text-gray-700 truncate">{item.slice(0, 24)}...</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ---- Bottom Section ---- */}
      <div className="space-y-1 px-3 mb-6">
        <div className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-blue-100 rounded-lg transition">
          <img src={assets.question_icon} alt="help" className="w-5 h-5 opacity-70" />
          {extended && <p className="text-sm text-gray-700">Help</p>}
        </div>

        <div className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-blue-100 rounded-lg transition">
          <img src={assets.history_icon} alt="activity" className="w-5 h-5 opacity-70" />
          {extended && <p className="text-sm text-gray-700">Activity</p>}
        </div>

        <div className="flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-blue-100 rounded-lg transition">
          <img src={assets.setting_icon} alt="settings" className="w-5 h-5 opacity-70" />
          {extended && <p className="text-sm text-gray-700">Settings</p>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
