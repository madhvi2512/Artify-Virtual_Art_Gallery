import { useEffect, useState } from "react";
import { api, getImageUrl } from "../utils/api";
import "./Artists.css";

const FALLBACK_ARTIST_IMAGE = "https://via.placeholder.com/600x600?text=Artist";
const artists = [
  {
    id: 1,
    name: "Aarav Mehta",
    specialty: "Abstract Expressionism",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d",
  },
  {
    id: 2,
    name: "Meera Kapoor",
    specialty: "Modern Landscape",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  },
  {
    id: 3,
    name: "Rohan Desai",
    specialty: "Surrealism",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e",
  },
  {
    id: 4,
    name: "Ishita Verma",
    specialty: "Contemporary Art",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
  },
];

const Artists = () => {
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        const res = await api.get("/api/users/artists");
        setArtists(res.data?.data || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load artists");
      }
    };

    fetchArtists();
  }, []);

  return (
    <section className="artists">
      <h1 className="artists-title">Our Artists</h1>

      {error ? <p className="artists-error">{error}</p> : null}
      <div className="artists-header">
        <h1 className="artists-title">
          Our <span>Artists</span>
        </h1>
        <p className="artists-subtitle">
          Meet the creative minds behind our gallery, each with a unique voice
          and visual language.
        </p>
      </div>

      <div className="artists-grid">
        {artists.length === 0 ? <p>No artists available yet.</p> : null}
        {artists.map((artist) => (
          <div key={artist._id} className="artist-card">
            <img
              src={getImageUrl(artist.profileImage) || FALLBACK_ARTIST_IMAGE}
              alt={artist.name}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = FALLBACK_ARTIST_IMAGE;
              }}
            />
            <div className="artist-info">
              <h3>{artist.name}</h3>
              <p>{artist.specialty || "Independent Artist"}</p>
              <small>{artist.email}</small>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Artists;

