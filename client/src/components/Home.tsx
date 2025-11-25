import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import GitHubLogo from "../github-logo.png";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css"; 
import "bootstrap/dist/css/bootstrap.min.css"; 

import { pingServer } from "./HeartbeatMonitor";

import "./HomeStyles.css"

import { addLink, getAllLinks, deleteLink, LinkItem } from "../api/useLink";
// import HeartbeatMonitor from "./HeartbeatMonitor";

export function generateRandomShort() {
    const shortKey = nanoid(10);

    return `https://short.url/${shortKey}`;
}

const isProd = window.location.hostname !== "localhost";

export const BASE_SHORT = isProd
  ? "https://your-production-domain.com"
  : "http://localhost:5000";


// export const BASE_SHORT = "http://localhost:5000";

function generateShort(): string {
  return nanoid(10);
}

export function Home() {

    const [links, setLinks] = useState<LinkItem[]>([]);
    const [original, setOriginal] = useState("");
    const [confirmed, setConfirmed] = useState(false);
    const shortDisplayInMilliSeconds = 5000
    const longDisplayInMilliSeconds = 10000

    async function loadLinks() {
        try {
            const response = await getAllLinks();
            console.log("API response:", response);
            if (response.success && Array.isArray(response.data)) {
                setLinks(response.data);
            } else {
                console.warn("Data not array or success=false");
            }
        } catch (err) {
            console.error(err);
        }
    }


    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (!confirmed) return toast.error("Please confirm first!", {duration: shortDisplayInMilliSeconds});
        if (!original.trim()) return toast.error("Enter a URL.", {duration: shortDisplayInMilliSeconds});

        const short = generateShort();
        const res = await addLink(original, short);

        if (res.success) {
            toast.success("Short link created!", {duration:longDisplayInMilliSeconds});

            if ($.fn.DataTable.isDataTable("#linksTable")) {
                $("#linksTable").DataTable().destroy();
            }

            setLinks((prev) => [res.data, ...prev]);

            setOriginal("");
            setConfirmed(false);
            
            await loadLinks();
        } else {
            toast.error("Failed to create link.", {duration: shortDisplayInMilliSeconds});
        }
    }

    async function handleDelete(id: string) {
        const res = await deleteLink(id);

        if (res.success) {
            toast.success("Deleted!", {duration:longDisplayInMilliSeconds});
            setLinks(prev => prev.filter(l => l._id !== id));
            $("#linksTable").DataTable().destroy();
        } else {
            toast.error("Error deleting link.", {duration:shortDisplayInMilliSeconds});
        }
    }

    useEffect(() => {
        loadLinks();
    }, []);

    useEffect(() => {
        setTimeout(() => {
            if ($.fn.DataTable.isDataTable("#linksTable")) {
                $("#linksTable").DataTable().destroy();
            }
            $("#linksTable").DataTable({
                paging: true,
                searching: true,
                info: true,
                pageLength: 5,
                lengthMenu: [5, 10, 25, 50],
            });
        }, 1000);
    }, [links]);

    return(
        <div className="bg text-white p-4 min-vh-100">

            <div className="card bg text-white border mt-4">
            <h1 className="card-title text-center p-4 mb-4">
                Link Shortener
            </h1>
            <div className="flex justify-content-center align-items-center">
                <form onSubmit={handleAdd}>
                    <label htmlFor="og-link">OG-Link:</label>
                    <input 
                        type="text" 
                        id="og-link" 

                        value={original}
                        onChange={(e) => setOriginal(e.target.value)}

                        placeholder="Enter original URL" 
                        />

                    <button id="submit">Submit</button>
                </form>
            </div>
            <div className="main x-center my-4">
                <label>
                    <input
                        type="checkbox"
                        checked={confirmed}
                        className="mx-2"
                        onChange={(e) => setConfirmed(e.target.checked)}
                    />
                    I confirm this URL is correct
                </label>
            </div>
            <button className="btn btn-warning" onClick={pingServer}>Check Server</button>
            </div>

            <div className="main new-link x-center y-center">
                * This is highly experimental
            </div>
            
            <div className="mb-4 border border-white p-5">
                <h2>All Links</h2>
                <table 
                    id="linksTable" 
                    className="table table-dark table-bordered table-striped table-hover">
                    <thead className="thead-light">
                        <tr className="border border-white">
                            <th>Short</th>
                            <th>Original</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody className="border border-white">
                        {links.map((l) => (
                            <tr key={l._id}>
                            <td>
                                <a 
                                    href={`${BASE_SHORT}/${l.newLink}`} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                >
                                    {BASE_SHORT}/{l.newLink}
                                </a>
                            </td>
                            <td>{l.originalLink}</td>
                            <td>
                                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(l._id)}>
                                    Delete
                                </button>
                            </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
           <footer className='bg'>
                <div className="p-4 d-flex justify-content-between">
                    <a href="../index.html" className="btn btn-outline-primary text-white d-flex align-items-center">
                        <img 
                            src="https://shorturl.at/qhIwu" 
                            alt="home"
                            width="40"    
                        />
                        <span className="mx-2">Return To Home</span>
                    </a>
                    <a href="https://github.com/shoc71/link-shortener" target="_blank" className="btn btn-sm btn-white d-flex align-items-center">
                        <img 
                            src={GitHubLogo} 
                            alt="Github Icon"
                            className="rounded"
                            width="50"
                        />
                        <span className="mx-2">Source Code</span>
                    </a>            
                </div>
            </footer>
        </div>
    )
}

export default Home;

// copy-to-clipboard button
// custom domain support
// QR code generator for each short link
// Expiration timestamps
// Rate limiting
// MongoDB indexing for speed