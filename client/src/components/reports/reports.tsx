import { Table } from "flowbite-react";
import { useState } from "react";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { IMonthlyReportFilterExpensesInput } from "./types";
import { fetchExpensesMonthlyReport } from "./api";
import { useForm } from "react-hook-form";
import { TextInput } from "../input/textInput";
export const Reports = () => {
  const [filter, setFilter] = useState<IMonthlyReportFilterExpensesInput>({
    month: new Date().getMonth().toString(),
    year: new Date().getFullYear().toString(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IMonthlyReportFilterExpensesInput>({
    defaultValues: filter,
  });

  const handleSuccess = async (data: any) => {
    setFilter(data);
  };
  const handleErrors = (errorsDetails: any) => {
    console.log(errorsDetails);
  };

  const {
    isPending,
    error,
    data: expenses,
  } = useQuery({
    queryKey: ["expensesReport", filter],
    queryFn: () => fetchExpensesMonthlyReport(filter),
    placeholderData: keepPreviousData,
  });

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className=" flex flex-col items-center p-10  max-sm:max-w-96">
      <h1 className=" text-2xl text-yellow-300">Monthly Report</h1>
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
              validation={{ Required: "Month is required" }}
              register={register}
              field="month"
              width={"w-1/3"}
            />
            <TextInput
              errors={errors}
              validation={{ Required: "Year is required" }}
              register={register}
              field="year"
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

      <div className="mt-10  overflow-x-auto  ">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Count</Table.HeadCell>
            <Table.HeadCell>Avg Amount</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {expenses?.map((expense: any) => {
              return (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                    {expense.category?.name}
                  </Table.Cell>
                  <Table.Cell>{expense.count}</Table.Cell>
                  <Table.Cell>{expense.avgAmount}</Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      </div>
    </div>
  );
};
