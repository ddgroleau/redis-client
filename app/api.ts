"use server";
import { redirect } from "next/navigation";
import { Todo } from "./Todo";

const baseUri = process.env.API_BASE_URI;

export async function createToDo(formData: FormData): Promise<string> {
  const name = formData.get("name");
  const res = await fetch(`${baseUri}/todos?name=${name}`, { method: "POST" });
  const id = await res.text();
  return redirect(`/${id}`);
}

export async function getToDo(id: string): Promise<Todo> {
  const res = await fetch(`${baseUri}/todos/${id}`, { cache: "no-cache" });
  return await res.json();
}

export async function updateToDo(formData: FormData): Promise<void> {
  const newName = formData.get("newName");
  const id = formData.get("id");
  await fetch(`${baseUri}/todos/${id}?newName=${newName}`, { method: "PUT" });
  return redirect(`/${id}`);
}

export async function deleteToDo(formData: FormData): Promise<void> {
  const id = formData.get("id");
  await fetch(`${baseUri}/todos/${id}`, { method: "DELETE" });
  return redirect("/");
}
