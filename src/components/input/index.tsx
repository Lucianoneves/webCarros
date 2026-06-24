import type { RegisterOptions, UseFormRegister } from "react-hook-form";


interface InputProps {
  type: string;
  placeholder: string;
  name: string;
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
}

export function Input({name, type, placeholder, rules,register,error}: InputProps) {
  return (
      <div> 
      <input  
      className=" w-full border-2 rounded-mb h-11 px-2"
       placeholder={placeholder}
       type={type}   
       {...register(name, rules)}
       id={name}       
   />

   {error && <p className="my-2 text-sm text-red-400"> {error}</p>}
   </div>
  )
}