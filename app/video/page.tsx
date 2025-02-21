"use client";

import { useState } from "react";

const HomePage = () => {
  const [url, setUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setErrorMessage(null);
  };

  const handleDownload = async () => {
    if (!url) return setErrorMessage("Insira a URL do vídeo");
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      return setErrorMessage("URL do YouTube inválida");
    }

    setIsDownloading(true);
    setDownloadLink(null);
    setErrorMessage(null);

    try {
      const params = new URLSearchParams({ url });
      const response = await fetch(`video/video-api/download?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erro desconhecido");
      if (!data.downloadUrl) throw new Error("Link de download não encontrado");

      setDownloadLink(data.downloadUrl);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao baixar");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-black/50 h-screen space-y-4 gap-4 text-white">
      <div className="flex flex-col gap-2 items-center justify-center ">
        <div className="flex text-3xl items-center justify-center">
          Safe<p className="font-semibold">Link</p>
          <p className="pl-4 font-extralight font-sans text-sky-500 text-2xl items-center flex">Videos</p>
        </div>
        <p>Baixe vídeos do Youtube livre de virús.</p>
      </div>
      <input
        type="text"
        className="p-2 border-2 text-gray-700 border-sky-500 rounded-xl lg:w-[30rem] xl:w-[30rem] sm:w-[30rem] md:w-[30rem] xs:w-[22rem] w-[20rem] text-center"
        placeholder="Cole a URL do YouTube aqui"
        value={url}
        onChange={handleUrlChange}
        onKeyDown={(e) => e.key === "Enter" && handleDownload()}
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="p-2 px-4 w-[10rem] bg-sky-500 text-white rounded-xl"
      >
        {isDownloading ? "Processando..." : "Encontrar"}
      </button>

      {downloadLink && (
        <div className="download-link">
          <a
            href={downloadLink}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 px-6 bg-green-600 rounded-xl text-white font-semibold"
          >
            Clique para baixar agora!
          </a>
        </div>
      )}
      <div className="flex flex-col text-center">
        <p>* Limite temporário de Downloads por dia *</p>
        <p className="font-semibold">API LIMITADA!</p>
      </div>
    </div>
  );
};

export default HomePage;
