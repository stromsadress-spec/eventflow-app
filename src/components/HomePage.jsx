import { useState } from 'react'
import NewProjectModal from './NewProjectModal'

export default function HomePage({ projects, onOpenProject, onAddProject, onSignOut }) {
  const [showNewProjectModal, setShowNewProjectModal] = useState(false)

  const activeProjects = projects.filter(p => !p.status_checks?.klar)
  const completedProjects = projects.filter(p => p.status_checks?.klar)

  const getTotalTasks = () => {
    let total = 0, completed = 0
    projects.forEach(p => {
      if (p.tasks) {
        total += (p.tasks.todo?.length || 0) + (p.tasks.inProgress?.length || 0) + (p.tasks.done?.length || 0)
        completed += p.tasks.done?.length || 0
      }
    })
    return { total, completed }
  }

  const getCriticalRisks = () => {
    let count = 0
    projects.forEach(p => {
      count += (p.risks || []).filter(r => r.severity === 'hög').length
    })
    return count
  }

  const taskStats = getTotalTasks()
  const criticalRisks = getCriticalRisks()

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">EventFlow</h1>
              <p className="text-gray-600 text-sm">Projekthantering för eventbyråer</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowNewProjectModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <span className="text-xl">+</span> Nytt projekt
              </button>
              <button
                onClick={onSignOut}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Logga ut
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold">{activeProjects.length}</p>
                <p className="text-sm text-gray-600">Aktiva projekt</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold">{taskStats.completed}/{taskStats.total}</p>
                <p className="text-sm text-gray-600">Uppgifter klara</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-lg ${criticalRisks > 0 ? 'bg-red-100' : 'bg-gray-100'}`}>
                <svg className={`w-6 h-6 ${criticalRisks > 0 ? 'text-red-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold">{criticalRisks}</p>
                <p className="text-sm text-gray-600">Kritiska risker</p>
              </div>
            </div>
          </div>
        </div>

        {/* Projects */}
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Inga projekt än</h2>
            <p className="text-gray-600 mb-6">
              Skapa ditt första projekt för att komma igång!
            </p>
            <button 
              onClick={() => setShowNewProjectModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Skapa projekt
            </button>
          </div>
        ) : (
          <div className="space-y-8">
            {activeProjects.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4">Aktiva projekt</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {activeProjects.map(project => (
                    <ProjectCard key={project.id} project={project} onClick={() => onOpenProject(project)} />
                  ))}
                </div>
              </section>
            )}

            {completedProjects.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold mb-4 text-gray-500">Avslutade</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 opacity-75">
                  {completedProjects.map(project => (
                    <ProjectCard key={project.id} project={project} onClick={() => onOpenProject(project)} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      {showNewProjectModal && (
        <NewProjectModal 
          onClose={() => setShowNewProjectModal(false)} 
          onAdd={(project) => {
            onAddProject(project)
            setShowNewProjectModal(false)
          }} 
        />
      )}
    </div>
  )
}

function ProjectCard({ project, onClick }) {
  const getStatusBadge = () => {
    if (project.status_checks?.klar) return <span className="status-badge status-klar">Klar</span>
    if (project.status_checks?.leverans) return <span className="status-badge status-leverans">Leverans</span>
    if (project.status_checks?.produktion) return <span className="status-badge status-produktion">Produktion</span>
    if (project.status_checks?.design) return <span className="status-badge status-design">Design</span>
    if (project.status_checks?.brief) return <span className="status-badge status-brief">Brief</span>
    return <span className="status-badge status-brief">Brief</span>
  }

  const totalTasks = (project.tasks?.todo?.length || 0) + (project.tasks?.inProgress?.length || 0) + (project.tasks?.done?.length || 0)
  const completedTasks = project.tasks?.done?.length || 0

  return (
    <div 
      onClick={onClick}
      className="bg-white p-6 rounded-xl border hover:shadow-lg transition cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-semibold text-lg">{project.name}</h3>
        {getStatusBadge()}
      </div>
      <p className="text-gray-600 text-sm mb-4">{project.client}</p>
      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {new Date(project.end_date).toLocaleDateString('sv-SE')}
      </div>
      {totalTasks > 0 && (
        <div>
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Framsteg</span>
            <span>{completedTasks}/{totalTasks}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${(completedTasks / totalTasks) * 100}%` }}
            />
          </div>
        </div>
      )}
      {(project.risks || []).some(r => r.severity === 'hög') && (
        <div className="mt-3 flex items-center gap-2 text-red-600 text-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Kritisk risk
        </div>
      )}
    </div>
  )
}
