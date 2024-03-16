import { Modal, Button } from "flowbite-react";
import React from "react";
import { IAddExpenseInput, IExpenses } from "../types";
import { addExpense, updateExpense } from "../api";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useAppSelector } from "../../../store/redux/hooks/store.hooks";
import { Category } from "../../categroies/types";
import { TextSelectInput, TextInput } from "../../input/textInput";
import axiosInstance from "../../../services/api/api.service";

export const UpdateExpense = ({
  openModal,
  setOpenModal,
  expense,
  invalidateQuery,
}: {
  openModal: any;
  setOpenModal: any;
  expense: IExpenses;
  invalidateQuery: any;
}) => {
  const categories: Category[] = useAppSelector(
    (state) => state.categories.categories
  );

  const mutation = useMutation({
    mutationFn: (data: IAddExpenseInput) => {
      return updateExpense(data, expense.id!);
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IAddExpenseInput>({
    defaultValues: {
      amount: expense.amount,
      category: (expense.category as Category)?.id,
      description: expense.description,
      date: new Date(expense.date!),
    },
  });

  const [imageFile, setImageFile] = React.useState<Blob>();

  const imageFileHandler = (e: any) => {
    setImageFile(e.target.files[0]);
  };

  const handleSuccess = async (data: any) => {
    const formData = new FormData();
    formData.append("file", imageFile!);

    if (imageFile) {
      const mediaFile = await axiosInstance.post(
        "http://localhost:4000/api/files",
        formData
      );

      mutation.mutate({ ...data, mediaFileId: mediaFile?.data?.id });
    } else mutation.mutate(data);
    invalidateQuery();
  };
  const handleErrors = (errorsDetails: any) => {
    console.log(errorsDetails);
  };

  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Update Expense</Modal.Header>
      <Modal.Body className="p-0">
        <div className=" bg-slate-500  flex flex-col items-center ">
          {mutation.isError ? (
            <h1 className=" text-white bg-red-700 p-4  rounded-md shadow-md shadow-zinc-200">
              {mutation.error.message}
            </h1>
          ) : null}

          {mutation.isSuccess ? (
            <div className=" text-white mt-2 bg-yellow-300 p-4  rounded-md shadow-md shadow-zinc-200">
              Expenses Updated!
            </div>
          ) : null}
          {mutation.isPending ? (
            <div className=" text-white mt-2 bg-red-yellow-500 p-4  rounded-md shadow-md shadow-zinc-200">
              Updateing...
            </div>
          ) : null}

          <form
            className="flex flex-col text-indigo-500"
            onSubmit={handleSubmit(handleSuccess, handleErrors)}
          >
            <div className="flex  w-full flex-wrap p-2  gap-2 items-center justify-around mt-2">
              <TextInput
                errors={errors}
                validation={{ required: "description is required" }}
                register={register}
                field="amount"
                width={"w-1/3"}
                type={"number"}
              />

              <TextInput
                errors={errors}
                validation={{ required: "description is required" }}
                register={register}
                field="description"
                width={"w-1/3"}
              />

              <TextInput
                errors={errors}
                validation={{ required: "date is required" }}
                register={register}
                field="date"
                type={"date"}
                width={"w-1/3"}
              />

              <TextSelectInput
                errors={errors}
                options={categories}
                validation={{}}
                register={register}
                field="category"
                type={"category"}
                width={"w-1/3"}
              />

              <div className="flex  items-center ">
                <label className="text-white  mb-2   [text-shadow:_0_1px_0_cyan] ml-1 block">
                  invoice
                </label>
                <input
                  className="block w-full ml-2 text-sm text-gray-900 
 border-gray-300 rounded-lg cursor-pointer
  bg-gray-50 dark:text-gray-400 focus:outline-none
   dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                  onChange={imageFileHandler}
                  type="file"
                />
              </div>
            </div>

            <input
              className="px-4 py-2  rounded-md shadow-sky-900 shadow-md hover:bg-cyan-400 hover:cursor-pointer bg-cyan-600 text-white"
              type="submit"
              value="update"
            ></input>
          </form>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button color="gray" onClick={() => setOpenModal(false)}>
          Decline
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
