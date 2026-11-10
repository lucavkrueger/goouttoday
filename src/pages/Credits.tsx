import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { IMAGE_CREDITS } from "@/data/imageCredits";

const Credits = () => (
  <div className="min-h-screen flex flex-col bg-background">
    <Navbar />
    <main className="flex-1 container max-w-3xl mx-auto px-4 pt-24 pb-12">
      <h1 className="text-3xl font-display font-bold text-slate-900 mb-4">Bildnachweise</h1>
      <p className="text-slate-600 mb-3">
        Viele Fotos auf GoOutToday stammen von{" "}
        <a className="text-blue-600 underline" href="https://commons.wikimedia.org" target="_blank" rel="noopener noreferrer">Wikimedia Commons</a>{" "}
        und stehen unter freien Lizenzen (z.&nbsp;B. CC BY-SA). Unten stehen Urheber und Lizenz jedes Fotos, mit Link zur Dateiseite. Die Fotos wurden für die Website verkleinert.
      </p>
      <p className="text-slate-600 mb-8">
        Weitere Fotos stammen von{" "}
        <a className="text-blue-600 underline" href="https://unsplash.com/license" target="_blank" rel="noopener noreferrer">Unsplash</a>{" "}
        und stehen unter der Unsplash-Lizenz.
      </p>
      <ul className="space-y-2 text-sm">
        {IMAGE_CREDITS.map((c) => (
          <li key={c.page} className="break-words">
            <a className="text-blue-600 hover:underline" href={c.page} target="_blank" rel="noopener noreferrer">
              {c.name}
            </a>
            <span className="text-slate-500">
              {" – "}{c.artist || "Unbekannt"}{c.license ? `, ${c.license}` : ""}, Wikimedia Commons
            </span>
          </li>
        ))}
      </ul>
    </main>
    <Footer />
  </div>
);

export default Credits;
