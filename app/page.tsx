import FormStatus from "@/components/FormStatus";
import { createToDo, getToDos } from "./api";

export default async function Home() {
  const todos = await getToDos();

  return (
    <main className="m-8">
      <h1 className="font-bold my-4">Hello World!</h1>
      <form className="flex flex-col gap-y-2 mb-8" action={createToDo}>
        <FormStatus />
        <label htmlFor="name">Add a To-Do:</label>
        <input
          id="name"
          name="name"
          type="text"
          placeholder="Enter a To-Do"
          className="border max-w-64 px-2 py-1 rounded"
        />
        <button
          type="submit"
          className="border border-black hover:text-white hover:bg-black px-2 py-1 rounded w-fit mt-4"
        >
          Save
        </button>
      </form>
      {!!todos && todos.length > 0 && (
        <>
          <h2 className="font-bold my-2">My Todos</h2>
          <ol className="flex flex-col list-decimal mx-8">
            {todos.map((t, i) => (
              <li key={i}>
                <a className="underline" href={`/${t.id}`}>
                  {t.name}
                </a>
              </li>
            ))}
          </ol>
        </>
      )}
    </main>
  );
}
