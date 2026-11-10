
import React from "react";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Twitter, Share2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

// Custom TikTok icon component since lucide doesn't provide one
const TikTokIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

const SocialMediaLinks: React.FC = () => {
  const shareProfile = (platform: string) => {
    const url = window.location.href;
    const text = "Entdecke Berlin mit mir! Hier ist mein Berlin Erleben Profil:";
    
    let shareUrl = "";
    
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      case "tiktok":
        // TikTok doesn't have a direct sharing API
        navigator.clipboard.writeText(url).then(() => {
          toast.success("Link in die Zwischenablage kopiert. Teile ihn auf TikTok!");
        });
        return;
      case "instagram":
        // Instagram doesn't have a direct sharing API like others
        // Copy to clipboard and notify user
        navigator.clipboard.writeText(url).then(() => {
          toast.success("Link in die Zwischenablage kopiert. Teile ihn auf Instagram!");
        });
        return;
      default:
        // Default share using Web Share API if available
        if (navigator.share) {
          navigator.share({
            title: 'Berlin Erleben Profil',
            text: text,
            url: url,
          }).catch(err => {
            console.error("Error sharing:", err);
            navigator.clipboard.writeText(url).then(() => {
              toast.success("Link in die Zwischenablage kopiert");
            });
          });
          return;
        }
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(url).then(() => {
          toast.success("Link in die Zwischenablage kopiert");
        });
        return;
    }
    
    // Open share dialog in new window
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <h2 className="text-xl font-semibold text-slate-900">Social Media & Teilen</h2>
        <p className="text-sm text-slate-500">
          Teile dein Profil oder folge uns auf Social Media
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => shareProfile("instagram")}
          >
            <Instagram className="h-6 w-6 text-pink-600" />
            <span className="text-sm">Instagram</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => shareProfile("twitter")}
          >
            <Twitter className="h-6 w-6 text-blue-400" />
            <span className="text-sm">X</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => shareProfile("tiktok")}
          >
            <TikTokIcon className="h-6 w-6 text-slate-800" />
            <span className="text-sm">TikTok</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex flex-col items-center gap-2 h-auto py-4"
            onClick={() => shareProfile("other")}
          >
            <Share2 className="h-6 w-6 text-slate-700" />
            <span className="text-sm">Teilen</span>
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-start border-t border-slate-100 pt-4">
        <h3 className="text-sm font-medium mb-3">Folge Berlin Erleben</h3>
        <div className="flex gap-3">
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-pink-600 hover:text-pink-800 flex items-center gap-1 text-sm"
          >
            <Instagram className="h-4 w-4" />
            <span>Instagram</span>
          </a>
          <a 
            href="https://tiktok.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-800 hover:text-slate-950 flex items-center gap-1 text-sm"
          >
            <TikTokIcon className="h-4 w-4" />
            <span>TikTok</span>
          </a>
          <a 
            href="https://twitter.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-600 flex items-center gap-1 text-sm"
          >
            <Twitter className="h-4 w-4" />
            <span>X</span>
          </a>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SocialMediaLinks;
