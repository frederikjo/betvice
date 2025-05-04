import React, { createContext, useContext } from "react";

// Initial context values
export const BettingAssistantContext = createContext({
  toggleChatbot: () => {},
  isOpen: false,
  sendMessage: (message) => {},
  savedMessages: [],
  clearSavedMessages: () => {},
});

// Hook for easy access
export const useBettingAssistant = () =>
  useContext(BettingAssistantContext);
