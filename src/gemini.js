import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateRPPContent = async (apiKey, data) => {
  if (!apiKey) {
    throw new Error("API Key belum diisi! Harap masukkan API Key terlebih dahulu.");
  }

  // Inisialisasi Gemini
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  // Susun Prompt (Perintah) untuk Gemini
  const prompt = `
    Bertindaklah sebagai Guru profesional dan ahli kurikulum Merdeka Belajar.
    Buatkan konten Modul Ajar (RPP) yang lengkap dan praktis untuk:
    
    - Mata Pelajaran: ${data.mapel}
    - Kelas: ${data.kelas}
    - Fase: ${data.fase}
    - Topik/Materi: ${data.elemen}
    - Alokasi Waktu: ${data.alokasiWaktu}

    Tugasmu adalah mengisi bagian-bagian berikut:
    1. Tujuan Pembelajaran
    2. Pemahaman Bermakna
    3. Pertanyaan Pemantik
    4. Kegiatan Pendahuluan (poin-poin)
    5. Kegiatan Inti (poin-poin detail)
    6. Kegiatan Penutup (poin-poin)
    7. Asesmen / Penilaian

    PENTING: Output HARUS dalam format JSON murni (tanpa markdown \`\`\`json) dengan struktur key persis seperti ini:
    {
      "tujuanPembelajaran": "...",
      "pemahamanBermakna": "...",
      "pertanyaanPemantik": "...",
      "kegiatanPendahuluan": "...",
      "kegiatanInti": "...",
      "kegiatanPenutup": "...",
      "asesmen": "..."
    }
    
    Gunakan bahasa Indonesia yang baku, edukatif, dan mudah dipahami.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Bersihkan format jika Gemini memberikan markdown block
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();
    
    // Ambil hanya bagian JSON (jaga-jaga ada teks pembuka/penutup)
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1) {
      text = text.substring(firstBrace, lastBrace + 1);
    }

    return JSON.parse(text);
  } catch (error) {
    console.error("Error generating RPP:", error);
    throw new Error("Gagal membuat RPP. Pastikan API Key benar atau coba lagi.");
  }
};