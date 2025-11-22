export default function Home() {

  const demoArticles = [
    {
      id: "1",
      title: "AI Revolution begins",
      description: "A massive shift happening in AI industry.",
      image: "https://picsum.photos/400/200?1",
      category: "AI",
      date: "Today"
    },
    {
      id: "2",
      title: "iPhone 17 leaked!",
      description: "Crazy design changes spotted",
      image: "https://picsum.photos/400/200?2",
      category: "Tech",
      date: "Yesterday"
    },
    {
      id: "3",
      title: "India won finals!",
      description: "Historic win! 5 wicket victory",
      image: "https://picsum.photos/400/200?3",
      category: "Sports",
      date: "2 days ago"
    },
  ];

  return (
    <div style={{padding:"20px", color:"white"}}>
      <h1 style={{marginBottom:"15px"}}>Top Stories 🔥</h1>

      {demoArticles.map(item => (
        <div 
          key={item.id}
          style={{
            background:"#222",
            padding:"15px",
            borderRadius:"10px",
            marginBottom:"20px"
          }}
        >
          <img 
            src={item.image} 
            style={{width:"100%", borderRadius:"8px"}} 
          />

          <h2 style={{marginTop:"10px"}}>{item.title}</h2>

          <p style={{opacity:.7}}>{item.description}</p>

          <small style={{opacity:.5}}>
            {item.category} • {item.date}
          </small>
        </div>
      ))}

    </div>
  );
}
