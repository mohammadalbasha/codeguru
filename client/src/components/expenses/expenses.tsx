import { Button, Pagination, Table } from "flowbite-react";
import { useState } from "react";
import { AddExpense } from "./addExpense/addExpense";

import { IoIosAddCircle } from "react-icons/io";
import { IExpenses, IFilterExpensesInput } from "./types";
import FilterExpenses from "./filterExpenses/filterExpenses";
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  deleteExpense,
  downloadInvoice,
  downloadReport,
  fetchExpenses,
} from "./api";
import { Category } from "../categroies/types";
import { Expense } from "./expense";
export const Expenses = () => {
  const [filter, setFilter] = useState<IFilterExpensesInput>({
    description: "",
    dateFrom: "",
    dateTo: "",
    category: "",
  });

  const [openAddModal, setAddOpenModal] = useState<boolean>(false);

  const [currentPage, setCurrentPage] = useState<number>(1);

  const onPageChange = (page: number) => setCurrentPage(page);

  const queryClient = useQueryClient();
  const fetchExpensesQuery = {
    queryKey: ["expenses", currentPage, filter],
    queryFn: () =>
      fetchExpenses(
        { limit: 5, offset: Math.max(0, 5 * (currentPage - 1)) },
        filter
      ),
    placeholderData: keepPreviousData,
  };
  const {
    isPending,
    error,
    data: expenses,
  } = useQuery<{ expenses: IExpenses[]; count: number }>(fetchExpensesQuery);

  const invalidateQueryHandler = () => {
    queryClient.invalidateQueries(fetchExpensesQuery);
  };
  const deleteHandler = async (id: string) => {
    try {
      await deleteExpense({ id });
      invalidateQueryHandler();
    } catch {}
  };

  // eport as an excel

  const initiateDownload = (blobData: any) => {
    const url = URL.createObjectURL(blobData);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.pdf";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadReportHandler = async () => {
    // Call the function to initiate the download
    const report = await downloadReport(filter);
    initiateDownload(report);
  };

  const downloadInvoiceHandler = async (id: string) => {
    // Call the function to initiate the download
    const report = await downloadInvoice(id);
    initiateDownload(report);
  };

  if (isPending) return "Loading...";

  if (error) return "An error has occurred: " + error.message;

  return (
    <div className=" flex flex-col items-center p-10  max-sm:max-w-96">
      <h1 className=" text-2xl text-yellow-300">Expenses</h1>

      <FilterExpenses setFilter={setFilter} />
      <div className="m-4 p-4 flex justify-between w-full ">
        <Button onClick={downloadReportHandler} color="cyan">
          download as pdf
        </Button>
        <Button color="cyan">
          <IoIosAddCircle size={20} onClick={() => setAddOpenModal(true)} />
        </Button>
      </div>

      <div className="mt-10  overflow-x-auto  ">
        <Table striped>
          <Table.Head>
            <Table.HeadCell>Amount</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Date</Table.HeadCell>

            <Table.HeadCell>Description</Table.HeadCell>
            <Table.HeadCell>invoice</Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Delete</span>
            </Table.HeadCell>
            <Table.HeadCell>
              <span className="sr-only">Update</span>
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {expenses?.expenses?.map((expense) => {
              return (
                <Expense
                  expense={expense}
                  deleteHandler={deleteHandler}
                  downloadInvoiceHandler={downloadInvoiceHandler}
                  invalidateQuery={invalidateQueryHandler}
                />
              );
            })}
          </Table.Body>
        </Table>
      </div>
      <div className="flex overflow-x-auto mt-4 sm:justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={1 + Math.floor(expenses?.count / 5)}
          onPageChange={onPageChange}
        />
      </div>
      <AddExpense
        openModal={openAddModal}
        setOpenModal={setAddOpenModal}
        invalidateQuery={invalidateQueryHandler}
      />
    </div>
  );
};
