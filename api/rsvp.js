// Vercel Serverless Function to handle RSVP via Supabase
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Cek apakah ENV terbaca (Muncul di terminal server)
console.log("🔍 Mengecek Environment Variables:");
console.log("👉 SUPABASE_URL ada:", !!supabaseUrl);
console.log("👉 SUPABASE_ANON_KEY ada:", !!supabaseKey);

// Jangan inisialisasi client jika ENV kosong
let supabase = null;
if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
}

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (!supabase) {
        return res.status(500).json({ error: "Server Configuration Error: Environment Variables (Supabase) are missing." });
    }

    if (req.method === 'POST') {
        const { author, attendance, guest, comment } = req.body;

        const { data, error } = await supabase
            .from('guestbooks')
            .insert([
                {
                    author: author || 'Tamu',
                    attendance: attendance || 'notsure',
                    guest: guest ? parseInt(guest, 10) : 1,
                    comment: comment || ''
                }
            ]);

        if (error) {
            console.error("❌ Database Error (POST):", error.message);
            return res.status(500).json({ error: error.message });
        }

        console.log("✅ Database terhubung! Berhasil menyimpan ucapan dari:", author || 'Tamu');
        return res.status(200).json({ success: true, data });
    }

    if (req.method === 'GET') {
        const { data, error } = await supabase
            .from('guestbooks')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error("❌ Database Error (GET):", error.message);
            return res.status(500).json({ error: error.message });
        }

        console.log("✅ Database terhubung! Berhasil mengambil " + (data ? data.length : 0) + " data ucapan.");
        return res.status(200).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
}
