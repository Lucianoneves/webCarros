/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { Container } from '../../components/container'
import { FaWhatsapp } from 'react-icons/fa'
import { useParams } from 'react-router-dom'

import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'




interface CarsProps {
  id: string;
  name: string;
  model: string;
  city: string;
  year: string;
  km: string;
  description: string
  created: string;
  price: number | string;
  owner: string;
  uid: string;
  whatsapp: string;
  images: string[]

}

interface ImagesCarProps {
  url: string
  publicId: string
}


export function CarDetail() {
  const { id } = useParams()
  console.log("ID DO CARRO:", id);
  const [car, setCar] = useState<CarsProps>()


  useEffect(() => {
    async function loadCar() {
      if (!id) { return }

      const docRef = doc(db, "cars", id)
      getDoc(docRef)
        .then((snapshot) => {
          setCar({
            id: snapshot.id,
            name: snapshot.data()?.name || '',
            model: snapshot.data()?.model || '',
            city: snapshot.data()?.city || '',
            year: snapshot.data()?.year || '',
            km: snapshot.data()?.km || '',
            description: snapshot.data()?.description || '',
            created: snapshot.data()?.created || '',
            price: snapshot.data()?.price || '',
            owner: snapshot.data()?.owner || '',
            uid: snapshot.data()?.uid || '',
            whatsapp: snapshot.data()?.whatsapp || '',
            images: snapshot.data()?.images || [],

          })
        })

    }

    loadCar()
  }, [id])




  return (
    <Container>
      <h1> Detalhes doCarro</h1>

      {car && (
        <main className=' w-full bg-zinc-200 rounded-lg p-6 my-4'>
          <div className=' flex flex-col  sm:flex-row mb-4 items-center justify-between'>
            <h1 className=' font-bol text-3xl text-black'>{car.name}</h1>
            <h1 className=' font-bol text-3xl text-black'>R$:{car.price}</h1>
          </div>
          <p>Versão: {car.model}</p>



          <div className=' flex w-full gap-6  my-4'>
            <div className=' flex flex-col gap-4'>
              <div>
                <p>Cidade</p>
                <strong> {car?.city}</strong>
              </div>
              <div>
                <p>Ano</p>
                <strong> {car?.year}</strong>
              </div>
            </div>

            <div className=' flex flex-col gap-4'>
              <div>
                <p>KM</p>
                <strong> {car?.km}</strong>
              </div>
            </div>
          </div>

          <strong>Descrição</strong>
          <p className=' mb-4'>{car?.description}</p>

          <strong> Telefone Whatsapp
            <p>{car?.whatsapp}</p>

            <a
              className=' cursor-pointer bg-green-600 w-full text-white flex  flex-items justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium'
            >
              Conversar com Vendedor
              <FaWhatsapp size={26} color='#fff' />
            </a>
          </strong>






        </main>
      )}

    </Container>
  )
}