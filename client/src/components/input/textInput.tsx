import React from "react";
import { UseFormRegister } from "react-hook-form";
import { IAddExpenseInput } from "../expenses/types";

export const TextInput = ({
  register,
  errors,
  field,
  validation,
  width,
  type,
}: {
  register: any;
  field: any;
  validation: any;
  errors: any;
  width?: any;
  type?: any;
}) => {
  return (
    <div className={`mb-4 text-left ${width ?? "w-1/2"} min-w-80`}>
      <label className="text-white  mb-2   [text-shadow:_0_1px_0_cyan] ml-1 block">
        {field}
      </label>
      <input
        className=" text-cyan-600  border border-gray-300 w-full   outline-none hover:border-gray-500
          focus-within:border-gray-500  focus:border-2  rounded px-4 py-2"
        type={type ?? "text"}
        {...register(field, {
          ...validation,
          // ...(type == "date" && {
          //   valueAsDate: true,
          // }),
          // ...(type == "number" && {
          //   valueAsNumber: true,
          // }),
        })}
      />
      {errors[field] && (
        <p className="text-red-500 mb-2"> {errors[field].message}</p>
      )}
    </div>
  );
};

export const TextSelectInput = ({
  options,
  register,
  errors,
  field,
  validation,
  width,
  type,
}: {
  options: any;
  register: any;
  field: any;
  validation: any;
  errors: any;
  width?: any;
  type?: any;
}) => {
  console.log(field, errors["email"]);
  return (
    <div className={`mb-4 text-left ${width ?? "w-1/2"} min-w-80`}>
      <Select label={field} options={options} {...register(field)} />

      {errors[field] && (
        <p className="text-red-500 mb-2"> {errors[field].message}</p>
      )}
    </div>
  );
};

const Select = React.forwardRef<
  HTMLSelectElement,
  { label: string; options: { id: string; name: string }[] } & ReturnType<
    UseFormRegister<IAddExpenseInput>
  >
>(({ onChange, onBlur, name, label, options }, ref) => (
  <>
    <label className="text-white  mb-2   [text-shadow:_0_1px_0_cyan] ml-1 block">
      {label}
    </label>
    <select
      className=" text-cyan-600  border border-gray-300 w-full   outline-none hover:border-gray-500
          focus-within:border-gray-500  focus:border-2  rounded px-4 py-2"
      name={name}
      ref={ref}
      onChange={onChange}
      onBlur={onBlur}
    >
      <option value={""}></option>
      {options.map((option) => {
        return <option value={option.id}>{option.name}</option>;
      })}
    </select>
  </>
));
