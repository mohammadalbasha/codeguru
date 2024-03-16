import React, { useContext } from "react";
import { useForm, useFormState } from "react-hook-form";

import { Link, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import { FaAddressBook } from "react-icons/fa";
import { IFilterExpensesInput } from "../types";
import { TextInput, TextSelectInput } from "../../input/textInput";
import { useAppSelector } from "../../../store/redux/hooks/store.hooks";
import { Category } from "../../categroies/types";

const FilterExpenses = ({ filter, setFilter }: any) => {
  const categories: Category[] = useAppSelector(
    (state) => state.categories.categories
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFilterExpensesInput>({
    defaultValues: filter,
  });

  const handleSuccess = async (data: any) => {
    console.log(data);
    setFilter(data);
  };
  const handleErrors = (errorsDetails: any) => {
    console.log(errorsDetails);
  };

  return (
    <div className="  bg-gradient-to-t from-yellow-200 to-yellow-300 w-full min-w-96 mt-10 rounded-md    shadow-md  shadow-zinc-200   flex flex-col items-center    ">
      <h2 className="text-2xl text-white font-bold  mt-8 ">Filtering</h2>

      {errors.root?.serverError?.message && (
        <h1 className=" text-white bg-red-700 p-4  rounded-md shadow-md shadow-zinc-200">
          {errors.root?.serverError?.message}
        </h1>
      )}

      <form
        className="flex flex-col text-indigo-500"
        onSubmit={handleSubmit(handleSuccess, handleErrors)}
      >
        <div className="flex  w-full flex-wrap p-2  gap-2 items-center justify-around mt-2">
          <TextInput
            errors={errors}
            validation={{}}
            register={register}
            field="description"
            width={"w-1/3"}
          />

          <TextInput
            errors={errors}
            validation={{}}
            register={register}
            field="dateFrom"
            type={"date"}
            width={"w-1/3"}
          />
          <TextInput
            errors={errors}
            validation={{}}
            register={register}
            field="dateTo"
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
        </div>

        <input
          className="px-4 py-2  rounded-md shadow-sky-900 shadow-md hover:bg-cyan-400 hover:cursor-pointer bg-cyan-600 text-white"
          type="submit"
          value="filter"
        ></input>
      </form>
    </div>
  );
};

export default FilterExpenses;
