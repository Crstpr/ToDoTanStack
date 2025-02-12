import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

const getTodos = async()=>{
    const response = await fetch("http://localhost:5000/todo");
    return await response.json();
};

const deleteTodo = async(id)=>{
    await fetch(`http://localhost:5000/todo/${id}`, {method: "DELETE"});
};

const TodoList = () => {
    const queryClient = useQueryClient();

    const{data: todos, isLoading, error} = useQuery({
        queryKey: ["todo"],
        queryFn: getTodos,
    });

    const mutation = useMutation({
        mutationFn: deleteTodo,
        onSuccess: ()=> {
            queryClient.invalidateQueries(["todo"]);
        },
    });

    if(isLoading) return <p>Loading . . .</p>
    if(error) return <p>Error fetching tasks</p>
  return (
    <div style={{marginRight: '42px'}}>
      <ul>
        {todos.map((todo)=>(
            <li key={todo.id} style={{display:'flex',justifyContent:'space-between', padding: '10px', border:'1px solid #fff', borderRadius:'5px', marginBottom:'5px'}}>
                {todo.description}
                <button onClick={()=>mutation.mutate(todo.id)}>Delete</button>
            </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList
