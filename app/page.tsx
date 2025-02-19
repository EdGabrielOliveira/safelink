"use client";

import { useState } from "react";

const HomePage = () => {
  const [url, setUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const handleDownload = async () => {
    if (!url) return alert("Insira a URL do vídeo");
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      return alert("URL do YouTube inválida");
    }

    setIsDownloading(true);
    setDownloadLink(null);

    try {
      const params = new URLSearchParams({ url });
      const response = await fetch(`/api/download?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erro desconhecido");
      if (!data.downloadUrl) throw new Error("Link de download não encontrado");

      setDownloadLink(data.downloadUrl);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erro ao baixar");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-black/50 h-screen space-y-4 gap-4 text-white">
      <div className="flex flex-col gap-2 items-center justify-center ">
        <h1 className="flex text-3xl">
          Safe<p className="font-semibold">Link</p>
        </h1>
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

      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="p-2 px-4 w-[10rem] bg-sky-500 text-white rounded-xl"
      >
        {isDownloading ? "Processando..." : "Encontrar"}
      </button>

      {downloadLink && (
        <div className="download-link">
          <a href={downloadLink} download className="p-3 px-6 bg-green-600 rounded-xl text-white font-semibold">
            Clique para baixar agora!
          </a>
        </div>
      )}
      <p>* Limite temporário de Downloads por dia *</p>
    </div>
  );
};

export default HomePage;
