"use server";
import { redirect } from "next/navigation";
import { Todo } from "./Todo";
import { revalidateTag } from "next/cache";

const baseUri = process.env.API_BASE_URI;

export async function createToDo(formData: FormData): Promise<string> {
  const name = formData.get("name");
  await fetch(`${baseUri}/todos?name=${name}`, { method: "POST" });
  revalidateTag("collection");
  return redirect("/");
}

export async function getToDo(id: string): Promise<Todo> {
  const res = await fetch(`${baseUri}/todos/${id}`, {
    next: { tags: [id], revalidate: 3600 },
  });
  return await res.json();
}

export async function getToDos(): Promise<Todo[]> {
  const res = await fetch(`${baseUri}/todos`, {
    next: { tags: ["collection"], revalidate: 3600 },
  });
  return await res.json();
}

export async function updateToDo(formData: FormData): Promise<void> {
  const newName = formData.get("newName");
  const id = formData.get("id");
  if (!!id) {
    await fetch(`${baseUri}/todos/${id}?newName=${newName}`, { method: "PUT" });
    revalidateTags([id.toString(), "collection"]);
  }
  return redirect("/");
}

export async function deleteToDo(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (!!id) {
    await fetch(`${baseUri}/todos/${id}`, { method: "DELETE" });
    revalidateTags([id.toString(), "collection"]);
  }
  return redirect("/");
}

function revalidateTags(tags: string[]) {
  tags.forEach((t) => revalidateTag(t));
}
