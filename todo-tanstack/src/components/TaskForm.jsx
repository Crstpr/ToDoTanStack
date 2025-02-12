import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const addTodo = async(data)=>{
  const response = await fetch("http://localhost:5000/todo", {
    method: "POST",
    headers: { "Content-Type": "application/json"},
    body: JSON.stringify({description: data.taskDesc}),
  });
  return response.json();
}

const TaskForm = () => {
  const queryClient = useQueryClient();
  const form = useForm();
  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;

  const mutation = useMutation({
    mutationFn: addTodo,
    onSuccess: ()=>{
      queryClient.invalidateQueries(["todo"]);
      reset();
    },
  });

  const onSubmit = (data)=>{
    mutation.mutate(data);
  }
  return (
    <div>
      <h1>Todo Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
        <h3 htmlFor='taskDesc'>Task Description</h3>
        <input type='text' id="taskDesc" {...register("taskDesc",{required: 'Description cannot be empty!'})} style={{width: '350px', height: '25px'}}/>
        <p>{errors.taskDesc?.message}</p>
        </div>
        <button type="submit" disabled={mutation.isLoading}>{mutation.isLoading?"Submitting...": "Submit"}</button>
      </form>
    </div>
  );
};

export default TaskForm;
