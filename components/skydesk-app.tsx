'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  AlertCircle,
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  ClipboardCheck,
  Cloud,
  FileCheck2,
  FileText,
  Filter,
  Gauge,
  LayoutDashboard,
  MapPin,
  Menu,
  Plane,
  Plus,
  Search,
  Send,
  Settings,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
  Users,
  X,
  XCircle,
  Zap,
} from 'lucide-react'
import { useApp } from '@/lib/context'
import { Drone, Mission, MissionStatus, Pilot, Role } from '@/lib/types'
import { Button } from '@/components/ui/button'

const cn = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ')

const statusStyles: Record<string, string> = {
  Draft: 'bg-slate-100 text-slate-700 border-slate-200',
  Submitted: 'bg-blue-50 text-blue-700 border-blue-200',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Rejected: 'bg-red-50 text-red-700 border-red-200',
  Flown: 'bg-violet-50 text-violet-700 border-violet-200',
  'Report filed': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Unavailable: 'bg-slate-100 text-slate-600 border-slate-200',
  'On mission': 'bg-amber-50 text-amber-700 border-amber-200',
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold', statusStyles[String(children)] || 'bg-slate-100 text-slate-700 border-slate-200')}>{children}</span>
}

function StatCard({ label, value, icon: Icon, tone, detail }: { label: string; value: string | number; icon: React.ElementType; tone: string; detail: string }) {
  return <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-start justify-between"><div><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{value}</p></div><div className={cn('flex size-10 items-center justify-center rounded-xl', tone)}><Icon className="size-5" /></div></div><p className="mt-4 text-xs text-slate-500">{detail}</p></div>
}

function Sidebar({ activePage, setActivePage, role }: { activePage: string; setActivePage: (page: string) => void; role: Role }) {
  const items = role === 'pilot' ? [['dashboard', LayoutDashboard, 'Overview'], ['profile', UserRound, 'My profile'], ['missions', ClipboardCheck, 'My missions'], ['notifications', Bell, 'Notifications']] : role === 'authority' ? [['review', ShieldCheck, 'Review queue'], ['history', Activity, 'Decision history']] : [['dashboard', LayoutDashboard, 'Dashboard'], ['pilots', Users, 'Pilots'], ['missions', ClipboardCheck, 'Missions'], ['documents', FileText, 'Documents']]
  return <aside className="hidden w-64 shrink-0 flex-col bg-[#0d1b34] text-white lg:flex"><div className="flex h-20 items-center gap-3 border-b border-white/10 px-6"><div className="flex size-9 items-center justify-center rounded-lg bg-blue-500 shadow-lg shadow-blue-500/20"><Plane className="size-5" /></div><div><div className="font-bold tracking-tight">SkyDesk</div><div className="text-[10px] uppercase tracking-[0.18em] text-blue-200">Flight operations</div></div></div><div className="flex flex-1 flex-col px-4 py-6"><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">Workspace</p><nav className="flex flex-col gap-1">{items.map(([id, Icon, label]) => <button key={id as string} onClick={() => setActivePage(id as string)} className={cn('flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors', activePage === id ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-slate-300 hover:bg-white/10 hover:text-white')}><Icon className="size-4" />{label as string}{id === 'notifications' && <span className="ml-auto rounded-full bg-red-400 px-1.5 py-0.5 text-[10px]">2</span>}</button>)}</nav><div className="mt-auto rounded-xl border border-white/10 bg-white/5 p-4"><div className="mb-3 flex items-center gap-2 text-xs font-semibold text-blue-100"><CircleHelp className="size-4" />Need a hand?</div><p className="text-xs leading-relaxed text-slate-400">Review your compliance checklist before every flight.</p><button className="mt-3 text-xs font-semibold text-blue-300 hover:text-blue-200">Open help center →</button></div></div><div className="border-t border-white/10 p-4"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">AD</div><div className="min-w-0"><p className="truncate text-sm font-semibold">Andrei Dumitru</p><p className="truncate text-xs text-slate-400">Operations coordinator</p></div><Settings className="ml-auto size-4 text-slate-400" /></div></div></aside>
}

