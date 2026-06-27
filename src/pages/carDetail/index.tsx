/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react'
import { Container } from '../../components/container'
import { FaWhatsapp } from 'react-icons/fa'
import { useParams, useNavigate } from 'react-router-dom'

import { getDoc, doc } from 'firebase/firestore'
import { db } from '../../services/firebaseConnection'

import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'




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
  images: ImagesCarProps[]

}

interface ImagesCarProps {
  url: string
  publicId: string
}


export function CarDetail() {
  const { id } = useParams()
  console.log("ID DO CARRO:", id);
  const [car, setCar] = useState<CarsProps>()
  const [swiperPerView, setSwiperPerView] = useState<number>()
  const navigate = useNavigate()



  useEffect(() => {
    async function loadCar() {
      if (!id) { return }

      const docRef = doc(db, "cars", id)
      getDoc(docRef)
        .then((snapshot) => {



          if (!snapshot.data()) {
            navigate("/")

          }
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

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 720) {
        setSwiperPerView(1)
      } else {
        setSwiperPerView(2)
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })




  return (
    <Container>

      {car && (
        <Swiper
          modules={[Pagination]}
          slidesPerView={swiperPerView}
          pagination={{ clickable: true }}
          navigation
        >

          {car?.images.map(image => (

            <SwiperSlide key={image.publicId}>

              <img
                src={image.url}
                className="w-full h-96 object-cover"
              />

            </SwiperSlide>

          ))}

        </Swiper>
      )}





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
            href={`https://api.whatsapp.com/send?phone=${car?.whatsapp}&text=${encodeURIComponent(`Olá, quero saber mais sobre esse carro ${car?.name}`)}`}
            target='_blank'
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