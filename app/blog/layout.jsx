import Galaxy from "@/components/Galaxy";
import FloatingStars from "@/components/FloatingStars";
import CursorGlow from "@/components/CursorGlow";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// Blog pages reuse the same background chrome, nav, and footer as the homepage.
export default function BlogLayout({ children }) {
  return (
    <>
      <Galaxy />
      <FloatingStars />
      <CursorGlow />
      <Nav />
      <main>{children}</main>
      <Footer />
    </>
  );
}
