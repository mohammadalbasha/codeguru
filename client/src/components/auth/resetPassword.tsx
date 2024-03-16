import { useContext } from "react";
import { useForm, useFormState } from "react-hook-form";
import instance from "../../services/api/api.service";
import AuthContext from "../../store/auth-context";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { TextInput } from "../input/textInput";
import { FaAddressBook } from "react-icons/fa";
import { IResetPsaswordInput, ISigninInput } from "./types";

const ResetPassword = () => {
  const [queryParameters] = useSearchParams();
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  console.log(queryParameters);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
    control,
  } = useForm<IResetPsaswordInput>({
    defaultValues: {
      password: "",
      email: queryParameters.get("email")!,
      resetPasswordToken: queryParameters.get("resetPasswordToken")!,
    },
  });

  const { isSubmitted, isSubmitting } = useFormState({
    control,
  });

  const handleSuccess = async (data: any) => {
    try {
      const response = await instance({
        url: "/users/resetPassword",
        method: "POST",
        data: data,
        withCredentials: true,
      });

      navigate("/signin");
    } catch (err: any) {
      setError("root.serverError", {
        message: err.response?.data?.errors[0]?.message,
      });
    }
  };
  const handleErrors = (errorsDetails: any) => {
    console.log(errorsDetails);
  };

  return (
    <div className="  bg-gradient-to-t from-yellow-200 to-yellow-300   min-h-96 w-1/3 min-w-96 mt-10 rounded-md    shadow-md  shadow-zinc-200   flex flex-col items-center    ">
      <h2 className="text-2xl text-white font-bold  mt-8 ">Reset Password</h2>

      {errors.root?.serverError?.message && (
        <h1 className=" text-white bg-red-700 p-4  rounded-md shadow-md shadow-zinc-200">
          {errors.root?.serverError?.message}
        </h1>
      )}

      {isSubmitting ? (
        <div className="flex flex-col w-full items-center text-white">
          <h1>... ressetting</h1>
        </div>
      ) : (
        <form
          className="flex flex-col w-full   gap-4 items-center mt-10 text-indigo-500"
          onSubmit={handleSubmit(handleSuccess, handleErrors)}
        >
          <TextInput
            errors={errors}
            validation={{ required: "Password is required" }}
            register={register}
            field="password"
          />

          <input
            className="px-4 py-2 mt-20 rounded-md shadow-sky-900 shadow-md hover:bg-cyan-400 hover:cursor-pointer bg-cyan-600 text-white"
            type="submit"
            value="reset"
          ></input>
        </form>
      )}
      <div className="mt-6 flex flex-col items-center text-xs text-yellow-50 ">
        <Link className="  m-1" to={"/signin"}>
          {" "}
          <p className=" text-cyan-700 inline mr-4">
            {" "}
            <i>signin?</i>
          </p>
          {/* <button className="">reset</button> */}
        </Link>
      </div>
    </div>
  );
};

export default ResetPassword;
