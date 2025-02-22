"use client";

import { useState } from "react";
import { FaDownload } from "react-icons/fa6";
import { MdVolumeOff, MdVolumeUp } from "react-icons/md"; // Importando ícones

const HomePage = () => {
  const [url, setUrl] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadLink, setDownloadLink] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showButtons, setShowButtons] = useState(true); // Novo estado para controlar a visibilidade dos botões
  const [showBackButton, setShowBackButton] = useState(false); // Novo estado para controlar a visibilidade do botão de voltar

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    setErrorMessage(null);
  };

  const handleDownload = async (withAudio: boolean) => {
    if (!url) return setErrorMessage("Insira a URL do vídeo");
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      return setErrorMessage("URL do YouTube inválida");
    }

    setIsDownloading(true);
    setDownloadLink(null);
    setErrorMessage(null);
    setShowButtons(false); // Esconder os botões de seleção
    setShowBackButton(false); // Esconder o botão de voltar

    try {
      const params = new URLSearchParams({ url, audio: withAudio.toString() });
      const response = await fetch(`/video/video-api/download?${params.toString()}`);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Erro desconhecido");
      if (!data.downloadUrl) throw new Error("Link de download não encontrado");

      setDownloadLink(data.downloadUrl);
      setShowBackButton(true); // Mostrar o botão de voltar após o download
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Erro ao baixar");
      setShowButtons(true); // Mostrar os botões de seleção novamente em caso de erro
    } finally {
      setIsDownloading(false);
    }
  };

  const handleBack = () => {
    setUrl("");
    setDownloadLink(null);
    setShowButtons(true);
    setShowBackButton(false);
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
        onKeyDown={(e) => e.key === "Enter" && handleDownload(true)}
      />
      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {showButtons ? (
        <div className="flex gap-4 lg:w-[30rem] xl:w-[30rem] sm:w-[30rem] md:w-[30rem] xs:w-[22rem] w-[20rem]">
          <button
            onClick={() => handleDownload(true)}
            disabled={isDownloading}
            className="p-2 px-4 w-full bg-sky-500 hover:bg-sky-400 text-white rounded-xl flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              "Processando..."
            ) : (
              <>
                <MdVolumeUp /> Com Áudio
              </>
            )}
          </button>
          <button
            onClick={() => handleDownload(false)}
            disabled={isDownloading}
            className="p-2 px-4 w-full hover:bg-sky-700 bg-sky-600 text-white rounded-xl flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              "Processando..."
            ) : (
              <>
                <MdVolumeOff /> Sem Áudio
              </>
            )}
          </button>
        </div>
      ) : null}

      {isDownloading && !downloadLink && (
        <div className="flex items-center justify-center  p-1 px-6 rounded-xl gap-4">
          <div className="hidden w-5 h-5 border-4 border-t-gray-400 border-gray-300 rounded-full animate-spin"></div>

          <div className="flex gap-3">
            <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">.</span>
            <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">.</span>
            <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">.</span>
            <p className="text-xl pr-2 pl-2 uppercase">Carregando</p>
            <span className="animate-[ping_1.5s_0.5s_ease-in-out_infinite]">.</span>
            <span className="animate-[ping_1.5s_0.7s_ease-in-out_infinite]">.</span>
            <span className="animate-[ping_1.5s_0.9s_ease-in-out_infinite]">.</span>
          </div>
        </div>
      )}

      {downloadLink && (
        <div className="download-link flex flex-col items-center gap-4">
          <a
            href={downloadLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-3 px-6 bg-green-600 rounded-xl text-white font-semibold"
          >
            Clique para baixar agora
            <FaDownload />
          </a>

          {showBackButton && (
            <button
              onClick={handleBack}
              className="p-2 px-4 w-[10rem] underline underline-offset-2 text-white rounded-xl"
            >
              Voltar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
