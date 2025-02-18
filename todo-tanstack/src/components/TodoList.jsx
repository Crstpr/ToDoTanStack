import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns';

const getTodos = async()=>{
    const token = localStorage.getItem("token");
    const response = await fetch("http://localhost:5000/todo", {headers
    : {token}
    });

    const data = await response.json();
    console.log("Fetched todos:", data);
    return data;

    if(!response.ok){
      throw new Error("Something went wrong");
    }
    return await response.json();
};

const deleteTodo = async(id)=>{
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:5000/todo/${id}`, {method: "DELETE", headers: {token}});
    return await response.json();
};

const updateTodo = async({id, isDone})=>{
  const response = await fetch(`http://localhost:5000/todo/${id}`,{
    method: "PUT",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({isDone}), 
  });
  return response.json();
}

const TodoList = () => {
    const queryClient = useQueryClient();

    const{data: todos, isLoading, error} = useQuery({
        queryKey: ["todo"],
        queryFn: getTodos,
    });

    const mutation = useMutation({
        mutationFn: (id)=>deleteTodo(id),
        onSuccess: ()=> {
            queryClient.invalidateQueries(["todo"]);
        },
    });

    const updateMutation = useMutation({
      mutationFn: updateTodo,
      onSuccess: ()=>{
        queryClient.invalidateQueries(["todo"]);
      },
    });

    const toggleDone = (todo) =>{
      updateMutation.mutate({id: todo.id, isDone: !todo.isDone});
      
    }
  

    if(isLoading) return <p>Loading . . .</p>
    if(error) return <p>Error fetching tasks</p>
  return (
    <div style={{marginRight: '42px'}}>
      <ul>
        {todos.map((todo)=>(
            <li key={todo.id} style={{display:'flex',justifyContent:'space-between', padding: '10px', border:'1px solid #fff', borderRadius:'5px', marginBottom:'5px'}}>
              <input type="checkbox" checked={todo.isDone} onChange={() => toggleDone(todo)} style={{ marginRight: '10px' }} />
              <div style={{flex:1, textAlign:'justify'}}><strong>{todo.title}</strong> - {todo.description} <br/> <small> {todo.dueDate ? (
                  format(new Date(todo.dueDate), 'MMMM dd, yyyy')) : ('No due date')}</small></div>
                <button onClick={()=>mutation.mutate(todo.id)} style={{marginLeft: '50px'}} className='btn btn-danger'>Delete</button>
            </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList
