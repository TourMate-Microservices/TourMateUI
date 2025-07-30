"use client"

import { useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { fetchPaymentResultWithServiceName } from "@/api/payment.api"
import { PaymentResultHeader } from "./payment-result-header"
import { PaymentDetails } from "./payment-details"
import { PaymentError } from "./payment-error"
import { ActionButtons } from "./action-buttons"
import { BackgroundDecoration } from "./background-decoration"
import { updatePaymentStatus } from "@/api/invoice.api"

// Thêm state cho modal trong PaymentResultContent component
export function PaymentResultContent() {
  const searchParams = useSearchParams()

  const isSuccess = searchParams.get("success") === "true"
  const paymentId = searchParams.get("paymentId")
  const invoiceId = searchParams.get("invoiceId")

  // Nếu thành công, fetch payment detail
  const { data: paymentData } = useQuery({
    queryKey: ["payment", paymentId],
    queryFn: () => (paymentId && typeof paymentId === "string" ? fetchPaymentResultWithServiceName(Number(paymentId)) : null),
    enabled: isSuccess && !!paymentId && typeof paymentId === "string",
  })

  useEffect(() => {
    if (isSuccess && invoiceId && typeof invoiceId === "string") {
      updatePaymentStatus(invoiceId, "paid").then(() => {
      })
    }
  }, [isSuccess, invoiceId])

  return (
    <>
      <hr className="border-gray-200 sm:mx-auto" />
      <div
        className={`min-h-screen bg-gradient-to-br ${
          isSuccess ? "from-green-100 via-green to-green-500" : "from-red-200 via-red to-red-700"
        } relative overflow-hidden`}
      >
        <BackgroundDecoration />

        <div className="relative flex items-center justify-center min-h-screen p-4 py-16">
          <div className="w-full max-w-lg space-y-6">
            <PaymentResultHeader isSuccess={isSuccess} />

            {/* Payment Details Card */}
            <Card className="backdrop-blur-sm bg-white/80 border-0 shadow-2xl">
              <CardContent className="p-8">
                {isSuccess ? <PaymentDetails paymentId={paymentId} paymentData={paymentData} /> : <PaymentError />}
              </CardContent>

              <CardFooter className="p-8 pt-0">
                <ActionButtons
                  isSuccess={isSuccess}
                  id={invoiceId}
                />
              </CardFooter>
            </Card>

            <div className="text-center mt-8 text-sm text-white">
              <p>
                Cần hỗ trợ? Liên hệ với chúng tôi qua email:{" "}
                <span className="font-semibold">tourmate2025@gmail.com</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
