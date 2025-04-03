import { FloatingDock } from "@/app/Icons/ui/floating-dock";
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
} from "@tabler/icons-react";

export default function FloatingDockDemo() {
  const links = [
    {
      title: "LinkedIn",
      icon: <IconBrandLinkedin className="h-full w-full text-white" />,
      href: "#",
    },
    {
      title: "Instagram",
      icon: <IconBrandInstagram className="h-full w-full text-white" />,
      href: "#",
    },
    {
      title: "YouTube",
      icon: <IconBrandYoutube className="h-full w-full text-white" />,
      href: "#",
    },
    {
      title: "TikTok",
      icon: <IconBrandTiktok className="h-full w-full text-white" />,
      href: "#",
    },
    {
      title: "Twitter",
      icon: <IconBrandX className="h-full w-full text-white" />,
      href: "#",
    },
    {
      title: "GitHub",
      icon: <IconBrandGithub className="h-full w-full text-white" />,
      href: "#",
    },
  ];
  return (
    <div className="flex items-center justify-center">
      <FloatingDock
        desktopClassName="bg-transparent dark:bg-transparent"
        mobileClassName="translate-y-0"
        items={links}
      />
    </div>
  );
}
