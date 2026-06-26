
import { useState, useEffect } from 'react'
import { Container } from '../../components/container'
import {Link}from 'react-router-dom'

import {
  collection,
  query,
  getDocs,
  orderBy,
} from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

interface CarsProps{
  uid: string
  id: string
  name: string
  model: string
  price: string
  year: string
  km: string
  city: string
  state?: string
  images: CarImageProps[]
}
interface CarImageProps{
  url: string
  publicId: string
}

export function Home() {
  const [cars, setCars] = useState<CarsProps[]>([])
 const [loadImages, setLoadImages] = useState<string[]>([])



  function formatPrice(value: string) {
    const digits = value.replace(/[^0-9]/g, '')
    if (!digits) {
      return value
    }

    const numberValue = Number(digits)
    if (!Number.isFinite(numberValue)) {
      return value
    }

    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numberValue)
  }

  useEffect(() => { // carregar os carros do firebase
    function loadCars(){
      const carsRef = collection(db, 'cars')
      const queryRef = query(carsRef, orderBy('created', 'desc'))

      getDocs(queryRef)
        .then((snapshot) => {
          const listCars = [] as CarsProps[]

          snapshot.forEach((doc) => {
            const data = doc.data() as Omit<CarsProps, 'id'>

            listCars.push({
              id: doc.id,
              uid: data.uid,
              name: data.name,
              model: data.model,
              price: data.price,
              year: data.year,
              km: data.km,
              city: data.city,            
              images: data.images ?? [],
            })
          })

   

          setCars(listCars)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    loadCars()
  }, [])

  function handleOnLoad(id:string){ // caregar as imagens 
    setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
  }
  


  return (
   <Container>
     <section className=' bg-white p-4 rounded-lg w-full max-w-2xl mx-auto flex justify-center  items-center gap-2'>
      <input 
      className='w-full border-2 rounded-lg h-9 px-3 outline-none'
      placeholder='Digite o nome do carro..'
      />

      <button 
      className='bg-red-500 h-9 px-8 rounded-lg text-white font-medium text-lg'
      >
        Buscar
      </button>
     </section>


     <h1 className=' font-bold text-center mt-6 text-2xl mb-4'>
       Carros novos e usados em todos o Brasil
       </h1>

       <main className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {cars.length === 0 ? (
          <p className='text-center text-zinc-600 col-span-full'>
            Nenhum carro cadastrado.
          </p>
        ) : (



          cars.map((car) => (     
           <Link key={car.id} to={`/car/${car.id}`}>
            <section className='w-full bg-white rounded-lg'>
              <div className=' w-full h-72 rounded-lg bg-slate-200'
              style={{display:loadImages.includes(car.id) ? 'none' : 'block'}} //  se não existe a imagem  mostra o block
              > </div>
              <img
                className='w-full rounded-lg mb-2 max-h-72 hover:scale-105 transition-all object-cover'
                src={car.images?.[0]?.url ?? 'https://via.placeholder.com/800x600?text=Sem+imagem'}
                alt={car.name}
                onLoad={() => handleOnLoad(car.id)}
                style={{ display: loadImages.includes(car.id) ? "block": "none" }} //  se a imagem carregou  mostra o img
              />
              <p className='font-bold mt-1 mb-2 px-2'>{car.name}</p>

              <div className='flex flex-col px-2'>
                <span className='text-zinc-800 mb-6'>
                  Ano: {car.year} | {car.km} km
                </span>
                <strong className='text-black font-medium text-xl'>
                  {formatPrice(car.price)}
                </strong>
              </div>

              <div className='w-full h-px bg-slate-200 my-2'></div>

              <div className='px-2 pb-2'>
                <span className='text-black'>
                  {car.city}
                  {car.state ? `-${car.state}` : ''}
                </span>
              </div>
            </section>
            </Link>
          ))
        )}
       </main>
    </Container>
  )
}