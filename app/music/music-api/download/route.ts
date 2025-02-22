import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL do vídeo é obrigatória" }, { status: 400 });
  }

  try {
    const videoId = new URL(url).searchParams.get("v");
    if (!videoId) {
      return NextResponse.json({ error: "ID do vídeo inválido" }, { status: 400 });
    }

    const response = await fetch(
      `https://youtube-media-downloader.p.rapidapi.com/v2/video/details?videoId=${videoId}&videos=false&audios=true&subtitles=false`,
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

    interface AudioFormat {
      mimeType: string;
      url: string;
      extension: string;
    }

    // Verificando se a propriedade items existe e é um array
    if (!Array.isArray(data?.audios?.items)) {
      return NextResponse.json({ error: "Estrutura de resposta inválida" }, { status: 500 });
    }

    // Adicionando log para verificar a estrutura dos itens
    console.log("Items:", data.audios.items);

    const formats = data.audios.items.filter((item: AudioFormat) => {
      const isM4a = item.mimeType.includes("audio/mp4") && item.mimeType.includes("mp4a.40.2");
      return isM4a && item.extension === "m4a";
    });

    if (!formats || formats.length === 0) {
      return NextResponse.json({ error: "Nenhum formato de áudio encontrado" }, { status: 500 });
    }

    const bestFormat = formats.reduce((prev: AudioFormat, current: AudioFormat) => {
      // Aqui você pode adicionar lógica para escolher o melhor formato, se necessário
      return current;
    });

    if (bestFormat?.url) {
      return NextResponse.json({ downloadUrl: bestFormat.url, title: data.title });
    }

    return NextResponse.json({ error: "Link de download não encontrado na resposta" }, { status: 500 });
  } catch (error) {
    console.error("Erro ao processar o download:", error);
    return NextResponse.json({ error: "Erro interno", details: (error as Error).message }, { status: 500 });
  }
}
