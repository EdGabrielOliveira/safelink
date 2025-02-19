import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "URL é obrigatória" }, { status: 400 });
  }

  try {
    // Extrair o ID do vídeo da URL
    const videoId = new URL(url).searchParams.get("v");
    if (!videoId) {
      return NextResponse.json({ error: "ID do vídeo inválido" }, { status: 400 });
    }

    const response = await fetch(
      `https://cloud-api-hub-youtube-downloader.p.rapidapi.com/mux?id=${videoId}&quality=max&codec=h264&audioFormat=mp3`,
      {
        headers: {
          "x-rapidapi-host": "cloud-api-hub-youtube-downloader.p.rapidapi.com",
          "x-rapidapi-key": process.env.RAPIDAPI_KEY!,
        },
      },
    );

    const data = await response.json();

    if (data?.url) {
      return NextResponse.json({ downloadUrl: data.url });
    }

    return NextResponse.json({ error: "Link de download não encontrado na resposta" }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno", details: (error as Error).message }, { status: 500 });
  }
}
