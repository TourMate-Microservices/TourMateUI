'use client'
import { getTourGuideProfile, updateTourGuide } from '@/api/tour-guide.api'
import Footer from '@/components/footer'
import MegaMenu from '@/components/mega-menu'
import { MyJwtPayload } from '@/types/jwt-payload'
import { useToken } from '@/utils/get-token'
import { useMutation, useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'
import { ServiceEditContext } from './service/service-edit-context'
import { TourService } from '@/types/tour-service'
import EditPic from './edit-pic'
import ServiceEditModal from './service/edit-service-modal'
import Banner from '@/components/banner'
import { FaCamera } from 'react-icons/fa'
import SafeImage from '@/components/safe-image'
import { Button } from '@/components/ui/button'
import TourGuideEditModal from './tour-guide-edit-modal'
import Detail from './detail'
import TourServices from './service/services'
import PictureView from './picture-view'
import { toast } from 'react-toastify'
import { TourGuideProfileEdit } from '@/types/tour-guide'

export default function TourGuideProfileEditPage() {
    const targetType = {
        profilePic: 'Image',
        banner: 'BannerImage'
    }
    const baseService: TourService = {
        serviceId: 0,
        serviceName: 'name',
        price: 1,
        duration: '01:00',
        content: 'ABC',
        image: '123456.png',
        tourGuideId: 0,
        createdDate: '',
        isDeleted: false,
        title: 'Title',
        tourDesc: 'desc'
    }
    const token = useToken()
    const [id, setId] = useState(-1)
    const [modalOpen, setModalOpen] = useState({ edit: false, delete: false, create: false })
    const [signal, setSignal] = useState({ edit: false, delete: false, create: false })
    const [target, setTarget] = useState(baseService)
    const [toggleMode, setToggleMode] = useState({
        view: false,
        edit: false,
        targetType: targetType.profilePic,
        value: '',
    })
    const [toggleSection, setToggleSection] = useState({
        info: true,
        services: true,
        membership: false
    })
    const [editFormOpen, setEditFormOpen] = useState(false)

    useEffect(() => {
        if (!token) return;
        const tokenData = jwtDecode<MyJwtPayload>(token)
        console.log(tokenData.SuppliedId);

        setId(tokenData.SuppliedId)
    }, [token])
    const { data, refetch } = useQuery({
        queryKey: ['tour-guide-profile', id],
        queryFn: () => getTourGuideProfile(id),
        staleTime: 24 * 3600 * 1000,
        enabled: id !== -1
    })
    const updateTourGuideMutation = useMutation({
        mutationFn: async ({ data }: { data: TourGuideProfileEdit }) => {
            return await updateTourGuide(data)
        },
        onSuccess: () => {
            toast.success("Cập thành công");
            setEditFormOpen(false)
            refetch()
        },
        onError: (error) => {
            toast.error("Cập nhật thất bại");
            console.error(error);
        },
    });

    const update = (newData: TourGuideProfileEdit) => {
        updateTourGuideMutation.mutate({ data: newData })
        setToggleMode({ ...toggleMode, edit: false })
    }
    const tourGuide = data?.data
    return (
        <div>
            <MegaMenu />
            <PictureView isOpen={toggleMode.view} onClose={() => { setToggleMode({ ...toggleMode, view: false }) }} img={toggleMode.value} />
            <ServiceEditContext.Provider value={{ modalOpen, setModalOpen, target, setTarget, signal, setSignal }}>
                {toggleMode.edit &&
                    <EditPic
                        isOpen
                        onClose={() => { setToggleMode({ ...toggleMode, edit: false }) }}
                        type={toggleMode.targetType}
                        onConfirm={(url) => {
                            if (!tourGuide) return;
                            const newData = { ...tourGuide }
                            if (targetType.banner == toggleMode.targetType) {
                                newData.bannerImage = url
                            }
                            else {
                                newData.image = url
                            }
                            update(newData)
                        }}
                    />
                }
                {(modalOpen.edit || modalOpen.create) &&
                    <ServiceEditModal
                        isOpen
                        onClose={() => { setModalOpen(p => ({ ...p, edit: false, create: false })) }}                        
                    />
                }

                <div className='mb-10 relative'>
                    {/* Banner */}
                    <div className='relative'>

                        <div onClick={() => {
                            setToggleMode(p => ({ ...p, view: true, targetType: targetType.banner, value: tourGuide?.bannerImage ?? '' }))
                        }}>
                            <Banner imageUrl={tourGuide?.bannerImage} title='' />
                        </div>

                        <div
                            className='absolute right-[5%] bottom-[5%] rounded-full lg:rounded-lg bg-gray-200 hover:bg-gray-300 text-black shadow-lg px-2.5 py-2 pt-1 lg:pt-2'
                            onClick={() => {
                                setToggleMode(p => ({ ...p, edit: true, targetType: targetType.banner, value: tourGuide?.bannerImage ?? '' }))
                            }}>
                            <FaCamera className='inline' /> <span className='hidden lg:inline'>Chỉnh sửa ảnh bìa</span>
                        </div>
                    </div>
                    {/* Profile pic */}
                    <div className='absolute top-[300px] left-1/2 transform -translate-x-1/2 lg:top-[250px] lg:left-[250px]'>
                        <div className='p-1 rounded-full flex justify-center'>
                            <div className='p-1 rounded-full *:hover:cursor-pointer relative'>
                                <SafeImage
                                    src={tourGuide?.image}
                                    alt={'shell'}
                                    className="w-[125px] h-[125px] lg:w-[175px] lg:h-[175px] rounded-full aspect-square relative border-2 object-cover"
                                    onClick={() => {
                                        setToggleMode(p => ({
                                            ...p,
                                            view: true,
                                            targetType: targetType.profilePic,
                                            value: tourGuide?.image ?? ''
                                        }))
                                    }}
                                />
                                <div className='absolute right-0 bottom-0 lg:right-[20px] lg:bottom-[5px] border-[1] p-3 rounded-full bg-gray-200 hover:bg-gray-300' onClick={() => {
                                    setToggleMode(p => ({ ...p, edit: true, targetType: targetType.profilePic }))
                                }}>
                                    <FaCamera fill='#000000' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mx-[5%] lg:mx-[20%] mt-16 '>
                        <div className='flex justify-between mb-5'>
                            <h3 className='text-3xl font-bold'>Thông tin cá nhân</h3>
                            <Button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer'
                                onClick={() => setToggleSection(p => ({ ...p, info: !p.info }))}
                            >
                                {toggleSection.info ? 'Ẩn' : 'Hiện'}
                            </Button>
                        </div>
                        <div className={`${toggleSection.info ? 'block' : 'hidden'} mb-1`}>
                            {tourGuide && <TourGuideEditModal tourGuide={tourGuide} updateFn={(v) => {
                                if (tourGuide) {
                                    update(v)
                                }
                            }} isOpen={editFormOpen} onClose={() => setEditFormOpen(false)} />}
                            {tourGuide && <Detail s={tourGuide} />}
                            <Button
                                onClick={() => setEditFormOpen(true)}
                                className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer'>
                                Cập nhật thông tin
                            </Button>
                        </div>
                    </div>
                    <div className='my-10 mx-[5%] border-[1] border-b-gray-200' />
                    <div className=''>
                        <div className='mx-[5%] lg:mx-[20%] flex justify-between '>
                            <h3 className='text-3xl font-bold'>Dịch vụ du lịch</h3>
                            <Button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer'
                                onClick={() => setToggleSection(p => ({ ...p, services: !p.services }))}
                            >
                                {toggleSection.services ? 'Ẩn' : 'Hiện'}
                            </Button>

                        </div>
                        <div className={`${toggleSection.services ? 'block' : 'hidden'}`}>
                            <Button
                                onClick={() => {
                                    setTarget(baseService)
                                    setModalOpen({ edit: false, delete: false, create: true })
                                }}
                                className='mx-[5%] lg:mx-[20%] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer my-6'>
                                Tạo dịch vụ
                            </Button>
                            <div className='mx-[5%] mt-4'>
                                <TourServices tourGuideId={id} areaId={tourGuide?.areaId}/>
                            </div>
                        </div>
                    </div>
                </div>
            </ServiceEditContext.Provider >
            <Footer />
        </div>
    )
}
