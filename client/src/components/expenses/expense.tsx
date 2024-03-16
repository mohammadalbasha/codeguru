import { Table } from "flowbite-react";
import { Category } from "../categroies/types";
import { IExpenses } from "./types";
import { useState } from "react";
import { UpdateExpense } from "./updateExpense/updateExpense";

export function Expense({
  expense,
  downloadInvoiceHandler,
  deleteHandler,
  invalidateQuery,
}: {
  expense: IExpenses;
  downloadInvoiceHandler: any;
  deleteHandler: any;
  invalidateQuery: any;
}) {
  const [openUpdateModal, setUpdateOpenModal] = useState<boolean>(false);

  return (
    <>
      {" "}
      <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
        <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
          {expense.amount}
        </Table.Cell>
        <Table.Cell>{(expense.category as Category)?.name}</Table.Cell>
        <Table.Cell>{expense.date?.toString()}</Table.Cell>

        <Table.Cell>{expense.description}</Table.Cell>
        <Table.Cell>
          {expense.mediaFileId && expense.mediaFileId != "" && (
            <button
              className="font-medium text-cyan-600  dark:text-cyan-800"
              onClick={() => downloadInvoiceHandler(expense.mediaFileId)}
            >
              Invoice
            </button>
          )}
        </Table.Cell>
        <Table.Cell>
          <button
            className="font-medium text-red-600  dark:text-red-800"
            onClick={() => deleteHandler(expense.id!)}
          >
            Delete
          </button>
        </Table.Cell>
        <Table.Cell>
          <button
            className="font-medium text-cyan-600  dark:text-cyan-800"
            onClick={() => setUpdateOpenModal(true)}
          >
            Update
          </button>
        </Table.Cell>
      </Table.Row>
      <UpdateExpense
        openModal={openUpdateModal}
        setOpenModal={setUpdateOpenModal}
        expense={expense}
        invalidateQuery={invalidateQuery}
      />
    </>
  );
}
