import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { resourceRegistry } from "../resources/resourceRegistry.js";
import { PageIntro } from "../../shared/ui/PageIntro.jsx";
import { useAuth } from "../../shared/auth/AuthProvider.jsx";

function LoginPage() {
    const navigate = useNavigate();
    const { isAuthenticated, login } = useAuth();
    const [credentials, setCredentials] = useState({ username: "", password: "" });
    const [error, setError] = useState("");

    if (isAuthenticated) {
        return <Navigate to="/overview" replace />;
    }

    function handleChange(event) {
        const { name, value } = event.target;
        setCredentials((currentValues) => ({
            ...currentValues,
            [name]: value,
        }));
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");

        try {
            await login(credentials);
            navigate("/overview");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login non disponibile.");
        }
    }

    return (
        <section className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-10 lg:px-6">
            <div className="grid w-full gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[1.75rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface-strong)] p-8 shadow-[0_24px_80px_rgba(20,36,60,0.10)]">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--app-primary)]">
                        ASD Management
                    </p>
                    <h1 className="mt-4 text-4xl font-semibold text-[color:var(--app-ink)]">
                        Accedi al gestionale
                    </h1>
                    <div className="mt-4 max-w-2xl space-y-2 text-sm leading-7 text-[color:var(--app-muted)]">
                        <p>Accesso interno riservato agli utenti gia' presenti nel sistema. Non e' prevista registrazione pubblica.</p>
                    </div>

                    <div className="mt-8 space-y-4">
                        <div className="rounded-2xl bg-[color:var(--app-surface)] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-primary)]">
                                Provisioning utenti
                            </p>
                            <p className="mt-2 text-sm text-[color:var(--app-muted)]">
                                Gli account saranno creati a cura del personale dell'associazione
                                sportiva.
                            </p>
                        </div>
                        <div className="rounded-2xl bg-[color:var(--app-surface)] p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--app-primary)]">
                                Autenticazione
                            </p>
                            <p className="mt-2 text-sm text-[color:var(--app-muted)]">
                                In caso di problemi con l'autenticazione contattare:
                            </p>
                            <p className="mt-2 text-sm font-medium text-[color:var(--app-ink)]">
                                supporto@asd-management.local
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-[1.75rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface-strong)] p-8 shadow-[0_24px_80px_rgba(20,36,60,0.10)]"
                >
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--app-primary)]">
                            Login
                        </p>
                        <h2 className="mt-3 text-2xl font-semibold text-[color:var(--app-ink)]">
                            Accesso Area Riservata
                        </h2>
                        <p className="mt-3 text-sm leading-6 text-[color:var(--app-muted)]">
                            Inserire Username e Password fornite dal personale dell'associazione sportiva.
                        </p>
                    </div>

                    <div className="mt-8 space-y-5">
                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-[color:var(--app-ink)]">
                                Username
                            </span>
                            <input
                                name="username"
                                type="text"
                                value={credentials.username}
                                onChange={handleChange}
                                placeholder="admin"
                                className="w-full rounded-xl border border-[color:var(--app-border)] bg-white px-4 py-3 text-sm text-[color:var(--app-ink)] outline-none transition focus:border-[color:var(--app-primary)] focus:ring-4 focus:ring-[color:var(--app-primary)]/10"
                            />
                        </label>

                        <label className="block">
                            <span className="mb-2 block text-sm font-medium text-[color:var(--app-ink)]">
                                Password
                            </span>
                            <input
                                name="password"
                                type="password"
                                value={credentials.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="w-full rounded-xl border border-[color:var(--app-border)] bg-white px-4 py-3 text-sm text-[color:var(--app-ink)] outline-none transition focus:border-[color:var(--app-primary)] focus:ring-4 focus:ring-[color:var(--app-primary)]/10"
                            />
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[color:var(--app-primary)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[color:var(--app-primary-strong)]"
                    >
                        Entra nel gestionale
                    </button>

                    {error ? (
                        <p className="mt-4 text-sm text-[color:var(--app-danger)]">{error}</p>
                    ) : null}
                </form>
            </div>
        </section>
    );
}

function DashboardPage() {
    return (
        <section className="space-y-6">
            <PageIntro
                eyebrow="Overview"
                title="Dashboard operativa"
                description="Area protetta dell'applicazione. Da qui puoi aprire i moduli CRUD e continuare l'evoluzione del gestionale step by step."
            />

            <div className="grid gap-4 xl:grid-cols-2">
                {resourceRegistry.map((resource) => (
                    <article
                        key={resource.key}
                        className="rounded-[1.5rem] border border-[color:var(--app-border)] bg-[color:var(--app-surface-strong)] p-6 shadow-[0_14px_40px_rgba(20,36,60,0.08)]"
                    >
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--app-primary)]">
                            {resource.section}
                        </p>
                        <h3 className="mt-3 text-2xl font-semibold text-[color:var(--app-ink)]">
                            {resource.labels.plural}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-[color:var(--app-muted)]">
                            {resource.description}
                        </p>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Link
                                to={`/${resource.path}`}
                                className="btn btn-secondary"
                            >
                                Apri elenco
                            </Link>
                            <Link
                                to={`/${resource.path}/new`}
                                className="btn btn-outline"
                            >
                                Inserisci
                            </Link>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}

export function HomePage({ mode = "login" }) {
    if (mode === "dashboard") {
        return <DashboardPage />;
    }

    return <LoginPage />;
}
