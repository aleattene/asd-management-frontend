import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { moduleSections } from "../../app/moduleCatalog";
import type { ModuleDefinition } from "../types/resources";
import { useAuth } from "../auth/AuthProvider";
import { appEnv } from "../config/env";

function PlaceholderModule({ module }: { module: ModuleDefinition }) {
    return (
        <div className="rounded-xl border border-white/10 px-3 py-2.5 text-sm text-slate-300/85">
            <div className="flex items-center justify-between gap-3">
                <span>{module.title}</span>
                <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-300">
                    {module.status === "standby" ? "Standby" : "Planned"}
                </span>
            </div>
        </div>
    );
}

export function AppShell() {
    const navigate = useNavigate();
    const { logout, firstName, lastName, username, role } = useAuth();

    const displayName = `${firstName} ${lastName}`.trim() || username || "Utente";

    function handleLogout() {
        logout();
        navigate("/", { replace: true });
    }

    return (
        <div className="min-h-screen bg-transparent text-[color:var(--app-ink)]">
            <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-4 py-4 lg:flex-row lg:px-6">
                <aside className="mb-4 shrink-0 rounded-[1.5rem] border border-white/50 bg-[color:var(--app-panel)] px-5 py-6 text-slate-50 shadow-[0_24px_80px_rgba(15,39,64,0.22)] lg:mb-0 lg:w-80">
                    <NavLink
                        to="/overview"
                        className="block rounded-[1.25rem] border border-white/10 bg-white/5 px-4 py-4 transition hover:bg-white/10"
                    >
                        <div className="inline-flex items-center rounded-full bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.28em] text-[color:var(--app-accent)]">
                            {appEnv.applicationName}
                        </div>
                        <h1 className="mt-4 text-[2rem] font-semibold leading-tight text-white">
                            {appEnv.associationName}
                        </h1>
                        <p className="mt-3 text-sm leading-6 text-slate-300">{appEnv.appTagline}</p>
                    </NavLink>

                    <nav className="mt-8 space-y-6">
                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-200">
                            <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                                Profilo
                            </p>
                            <p className="mt-2 font-medium text-white">{displayName}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                                {role || "Utente autenticato"}
                            </p>
                        </div>

                        <div>
                            <p className="mb-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                                Overview
                            </p>
                            <NavLink
                                to="/overview"
                                className={({ isActive }) =>
                                    `block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                        isActive
                                            ? "bg-[color:var(--app-primary)] text-white shadow-[0_10px_24px_rgba(28,165,107,0.28)]"
                                            : "text-slate-200 hover:bg-white/8"
                                    }`
                                }
                            >
                                Dashboard
                            </NavLink>
                        </div>

                        {Object.entries(moduleSections).map(([sectionName, modules]) => (
                            <div key={sectionName}>
                                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-slate-400">
                                    {sectionName}
                                </p>
                                <div className="space-y-1">
                                    {modules.map((module) =>
                                        module.status === "live" && module.path ? (
                                            <NavLink
                                                key={module.key}
                                                to={module.path}
                                                className={({ isActive }) =>
                                                    `block rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                                                        isActive
                                                            ? "bg-[color:var(--app-primary)] text-white shadow-[0_10px_24px_rgba(28,165,107,0.28)]"
                                                            : "text-slate-200 hover:bg-white/8"
                                                    }`
                                                }
                                            >
                                                {module.title}
                                            </NavLink>
                                        ) : (
                                            <PlaceholderModule key={module.key} module={module} />
                                        ),
                                    )}
                                </div>
                            </div>
                        ))}
                    </nav>

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-8 inline-flex w-full items-center justify-center rounded-xl border border-white/15 bg-white/8 px-4 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/14"
                    >
                        Logout
                    </button>
                </aside>

                <main className="min-w-0 flex-1 lg:pl-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
