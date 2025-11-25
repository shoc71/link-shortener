import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";

import "./HomeStyles.css"

import { addLink, getAllLinks, deleteLink, LinkItem } from "../api/useLink";

export function generateRandomShort() {
    const shortKey = nanoid(10);

    return `https://short.url/${shortKey}`;
}

export const BASE_SHORT = "http://localhost:5000";

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
            // console.log("API response:", response);
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
            loadLinks();
        } else {
            toast.error("Error deleting link.", {duration:shortDisplayInMilliSeconds});
        }
    }

    useEffect(() => {
        loadLinks();
    }, []);

    return(
        <div className="">
            <main className="main x-center">
                <h1 className="">Link Shortener</h1>
            </main>
            <div className="main og-link x-center y-center">
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
            <div className="main x-center">
                <label>
                        <input
                            type="checkbox"
                            checked={confirmed}
                            onChange={(e) => setConfirmed(e.target.checked)}
                        />
                        I confirm this URL is correct
                    </label>
            </div>
            <div className="main new-link x-center y-center">
                psa
            </div>
            
            <h2>All Links</h2>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Short</th>
                    <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Original</th>
                    <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Actions</th>
                </tr>
                </thead>

                <tbody>
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
                            <button onClick={() => handleDelete(l._id)}>Delete</button>
                        </td>
                        </tr>
                    ))}
                </tbody>
            </table>
           
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