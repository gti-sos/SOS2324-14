// const fs = require('fs');
// const Papa = require('papaparse');
const movies_data = [
  {
    "index": 0,
    "budget": 237000000,
    "genres": "Action Adventure Fantasy Science Fiction",
    "id": 19995,
    "keywords": "culture clash future space war space colony society",
    "original_language": "en",
    "original_title": "Avatar",
    "overview": "In the 22nd century, a paraplegic Marine is dispatched to the moon Pandora on a unique mission, but becomes torn between following orders and protecting an alien civilization.",
    "popularity": 150.437577,
    "production_companies": [
      {
        "name": "Ingenious Film Partners",
        "id": 289
      },
      {
        "name": "Twentieth Century Fox Film Corporation",
        "id": 306
      },
      {
        "name": "Dune Entertainment",
        "id": 444
      },
      {
        "name": "Lightstorm Entertainment",
        "id": 574
      }
    ],
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      },
      {
        "iso_3166_1": "GB",
        "name": "United Kingdom"
      }
    ],
    "release_date": "2009-12-10",
    "revenue": 2787965087,
    "runtime": 162,
    "status": "Released",
    "tagline": "Enter the World of Pandora.",
    "title": "Avatar",
    "vote_average": 7.2,
    "vote_count": 11800,
    "director": "James Cameron"
  },
  {
    "index": 1,
    "budget": 300000000,
    "genres": "Adventure Fantasy Action",
    "id": 285,
    "keywords": "ocean drug abuse exotic island east india trading company love of one's life",
    "original_language": "en",
    "original_title": "Pirates of the Caribbean: At World's End",
    "overview": "Captain Barbossa, long believed to be dead, has come back to life and is headed to the edge of the Earth with Will Turner and Elizabeth Swann. But nothing is quite as it seems.",
    "popularity": 139.082615,
    "production_companies": [
      {
        "name": "Walt Disney Pictures",
        "id": 2
      },
      {
        "name": "Jerry Bruckheimer Films",
        "id": 130
      },
      {
        "name": "Second Mate Productions",
        "id": 19936
      }
    ],
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "release_date": "2007-05-19",
    "revenue": 961000000,
    "runtime": 169,
    "status": "Released",
    "tagline": "At the end of the world, the adventure begins.",
    "title": "Pirates of the Caribbean: At World's End",
    "vote_average": 6.9,
    "vote_count": 4500,
    "director": "Gore Verbinski"
  },
  {
    "index": 2,
    "budget": 245000000,
    "genres": "Action Adventure Crime",
    "id": 206647,
    "keywords": "spy based on novel secret agent sequel mi6",
    "original_language": "en",
    "original_title": "Spectre",
    "overview": "A cryptic message from Bond’s past sends him on a trail to uncover a sinister organization. While M battles political forces to keep the secret service alive, Bond peels back the layers of deceit to reveal the terrible truth behind SPECTRE.",
    "popularity": 107.37678799999999,
    "production_companies": [
      {
        "name": "Columbia Pictures",
        "id": 5
      },
      {
        "name": "Danjaq",
        "id": 10761
      },
      {
        "name": "B24",
        "id": 69434
      }
    ],
    "production_countries": [
      {
        "iso_3166_1": "GB",
        "name": "United Kingdom"
      },
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "release_date": "2015-10-26",
    "revenue": 880674609,
    "runtime": 148,
    "status": "Released",
    "tagline": "A Plan No One Escapes",
    "title": "Spectre",
    "vote_average": 6.3,
    "vote_count": 4466,
    "director": "Sam Mendes"
  },
  {
    "index": 3,
    "budget": 250000000,
    "genres": "Action Crime Drama Thriller",
    "id": 49026,
    "keywords": "dc comics crime fighter terrorist secret identity burglar",
    "original_language": "en",
    "original_title": "The Dark Knight Rises",
    "overview": "Following the death of District Attorney Harvey Dent, Batman assumes responsibility for Dent's crimes to protect the late attorney's reputation and is subsequently hunted by the Gotham City Police Department. Eight years later, Batman encounters the mysterious Selina Kyle and the villainous Bane, a new terrorist leader who overwhelms Gotham's finest. The Dark Knight resurfaces to protect a city that has branded him an enemy.",
    "popularity": 112.31295,
    "production_companies": [
      {
        "name": "Legendary Pictures",
        "id": 923
      },
      {
        "name": "Warner Bros.",
        "id": 6194
      },
      {
        "name": "DC Entertainment",
        "id": 9993
      },
      {
        "name": "Syncopy",
        "id": 9996
      }
    ],
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "release_date": "2012-07-16",
    "revenue": 1084939099,
    "runtime": 165,
    "status": "Released",
    "tagline": "The Legend Ends",
    "title": "The Dark Knight Rises",
    "vote_average": 7.6,
    "vote_count": 9106,
    "director": "Christopher Nolan"
  },
  {
    "index": 4,
    "budget": 260000000,
    "genres": "Action Adventure Science Fiction",
    "id": 49529,
    "keywords": "based on novel mars medallion space travel princess",
    "original_language": "en",
    "original_title": "John Carter",
    "overview": "John Carter is a war-weary, former military captain who's inexplicably transported to the mysterious and exotic planet of Barsoom (Mars) and reluctantly becomes embroiled in an epic conflict. It's a world on the brink of collapse, and Carter rediscovers his humanity when he realizes the survival of Barsoom and its people rests in his hands.",
    "popularity": 43.926995,
    "production_companies": [
      {
        "name": "Walt Disney Pictures",
        "id": 2
      }
    ],
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "release_date": "2012-03-07",
    "revenue": 284139100,
    "runtime": 132,
    "status": "Released",
    "tagline": "Lost in our world, found in another.",
    "title": "John Carter",
    "vote_average": 6.1,
    "vote_count": 2124,
    "director": "Andrew Stanton"
  },
  {
    "index": 5,
    "budget": 258000000,
    "genres": "Fantasy Action Adventure",
    "id": 559,
    "keywords": "dual identity amnesia sandstorm love of one's life forgiveness",
    "original_language": "en",
    "original_title": "Spider-Man 3",
    "overview": "The seemingly invincible Spider-Man goes up against an all-new crop of villain – including the shape-shifting Sandman. While Spider-Man’s superpowers are altered by an alien organism, his alter ego, Peter Parker, deals with nemesis Eddie Brock and also gets caught up in a love triangle.",
    "popularity": 115.69981399999999,
    "production_companies": [
      {
        "name": "Columbia Pictures",
        "id": 5
      },
      {
        "name": "Laura Ziskin Productions",
        "id": 326
      },
      {
        "name": "Marvel Enterprises",
        "id": 19551
      }
    ],
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "release_date": "2007-05-01",
    "revenue": 890871626,
    "runtime": 139,
    "status": "Released",
    "tagline": "The battle within.",
    "title": "Spider-Man 3",
    "vote_average": 5.9,
    "vote_count": 3576,
    "director": "Sam Raimi"
  },
  {
    "index": 6,
    "budget": 260000000,
    "genres": "Animation Family",
    "id": 38757,
    "keywords": "hostage magic horse fairy tale musical",
    "original_language": "en",
    "original_title": "Tangled",
    "overview": "When the kingdom's most wanted-and most charming-bandit Flynn Rider hides out in a mysterious tower, he's taken hostage by Rapunzel, a beautiful and feisty tower-bound teen with 70 feet of magical, golden hair. Flynn's curious captor, who's looking for her ticket out of the tower where she's been locked away for years, strikes a deal with the handsome thief and the unlikely duo sets off on an action-packed escapade, complete with a super-cop horse, an over-protective chameleon and a gruff gang of pub thugs.",
    "popularity": 48.681969,
    "production_companies": [
      {
        "name": "Walt Disney Pictures",
        "id": 2
      },
      {
        "name": "Walt Disney Animation Studios",
        "id": 6125
      }
    ],
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "release_date": "2010-11-24",
    "revenue": 591794936,
    "runtime": 100,
    "status": "Released",
    "tagline": "They're taking adventure to new lengths.",
    "title": "Tangled",
    "vote_average": 7.4,
    "vote_count": 3330,
    "director": "Byron Howard"
  },
  {
    "index": 7,
    "budget": 280000000,
    "genres": "Action Adventure Science Fiction",
    "id": 99861,
    "keywords": "marvel comic sequel superhero based on comic book vision",
    "original_language": "en",
    "original_title": "Avengers: Age of Ultron",
    "overview": "When Tony Stark tries to jumpstart a dormant peacekeeping program, things go awry and Earth’s Mightiest Heroes are put to the ultimate test as the fate of the planet hangs in the balance. As the villainous Ultron emerges, it is up to The Avengers to stop him from enacting his terrible plans, and soon uneasy alliances and unexpected action pave the way for an epic and unique global adventure.",
    "popularity": 134.27922900000002,
    "production_companies": [
      {
        "name": "Marvel Studios",
        "id": 420
      },
      {
        "name": "Prime Focus",
        "id": 15357
      },
      {
        "name": "Revolution Sun Studios",
        "id": 76043
      }
    ],
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "release_date": "2015-04-22",
    "revenue": 1405403694,
    "runtime": 141,
    "status": "Released",
    "tagline": "A New Age Has Come.",
    "title": "Avengers: Age of Ultron",
    "vote_average": 7.3,
    "vote_count": 6767,
    "director": "Joss Whedon"
  },
  {
    "index": 8,
    "budget": 250000000,
    "genres": "Adventure Fantasy Family",
    "id": 767,
    "keywords": "witch magic broom school of witchcraft wizardry",
    "original_language": "en",
    "original_title": "Harry Potter and the Half-Blood Prince",
    "overview": "As Harry begins his sixth year at Hogwarts, he discovers an old book marked as 'Property of the Half-Blood Prince', and begins to learn more about Lord Voldemort's dark past.",
    "popularity": 98.885637,
    "production_companies": [
      {
        "name": "Warner Bros.",
        "id": 6194
      },
      {
        "name": "Heyday Films",
        "id": 7364
      }
    ],
    "production_countries": [
      {
        "iso_3166_1": "GB",
        "name": "United Kingdom"
      },
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "release_date": "2009-07-07",
    "revenue": 933959197,
    "runtime": 153,
    "status": "Released",
    "tagline": "Dark Secrets Revealed",
    "title": "Harry Potter and the Half-Blood Prince",
    "vote_average": 7.4,
    "vote_count": 5293,
    "director": "David Yates"
  },
  {
    "index": 9,
    "budget": 250000000,
    "genres": "Action Adventure Fantasy",
    "id": 209112,
    "keywords": "dc comics vigilante superhero based on comic book revenge",
    "original_language": "en",
    "original_title": "Batman v Superman: Dawn of Justice",
    "overview": "Fearing the actions of a god-like Super Hero left unchecked, Gotham City’s own formidable, forceful vigilante takes on Metropolis’s most revered, modern-day savior, while the world wrestles with what sort of hero it really needs. And with Batman and Superman at war with one another, a new threat quickly arises, putting mankind in greater danger than it’s ever known before.",
    "popularity": 155.790452,
    "production_companies": [
      {
        "name": "DC Comics",
        "id": 429
      },
      {
        "name": "Atlas Entertainment",
        "id": 507
      },
      {
        "name": "Warner Bros.",
        "id": 6194
      },
      {
        "name": "DC Entertainment",
        "id": 9993
      },
      {
        "name": "Cruel & Unusual Films",
        "id": 9995
      },
      {
        "name": "RatPac-Dune Entertainment",
        "id": 41624
      }
    ],
    "production_countries": [
      {
        "iso_3166_1": "US",
        "name": "United States of America"
      }
    ],
    "release_date": "2016-03-23",
    "revenue": 873260194,
    "runtime": 151,
    "status": "Released",
    "tagline": "Justice or revenge",
    "title": "Batman v Superman: Dawn of Justice",
    "vote_average": 5.7,
    "vote_count": 7004,
    "director": "Zack Snyder"
  }
]

console.log(movies_data.slice(0, 3))

// Lee el archivo CSV
// let csvData = fs.readFileSync('./Enrique/movies_dataset.csv', 'utf8');

// // Inicializa un array para almacenar los datos
// let movies = [];

// // Parsea el CSV
// Papa.parse(csvData, {
//   header: true,
//   dynamicTyping: true,
//   complete: (result) => {
//     // Obtiene los datos parseados
//     const data = result.data;

//     // Almacena los datos en el array
//     movies.push(...data);

//     // Muestra los 3 primeros datos del array
//     console.log(movies.slice(0,3));
//   }
// });

// let movies_reduce = []
// movies_reduce.push(movies.splice(0,11))

function presupuestoMedio() {
  // Creo el array presupuestos donde estarán el budget de cada pelicula 
  let presupuestos = new Array();
  for (let i = 0; i < movies_data.length; i++){
    //presupuestos.push(parseInt(movies[i].budget))
    presupuestos.push(movies_data[i].budget)
  }
  // Calculamos la suma de los presupuestos con reduce
  let sumaPresupuestos = presupuestos.reduce((a,b) => a + b, 0)
  // Obtenemos el total de peliculas para hacer la media
  let totalPeliculas = presupuestos.length
  
  return sumaPresupuestos/totalPeliculas
}

let averageBudget = presupuestoMedio();
let movie = {
  "index": 10,
  "badget": 237050000,
  "genres": "Action Adventure Fantasy Science Fiction",
  "id": 199969,
  "keywords": "culture clash future space war space colony society",
  "original_language": "es",
  "original_title": "Avator",
  "overview": "When you dont expected came the new mdfk hero, its a blue thor? No its the supreme thor.",
  "popularity": 0.000,
  "production_companies": [
    {
      "name": "Ingenious Film Partners",
      "id": 289
    },
    {
      "name": "Twentieth Century Fox Film Corporation",
      "id": 306
    },
    {
      "name": "Dune Entertainment",
      "id": 444
    }
  ],
  "production_countries": [
    {
      "iso_3166_1": "US",
      "name": "United States of America"
    },
    {
      "iso_3166_1": "GB",
      "name": "United Kingdom"
    }
  ],
  "release_date": "2010-12-10",
  "revenue": 100,
  "runtime": 30,
  "status": "Released",
  "tagline": "Enter the World of Pedrolas.",
  "title": "Antavor",
  "vote_average": 2.2,
  "vote_count": 5,
  "director": "Joma Cameron"
}
console.log(`El presupuesto medio es ${Math.round(averageBudget)}€`);
 
//module.exports = presupuestoMedio
module.exports = movies_data
let comprueba = []
console.log(Object.keys(movies_data)[7])
console.log(Object.keys(movie)[0])
console.log(Object(movies_data[0]).budget)
console.log(movies_data[0].budget)
movies_data[0].budget = 100
console.log(movies_data[0].budget)
console.log(movies_data.find(objeto => objeto.original_title === "Avatar"))
if (movies_data.find(objeto => objeto.original_title === "Avatar")) {
  console.log("Lo tenemos")
} else {
  console.log("No tenemos")
}

let camposOriginal = Object.keys(movies_data[0]);
//console.log(camposOriginal.length)
for(let i=0; i<Object.keys(movie).length;i++) { //(let campo in Object.keys(movie)){
  // Para cada campo dentro de cada nueva pelicula añadida en el post, comprueba si todos los campos son correctos
  //console.log(Object.keys(movie)[i])
  comprueba.push(camposOriginal.includes(Object.keys(movie)[i]));
}
//console.log(comprueba)
//console.log(comprueba.reduce((a,b) => a && b))