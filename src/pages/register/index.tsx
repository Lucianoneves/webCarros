
import { useContext } from 'react'
import logoImg from '../../assets/logo.svg'
import { Link, useNavigate } from 'react-router-dom' 
import { Container } from '../../components/container'
import { Input } from '../../components/input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { auth } from '../../services/firebaseConnection'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth' 
import { AuthContext } from '../../contexts/AuthContext'



 const schema = z.object({
  name: z.string().min(3, 'Digite seu nome').nonempty("O campo nome é obrigatório"),
  email: z.string().email().min(1, 'Digite seu email').nonempty("O campo email é obrigatório"),
  password: z.string().min(6, 'A senha deve ter no minimo 6 caracteres').nonempty("O campo senha é obrigatório"),
 })

 type FormData = z.infer<typeof schema>

export function Register() { 
  const { handleInfoUser } = useContext(AuthContext)

  const navigate = useNavigate()
  const {register,handleSubmit, formState: {errors} } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })


  async function onSubmit(data: FormData) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

      await updateProfile(userCredential.user, {
        displayName: data.name,
      })

      handleInfoUser({
        name: data.name,
        email: data.email,
        uid: userCredential.user.uid,
      })

      console.log('Cadastro realizado com sucesso!')
      navigate('/dashboard', { replace: true })
    } catch (error) {
      console.log('Erro ao realizar cadastro')
      console.log(error)
    }
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
        type="text"
        placeholder="Digite seu nome"
        name="name"
        error={errors.name?.message}
        register ={register}
        />    
        </div>


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
          Cadastrar 
          </button> 


      </form>

      <Link to='/login' className=' text-center'>
        Já tem uma conta? Faça login aqui
      </Link>
     
     

     </div>
    </Container>
  )
}