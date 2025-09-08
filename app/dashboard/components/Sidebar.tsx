import { Button } from "@/components/ui/button"
import { Folder, Settings, User, Plus, FolderTree, CornerDownRight } from "lucide-react"
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  weight: ['700']
})

export function Sidebar() {
  return (
    <div className="w-64 bg-white p-4 flex flex-col h-full">
      <h2 className={`text-3xl font-bold mb-4 ${spaceGrotesk.className}`}>Sophos.ai</h2>
      <div className="flex items-center gap-2 mb-6 text-gray-700">
        <FolderTree className="h-6 w-6" />
        <span className="text-lg font-semibold">Projects</span>
      </div>
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
    { id: 1, name: "ML", group: "Work" },
    { id: 2, name: "Linear Reg", group: "Personal" },
    { id: 3, name: "Linear Algebra", group: "Work" },
    { id: 4, name: "Statistics", group: "Study" },
  ]

  // Group projects by their group property
  const groupedProjects = projects.reduce((acc, project) => {
    if (!acc[project.group]) {
      acc[project.group] = [];
    }
    acc[project.group].push(project);
    return acc;
  }, {} as Record<string, typeof projects>);

  return (
    <div className="space-y-4">
      {Object.entries(groupedProjects).map(([group, projects]) => (
        <div key={group}>
          <div className="flex items-center gap-2 mb-2 text-gray-600">
            <Folder className="h-4 w-4" />
            <span className="text-sm font-medium">{group}</span>
          </div>
          <div className="space-y-1 pl-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center p-2 hover:bg-gray-100 rounded">
                <CornerDownRight className="mr-2 h-4 w-4" />
                <span>{project.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

