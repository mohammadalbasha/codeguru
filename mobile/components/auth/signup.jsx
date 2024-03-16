// import React, { useContext } from "react";
// import { useForm, useFormState } from "react-hook-form";
// import instance from "../../services/api/api.service";
// import AuthContext from "../../store/auth-context";
// import { useNavigate } from "react-router-dom";
// import { AxiosError } from "axios";
// import { TextInput } from "../input/textInput";

// interface ISigninInput {
//   name: string;
//   email: string;
//   password: string;
// }

// const SignUp = () => {
//   const auth = useContext(AuthContext);
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     setError,
//     control,
//   } = useForm<ISigninInput>({
//     defaultValues: {
//       email: "",
//       password: "",
//       name: "",
//     },
//   });

//   const { isSubmitted, isSubmitting } = useFormState({
//     control,
//   });

//   const handleSuccess = async (data: any) => {
//     try {
//       const response = await instance({
//         url: "/users/signup",
//         method: "POST",
//         data: data,
//         withCredentials: true,
//       });

//       auth.login(response.data);
//       navigate("/");
//     } catch (err: any) {
//       setError("root.serverError", {
//         message: err.response?.data?.errors[0]?.message,
//       });
//     }
//   };
//   const handleErrors = (errorsDetails: any) => {
//     console.log(errorsDetails);
//   };

//   return (
//     <div className="  bg-gradient-to-t from-yellow-200 to-yellow-300  h-3/4 w-1/3 min-w-96 mt-10 rounded-md    shadow-md  shadow-zinc-200   flex flex-col items-center    ">
//       <h2 className="text-2xl text-white font-bold  mt-8 ">Signin</h2>

//       {errors.root?.serverError?.message && (
//         <h1 className=" text-white bg-red-700 p-4  rounded-md shadow-md shadow-zinc-200">
//           {errors.root?.serverError?.message}
//         </h1>
//       )}

//       {isSubmitting ? (
//         <div className="flex flex-col w-full items-center text-white">
//           <h1>...register</h1>
//         </div>
//       ) : (
//         <form
//           className="flex flex-col w-full   gap-4 items-center mt-10 text-indigo-500"
//           onSubmit={handleSubmit(handleSuccess, handleErrors)}
//         >
//           <TextInput
//             errors={errors}
//             validation={{ required: "Name is required" }}
//             register={register}
//             field="name"
//           />
//           <TextInput
//             errors={errors}
//             validation={{ required: "Email is required" }}
//             register={register}
//             field="email"
//           />
//           <TextInput
//             errors={errors}
//             validation={{ required: "Password is required" }}
//             register={register}
//             field="password"
//           />
//           <input
//             className="px-4 py-2 mt-20 rounded-md shadow-sky-900 shadow-md hover:bg-cyan-400 hover:cursor-pointer bg-cyan-600 text-white"
//             type="submit"
//             value="submit"
//           ></input>
//         </form>
//       )}
//     </div>
//   );
// };

// export default SignUp;
