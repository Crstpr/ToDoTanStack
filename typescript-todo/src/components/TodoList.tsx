import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

interface Todo {
  id: number;
  title: string;
  description: string;
  dueDate: string | null; 
  isDone: boolean;
}

const getTodos = async (): Promise<Todo[]> => {
  const token = localStorage.getItem("token");
  const response = await fetch("http://localhost:5000/todo", {
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

  const { data: todos, isPending, error } = useQuery<Todo[], Error>({ 
    queryKey: ["todo"],
    queryFn: getTodos,
  });

  const mutation = useMutation<any, Error, number>({ 
    mutationFn: (id: number) => deleteTodo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });

  const updateMutation = useMutation<any, Error, { id: number; isDone: boolean }>({ 
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });

  const toggleDone = (todo: Todo) => {
    updateMutation.mutate({ id: todo.id, isDone: !todo.isDone });
  };

  if (isPending) return <p>Loading . . .</p>;
  if (error) return <p>Error fetching tasks</p>;

  return (
    <div style={{ marginRight: '42px' }}>
      <ul>
        {todos?.map((todo) => ( 
          <li
            key={todo.id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              border: '1px solid #fff',
              borderRadius: '5px',
              marginBottom: '5px',
            }}
          >
            <input
              type="checkbox"
              checked={todo.isDone}
              onChange={() => toggleDone(todo)}
              style={{ marginRight: '10px' }}
            />
            <div style={{ flex: 1, textAlign: 'justify' }}>
              <strong>{todo.title}</strong> - {todo.description} <br />{" "}
              <small>{todo.dueDate ? (format(new Date(todo.dueDate), 'MMMM dd, yyyy')): ('No due date')}</small>
            </div>
            <button
              onClick={() => mutation.mutate(todo.id)}
              style={{ marginLeft: '50px' }}
              className='btn btn-danger'
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
