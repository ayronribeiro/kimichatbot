import React from "react";
import { createRoot } from "react-dom/client";
import ChatWidget from "./src/components/ChatWidget";

const containerId = "mentor-chatbot-widget-root";

function injectWidget() {
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    document.body.appendChild(container);
  }
  createRoot(container).render(<ChatWidget />);
}

// Só injeta se estiver no browser
if (typeof window !== "undefined") {
  injectWidget();
} 