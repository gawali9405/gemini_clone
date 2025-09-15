import React from "react";
import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");

  // Typing animation
  const delayPara = (index, nextWord) => {
    setTimeout(() => {
      setResultData((prev) => prev + nextWord);
    }, 50 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    setResultData("");
    setInput("");
  };

  const onSend = async (prompt) => {
    setResultData("");
    setLoading(true);
    setShowResult(true);

    let finalPrompt = prompt || input; 
    setRecentPrompt(finalPrompt);
    setPrevPrompts((prev) => [...prev, finalPrompt]);

    try {
      const response = await runChat(finalPrompt);

      // Format response
      let responseArray = response.split("**");
      let formattedResponse = "";

      for (let i = 0; i < responseArray.length; i++) {
        if (i === 0 || i % 2 !== 1) {
          formattedResponse += responseArray[i];
        } else {
          formattedResponse += "<br><b>" + responseArray[i] + "</b><br>";
        }
      }

      let newResponseData = formattedResponse.split("*").join("<br>");
      let newResponseArray = newResponseData.split(" ");

      // Animate output
      for (let i = 0; i < newResponseArray.length; i++) {
        const nextWord = newResponseArray[i];
        delayPara(i, nextWord + " ");
      }
    } catch (error) {
      console.error("Error running chat:", error);
      setResultData("⚠️ Something went wrong. Please try again.");
    }

    setLoading(false);
    setInput("");
  };

  const value = {
    prevPrompts,
    setPrevPrompts,
    onSend,
    recentPrompt,
    setRecentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export default ContextProvider;
