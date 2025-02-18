import * as yup from 'yup';


export const TodoSchema = yup.object({
    taskTitle: yup.string().required('Title cannot be empty!'),
    taskDesc: yup.string().nullable(),
    taskdueDate: yup.date().transform((value, originalValue: any) => (originalValue === "" ? null : value)).required('Please input a due date!'),
    isDone: yup.boolean().default(false),
}).required();


export type TodoSchemaType = yup.InferType<typeof TodoSchema>;
