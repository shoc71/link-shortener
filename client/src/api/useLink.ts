
const BASEURL = "http://localhost:5000/api";

export interface LinkItem {
  _id: string;
  originalLink: string;
  newLink: string;
}

export async function addLink( originalLink: String, newLink: String ) {

  try {
    const res = await fetch(`${BASEURL}/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ originalLink, newLink }),
    });

    return await res.json();
  } catch (err) {
    return { success: false, error: "Network error" };
  }
}

export async function getAllLinks(): Promise<{ success: boolean; data: LinkItem[] }> {
  const res = await fetch(`${BASEURL}/getAll`);
  const data = await res.json();
  return { success: true, data: data.data };
}

export async function deleteLink( id: String ) {
  const res = await fetch(`${BASEURL}/delete/${id}`, {
    method: "DELETE",
  });

  const data = await res.json();
  return data;
}
