const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Movie = require('../models/Movie')

dotenv.config()

const sampleMovies = [
  {
    title: "RRR",
    language: "Telugu",
    category: "Movie",
    genre: ["Action", "Drama"],
    year: 2022,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BODUwNDNjYzctODUxNy00ZTA2LWIyYTEtMDc5Y2E5ZjBmNTMzXkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample1/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample2/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample3/view" }
    ],
    description: "A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s.",
    fileSize: "2.8 GB",
    isTrending: true,
    isFeatured: true,
    downloadCount: 15420,
    isActive: true
  },
  {
    title: "Pushpa: The Rise",
    language: "Telugu",
    category: "Movie",
    genre: ["Action", "Thriller"],
    year: 2021,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMDc3Zjc4NjAtMTk5OC00MjQzLWFkYjYtMmQ0MTBhYjg0MGRkXkEyXkFqcGdeQXVyNzI0NzQyNTk@._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample4/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample5/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample6/view" }
    ],
    description: "A labourer named Pushpa makes enemies as he rises in the world of red sandalwood smuggling.",
    fileSize: "2.5 GB",
    isTrending: true,
    isFeatured: false,
    downloadCount: 23150,
    isActive: true
  },
  {
    title: "KGF Chapter 2",
    language: "Hindi",
    category: "Movie",
    genre: ["Action", "Drama"],
    year: 2022,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjI2Njg2ODQ0MF5BMl5BanBnXkFtZTgwNDc2NjA0MDI@._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample7/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample8/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample9/view" }
    ],
    description: "In the blood-soaked Kolar Gold Fields, Rocky's name strikes fear into his foes. While his allies look up to him, the government sees him as a threat to law and order.",
    fileSize: "3.1 GB",
    isTrending: true,
    isFeatured: true,
    downloadCount: 18900,
    isActive: true
  },
  {
    title: "Vikram",
    language: "Tamil",
    category: "Movie",
    genre: ["Action", "Thriller"],
    year: 2022,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMmJhYjBkMzgtZGIwMC00YTAzLWE4OGYtZGNkZmQ1YzVjOGRkXkEyXkFqcGdeQXVyMTEzNzg0Mjkx._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample10/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample11/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample12/view" }
    ],
    description: "A special investigator assigned a case of serial killings discovers the case is not what it seems to be, and leading down this path is only going to end in a war between everyone involved.",
    fileSize: "2.6 GB",
    isTrending: false,
    isFeatured: true,
    downloadCount: 12400,
    isActive: true
  },
  {
    title: "The Batman",
    language: "English",
    category: "Movie",
    genre: ["Action", "Thriller", "Drama"],
    year: 2022,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMDdmMTBiNTYtMDIzNi00NGVlLWIzMDYtZTk3MTQ3NGQxZGEwXkEyXkFqcGdeQXVyMzMwOTU5MDk@._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample13/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample14/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample15/view" }
    ],
    description: "When a sadistic serial killer begins murdering key political figures in Gotham, Batman is forced to investigate the city's hidden corruption and question his family's involvement.",
    fileSize: "3.2 GB",
    isTrending: false,
    isFeatured: false,
    downloadCount: 9800,
    isActive: true
  },
  {
    title: "Avengers: Endgame",
    language: "English",
    category: "Movie",
    genre: ["Action", "Sci-Fi", "Adventure"],
    year: 2019,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample16/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample17/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample18/view" }
    ],
    description: "After the devastating events of Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more in order to reverse Thanos' actions and restore balance to the universe.",
    fileSize: "4.1 GB",
    isTrending: false,
    isFeatured: false,
    downloadCount: 45200,
    isActive: true
  },
  {
    title: "Dangal",
    language: "Hindi",
    category: "Movie",
    genre: ["Drama", "Action"],
    year: 2016,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTQ4MzQzMzM2Ml5BMl5BanBnXkFtZTgwMTQ1NzU3MDI@._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample19/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample20/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample21/view" }
    ],
    description: "Former wrestler Mahavir Singh Phogat and his two wrestler daughters struggle towards glory at the Commonwealth Games in the face of societal oppression.",
    fileSize: "2.9 GB",
    isTrending: false,
    isFeatured: false,
    downloadCount: 32100,
    isActive: true
  },
  {
    title: "Master",
    language: "Tamil",
    category: "Movie",
    genre: ["Action", "Thriller"],
    year: 2021,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYzJkNzRkMjMtYTA3Ny00OGY1LTlhNmEtMGQ3MDczNzlmNjVjXkEyXkFqcGdeQXVyMTY1MzAyNjE4._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample22/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample23/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample24/view" }
    ],
    description: "An alcoholic professor is sent to a juvenile school, where he clashes with a gangster who uses the school children for criminal activities.",
    fileSize: "2.7 GB",
    isTrending: false,
    isFeatured: false,
    downloadCount: 15600,
    isActive: true
  },
  {
    title: "Spider-Man: No Way Home",
    language: "English",
    category: "Movie",
    genre: ["Action", "Sci-Fi", "Adventure"],
    year: 2021,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BZWMyYzFjYTYtNTRjYi00OGExLWE2YzgtOGRmYjAxZTU3NzBiXkEyXkFqcGdeQXVyMzQ0MzA0NTM@._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample25/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample26/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample27/view" }
    ],
    description: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear.",
    fileSize: "3.4 GB",
    isTrending: true,
    isFeatured: false,
    downloadCount: 28900,
    isActive: true
  },
  {
    title: "Ala Vaikunthapurramuloo",
    language: "Telugu",
    category: "Movie",
    genre: ["Action", "Comedy", "Drama"],
    year: 2020,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTBjM2ZmMzktMjY3OS00YjQ0LThiODctMjA3ZjIwZGY5MmJhXkEyXkFqcGdeQXVyNTgxODY5ODI@._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample28/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample29/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample30/view" }
    ],
    description: "A man is exchanged at birth with a millionaire's son. Years later, he discovers his true identity and seeks to reclaim his rightful place.",
    fileSize: "2.4 GB",
    isTrending: false,
    isFeatured: false,
    downloadCount: 19800,
    isActive: true
  },
  {
    title: "Money Heist - Season 1",
    language: "English",
    category: "Web Series",
    genre: ["Thriller", "Drama"],
    year: 2017,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNDJkYzY3MzMtMGFhYi00MmQ4LWJkNTgtZGNiZGZmN2Y2MjQ4XkEyXkFqcGdeQXVyMTEyMjM2NDc2._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample31/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample32/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample33/view" }
    ],
    description: "An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history - stealing 2.4 billion euros from the Royal Mint of Spain.",
    fileSize: "4.5 GB",
    isTrending: false,
    isFeatured: true,
    downloadCount: 12500,
    isActive: true
  },
  {
    title: "Squid Game - Season 1",
    language: "English",
    category: "Web Series",
    genre: ["Thriller", "Drama"],
    year: 2021,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYWE3MDVkN2EtNjQ5MS00ZDQ4LTliNzYtMjc2YWMzMDEwMTA3XkEyXkFqcGdeQXVyMTEzMTI1Mjk3._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample34/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample35/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample36/view" }
    ],
    description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
    fileSize: "5.2 GB",
    isTrending: true,
    isFeatured: true,
    downloadCount: 34200,
    isActive: true
  },
  {
    title: "Salaar: Part 1 - Ceasefire",
    language: "Telugu",
    category: "Movie",
    genre: ["Action", "Thriller"],
    year: 2023,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNmYzMWVjNzctM2JmYS00NzM3LWI2YTMtOTM0Y2E5ZGI5NzZmXkEyXkFqcGdeQXVyMTY1MzAyNjE4._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample49/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample50/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample51/view" }
    ],
    description: "The fate of a violently contested kingdom hangs on the fraught bond between two friends-turned-foes in this saga of power, bloodshed and betrayal.",
    fileSize: "3.0 GB",
    isTrending: true,
    isFeatured: true,
    downloadCount: 28400,
    isActive: true
  },
  {
    title: "Animal",
    language: "Hindi",
    category: "Movie",
    genre: ["Action", "Drama", "Thriller"],
    year: 2023,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNDQ5NTVjYjMtZjU1Zi00M2Y3LWI0MjktOTY5Y2NjNzY5MzQ0XkEyXkFqcGdeQXVyMTY1MzAyNjE4._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample52/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample53/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample54/view" }
    ],
    description: "A son's love for his father spirals into a dark obsession, leading him down a path of violence and destruction.",
    fileSize: "3.4 GB",
    isTrending: true,
    isFeatured: true,
    downloadCount: 31200,
    isActive: true
  },
  {
    title: "Leo",
    language: "Tamil",
    category: "Movie",
    genre: ["Action", "Thriller"],
    year: 2023,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BODQ0MmI1ZmQtY2Y0Zi00YjBjLWJmMjgtNzU0MjYyMDY5ZDNkXkEyXkFqcGdeQXVyMTY1MzAyNjE4._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample55/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample56/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample57/view" }
    ],
    description: "A cafe owner in Kashmir is forced to confront his violent past when his family is threatened by a gang of criminals.",
    fileSize: "2.9 GB",
    isTrending: true,
    isFeatured: false,
    downloadCount: 26700,
    isActive: true
  },
  {
    title: "Jawan",
    language: "Hindi",
    category: "Movie",
    genre: ["Action", "Thriller"],
    year: 2023,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BOWI5NmU3OTUtMjVlOC00YjBiLWEzYjE5ZWNlZmY5MmJkXkEyXkFqcGdeQXVyMTY1MzAyNjE4._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample58/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample59/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample60/view" }
    ],
    description: "A man is driven by a personal vendetta to rectify the wrongs in society, while keeping a promise made years ago.",
    fileSize: "3.2 GB",
    isTrending: true,
    isFeatured: false,
    downloadCount: 29800,
    isActive: true
  },
  {
    title: "Pathaan",
    language: "Hindi",
    category: "Movie",
    genre: ["Action", "Thriller"],
    year: 2023,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYTg2OTY0MDktMjEyMi00M2Y3LWI2ZDQtYjZkMjM3MWMxNzE0XkEyXkFqcGdeQXVyMTY1MzAyNjE4._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample61/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample62/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample63/view" }
    ],
    description: "An Indian spy battles against the leader of a gang of mercenaries who have a heinous plot for his homeland.",
    fileSize: "2.8 GB",
    isTrending: false,
    isFeatured: true,
    downloadCount: 25600,
    isActive: true
  },
  {
    title: "Oppenheimer",
    language: "English",
    category: "Movie",
    genre: ["Drama", "Thriller"],
    year: 2023,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample64/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample65/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample66/view" }
    ],
    description: "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
    fileSize: "3.8 GB",
    isTrending: false,
    isFeatured: true,
    downloadCount: 18900,
    isActive: true
  },
  {
    title: "Barbie",
    language: "English",
    category: "Movie",
    genre: ["Comedy", "Adventure"],
    year: 2023,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNjU3N2QxNzYtMjk1NC00MTc4LTk1NTQtMmUxNTYyMGIxMjY5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample67/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample68/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample69/view" }
    ],
    description: "Barbie suffers a crisis that leads her to question her world and her existence, leading her to venture into the real world.",
    fileSize: "2.9 GB",
    isTrending: false,
    isFeatured: false,
    downloadCount: 16700,
    isActive: true
  },
  {
    title: "The Family Man - Season 1",
    language: "Hindi",
    category: "Web Series",
    genre: ["Action", "Thriller", "Drama"],
    year: 2019,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMzRjZWVmMzItNTQwYS00NmRiLWE5NmMtZWRlMjExYjBlNjE0XkEyXkFqcGdeQXVyMTAyMTE1MDA1._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample70/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample71/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample72/view" }
    ],
    description: "A working man from the National Investigation Agency tries to protect the nation from terrorism, but he also needs to keep his family safe from his secret job.",
    fileSize: "4.2 GB",
    isTrending: false,
    isFeatured: true,
    downloadCount: 19800,
    isActive: true
  },
  {
    title: "Mirzapur - Season 1",
    language: "Hindi",
    category: "Web Series",
    genre: ["Action", "Crime", "Drama"],
    year: 2018,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTI2NjU0MjA0Ml5BMl5BanBnXkFtZTgwMjA0MTE0NjM@._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample73/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample74/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample75/view" }
    ],
    description: "A shocking incident at a wedding procession ignites a series of events entangling the lives of two families in the lawless city of Mirzapur.",
    fileSize: "3.8 GB",
    isTrending: false,
    isFeatured: false,
    downloadCount: 22300,
    isActive: true
  },
  {
    title: "Stranger Things - Season 1",
    language: "English",
    category: "Web Series",
    genre: ["Drama", "Horror", "Sci-Fi"],
    year: 2016,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjEzMDAxOTUyMV5BMl5BanBnXkFtZTgwNzAxMjYzOTE@._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample76/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample77/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample78/view" }
    ],
    description: "When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces in order to get him back.",
    fileSize: "4.5 GB",
    isTrending: false,
    isFeatured: false,
    downloadCount: 28900,
    isActive: true
  },
  {
    title: "Breaking Bad - Season 1",
    language: "English",
    category: "Web Series",
    genre: ["Crime", "Drama", "Thriller"],
    year: 2008,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMjhiMzgxZTctNDc1Ni00OTIxLTlhMTYtZTA3ZWFkODRkMmE2XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample79/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample80/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample81/view" }
    ],
    description: "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine in order to secure his family's future.",
    fileSize: "3.2 GB",
    isTrending: false,
    isFeatured: false,
    downloadCount: 35600,
    isActive: true
  },
  {
    title: "Avatar: The Way of Water",
    language: "English",
    category: "Movie",
    genre: ["Action", "Sci-Fi", "Adventure"],
    year: 2022,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BYjhiNjBlODctY2ZiOC00YjVlLWFlNzAtNTVhNzM1YjI1NzU5XkEyXkFqcGdeQXVyMjQxNTE1MDA@._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample82/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample83/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample84/view" }
    ],
    description: "Jake Sully lives with his newfound family formed on the extrasolar moon Pandora. Once a familiar threat returns to finish what was previously started, Jake must work with Neytiri and the army of the Na'vi race to protect their home.",
    fileSize: "4.8 GB",
    isTrending: false,
    isFeatured: true,
    downloadCount: 21400,
    isActive: true
  },
  {
    title: "Top Gun: Maverick",
    language: "English",
    category: "Movie",
    genre: ["Action", "Drama"],
    year: 2022,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BOWQwOTA1ZDQtNzk3Yi00ZDFmLThkZTctOGY0ZGMwNzM2ZGY5XkEyXkFqcGdeQXVyODE5NzE3OTE@._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample85/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample86/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample87/view" }
    ],
    description: "After thirty years, Maverick is still pushing the envelope as a top naval aviator, but must confront ghosts of his past when he leads TOP GUN's elite graduates on a mission that demands the ultimate sacrifice.",
    fileSize: "3.6 GB",
    isTrending: false,
    isFeatured: false,
    downloadCount: 19800,
    isActive: true
  },
  {
    title: "Kantara",
    language: "Kannada",
    category: "Movie",
    genre: ["Action", "Drama", "Thriller"],
    year: 2022,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BNjVlMTYyNTItMjY0ZS00ZWYwLWFiM2YtOTIzYWVhY2E3Y2Q4XkEyXkFqcGdeQXVyMTEzNzg0Mjkx._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample88/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample89/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample90/view" }
    ],
    description: "When greed paves the way for betrayal, scheming and murder, a young tribal reluctantly dons the traditions of his ancestors to seek justice.",
    fileSize: "2.5 GB",
    isTrending: false,
    isFeatured: false,
    downloadCount: 18200,
    isActive: true
  },
  {
    title: "Sita Ramam",
    language: "Telugu",
    category: "Movie",
    genre: ["Romance", "Drama"],
    year: 2022,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BN2Q1Y2JkZjMtZjEyMy00Y2ZlLWI3YjAtM2U0YzN2Y2U0YjE0XkEyXkFqcGdeQXVyMTY1MzAyNjE4._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample91/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample92/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample93/view" }
    ],
    description: "An orphan soldier, Lieutenant Ram's life changes, after he gets a letter from a girl named Sita. He meets her and love blossoms between them. When he comes back to his camp in Kashmir, he sends a letter to Sita which won't reach her.",
    fileSize: "2.3 GB",
    isTrending: false,
    isFeatured: false,
    downloadCount: 16500,
    isActive: true
  },
  {
    title: "Ponniyin Selvan: Part I",
    language: "Tamil",
    category: "Movie",
    genre: ["Action", "Drama", "Adventure"],
    year: 2022,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMzM0YjM0YjktZjY3NC00NjE0LWJkYjEtMmE5YjY5YjY5YjY5XkEyXkFqcGdeQXVyMTY1MzAyNjE4._V1_.jpg",
    downloadLinks: [
      { quality: "480p", url: "https://drive.google.com/file/d/sample94/view" },
      { quality: "720p", url: "https://drive.google.com/file/d/sample95/view" },
      { quality: "1080p", url: "https://drive.google.com/file/d/sample96/view" }
    ],
    description: "Vandiyathevan sets out to cross the Chola land to deliver a message from the Crown Prince Adithya Karikalan. Meanwhile, Kundavai attempts to establish political peace as vassals and petty chieftains plot against the throne.",
    fileSize: "2.9 GB",
    isTrending: false,
    isFeatured: false,
    downloadCount: 14200,
    isActive: true
  }
]

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/movie-download-db')
    console.log('Connected to MongoDB')

    // Clear existing data
    await Movie.deleteMany({})
    console.log('Cleared existing movies')

    // Insert sample data
    const result = await Movie.insertMany(sampleMovies)
    console.log(`Successfully seeded ${result.length} movies`)

    // Close connection
    await mongoose.connection.close()
    console.log('Database connection closed')
    
    process.exit(0)
  } catch (error) {
    console.error('Error seeding database:', error)
    process.exit(1)
  }
}

seedDatabase()
