"use client";

import { Toaster } from "react-hot-toast";

export default function ToasterProvider() {
  return (
    <Toaster
      position="bottom-center"
      toastOptions={{
        style: {
          fontFamily: "var(--font-sans)",
          fontSize: "14px",
        },
        success: {
          iconTheme: { primary: "#ed6887", secondary: "white" },
        },
      }}
    />
  );
}
