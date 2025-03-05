import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TodoSchema, TodoSchemaType } from './type'; 
import { yupResolver } from '@hookform/resolvers/yup';


interface AddTodoData {
  taskDesc?: string | null;
  taskTitle: string;
  taskdueDate: Date; 
  isDone: boolean;
}

const addTodo = async (data: AddTodoData): Promise<TodoSchemaType> => { 
  const response = await fetch("http://localhost:5000/todo", {
    method: "POST",
    headers: { "Content-Type": "application/json", token: localStorage.token },
    body: JSON.stringify({ description: data.taskDesc, title: data.taskTitle, dueDate: data.taskdueDate, isDone: false }),
  });

  if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`); 
  }

  return response.json();
};

const TaskForm: React.FC = () => { 
  const queryClient = useQueryClient();


  type FormValues = {
    taskTitle: string;
    taskDesc?: string | null;
    taskdueDate: Date; 
    isDone: boolean;
  };

  const form = useForm<FormValues>({ 
    resolver: yupResolver(TodoSchema),
    defaultValues: { isDone: false },
  });

  const { register, handleSubmit, formState, reset } = form;
  const { errors } = formState;

  const mutation = useMutation<TodoSchemaType, Error, AddTodoData>({ 
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] }); 
      reset();
    },
  });

  const onSubmit = (data: FormValues) => { 
    mutation.mutate(data);
  };

  return (
    <div className="bg-[#9AA6B2] p-6 pl-6 pr-6 rounded-xl w-1/2 flex flex-col items-center justify-center">
      <h3 className=' text-center mb-2 text-2xl font-bold'>Todo Form</h3>
      <form onSubmit={handleSubmit(onSubmit)} noValidate className='flex flex-col'>
        <div className='border-1 rounded-md'>
          <input
            type='text'
            id="taskTitle"
            {...register("taskTitle")}
            style={{ width: '350px', height: '25px' }}
            placeholder=' Task Title'
          />
          <p style={{ color: 'red' }}>{errors.taskTitle?.message}</p>
        </div>

        <div className='border-1 rounded-md mt-2'>
          <input
            type='text'
            id="taskDesc"
            {...register("taskDesc")}
            style={{ width: '350px', height: '25px' }}
            placeholder='Task Description'
          />
          <p />
        </div>

        <div className='border-1 rounded-md mt-2'>
          <input
            type='date'
            id="taskdueDate"
            {...register("taskdueDate")}
            style={{ width: '350px', height: '25px' }}
          />
          <p style={{ color: 'red' }}>{errors.taskdueDate?.message}</p>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className='bg-[#BCCCDC] hover:bg-blue-950 text-white mt-3.5 rounded-md p-1'
        >
          {mutation.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default TaskForm;

