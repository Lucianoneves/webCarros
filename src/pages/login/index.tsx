import { useEffect } from 'react'
import logoImg from '../../assets/logo.svg'
import { Link, useNavigate } from 'react-router-dom'
import {Container} from '../../components/container'
import {Input} from '../../components/input'
import {useForm}from 'react-hook-form'
import {z} from 'zod'
import {zodResolver} from '@hookform/resolvers/zod'
import { signInWithEmailAndPassword,signOut } from 'firebase/auth'
import {auth} from '../../services/firebaseConnection'	
import { toast } from 'react-toastify'



 const schema = z.object({
  email: z.string().email().min(1, 'Digite seu email').nonempty("O campo email é obrigatório"),
  password: z.string().min(3, 'Digite sua senha').nonempty("O campo senha é obrigatório"),
 })

 type FormData = z.infer<typeof schema>

export function Login() {
  const navigate = useNavigate()
  const {register,handleSubmit, formState: {errors} } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  useEffect(() => {
   async function handleLogout(){
    await signOut(auth)
    navigate("/login", { replace: true})
   }

   handleLogout();
  }, [navigate])


  function onSubmit(data: FormData) {
   signInWithEmailAndPassword(auth, data.email, data.password)
   .then((user) => {
    toast.success("Login realizado com sucesso!")
    console.log(user.user)
  
    navigate("/dashboard", { replace: true})
   })
   .catch((error) => {    
    toast.error("Erro ao realizar login")
    console.log(error)
   })
  }


  return (
    <Container>
     <div className='w-full  min-h-screen flex justify-center items-center flex-col  gap-4'>
      <Link to='/' className=' mb-6 max-w-sm w-full'>
        <img
         src={logoImg}
         alt="logo"
          className='w-full' 
          />
      </Link>

      <form
      className='bg-white max-w-xl rounded-lg w-full p-4'
      onSubmit={handleSubmit(onSubmit)}
           >


       <div className=' mb-3'>
        <Input 
        type="email"
        placeholder="Digite seu email"
        name="email"
        error={errors.email?.message}
        register ={register}
        />    
        </div>

       <div className=' mb-3'>
        <Input 
        type="password"
        placeholder="Digite sua senha"
        name="password"
        error={errors.password?.message}
        register ={register}
        />    
        </div>

        <button className=' bg-zinc-900 w-full rounded-mb text-white font-medium text-lg cursor-pointer'>
          Acessar 
          </button>  
      </form>
        <Link to='/register' className=' text-center'>
         Ainda não posssui uma conta? Cadastre-se aqui
      </Link>
     
     
     

     </div>
    </Container>
  )
}