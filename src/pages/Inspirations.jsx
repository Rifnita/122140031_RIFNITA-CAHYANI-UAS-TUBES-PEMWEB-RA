import React, { useState } from 'react';

const inspirations = [
  {
    id: 1,
    title: 'Outfit Chill Hangout',
    desc: 'Cocok dipakai saat hangout bareng teman, pacar, htsan :D',
    image: 'https://via.placeholder.com/400x250?text=Main',
    tag: 'main',
  },
  {
    id: 2,
    title: 'Outfit Simpel ke Kampus',
    desc: 'Nyaman dan tetap stylish untuk aktivitas sehari-hari di kampus.',
    image: 'https://via.placeholder.com/400x250?text=Kampus',
    tag: 'kampus',
  },
  {
    id: 3,
    title: 'Outfit Semi-Formal Meeting',
    desc: 'Look clean untuk event formal tapi tetap santai.',
    image: 'https://via.placeholder.com/400x250?text=Meeting',
    tag: 'meeting',
  },
  {
    id: 4,
    title: 'Outfit Olahraga',
    desc: 'Yang nyaman aja biar semangat olahraganya!',
    image: 'https://via.placeholder.com/400x250?text=Olahraga',
    tag: 'olahraga',
  },
  {
    id: 5,
    title: 'Outfit Ngedate',
    desc: 'Cocok banget nih buat dinner sama doi.',
    image: 'https://via.placeholder.com/400x250?text=Pesta',
    tag: 'pesta',
  },
];

export default function Inspirations() {
  const [searchTag, setSearchTag] = useState('');

  const filtered = inspirations.filter((inspo) =>
    inspo.tag.toLowerCase().includes(searchTag.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-nude p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Inspirasi Outfit</h1>
      <p className="text-gray-600 mb-6">Rekomendasi tampilan pakaian berdasarkan aktivitas harianmu.</p>

      <div className="mb-8">
        <input
          type="text"
          placeholder="Cari outfit untuk... (misal: kampus, pesta, olahraga)"
          value={searchTag}
          onChange={(e) => setSearchTag(e.target.value)}
          className="w-full md:w-1/2 p-3 border rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((inspo) => (
          <div key={inspo.id} className="bg-white rounded-xl shadow-md overflow-hidden">
            <img
              src={inspo.image}
              alt={inspo.title}
              className="w-full h-56 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">{inspo.title}</h2>
              <p className="text-gray-600 text-sm">{inspo.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> efaa580b454fae0aebd62b00175b0703e383c994
