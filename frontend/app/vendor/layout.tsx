import VendorLayout from "@/components/layouts/VendorLayout"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return <VendorLayout>{children}</VendorLayout>
}

