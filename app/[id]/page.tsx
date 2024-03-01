import FormStatus from "@/components/FormStatus";
import { deleteToDo, getToDo, updateToDo } from "../../lib/api";
import Authorize from "@/components/Authorize";

export default async function Page({ params }: { params: { id: string } }) {
  const todo = await getToDo(params.id);

  return (
    <Authorize returnUri={`/${!params.id ? "" : params.id}`}>
      <div className="m-8">
        <h1 className="font-bold my-4">Editing To-Do: {params.id}</h1>
        <form
          id="updateTodo"
          className="flex flex-col gap-y-4"
          action={updateToDo}
        >
          <FormStatus />
          <label htmlFor="newName">Description:</label>
          <input
            id="newName"
            name="newName"
            type="text"
            defaultValue={todo.name}
            className="border max-w-64 px-2 py-1 rounded"
          />
          <input name="id" type="hidden" value={todo.id} />
        </form>
        <form id="deleteToDo" action={deleteToDo}>
          <FormStatus />
          <input name="id" type="hidden" value={todo.id} />
        </form>
        <div className="flex gap-x-4">
          <button
            type="submit"
            className="border border-black hover:text-white hover:bg-black px-2 py-1 rounded w-fit mt-4"
            form="updateTodo"
          >
            Save
          </button>
          <button
            id="deleteToDoBtn"
            type="submit"
            className="border border-black text-white bg-black hover:bg-white hover:text-black px-2 py-1 rounded w-fit mt-4"
            form="deleteToDo"
          >
            Delete
          </button>
        </div>
      </div>
    </Authorize>
  );
}
