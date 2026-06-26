import { useState, useEffect, useContext } from 'react'
import { Container } from '../../components/container'
import { DashboardHeader } from '../../components/panelHeader'

import { FiTrash2 } from 'react-icons/fi'

import { collection, getDocs, where, query, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'
import { AuthContext } from '../../contexts/AuthContext'


interface CarsProps {
  uid: string
  id: string
  name: string
  model: string
  price: string
  year: string
  km: string
  city: string
  description?: string
  images?: CarImageProps[]
}

interface CarImageProps {
  url: string
  publicId: string
}



export function Dashboard() {
  const [cars, setCars] = useState<CarsProps[]>([])
  const { user } = useContext(AuthContext)

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

  useEffect(() => {
    function loadCars() {
      if (!user?.uid) return

      const carsRef = collection(db, 'cars')
      const queryRef = query(carsRef, where('uid', '==', user.uid))

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
              description: data.description,
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
  }, [user])


 async function deleteCar(carId: string) {

  const confirmDelete = window.confirm(
    "Tem certeza que deseja excluir este carro?"
  )

  if(!confirmDelete){
    return
  }


  try {
    const carDoc = doc(db, "cars", carId)
    await deleteDoc(carDoc)
    setCars((prevCars) =>
      prevCars.filter((car) => car.id !== carId)
    )
    console.log("Carro deletado com sucesso")
  } catch(error){
    console.log("Erro ao deletar carro:", error)
  }
}


  return (
    <Container>
      <DashboardHeader />

      <main className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2'>
        {cars.length === 0 ? (
          <p className='text-center text-zinc-600 col-span-full'>
            Nenhum carro cadastrado.
          </p>
        ) : (
          cars.map((car) => (
            <section key={car.id} className='w-full bg-white rounded-lg relative'>
              <button
                onClick={() => deleteCar(car.id)}
                className='absolute bg-white w-14 h-14 rounded-full flex items-center justify-center right-2 top-2 drop-shadow'
              >
                <FiTrash2 size={26} color="#000" />
              </button>

              <img
                className='w-full rounded-lg mb-2 max-h-72 object-cover'
                src={car.images?.[0]?.url || "/car-placeholder.png"}
                alt="Foto do carro"
              />


              <p className='font-bold mt-1 px-2 mb-2'>{car.name}</p>


              <div className='flex flex-col px-2 pb-2'>
                <span className='text-zinc-700'>
                  Ano {car.year} | {car.km} KM
                </span>

                <strong className='text-black font-bold mt-4'>
                  {formatPrice(car.price)}
                </strong>

                <div className='w-full h-px bg-slate-200 my-2' />

                <span className='text-zinc-700'>{car.city}</span>
              </div>
            </section>

          ))
        )}
      </main>
    </Container>
  )
}