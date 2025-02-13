import * as yup from 'yup';

const TodoSchema = yup.object().shape({
    taskTitle: yup.string().required('Title cannot be empty!'),
    taskDesc: yup.string().nullable(),
    taskdueDate: yup.date().transform((value, originalValue) => originalValue === ""? null:value).required('Please input a due date!'),
    isDone: yup.boolean().default(false),
});

export {TodoSchema};