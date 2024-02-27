import { createToDo } from "./api";

export default function Home() {
  return (
    <main className="m-8">
      <h1 className="font-bold my-4">Hello World!</h1>
      <form className="flex flex-col gap-y-2" action={createToDo}>
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
    </main>
  );
}
