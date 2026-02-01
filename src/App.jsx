import React, { useState } from 'react';
import { generateRPPContent } from './gemini';

function App() {
  // State untuk data Modul Ajar / RPP
  const [rppData, setRppData] = useState({
    // Informasi Umum
    sekolah: '',
    penyusun: '',
    tahun: new Date().getFullYear(),
    jenjang: 'SD',
    kelas: '',
    mapel: '',
    alokasiWaktu: '2 x 35 Menit',
    fase: 'A',
    elemen: '',
    
    // Komponen Inti
    tujuanPembelajaran: '',
    pemahamanBermakna: '',
    pertanyaanPemantik: '',
    
    // Kegiatan Pembelajaran
    kegiatanPendahuluan: '',
    kegiatanInti: '',
    kegiatanPenutup: '',
    
    // Asesmen
    asesmen: '',
  });

  // State untuk AI
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State untuk mengontrol accordion (buka/tutup menu)
  const [activeSection, setActiveSection] = useState('umum');

  const handleChange = (e) => {
    setRppData({ ...rppData, [e.target.name]: e.target.value });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateAI = async () => {
    if (!rppData.mapel || !rppData.elemen) {
      alert("Mohon isi Mata Pelajaran dan Elemen/Topik terlebih dahulu!");
      return;
    }

    setIsLoading(true);
    try {
      const generatedData = await generateRPPContent(apiKey, rppData);
      setRppData(prev => ({
        ...prev,
        ...generatedData // Menggabungkan hasil AI ke state yang ada
      }));
      alert("Alhamdulillah! RPP berhasil dibuat otomatis.");
      setActiveSection('inti'); // Buka tab komponen inti untuk melihat hasil
    } catch (error) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Komponen Helper untuk Input Textarea
  const InputArea = ({ label, name, placeholder, rows = 3 }) => (
    <div className="mb-3">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <textarea
        name={name}
        value={rppData[name]}
        onChange={handleChange}
        rows={rows}
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
      />
    </div>
  );

  // Komponen Helper untuk Input Text Biasa
  const InputText = ({ label, name, placeholder, type = "text" }) => (
    <div className="mb-3">
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={rppData[name]}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800">
      
      {/* Navbar Sederhana (No Print) */}
      <nav className="bg-blue-900 text-white p-4 shadow-md no-print">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Generator Modul Ajar / RPP (v1.2)</h1>
          <button 
            onClick={handlePrint}
            className="bg-yellow-500 hover:bg-yellow-600 text-blue-900 font-bold py-2 px-4 rounded shadow transition"
          >
            🖨️ Cetak PDF
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KOLOM KIRI: EDITOR (No Print) */}
        <div className="lg:col-span-4 space-y-4 no-print h-fit overflow-y-auto max-h-screen sticky top-4">
          <div className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-600">
            <h2 className="font-bold text-lg mb-2">Editor RPP</h2>
            <p className="text-xs text-gray-500 mb-4">Isi data di bawah ini, preview di kanan akan otomatis terupdate.</p>
            
            {/* PANEL AI GENERATOR */}
            <div className="bg-blue-50 p-3 rounded-md border border-blue-200 mb-4">
              <h3 className="font-bold text-blue-800 text-sm mb-2">✨ Generator AI (Otomatis)</h3>
              <div className="mb-2">
                <input 
                  type="password" 
                  placeholder="Tempel API Key Gemini di sini..." 
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2 text-xs"
                />
                <p className="text-[10px] text-gray-500 mt-1">Belum punya key? <a href="https://aistudio.google.com/app/apikey" target="_blank" className="text-blue-600 underline">Ambil di sini (Gratis)</a></p>
              </div>
              <button 
                onClick={handleGenerateAI}
                disabled={isLoading}
                className={`w-full py-2 px-4 rounded text-white font-bold text-sm transition ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLoading ? 'Sedang Berpikir... ⏳' : '⚡ Generate Isi RPP Otomatis'}
              </button>
            </div>
            <hr className="border-gray-200 mb-4" />
            
            {/* Accordion 1: Informasi Umum */}
            <div className="border rounded mb-2">
              <button 
                onClick={() => setActiveSection(activeSection === 'umum' ? '' : 'umum')}
                className="w-full text-left p-3 bg-gray-50 font-semibold flex justify-between hover:bg-gray-100"
              >
                1. Informasi Umum <span>{activeSection === 'umum' ? '▼' : '▶'}</span>
              </button>
              {activeSection === 'umum' && (
                <div className="p-3 bg-white animate-fade-in">
                  <InputText label="Nama Sekolah" name="sekolah" placeholder="SD Islam Terpadu..." />
                  <InputText label="Nama Penyusun (Guru)" name="penyusun" placeholder="Nama Ustadz/Ustadzah" />
                  <div className="grid grid-cols-2 gap-2">
                    <InputText label="Kelas" name="kelas" placeholder="4" />
                    <InputText label="Fase" name="fase" placeholder="B" />
                  </div>
                  <InputText label="Mata Pelajaran" name="mapel" placeholder="Matematika / PAI" />
                  <InputText label="Elemen / Topik" name="elemen" placeholder="Bilangan Cacah" />
                  <InputText label="Alokasi Waktu" name="alokasiWaktu" placeholder="2 JP (2 x 35 Menit)" />
                </div>
              )}
            </div>

            {/* Accordion 2: Komponen Inti */}
            <div className="border rounded mb-2">
              <button 
                onClick={() => setActiveSection(activeSection === 'inti' ? '' : 'inti')}
                className="w-full text-left p-3 bg-gray-50 font-semibold flex justify-between hover:bg-gray-100"
              >
                2. Komponen Inti <span>{activeSection === 'inti' ? '▼' : '▶'}</span>
              </button>
              {activeSection === 'inti' && (
                <div className="p-3 bg-white">
                  <InputArea label="Tujuan Pembelajaran" name="tujuanPembelajaran" placeholder="Peserta didik mampu..." />
                  <InputArea label="Pemahaman Bermakna" name="pemahamanBermakna" placeholder="Manfaat pembelajaran ini..." />
                  <InputArea label="Pertanyaan Pemantik" name="pertanyaanPemantik" placeholder="Pertanyaan pancingan..." />
                </div>
              )}
            </div>

            {/* Accordion 3: Kegiatan Pembelajaran */}
            <div className="border rounded mb-2">
              <button 
                onClick={() => setActiveSection(activeSection === 'kegiatan' ? '' : 'kegiatan')}
                className="w-full text-left p-3 bg-gray-50 font-semibold flex justify-between hover:bg-gray-100"
              >
                3. Kegiatan Pembelajaran <span>{activeSection === 'kegiatan' ? '▼' : '▶'}</span>
              </button>
              {activeSection === 'kegiatan' && (
                <div className="p-3 bg-white">
                  <InputArea label="Pendahuluan" name="kegiatanPendahuluan" rows={4} placeholder="- Guru memberi salam&#10;- Berdoa bersama&#10;- Apersepsi" />
                  <InputArea label="Kegiatan Inti" name="kegiatanInti" rows={6} placeholder="- Guru menjelaskan materi&#10;- Siswa berdiskusi&#10;- Presentasi kelompok" />
                  <InputArea label="Penutup" name="kegiatanPenutup" rows={4} placeholder="- Refleksi&#10;- Doa penutup" />
                </div>
              )}
            </div>

            {/* Accordion 4: Asesmen */}
            <div className="border rounded mb-2">
              <button 
                onClick={() => setActiveSection(activeSection === 'asesmen' ? '' : 'asesmen')}
                className="w-full text-left p-3 bg-gray-50 font-semibold flex justify-between hover:bg-gray-100"
              >
                4. Asesmen / Penilaian <span>{activeSection === 'asesmen' ? '▼' : '▶'}</span>
              </button>
              {activeSection === 'asesmen' && (
                <div className="p-3 bg-white">
                  <InputArea label="Rencana Asesmen" name="asesmen" placeholder="Tes tertulis, Observasi sikap, dll." />
                </div>
              )}
            </div>

          </div>
        </div>

        {/* KOLOM KANAN: PREVIEW DOKUMEN (Print Area) */}
        <div className="lg:col-span-8">
          <div className="print-area bg-white shadow-2xl p-10 min-h-[29.7cm] w-full mx-auto text-black leading-relaxed">
            
            {/* HEADER DOKUMEN */}
            <div className="text-center border-b-4 border-double border-black pb-4 mb-6">
              <h1 className="text-2xl font-bold uppercase tracking-wide">Modul Ajar Kurikulum Merdeka</h1>
              <h2 className="text-xl font-semibold uppercase">{rppData.sekolah || '[Nama Sekolah]'}</h2>
              <p className="text-sm mt-1">Tahun Pelajaran {rppData.tahun} / {rppData.tahun + 1}</p>
            </div>

            {/* A. INFORMASI UMUM */}
            <div className="mb-6">
              <h3 className="font-bold text-lg uppercase bg-gray-200 p-1 border border-gray-400 mb-3">A. Informasi Umum</h3>
              <table className="w-full text-sm border-collapse border border-gray-400">
                <tbody>
                  <tr>
                    <td className="border border-gray-400 p-2 font-semibold w-1/4 bg-gray-50">Penyusun</td>
                    <td className="border border-gray-400 p-2 w-1/4">{rppData.penyusun}</td>
                    <td className="border border-gray-400 p-2 font-semibold w-1/4 bg-gray-50">Fase / Kelas</td>
                    <td className="border border-gray-400 p-2 w-1/4">{rppData.fase} / {rppData.kelas}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-2 font-semibold bg-gray-50">Mata Pelajaran</td>
                    <td className="border border-gray-400 p-2">{rppData.mapel}</td>
                    <td className="border border-gray-400 p-2 font-semibold bg-gray-50">Alokasi Waktu</td>
                    <td className="border border-gray-400 p-2">{rppData.alokasiWaktu}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-2 font-semibold bg-gray-50">Elemen / Topik</td>
                    <td className="border border-gray-400 p-2" colSpan="3">{rppData.elemen}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* B. KOMPONEN INTI */}
            <div className="mb-6">
              <h3 className="font-bold text-lg uppercase bg-gray-200 p-1 border border-gray-400 mb-3">B. Komponen Inti</h3>
              
              <div className="mb-4">
                <h4 className="font-bold text-md underline mb-1">1. Tujuan Pembelajaran</h4>
                <p className="whitespace-pre-wrap text-justify text-sm">{rppData.tujuanPembelajaran || '-'}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-bold text-md underline mb-1">2. Pemahaman Bermakna</h4>
                <p className="whitespace-pre-wrap text-justify text-sm">{rppData.pemahamanBermakna || '-'}</p>
              </div>

              <div className="mb-4">
                <h4 className="font-bold text-md underline mb-1">3. Pertanyaan Pemantik</h4>
                <p className="whitespace-pre-wrap text-justify text-sm">{rppData.pertanyaanPemantik || '-'}</p>
              </div>
            </div>

            {/* C. KEGIATAN PEMBELAJARAN */}
            <div className="mb-6">
              <h3 className="font-bold text-lg uppercase bg-gray-200 p-1 border border-gray-400 mb-3">C. Kegiatan Pembelajaran</h3>
              
              <table className="w-full text-sm border-collapse border border-gray-400">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-400 p-2 w-1/4">Tahapan</th>
                    <th className="border border-gray-400 p-2">Kegiatan</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-400 p-2 font-bold align-top">Pendahuluan</td>
                    <td className="border border-gray-400 p-2 whitespace-pre-wrap">{rppData.kegiatanPendahuluan || '-'}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-2 font-bold align-top">Kegiatan Inti</td>
                    <td className="border border-gray-400 p-2 whitespace-pre-wrap">{rppData.kegiatanInti || '-'}</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 p-2 font-bold align-top">Penutup</td>
                    <td className="border border-gray-400 p-2 whitespace-pre-wrap">{rppData.kegiatanPenutup || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* D. ASESMEN */}
            <div className="mb-8">
              <h3 className="font-bold text-lg uppercase bg-gray-200 p-1 border border-gray-400 mb-3">D. Asesmen</h3>
              <p className="whitespace-pre-wrap text-justify text-sm border border-gray-400 p-3 min-h-[60px]">
                {rppData.asesmen || '-'}
              </p>
            </div>

            {/* TANDA TANGAN */}
            <div className="flex justify-between mt-12 px-8 break-inside-avoid">
              <div className="text-center">
                <p>Mengetahui,</p>
                <p>Kepala Sekolah</p>
                <br /><br /><br />
                <p className="font-bold underline">( .................................... )</p>
                <p className="text-xs">NIP. ...........................</p>
              </div>
              <div className="text-center">
                <p>Guru Mata Pelajaran</p>
                <br /><br /><br /><br />
                <p className="font-bold underline">{rppData.penyusun || '( .................................... )'}</p>
                <p className="text-xs">NIP. ...........................</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default App
