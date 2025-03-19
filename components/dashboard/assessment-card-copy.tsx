import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, Calendar, CheckCircle, AlertCircle } from "lucide-react"

interface AssessmentCardProps {
  title: string
  status: "upcoming" | "due-soon" | "practice"
  date: string
  time: string
  duration: string
}

export function AssessmentCard({ title, status, date, time, duration }: AssessmentCardProps) {
  const getStatusDisplay = () => {
    switch (status) {
      case "upcoming":
        return {
          icon: Clock,
          text: "Due in 2 days",
          color: "text-amber-600",
        }
      case "due-soon":
        return {
          icon: AlertCircle,
          text: "Due tomorrow",
          color: "text-red-600",
        }
      case "practice":
        return {
          icon: CheckCircle,
          text: "Practice Available",
          color: "text-green-600",
        }
    }
  }

  const statusDisplay = getStatusDisplay()
  const StatusIcon = statusDisplay.icon

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <CardDescription className={`flex items-center ${statusDisplay.color}`}>
          <StatusIcon className="h-4 w-4 mr-1" /> {statusDisplay.text}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground mb-4">
          <p className="flex items-center mb-1">
            <Calendar className="h-4 w-4 mr-2" /> {date} • {time}
          </p>
          <p className="flex items-center">
            <Clock className="h-4 w-4 mr-2" /> Duration: {duration}
          </p>
        </div>
        <Button className="w-full" variant={status === "practice" ? "outline" : "default"}>
          {status === "practice" ? "Take Practice Test" : "Start Assessment"}
        </Button>
      </CardContent>
    </Card>
  )
}

