import Image from "next/image"
import Link from "next/link"
import Logo from "@/public/logo.png"

interface FormHeaderProps {
  title: string
  subtitle: string
}

export function FormHeader({ title, subtitle }: FormHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-4 text-center mt-[-50]">
      <Link href="/">
        <Image src={Logo || "/placeholder.svg"} alt="TOURMATE Logo" width={180} height={180} className="mb-[-20]" />
      </Link>
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="text-balance text-sm text-muted-foreground">{subtitle}</p>
    </div>
  )
}