function Topbar({ role, setRole, activePage, setActivePage }: { role: Role; setRole: (role: Role) => void; activePage: string; setActivePage: (page: string) => void }) {
  const titles: Record<string, string> = { dashboard: 'Dashboard', pilots: 'Pilots', missions: 'Missions', documents: 'Documents', profile: 'My profile', notifications: 'Notifications', review: 'Authority review', history: 'Decision history' }
  return <header className="flex min-h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8"><div className="flex items-center gap-3"><button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"><Menu className="size-5" /></button><div><p className="text-xl font-bold tracking-tight text-slate-900">{titles[activePage] || 'Dashboard'}</p><p className="hidden text-xs text-slate-500 sm:block">{role === 'authority' ? 'Simulated authority workspace' : 'Wednesday, 9 October 2026'}</p></div></div><div className="flex items-center gap-3"><label className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 sm:flex"><span className="text-slate-400">Demo role</span><select value={role} onChange={(e) => { setRole(e.target.value as Role); setActivePage(e.target.value === 'authority' ? 'review' : 'dashboard') }} className="bg-transparent font-semibold text-slate-800 outline-none"><option value="coordinator">Drone Coordinator</option><option value="pilot">Drone Pilot</option><option value="authority">Authority Review (Simulated)</option></select></label><button className="relative rounded-lg p-2.5 text-slate-500 hover:bg-slate-100"><Bell className="size-5" /><span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-blue-500 ring-2 ring-white" /></button></div></header>
}

