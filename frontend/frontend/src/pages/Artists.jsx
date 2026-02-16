import "./Artists.css";

const artists = [
  {
    id: 1,
    name: "Aarav Mehta",
    specialty: "Abstract Expressionism",
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d"
  },
  {
    id: 2,
    name: "Meera Kapoor",
    specialty: "Modern Landscape",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330"
  },
  {
    id: 3,
    name: "Rohan Desai",
    specialty: "Surrealism",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
  },
  {
    id: 4,
    name: "Ishita Verma",
    specialty: "Contemporary Art",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
  }
];

const Artists = () => {
  return (
    <section className="artists">
      <h1 className="artists-title">Our Artists</h1>

      <div className="artists-grid">
        {artists.map((artist) => (
          <div key={artist.id} className="artist-card">
            <img src={artist.image} alt={artist.name} />
            <div className="artist-info">
              <h3>{artist.name}</h3>
              <p>{artist.specialty}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Artists;