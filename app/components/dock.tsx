"use client";
import { useState, useEffect, useRef } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Dock } from 'primereact/dock';

import { Geist, Geist_Mono } from "next/font/google";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export default function PrimeDock() {
    const [aboutModal, setAboutModal] = useState(false);
    const dockItems = [
        {
            label: 'Portfolio',
            tooltip: "My Portfolio",
            icon: () => <img alt="portfolio" src="/icons/portfolio.svg" width="100%" />,
            command: () => window.open('https://roden-mark-montoya.onrender.com/', '_blank'),
        },
        {
            label: 'Projects',
            tooltip: "My Projects",
            icon: () => <img alt="projects" src="/icons/projects.svg" width="100%" />,
            command: () => window.open('https://github.com/roden1999?tab=repositories', '_blank'),
        },
        {
            label: 'Account',
            tooltip: '@roden1999',
            icon: () => <img alt="account" src="/icons/account.svg" width="100%" />,
            command: () => window.open('https://github.com/roden1999', '_blank'),
        },
        {
            label: 'About',
            tooltip: 'About',
            icon: () => <img alt="about" src="/icons/about.svg" width="100%" />,
            command: () => setAboutModal(true),
        }
    ];
    return (
        <>
            <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50">
                <Dock model={dockItems} position="right" />
            </div>


            <Dialog
                header="About This Project"
                visible={aboutModal}
                style={{ width: "50rem", maxWidth: "95vw", padding: "1rem" }}
                modal
                onHide={() => setAboutModal(false)}
                breakpoints={{ "640px": "90vw" }}
                draggable
                resizable
            >
                <div style={{ fontFamily: "Arial, sans-serif", lineHeight: "1.65", color: "#333" }}>

                    <p style={{ fontSize: "1.1rem" }}>
                        This <strong>Money Tracking App</strong> is a full-stack portfolio project built to
                        demonstrate practical application architecture using modern web technologies.
                        The focus of this project is on clean data flow, maintainable code structure,
                        and reliable backend logic for managing financial records.
                    </p>

                    <p>
                        The application is developed using the <strong>current version of Next.js</strong>
                        with the <strong>App Router</strong> and styled primarily with
                        <strong> Tailwind CSS</strong>.
                        The UI is intentionally kept simple and responsive, with minimal third-party
                        UI dependencies to maintain full control over styling and behavior.
                    </p>

                    <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>UI & Frontend</h3>
                    <p>
                        The frontend follows a <strong>stateless data handling approach</strong>,
                        where form inputs are managed as structured objects instead of multiple fragmented states.
                        This design ensures consistency when passing parameters from the UI to the API layer
                        and improves overall maintainability.
                    </p>
                    <p>
                        <strong>PrimeReact</strong> is used only for the <strong>Dock component</strong>,
                        providing a compact and accessible navigation experience without affecting the rest
                        of the application’s styling.
                    </p>

                    <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>Backend & Database</h3>
                    <p>
                        The backend is implemented using <strong>Next.js API routes</strong>.
                        For local development and testing, the project uses <strong>SQL Server</strong>,
                        while the deployed version runs on <strong>Supabase PostgreSQL</strong>.
                    </p>
                    <p>
                        All database operations are handled through <strong>stored procedures</strong>,
                        supporting full <strong>CRUD functionality</strong> with
                        <strong> soft delete</strong> logic.
                        Instead of permanently removing records, data is marked as inactive,
                        ensuring safer data management and easier recovery when needed.
                    </p>
                    <p>
                        The application passes a single, stateless parameter object from the frontend,
                        through the API layer, and into the database procedures.
                        This approach reduces redundancy, simplifies validation, and follows
                        backend patterns commonly used in production systems.
                    </p>

                    <h3 style={{ marginTop: "1.5rem", marginBottom: "0.5rem" }}>Tech Stack</h3>
                    <ul>
                        <li>Next.js (App Router)</li>
                        <li>React</li>
                        <li>Tailwind CSS</li>
                        <li>PrimeReact (Dock component only)</li>
                        <li>SQL Server (local development)</li>
                        <li>Supabase PostgreSQL (deployment)</li>
                        <li>Next.js API Routes</li>
                        <li>Stored Procedures with Soft Delete</li>
                        <li>Stateless Parameter Flow (UI → API → DB)</li>
                    </ul>

                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.25rem" }}>
                        <Button
                            label="Close"
                            severity="secondary"
                            onClick={() => setAboutModal(false)}
                            className="p-button-outlined"
                        />
                    </div>
                </div>
            </Dialog>

        </>
    );
}