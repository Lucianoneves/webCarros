import { Container } from '../../components/container'



 export function Home() {
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

       <main className='grid grid-cols-1  ga-6  md:grid-cols-2  lg:grid-cols-3'>
        <section className=' w-full bg-white rounded-lg'>
          <img  
          className=' w-full rounded-lg mb-2 max-h-72 hover:scale-105  transition-all'
          src= "https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260624/jeep-renegade-1.3-t270-turbo-flex-longitude-at6-wmimagem03063944287.jpg?s=fill&w=1920&h=1440&q=75"
          alt="carro"
          />
          <p className=' font-bold mt-1  mb-2 px-2'> Jeep Renegade </p>

          <div className=' flex flex-col px-2' >
            <span className=' text-zinc-800 mb-6'> Ano: 2024/2025 | 85.000 km</span>
            <strong className=' text-black font-medium text-xl'> R$ 120.000,00</strong>
          </div>

          <div className=' w-full h-px bg-slate-200 my-2'></div>

          <div className=' px-2 pb-2'>
            <span className=' text-black'>
               Curitiba-Pr</span>
          </div>
        </section>


         <section className=' w-full bg-white rounded-lg'>
          <img  
          className=' w-full rounded-lg mb-2 max-h-72 hover:scale-105  transition-all'
          src= "https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260612/chevrolet-celta-1-0-mpfi-lt-8v-flex-4p-manual-wmimagem13375142012.webp?s=fill&w=552&h=414&q=60"
          alt="carro"
          />
          <p className=' font-bold mt-1  mb-2 px-2'> Celta </p>

          <div className=' flex flex-col px-2' >
            <span className=' text-zinc-800 mb-6'> Ano: 2012/2013 | 128.000 km</span>
            <strong className=' text-black font-medium text-xl'> R$ 32.900,00</strong>
          </div>
          
          <div className=' w-full h-px bg-slate-200 my-2'></div>

          <div className=' px-2 pb-2'>
            <span className=' text-black'>
               Ponta-Grossa-Pr</span>
          </div>
        </section>


         <section className=' w-full bg-white rounded-lg'>
          <img  
          className=' w-full rounded-lg mb-2 max-h-72 hover:scale-105  transition-all'
          src= "https://image.webmotors.com.br/_fotos/anunciousados/gigante/2026/202606/20260623/volkswagen-polo-1.0-mpi-track-manual-wmimagem18172998347.jpg?s=fill&w=1920&h=1440&q=75"
          alt="carro"
          />
          <p className=' font-bold mt-1  mb-2 px-2'> Polo </p>

          <div className=' flex flex-col px-2' >
            <span className=' text-zinc-800 mb-6'> Ano: 2024/2025 | 111.000 km</span>
            <strong className=' text-black font-medium text-xl'> R$ 105.800,00</strong>
          </div>
          
          <div className=' w-full h-px bg-slate-200 my-2'></div>

          <div className=' px-2 pb-2'>
            <span className=' text-black'>
               São-Paulo-SP</span>
          </div>
        </section>

       </main>
    </Container>
  )
}