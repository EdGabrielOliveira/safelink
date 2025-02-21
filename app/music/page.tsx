"use client";

import { useState } from "react";

const HomePage = () => {
  const [url, setUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);

  const handleDownload = async () => {
    if (!url) return alert("Insira a URL do vídeo");
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      return alert("URL do YouTube inválida");
    }

    setIsDownloading(true);
    setDownloadLink(null);
    setTitle(null);

    try {
      const params = new URLSearchParams({ url });
      const response = await fetch(`music/music-api/download?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erro desconhecido");
      if (!data.downloadUrl || !data.title) throw new Error("Link de download ou título não encontrado");

      setDownloadLink(data.downloadUrl);
      setTitle(data.title);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao baixar");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-black/50 h-screen space-y-4 gap-4 text-white">
      <div className="flex flex-col gap-2 items-center justify-center ">
        <h1 className="flex text-3xl items-center justify-center">
          Safe<p className="font-semibold">Link</p>
          <p className="pl-4 font-extralight font-sans text-red-500 text-2xl items-center flex">Music</p>
        </h1>
        <p>Baixe músicas do Youtube livre de vírus.</p>
      </div>
      <input
        type="text"
        className="p-2 border-2 text-gray-700 border-white outline-red-500 rounded-xl lg:w-[30rem] xl:w-[30rem] sm:w-[30rem] md:w-[30rem] xs:w-[22rem] w-[20rem] text-center"
        placeholder="Cole a URL do YouTube aqui"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleDownload()}
      />

      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="p-2 px-4 w-[10rem] bg-red-500 hover:bg-red-600 text-white rounded-xl"
      >
        {isDownloading ? "Processando..." : "Encontrar"}
      </button>

      {downloadLink && title && (
        <div className="mt-4 rounded-lg bg-black/60 p-4 text-gray-200  lg:w-[30rem] xl:w-[30rem] sm:w-[30rem] md:w-[30rem] xs:w-[22rem] w-[20rem]">
          <div className="flex flex-col gap-2 items-center justify-center">
            <h2 className="text-md font-bold text-center text-wrap">{title}</h2>
            <a href={url} target="_blank" className="text-red-500 underline  block">
              Link do vídeo no Youtube
            </a>
          </div>
          <audio controls src={downloadLink} className="w-full max-w-md mb-4 flex mt-2" />
        </div>
      )}
    </div>
  );
};

export default HomePage;
