import { Button } from "@/components/ui/button"

export function DashboardHeader() {
  return (
    <header className="bg-white border-b px-6 py-4 sticky top-0 z-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm">
            <BellIcon className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button size="sm">Start New Assessment</Button>
        </div>
      </div>
    </header>
  )
}

function BellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

