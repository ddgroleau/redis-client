"use server";
import { redirect } from "next/navigation";
import { Todo } from "./models/Todo";
import { revalidateTag } from "next/cache";
import { getTokenCookie } from "./auth";

const baseUri = process.env.API_BASE_URI;

async function getAuthorizationHeader() {
  const token = await getTokenCookie();
  return { Authorization: "bearer " + token?.value };
}

export async function createToDo(formData: FormData): Promise<string> {
  const name = formData.get("name");
  await fetch(`${baseUri}/todos?name=${name}`, {
    method: "POST",
    headers: await getAuthorizationHeader(),
  });
  revalidateTag("collection");
  return redirect("/");
}

export async function getToDo(id: string): Promise<Todo> {
  const res = await fetch(`${baseUri}/todos/${id}`, {
    headers: await getAuthorizationHeader(),
    next: { tags: [id], revalidate: 3600 },
  });
  if (res.status === 401) {
    return redirect("/error");
  }
  return await res.json();
}

export async function getToDos(): Promise<Todo[]> {
  const res = await fetch(`${baseUri}/todos`, {
    headers: await getAuthorizationHeader(),
    next: { tags: ["collection"], revalidate: 3600 },
  });
  if (res.status === 401) {
    return redirect("/error");
  }
  return await res.json();
}

export async function updateToDo(formData: FormData): Promise<void> {
  const newName = formData.get("newName");
  const id = formData.get("id");
  if (id) {
    await fetch(`${baseUri}/todos/${id}?newName=${newName}`, {
      method: "PUT",
      headers: await getAuthorizationHeader(),
    });
    revalidateTags([id.toString(), "collection"]);
  }
  return redirect("/");
}

export async function deleteToDo(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (id) {
    await fetch(`${baseUri}/todos/${id}`, {
      method: "DELETE",
      headers: await getAuthorizationHeader(),
    });
    revalidateTags([id.toString(), "collection"]);
  }
  return redirect("/");
}

function revalidateTags(tags: string[]) {
  tags.forEach((t) => revalidateTag(t));
}
