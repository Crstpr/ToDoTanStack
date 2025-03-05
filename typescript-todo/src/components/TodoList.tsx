import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';

interface Todo {
  id: number;
  title: string;
  description: string;
  dueDate: string | null;
  isDone: boolean;
}

type FormData = {
  search: string;
};

const getTodos = async (search: string = ""): Promise<Todo[]> => {
  const token = localStorage.getItem("token");
  let url = "http://localhost:5000/todo";
  if (search) {
    url += `?search=${search}`;
  }

  const response = await fetch(url, {
    headers: { token: token || "" },
  });

  if (!response.ok) {
    throw new Error("Something went wrong");
  }

  const data = await response.json();
  console.log("Fetched todos:", data);
  return data;
};

const deleteTodo = async (id: number): Promise<any> => {
  const token = localStorage.getItem("token");
  const response = await fetch(`http://localhost:5000/todo/${id}`, {
    method: "DELETE",
    headers: { token: token || "" },
  });
  return await response.json();
};

const updateTodo = async ({ id, isDone }: { id: number; isDone: boolean }): Promise<any> => {
  const response = await fetch(`http://localhost:5000/todo/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isDone }),
  });
  return await response.json();
};

const TodoList: React.FC = () => {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm<FormData>();
  const [search, setSearch] = React.useState('');

  const { data: todos, isPending, error } = useQuery<Todo[], Error>({
    queryKey: ["todo", search], 
    queryFn: () => getTodos(search),
  });


  const mutation = useMutation<any, Error, number>({
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo", search] }); // invalidate with search term
    },
  });

  const updateMutation = useMutation<any, Error, { id: number; isDone: boolean }>({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo", search] }); // invalidate with search term
    },
  });

  const toggleDone = (todo: Todo) => {
    updateMutation.mutate({ id: todo.id, isDone: !todo.isDone });
  };

  const onSubmit = (data: FormData) => {
    setSearch(data.search);
  };

  if (isPending) return <p className="text-white">Loading . . .</p>;
  if (error) return <p className="text-red-500">Error fetching tasks</p>;

  return (
    <div className="mr-10 mt-5">
       <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-2 mb-4 w-3/4">
        <input
          {...register('search')}
          placeholder="Search todos..."
          className="border border-black p-2 rounded w-full text-gray-500"
        />
        <button type="submit" className="bg-blue-950 text-white px-4 py-2 rounded">Search</button>
      </form>
      <ul className="space-y-3  ">
        {todos?.map((todo) => (
          <li
            key={todo.id}
            className="flex justify-between items-center p-1.5 bg-[#F8FAFC] rounded-xl text-blue-950 border-1 border-black"
          >
            <input
              type="checkbox"
              checked={todo.isDone}
              onChange={() => toggleDone(todo)}
              className="mr-4 accent-[#9AA6B2] "
            />
            <div className="flex-1 text-justify ">
              <strong className="font-semibold">{todo.title}</strong> - {todo.description}
              <br />
              <small className="text-gray-600">
                {todo.dueDate ? format(new Date(todo.dueDate), 'MMMM dd, yyyy') : 'No due date'}
              </small>
            </div>
            <button
              onClick={() => mutation.mutate(todo.id)}
              className="ml-8 bg-[#BCCCDC] hover:bg-[#9AA6B2] text-blue-950 font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline disabled:opacity-50"
              disabled={mutation.isPending}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
