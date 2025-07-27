'use client'
import { getTourGuide } from '@/api/tour-guide.api'
import Footer from '@/components/footer'
import MegaMenu from '@/components/mega-menu'
import { MyJwtPayload } from '@/types/jwt-payload'
import { useToken } from '@/utils/get-token'
import { useQuery } from '@tanstack/react-query'
import { jwtDecode } from 'jwt-decode'
import React, { useEffect, useState } from 'react'

export default function TourGuideProfileEditPage() {
    const token = useToken()
    const [id, setId] = useState(-1)
    useEffect(() => {
        if(!token) return;
        const tokenData = jwtDecode<MyJwtPayload>(token)
        setId(tokenData.AccountId)
    }, [token])
    const { data, refetch } = useQuery({
        queryKey: ['tour-guide', id],
        queryFn: () => getTourGuide(id),
        staleTime: 24 * 3600 * 1000,
        enabled: id !== -1
    })
    return (
        <div>
            <MegaMenu />
            <Footer />
        </div>
    )
}
