import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import GitHubLogo from "../github-logo.png";
import compassImg from "../compass copy.png";
import $ from "jquery";
import "datatables.net-bs5";
import "datatables.net-bs5/css/dataTables.bootstrap5.min.css"; 
import "bootstrap/dist/css/bootstrap.min.css";
import 'datatables.net-react';
import 'datatables.net-dt';
import 'datatables.net-bs5';

import { pingServer } from "./HeartbeatMonitor";

import "./HomeStyles.css"

import { addLink, getAllLinks, deleteLink, LinkItem } from "../api/useLink";

export function generateRandomShort() {
    const shortKey = nanoid(10);

    return `https://short.url/${shortKey}`;
}

const isProd = window.location.hostname !== "localhost";

export const BASE_SHORT = isProd
  ? `https://link-shortener-1-3jpx.onrender.com`
: "http://localhost:5000";


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
                // info: true,
                pageLength: 5,
                lengthMenu: [5, 10, 25, 50, 100],
                responsive: {
                     details: {
                        type: 'column',
                        target: 0,
                        display: $.fn.dataTable.Responsive.display.modal({
                            header: function (row:any) {
                                return 'Details for ' + row.data()[1]; // show short link in modal header
                            }
                        })
                    }
                },
                columnDefs : [{
                    className: "control",
                    orderable: false,
                    targets: 0
                }],
                // order : [ 0, 'desc']
            });
        }, 1000);
    }, [links]);

    return(
        <div className="bg-black text-white p-4 min-vh-100">

            <div className="card rounded bg-black text-white border mt-4">
                <h1 className="card-title text-center p-4 mb-4">
                    Link Shortener
                </h1>

                <div className="d-flex flex-column">
                    <form 
                        className="d-flex flex-column w-100"
                        onSubmit={handleAdd}
                    >
                        <div className="d-flex align-items-center w-100 mb-2 p-2">
                            <span className="input-group-text bg-dark text-white">OG-Link:</span>   
                            <input 
                                type="text" 
                                id="og-link"
                                className="form-control bg-dark text-white border-secondary" 
                                value={original}
                                style={{ minWidth: "200px", flexGrow: 1 }}
                                onChange={(e) => setOriginal(e.target.value)}
                                placeholder="Enter original URL" 
                            />
                        </div>

                        <button className="btn btn-success flex px-5" id="submit">
                            Submit
                        </button>
                    </form>
                </div>

                <div className="main my-4 w-100">
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
                <div className="d-flex justify-content-center">
                    <button className="btn btn-warning w-100" onClick={pingServer}>Check Server</button>
                </div>
            </div>

            <div className="d-flex align-items-center justify-content-center m-4">
                * This is highly experimental
            </div>

            <div className="d-flex align-items-center justify-content-center mb-4">
                This website server is run on a free-instance. Give it a minute to spin up.
            </div>
            
            <div className="mb-4 border border-white p-5">
                <h2 className="mb-4">All Links</h2>

                {/* desktop */}
                <div className="table-responsive d-none d-lg-block w-100">
                    <table 
                        id="linksTable" 
                        className="table table-dark table-bordered table-striped table-hover">
                        <thead className="thead-light">
                            <tr className="border border-white">
                                <th>ID</th>
                                <th>Short</th>
                                <th>Original</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody className="border border-white">
                            {links.map((l, index) => (
                                <tr key={l._id}>
                                    <td>{index}</td>
                                    <td>
                                        <a 
                                            href={`${BASE_SHORT}/${l.newLink}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                        >
                                            {BASE_SHORT}/{l.newLink}
                                        </a>
                                    </td>
                                    <td 
                                        className="text-truncate w200" title={l.originalLink}
                                        >
                                            {l.originalLink}
                                    </td>
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

                {/* mobile */}
                <div className="bg-black text-white d-lg-none">
                    {links.map((l, index) => (
                        <div className="card bg-black text-white border-white">
                            <h3 className="card-title pt-4 px-4">{index}</h3>
                            <div className="card-body">
                                <ul>
                                    <li>
                                        <a 
                                            href={`${BASE_SHORT}/${l.newLink}`} 
                                            target="_blank" 
                                            rel="noreferrer"
                                        >
                                            {BASE_SHORT}/{l.newLink}
                                        </a>
                                    </li>
                                    <li className="text-truncate" title={l.originalLink}>
                                        {l.originalLink}
                                    </li>
                                    <li>
                                        <button className="btn btn-danger btn-sm" onClick={() => handleDelete(l._id)}>
                                            Delete
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
           <footer className='bg-black'>
                <div className="p-4 d-flex justify-content-between">

                    <a href="https://shoc71.github.io/eDash/" target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-white mx-4">
                        <img 
                            src={compassImg}
                            alt="Compass Icon"
                            className="rounded"
                            width="50"
                        />
                        <span className="mx-2">
                            <strong>
                                Other Works
                            </strong>
                        </span>
                    </a>

                    <a href="https://github.com/shoc71/link-shortener" target="_blank" rel="noreferrer"
                    className="btn btn-sm btn-white d-flex align-items-center">
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