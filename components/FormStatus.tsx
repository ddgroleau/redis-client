"use client";

import { useFormStatus } from "react-dom";

export default function FormStatus() {
  const formStatus = useFormStatus();
  if (!formStatus.pending) return <></>;
  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 min-w-screen min-h-screen flex items-center justify-center">
      <span className="rounded-full border-l-8 border-blue-600 animate-spin w-[200px] h-[200px]"></span>
    </div>
  );
}
