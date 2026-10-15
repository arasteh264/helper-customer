const MIN_QUERY_LENGTH = 2;
const MAX_QUERY_LENGTH = 100;

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (query.length < MIN_QUERY_LENGTH || query.length > MAX_QUERY_LENGTH) {
    return Response.json(
      { message: "عبارت جست‌وجو باید بین ۲ تا ۱۰۰ نویسه باشد." },
      { status: 400 },
    );
  }

  const upstreamUrl = new URL("https://photon.komoot.io/api/");
  upstreamUrl.searchParams.set("q", query);
  upstreamUrl.searchParams.set("limit", "6");

  try {
    const response = await fetch(upstreamUrl, {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    });
    if (!response.ok) {
      console.error("Neighborhood search provider returned an error.", {
        status: response.status,
      });
      return Response.json(
        { message: "جست‌وجوی محله موقتاً در دسترس نیست." },
        { status: 502 },
      );
    }
    return Response.json(await response.json());
  } catch (error) {
    console.error("Neighborhood search request failed.", error);
    return Response.json(
      { message: "جست‌وجوی محله موقتاً در دسترس نیست." },
      { status: 502 },
    );
  }
}
