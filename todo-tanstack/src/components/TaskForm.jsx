import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoSchema } from './type';
import { yupResolver } from '@hookform/resolvers/yup'

const addTodo = async (data) => {
  const response = await fetch("http://localhost:5000/todo", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: data.taskDesc, title: data.taskTitle, dueDate: data.taskdueDate, isDone: false }),
  });
  return response.json();
}

const TaskForm = () => {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: yupResolver(TodoSchema),
    defaultValues: { isDone: false },
  });
  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;

  const mutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(["todo"]);
      reset();
    },
  });

  const onSubmit = (data) => {
    console.log(data, "checker")
    mutation.mutate(data);
  }

  const onCheck = (data) => {
    console.log(form.getValues(), "checker")
  }
  return (
    <div>
      <h1>Todo Form</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>

          <input type='text' id="taskTitle" {...register("taskTitle")} style={{ width: '350px', height: '25px' }} placeholder='Task Title' />
          <p style={{ color: 'red' }}>{errors.taskTitle?.message}</p>
        </div>

        <div>
          <input type='text' id="taskDesc" {...register("taskDesc")} style={{ width: '350px', height: '25px' }} placeholder='Task Description' />
          <p />
        </div>

        <div>
          <input type='date' id="taskdueDate" {...register("taskdueDate")} style={{ width: '350px', height: '25px' }} />
          <p style={{ color: 'red' }}>{errors.taskdueDate?.message}</p>
        </div>

        <button onClick={onCheck}>Check</button>
        <button type="submit" disabled={mutation.isLoading}>{mutation.isLoading ? "Submitting..." : "Submit"}</button>
      </form>
    </div>
  );
};

export default TaskForm;
