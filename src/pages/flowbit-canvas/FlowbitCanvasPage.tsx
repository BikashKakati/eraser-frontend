import { ReactFlowProvider } from "@xyflow/react"
import Sidebar from "../../components/sidebar/Sidebar"
import MainCanvas from "../../components/main-canvas/MainCanvas"
import { Link } from "react-router-dom"
import { ArrowLeft } from "lucide-react"

const FlowbitCanvasPage = () => {
    return (
        <div className="w-screen h-screen bg-gradient-to-br from-slate-50 to-indigo-50"
            style={{
                backgroundImage: `
          linear-gradient(to bottom right, var(--tw-gradient-stops)),
          linear-gradient(to right, #e2e8f0 1px, transparent 1px),
          linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
        `,
                backgroundSize: '100% 100%, 24px 24px, 24px 24px',
                backgroundColor: '#f8fafc'
            }}
        >
            <Link to="/flows" className="absolute top-4 left-4 z-50 px-3 py-1.5 bg-white border border-slate-200 rounded-lg shadow-sm text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Spaces
            </Link>
            <ReactFlowProvider>
                <Sidebar />
                <MainCanvas />
            </ReactFlowProvider>
        </div>
    )
}

export default FlowbitCanvasPage