import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  const audio = req.nextUrl.searchParams.get("audio") === "true"; // Novo parâmetro para indicar se deve incluir áudio

  if (!url) {
    return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 });
  }

  try {
    let videoId: string | null = null;

    // Verificar se a URL é do formato de navegador ou mobile e extrair o ID do vídeo
    if (url.includes("youtube.com/watch")) {
      videoId = new URL(url).searchParams.get("v");
    } else if (url.includes("youtu.be/")) {
      const urlParts = url.split("/");
      videoId = urlParts[urlParts.length - 1].split("?")[0];
    }

    if (!videoId) {
      return NextResponse.json({ error: "ID do vídeo inválido" }, { status: 400 });
    }

    const response = await fetch(
      `https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=${videoId}`,
      {
        headers: {
          "x-rapidapi-host": "youtube-media-downloader.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
        },
      },
    );

    if (!response.ok) {
      return NextResponse.json({ error: "Erro ao obter detalhes do vídeo" }, { status: response.status });
    }

    const data = await response.json();

    console.log("API Response:", data);

    interface Format {
      hasAudio: boolean;
      quality: string;
      url: string;
      mimeType: string;
    }

    // Verificando se a propriedade items existe e é um array
    if (!Array.isArray(data?.videos?.items)) {
      return NextResponse.json({ error: "Estrutura de resposta inválida" }, { status: 500 });
    }

    // Adicionando log para verificar a estrutura dos itens
    console.log("Items:", data.videos.items);

    const formats = data.videos.items.filter((item: Format) => {
      const isMp4 = item.mimeType.includes("video/mp4");
      const isAvc1 = item.mimeType.includes("avc1");
      return isMp4 && isAvc1 && (audio ? item.hasAudio : !item.hasAudio);
    });

    if (!formats || formats.length === 0) {
      return NextResponse.json({ error: `Nenhum formato ${audio ? "com" : "sem"} áudio encontrado` }, { status: 500 });
    }

    const bestFormat = formats.reduce((prev: Format, current: Format) => {
      const prevQuality = parseInt(prev.quality.replace("p", ""), 10);
      const currentQuality = parseInt(current.quality.replace("p", ""), 10);
      return currentQuality > prevQuality ? current : prev;
    });

    if (bestFormat?.url) {
      return NextResponse.json({ downloadUrl: bestFormat.url });
    }

    return NextResponse.json({ error: "Link de download não encontrado na resposta" }, { status: 500 });
  } catch (error) {
    console.error("Erro ao processar o download:", error);
    return NextResponse.json({ error: "Erro interno", details: (error as Error).message }, { status: 500 });
  }
}