function Dashboard({ setActivePage }: { setActivePage: (page: string) => void }) {
  const { missions, pilots, drones, recentActivity, getExpiringCredentials } = useApp()
  const expiring = getExpiringCredentials()
  const activeMissions = missions.filter((m) => ['Approved', 'Flown'].includes(m.status)).length
  const pending = missions.filter((m) => m.status === 'Submitted').length + pilots.filter((p) => p.approvalStatus === 'Submitted').length
  return <div className="flex flex-col gap-6"><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Active missions" value={activeMissions} icon={Plane} tone="bg-blue-50 text-blue-600" detail="Across 4 locations" /><StatCard label="Pending approvals" value={pending} icon={ShieldCheck} tone="bg-amber-50 text-amber-600" detail="Needs your attention" /><StatCard label="Available pilots" value={pilots.filter((p) => p.availability === 'Available').length} icon={Users} tone="bg-emerald-50 text-emerald-600" detail={`of ${pilots.length} registered pilots`} /><StatCard label="Credentials expiring" value={expiring.length} icon={AlertCircle} tone="bg-red-50 text-red-600" detail="Within the next 30 days" /></div><div className="grid gap-6 xl:grid-cols-[1.05fr_1fr]"><section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="font-bold text-slate-900">Credential expiry</h2><p className="mt-1 text-xs text-slate-500">Keep your operation flight-ready</p></div><button onClick={() => setActivePage('pilots')} className="text-xs font-semibold text-blue-600 hover:text-blue-700">View all →</button></div><div className="flex flex-col divide-y divide-slate-100">{expiring.length ? expiring.map((item, index) => <div key={index} className="flex items-center gap-3 px-5 py-4"><div className={cn('flex size-9 items-center justify-center rounded-lg', item.daysUntilExpiry <= 10 ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600')}><AlertCircle className="size-4" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-800">{item.pilotName}</p><p className="truncate text-xs text-slate-500">{item.type}</p></div><span className={cn('text-xs font-bold', item.daysUntilExpiry <= 10 ? 'text-red-600' : 'text-amber-600')}>{item.daysUntilExpiry} days</span></div>) : <div className="p-8 text-center text-sm text-slate-500">All credentials are up to date.</div>}</div></section><section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 p-5"><div><h2 className="font-bold text-slate-900">Recent activity</h2><p className="mt-1 text-xs text-slate-500">Latest updates from your workspace</p></div><Activity className="size-4 text-slate-400" /></div><div className="flex flex-col divide-y divide-slate-100">{recentActivity.slice(0, 5).map((activity) => <div key={activity.id} className="flex gap-3 px-5 py-3.5"><div className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600"><Zap className="size-3.5" /></div><div className="min-w-0"><p className="text-sm font-medium text-slate-800">{activity.action}</p><p className="mt-0.5 truncate text-xs text-slate-500">{activity.detail} · {activity.actor}</p><p className="mt-1 text-[10px] text-slate-400">{activity.timestamp}</p></div></div>)}</div></section></div><section className="rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between p-5"><div><h2 className="font-bold text-slate-900">Fleet overview</h2><p className="mt-1 text-xs text-slate-500">Registered aircraft across your operation</p></div><button onClick={() => setActivePage('pilots')} className="text-xs font-semibold text-blue-600">{drones.length} aircraft →</button></div><div className="grid gap-3 border-t border-slate-100 p-5 sm:grid-cols-2 lg:grid-cols-3">{drones.slice(0, 6).map((drone) => <div key={drone.id} className="flex items-center gap-3 rounded-lg bg-slate-50 p-3"><div className="flex size-9 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm"><Plane className="size-4" /></div><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800">{drone.model}</p><p className="text-xs text-slate-500">{drone.registrationNumber} · {drone.category}</p></div></div>)}</div></section></div>
}

function PilotsPage({ onPilotSelect }: { onPilotSelect: (pilot: Pilot) => void }) {
  const { pilots, drones } = useApp()
  return <div className="flex flex-col gap-5"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"><div><p className="text-sm text-slate-500">Manage competency, availability and flight credentials.</p></div><div className="flex gap-2"><Button variant="outline" size="sm"><Filter data-icon="inline-start" />Filter</Button><Button size="sm"><Plus data-icon="inline-start" />Add pilot</Button></div></div><div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-slate-100 p-4"><div className="relative w-full max-w-xs"><Search className="absolute left-3 top-2.5 size-4 text-slate-400" /><input placeholder="Search pilots..." className="h-9 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-blue-400" /></div><span className="text-xs text-slate-500">{pilots.length} pilots</span></div><div className="overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-5 py-3 font-semibold">Pilot</th><th className="px-5 py-3 font-semibold">Availability</th><th className="px-5 py-3 font-semibold">Certificate</th><th className="px-5 py-3 font-semibold">Insurance</th><th className="px-5 py-3 font-semibold">Drones</th><th className="px-5 py-3 font-semibold">Approval</th><th /></tr></thead><tbody className="divide-y divide-slate-100">{pilots.map((pilot) => { const cert = pilot.certificates[0]; const insurance = pilot.insurance[0]; return <tr key={pilot.id} className="cursor-pointer hover:bg-slate-50" onClick={() => onPilotSelect(pilot)}><td className="px-5 py-4"><div className="flex items-center gap-3"><div className="flex size-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">{pilot.name.split(' ').map((n) => n[0]).join('')}</div><div><p className="font-semibold text-slate-800">{pilot.name}</p><p className="text-xs text-slate-500">{pilot.flightHours} flight hours</p></div></div></td><td className="px-5 py-4"><Badge>{pilot.availability}</Badge></td><td className="px-5 py-4"><div className="flex items-center gap-2"><span className={cn('size-2 rounded-full', cert.status === 'valid' ? 'bg-emerald-500' : cert.status === 'expiring' ? 'bg-amber-500' : 'bg-red-500')} /><span className="text-xs font-medium capitalize text-slate-700">{cert.status}</span></div></td><td className="px-5 py-4"><div className="flex items-center gap-2"><span className={cn('size-2 rounded-full', insurance.status === 'valid' ? 'bg-emerald-500' : 'bg-red-500')} /><span className="text-xs font-medium capitalize text-slate-700">{insurance.status}</span></div></td><td className="px-5 py-4 text-slate-600">{pilot.registeredDrones.length}</td><td className="px-5 py-4"><Badge>{pilot.approvalStatus}</Badge></td><td className="px-5 py-4"><ChevronRight className="size-4 text-slate-400" /></td></tr>})}</tbody></table></div></div></div>
}

export default function SkyDeskApp() {
  const [role, setRole] = useState<Role>('coordinator')
  const [activePage, setActivePage] = useState('dashboard')
  const [selectedPilot, setSelectedPilot] = useState<Pilot | null>(null)
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null)
  const [showNewMission, setShowNewMission] = useState(false)
  return <AppProvider><div className="flex min-h-screen bg-[#f5f7fb]"><Sidebar activePage={activePage} setActivePage={(page) => { setActivePage(page); setSelectedMission(null) }} role={role} /><div className="flex min-w-0 flex-1 flex-col"><Topbar role={role} setRole={setRole} activePage={activePage} setActivePage={setActivePage} /><main className="flex-1 p-5 sm:p-8"><div className="mx-auto max-w-[1440px]"><Dashboard setActivePage={setActivePage} /></div></main></div></div></AppProvider>
}

function AppProvider({ children }: { children: React.ReactNode }) {
  return children
}
