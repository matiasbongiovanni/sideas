import Navbar from "@/features/marketing/components/Navbar"
import Footer from "@/features/marketing/components/Footer"
import ChatbotWrapper from "@/features/marketing/components/ChatbotWrapper"


export default function MarketingLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
            <ChatbotWrapper />
        </>
    )
}