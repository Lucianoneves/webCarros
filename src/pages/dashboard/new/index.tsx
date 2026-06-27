import { type ChangeEvent, useState, useContext } from "react";
import { Container } from "../../../components/container";
import { DashboardHeader } from "../../../components/panelHeader";
import { FiUpload, FiTrash } from 'react-icons/fi'
import { useForm } from 'react-hook-form'
import { Input } from '../../../components/input'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthContext } from '../../../contexts/AuthContext'
import { v4 as uuidV4 } from 'uuid'

import { db } from '../../../services/firebaseConnection'
import { addDoc, collection } from 'firebase/firestore'
import { toast } from "react-toastify";

const schema = z.object({
  name: z.string().nonempty("O campo nome é obrigatório"),
  model: z.string().nonempty("O modelo é obrigatório"),
  year: z.string().nonempty("O Ano do carro é obrigatório"),
  km: z.string().nonempty("O KM do carro é obrigatório"),
  price: z.string().nonempty("O preço é obrigatório"),
  city: z.string().nonempty("A cidade é obrigatória"),
  whatsapp: z.string().min(1, "O Telefone é obrigatório").refine((value) => /^(\d{11,12})$/.test(value), {
    message: "Numero de telefone invalido."
  }),
  description: z.string().nonempty("A descrição é obrigatória")
})

type NewCarFormData = z.infer<typeof schema>;

type CloudinaryUploadResponse = {
  secure_url?: string;
  public_id?: string;
  error?: {
    message?: string;
  };
};

interface ImageItemProps {
  id: string;
  previewUrl: string;
  file: File;
}

export function New() {
  const { user } = useContext(AuthContext);
  const { register, handleSubmit, formState: { errors }, reset } = useForm<NewCarFormData>({
    resolver: zodResolver(schema),
    mode: "onChange"
  })

  const [carImages, setCarImages] = useState<ImageItemProps[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false) // Para evitar envios duplicados

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

  async function uploadToCloudinary(file: File): Promise<{ url: string; publicId: string }> {
    if (!cloudName || !uploadPreset) {
      throw new Error('Cloudinary não configurado. Defina VITE_CLOUDINARY_CLOUD_NAME e VITE_CLOUDINARY_UPLOAD_PRESET')
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })

    const data = (await response.json()) as CloudinaryUploadResponse;

    if (!response.ok || !data.secure_url || !data.public_id) {
      throw new Error(data.error?.message ?? 'Falha ao enviar imagem para o Cloudinary')
    }

    return { url: data.secure_url, publicId: data.public_id };
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }

    const image = files[0]

    if (image.type !== 'image/jpeg' && image.type !== 'image/png') {
      toast("Envie uma imagem jpeg ou png!")
      return;
    }

    const imageItem: ImageItemProps = {
      id: uuidV4(),
      previewUrl: URL.createObjectURL(image),
      file: image,
    }

    setCarImages((images) => [...images, imageItem])
    e.target.value = ''
  }

  async function onSubmit(data: NewCarFormData) {

    if (isSubmitting) {
      return;
    }

    if (carImages.length === 0) {
      toast('Selecione pelo menos 1 imagem')
      return;
    }

    if (!user?.uid) {
      toast('Você precisa estar logado para cadastrar')
      return;
    }

    try {
      setIsSubmitting(true)

      const uploadedImages = await Promise.all(
        carImages.map((item) => uploadToCloudinary(item.file))
      )

      const carListImages = uploadedImages.map((img) => {
        return {
          url: img.url,
          publicId: img.publicId,

        }
      })

      await addDoc(collection(db, "cars"), {
        name: data.name.toUpperCase(),
        model: data.model,
        whatsapp: data.whatsapp,
        city: data.city,
        year: data.year,
        km: data.km,
        price: data.price,
        description: data.description,
        created: new Date(),
        owner: user?.name,
        uid: user?.uid,
        images: carListImages,
      })

      carImages.forEach((item) => URL.revokeObjectURL(item.previewUrl))
      reset();
      setCarImages([]);
      toast("CADASTRADO COM SUCESSO!");

    } catch (error) {
      console.log(error)
      const message = error instanceof Error ? error.message : 'Erro ao cadastrar'
      toast(message)
    } finally {
      setIsSubmitting(false)
    }

  }

  function handleDeleteImage(item: ImageItemProps) {
    URL.revokeObjectURL(item.previewUrl)
    setCarImages((images) => images.filter((img) => img.id !== item.id))
  }


  return (
    <Container>
      <DashboardHeader />

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 cursor-pointer">
        <button className="border-2 w-48 rounded-lg flex items-center justify-center  border-gray-600 h-32 md:w-48 cursor-pointer">
          <div className="absolute cursor-pointer">
            <FiUpload size={30} color="#000" />
          </div>
          <div className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              className="opacity-0 cursor-pointer"
              onChange={handleFile}
            />
          </div>
        </button>

        {carImages.map(item => (
          <div key={item.id} className="w-full h-32 flex items-center justify-center relative cursor-pointer">
            <button className="absolute" onClick={() => handleDeleteImage(item)}>
              <FiTrash size={28} color="#FFF" />
            </button>
            <img
              src={item.previewUrl}
              className="rounded-lg w-full h-32 object-cover cursor-pointer"
              alt="Foto do carro"
            />
          </div>
        ))}
      </div>

      <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
        <form
          className="w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-3">
            <p className="mb-2 font-medium">Nome do carro</p>
            <Input
              type="text"
              register={register}
              name="name"
              error={errors.name?.message}
              placeholder="Ex: Onix 1.0..."
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Modelo do carro</p>
            <Input
              type="text"
              register={register}
              name="model"
              error={errors.model?.message}
              placeholder="Ex: 1.0 Flex PLUS MANUAL..."
            />
          </div>

          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Ano</p>
              <Input
                type="text"
                register={register}
                name="year"
                error={errors.year?.message}
                placeholder="Ex: 2016/2016..."
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">KM rodados</p>
              <Input
                type="text"
                register={register}
                name="km"
                error={errors.km?.message}
                placeholder="Ex: 23.900..."
              />
            </div>

          </div>


          <div className="flex w-full mb-3 flex-row items-center gap-4">
            <div className="w-full">
              <p className="mb-2 font-medium">Telefone / Whatsapp</p>
              <Input
                type="text"
                register={register}
                name="whatsapp"
                error={errors.whatsapp?.message}
                placeholder="Ex: 011999101923..."
              />
            </div>

            <div className="w-full">
              <p className="mb-2 font-medium">Cidade</p>
              <Input
                type="text"
                register={register}
                name="city"
                error={errors.city?.message}
                placeholder="Ex: Campo Grande - MS..."
              />
            </div>

          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Preço</p>
            <Input
              type="text"
              register={register}
              name="price"
              error={errors.price?.message}
              placeholder="Ex: 69.000..."
            />
          </div>

          <div className="mb-3">
            <p className="mb-2 font-medium">Descrição</p>
            <textarea
              className="border-2 w-full rounded-md h-24 px-2"
              {...register("description")}
              name="description"
              id="description"
              placeholder="Digite a descrição completa sobre o carro..."
            />
            {errors.description && <p className="mb-1 text-red-500">{errors.description.message}</p>}
          </div>

          <button type="submit" disabled={isSubmitting} className=" cursor-pointer w-full rounded-md bg-zinc-900 text-white font-medium h-10 disabled:opacity-60 disabled:cursor-not-allowed">
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
          </button>

        </form>
      </div>
    </Container>
  )
}