import { Button, Table } from "flowbite-react";

import { useAppSelector } from "../../store/redux/hooks/store.hooks";
import { useState } from "react";
import { AddCategory } from "./addCategory/addCategory";
import { useDispatch } from "react-redux";
import { removeCategory } from "../../store/redux/actions/category-action";
import { Category } from "./types";

export const Categories = () => {
  const categories: Category[] = useAppSelector(
    (state) => state.categories.categories
  );
  const [openAddModal, setAddOpenModal] = useState<boolean>(false);

  const dispatch = useDispatch();
  const deleteHandler: any = (id: string) => {
    dispatch(removeCategory({ id }));
  };

  return (
    <div className="overflow-x-auto flex flex-col items-center p-10 ">
      <h1 className=" text-2xl text-yellow-300">Categories</h1>
      <div className="m-4">
        <Button color="gray" onClick={() => setAddOpenModal(true)}>
          Add
        </Button>
      </div>
      <Table className="mt-10 w-96">
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Description</Table.HeadCell>
          <Table.HeadCell>
            <span className="sr-only">Delete</span>
          </Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {categories?.map((category) => {
            return (
              <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                  {category.name}
                </Table.Cell>
                <Table.Cell>{category.description}</Table.Cell>
                <Table.Cell>
                  <button
                    className="font-medium text-cyan-600  dark:text-cyan-500"
                    onClick={() => deleteHandler(category.id)}
                  >
                    Delete
                  </button>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>
      <AddCategory openModal={openAddModal} setOpenModal={setAddOpenModal} />
    </div>
  );
};
