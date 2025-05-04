import React, { useState } from "react";
import BettingAssistant from "./BettingAssistant";
import { BettingAssistantContext } from "@/context/BettingAssistantContext";

const BettingAssistantProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [savedMessages, setSavedMessages] = useState([]);

  const toggleChatbot = () => setIsOpen((prev) => !prev);
  const sendMessage = (message) => {
    setSavedMessages((prev) => [...prev, message]);
    if (!isOpen) setIsOpen(true);
  };

  const contextValue = {
    toggleChatbot,
    isOpen,
    sendMessage,
    savedMessages,
    clearSavedMessages: () => setSavedMessages([]),
  };

  return (
    <BettingAssistantContext.Provider value={contextValue}>
      {children}
      <BettingAssistant />
    </BettingAssistantContext.Provider>
  );
};

export default BettingAssistantProvider;
