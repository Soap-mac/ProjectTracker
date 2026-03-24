import { useApp } from './context/AppContext'
import KanbanBoard from './component/kaban/KabanBoard'
import ListView from './component/list/ListView'
import TimelineView from './component/timeline/TimeLineView'
import FilterBar from './component/filters/FilterBar'
import CollabBar from './component/shared/CollabBar'

function App() {
  const { state, dispatch } = useApp()

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <header className="bg-white border-b border-gray-200 px-6 py-3 shrink-0 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-800">Project Tracker</h1>
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {(['kanban', 'list', 'timeline'] as const).map(view => (
            <button
              key={view}
              onClick={() => dispatch({ type: 'SET_VIEW', payload: view })}
              className={`px-3 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${state.activeView === view
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {view}
            </button>
          ))}
        </div>
      </header>

      <FilterBar />
      <CollabBar />

      <main className="flex-1 overflow-hidden p-4">
        {state.activeView === 'kanban' && <KanbanBoard />}
        {state.activeView === 'list' && <ListView />}
        {state.activeView === 'timeline' && <TimelineView />}
      </main>
    </div>
  )
}

export default App