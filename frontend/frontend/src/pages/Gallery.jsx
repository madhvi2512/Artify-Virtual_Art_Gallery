import "./Gallery.css";

const artworks = [
  {
    id: 1,
    title: "Artwork One",
    image: "/Images/art1.jpg",
  },
  {
    id: 2,
    title: "Artwork Two",
    image: "/Images/art2.jpg",
  },
  {
    id: 3,
    title: "Artwork Three",
    image: "/Images/art3.jpg",
  },
  {
    id: 4,
    title: "Artwork Four",
    image: "/Images/art4.jpg",
  },
];

const Gallery = () => {
  return (
    <section className="gallery">
      <h1 className="gallery-title">Art Collection</h1>

      <div className="gallery-grid">
        {artworks.map((art) => (
          <div key={art.id} className="gallery-card">
            <img src={art.image} alt={art.title} />
            <div className="overlay">
              <h3>{art.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Gallery;