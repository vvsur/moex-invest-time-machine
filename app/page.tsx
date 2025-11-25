"use client";

import { Calculator } from "./components/calculator/Calculator";


export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center py-10">
      <div className="w-full max-w-4xl">
        <Calculator />
      </div>
    </div>
  );
}
