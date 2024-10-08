import { add, del, get } from "../lib/redis";

const api = process.env.API_HOST;

export async function getSessionList() {
  const cacheKey = "sessionList";
  const cachedData = await get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  } else {
    const response = await fetch(api + "/sessions", {
      method: "GET",
      cache: "no-cache",
    }).then((e) => e.json());
    await add(cacheKey, JSON.stringify(response), 5 * 60);
    return response;
  }
}

export async function postSession(title: string, deckQuantity: number) {
  const cacheKey = "sessionList";
  await fetch(api + "/sessions", {
    body: JSON.stringify({ title: title, deckQuantity: deckQuantity }),
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
  });
  await del(cacheKey);
}

export async function getSessionById(id: string) {
  const response = await fetch(api + `/sessions/${id}`, {
    method: "GET",
    cache: "no-store",
  });
  const resp = await response.json();
  return resp;
}

export async function getStartRound(id: string) {
  const response = await fetch(api + "/sessions/" + id + "/card", {
    method: "GET",
    cache: "no-store",
  });
  return response.json();
}

export async function patchPlayerAction(id: string, playerAction: string) {
  await fetch(`${api}/sessions/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ playerAction: playerAction }),
  });
}

export async function patchClearHand(id: string) {
  await fetch(api + "/sessions/" + id + "/clearHand", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
  });
}
