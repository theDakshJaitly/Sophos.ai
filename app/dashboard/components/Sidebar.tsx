import { Button } from "@/components/ui/button"
import { Folder, Settings, User, Plus } from "lucide-react"

export function Sidebar() {
  return (
    <div className="w-64 bg-white p-4 flex flex-col h-full">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <div className="flex-grow overflow-auto">
        <ProjectList />
      </div>
      <div className="mt-auto pt-4 border-t">
        <Button variant="outline" className="w-full mb-2">
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
        <div className="flex justify-between">
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function ProjectList() {
  const projects = [
    { id: 1, name: "Project A", group: "Work" },
    { id: 2, name: "Project B", group: "Personal" },
    { id: 3, name: "Project C", group: "Work" },
    { id: 4, name: "Project D", group: "Study" },
  ]

  return (
    <div className="space-y-2">
      {projects.map((project) => (
        <div key={project.id} className="flex items-center p-2 hover:bg-gray-100 rounded">
          <Folder className="mr-2 h-4 w-4" />
          <span>{project.name}</span>
          <span className="ml-auto text-xs text-gray-500">{project.group}</span>
        </div>
      ))}
    </div>
  )
}

