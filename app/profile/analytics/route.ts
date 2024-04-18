import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const apiKey = "31247ae0-2fdb-4fc7-ac90-8c19d984c545";
  const url = `https://api.umami.is/v1/websites/649733d0-9231-4701-80e6-b59f51783b5c/events`;

  return fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "x-umami-api-key": apiKey,
    },
  })
    .then((response) => {
      if (response.ok) {
        return NextResponse.json({ data: response.json() });
      }
    })
    .then((data) => {
      console.log(data);
      return new Response(JSON.stringify(data), { status: 200 });
    })
    .catch((error) => {
      console.error("Error:", error);
      return NextResponse.json({ error });
    });
}
