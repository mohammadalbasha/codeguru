import { Modal, Button } from "flowbite-react";
import React from "react";
import { useDispatch } from "react-redux";
import { addCategory } from "../../../store/redux/actions/category-action";
import { AddCategoryInput } from "../types";

export const AddCategory = ({ openModal, setOpenModal }: any) => {
  const [categoryInput, setCategoryInput] = React.useState<AddCategoryInput>({
    name: "",
    description: "",
  });
  const dispatch = useDispatch();

  const changeHandler = (key: "name" | "description", value: string) => {
    setCategoryInput((prev: AddCategoryInput) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  };
  const submitHandler = () => {
    dispatch(addCategory(categoryInput));
  };
  return (
    <Modal show={openModal} onClose={() => setOpenModal(false)}>
      <Modal.Header>Add Category</Modal.Header>
      <Modal.Body>
        <div className=" flex items-center m-6">
          <span className={` basis-1/3`}>name:</span>
          <input
            className={`ml-2 border-2 p-1 rounded basis-2/3`}
            value={categoryInput?.name}
            onChange={(e) => {
              e.preventDefault();
              changeHandler("name", e.target.value);
            }}
            placeholder={"name"}
          ></input>
        </div>
        <div className=" flex items-center m-6">
          <span className={`basis-1/3`}>description:</span>
          <input
            className={`ml-2 border-2 p-1 rounded basis-2/3`}
            value={categoryInput?.description}
            onChange={(e) => {
              e.preventDefault();
              changeHandler("description", e.target.value);
            }}
            placeholder={"description"}
          ></input>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={() => {
            submitHandler(), setOpenModal(false);
          }}
        >
          Add
        </Button>
        <Button color="gray" onClick={() => setOpenModal(false)}>
          Decline
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
