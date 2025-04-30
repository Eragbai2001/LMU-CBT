import LoaderAnimation from "./loader-animation"

interface FullPageLoaderProps {
  message?: string
}

export default function FullPageLoader({ message = "Loading your content" }: FullPageLoaderProps) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
      <LoaderAnimation size="large" text={message} />
    </div>
  )
}
