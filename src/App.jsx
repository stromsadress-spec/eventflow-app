import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth'
import HomePage from './components/HomePage'
import ProjectView from './components/ProjectView'

// Image Compression Helper
export const compressImage = (file, maxWidth = 1200, quality = 0.85) => {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      img.src = e.target.result
    }
    reader.readAsDataURL(file)
  })
}

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState([])
  const [currentView, setCurrentView] = useState('home')
  const [currentProject, setCurrentProject] = useState(null)

  useEffect(() => {
    // Check active sessions
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (session) {
      fetchProjects()
    }
  }, [session])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error('Error fetching projects:', error)
      alert('Kunde inte hämta projekt: ' + error.message)
    }
  }

  const addProject = async (project) => {
    try {
      const newProject = {
        ...project,
        id: Date.now().toString(),
        user_id: session.user.id,
        venues: [],
        tasks: { todo: [], inProgress: [], done: [] },
        risks: [],
        work_orders: [],
        notes: [],
        brand: {
          logos: [],
          colors: [],
          referenceImages: []
        }
      }

      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select()

      if (error) throw error
      
      setProjects([data[0], ...projects])
      return data[0]
    } catch (error) {
      console.error('Error adding project:', error)
      alert('Kunde inte skapa projekt: ' + error.message)
    }
  }

  const updateProject = async (updatedProject) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({
          ...updatedProject,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedProject.id)
        .eq('user_id', session.user.id)

      if (error) throw error

      setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p))
      setCurrentProject(updatedProject)
    } catch (error) {
      console.error('Error updating project:', error)
      alert('Kunde inte uppdatera projekt: ' + error.message)
    }
  }

  const deleteProject = async (projectId) => {
    if (!confirm('Är du säker på att du vill ta bort detta projekt?')) return

    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', session.user.id)

      if (error) throw error

      setProjects(projects.filter(p => p.id !== projectId))
      setCurrentView('home')
      setCurrentProject(null)
    } catch (error) {
      console.error('Error deleting project:', error)
      alert('Kunde inte ta bort projekt: ' + error.message)
    }
  }

  const openProject = (project) => {
    setCurrentProject(project)
    setCurrentView('project')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Laddar...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return <Auth />
  }

  if (currentView === 'home') {
    return (
      <HomePage
        projects={projects}
        onOpenProject={openProject}
        onAddProject={addProject}
        onSignOut={() => supabase.auth.signOut()}
      />
    )
  }

  if (currentView === 'project' && currentProject) {
    return (
      <ProjectView
        project={currentProject}
        onBack={() => {
          setCurrentView('home')
          fetchProjects() // Refresh on back
        }}
        onUpdate={updateProject}
        onDelete={deleteProject}
      />
    )
  }

  return null
}

export default App
