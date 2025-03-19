import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AssessmentCard } from "./assessment-card"

export function AssessmentTabs() {
  const upcomingAssessments = [
    {
      title: "Database Systems",
      status: "upcoming" as const,
      date: "March 21, 2025",
      time: "10:00 AM",
      duration: "90 minutes",
    },
    {
      title: "Computer Networks",
      status: "due-soon" as const,
      date: "March 20, 2025",
      time: "2:00 PM",
      duration: "60 minutes",
    },
    {
      title: "Software Engineering",
      status: "practice" as const,
      date: "March 25, 2025",
      time: "9:00 AM",
      duration: "120 minutes",
    },
  ]

  return (
    <Tabs defaultValue="upcoming">
      <div className="flex items-center justify-between mb-6">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="results">Recent Results</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="upcoming" className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {upcomingAssessments.map((assessment, index) => (
            <AssessmentCard
              key={index}
              title={assessment.title}
              status={assessment.status}
              date={assessment.date}
              time={assessment.time}
              duration={assessment.duration}
            />
          ))}
        </div>
      </TabsContent>

      <TabsContent value="courses" className="space-y-4">
        {/* Course content would go here */}
        <p className="text-muted-foreground">Your enrolled courses will appear here.</p>
      </TabsContent>

      <TabsContent value="results" className="space-y-4">
        {/* Results content would go here */}
        <p className="text-muted-foreground">Your recent assessment results will appear here.</p>
      </TabsContent>
    </Tabs>
  )
}

