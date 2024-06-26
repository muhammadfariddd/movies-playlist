// $(".search-button").on("click", function () {
//   $.ajax({
//     url: "http://www.omdbapi.com/?apikey=8d74cc36&s=" + $(".input-keyword").val(),
//     success: (results) => {
//       const movies = results.Search;
//       let cards = "";
//       movies.forEach((m) => {
//         cards += showCards(m);
//       });
//       $(".movie-container").html(cards);

// // Ketika tombol detail di-klik
//       $(".modal-detail-button").on("click", function () {
//         $.ajax({
//           url: "http://www.omdbapi.com/?apikey=8d74cc36&i=" + $(this).data("imdbid"),
//           success: (m) => {
//             const moviesDetail = showMovieDetail(m);

//             $(".modal-body").html(moviesDetail);
//           },
//           error: (e) => {
//             console.log(e.responsText);
//           },
//         });
//       });
//     },
//     error: (e) => {
//       console.log(e.responsText);
//     },
//   });
// });

// // fetch
// const searchButton = document.querySelector(".search-button");
// searchButton.addEventListener("click", function () {
//   const inputKeyword = document.querySelector(".input-keyword");
//   fetch("http://www.omdbapi.com/?apikey=8d74cc36&s=" + inputKeyword.value)
//     .then((response) => response.json())
//     .then((response) => {
//       const movies = response.Search;
//       let cards = "";
//       movies.forEach((m) => (cards += showCards(m)));
//       const movieContainer = document.querySelector(".movie-container");
//       movieContainer.innerHTML = cards;

//       // ketika tombol detail di-klik
//       const modalDetailButton = document.querySelectorAll(".modal-detail-button");
//       modalDetailButton.forEach((btn) => {
//         btn.addEventListener("click", function () {
//           const imdid = this.dataset.imdbid;
//           fetch("http://www.omdbapi.com/?apikey=8d74cc36&i=" + imdid)
//             .then((response) => response.json())
//             .then((m) => {
//               const movieDetail = showMovieDetail(m);
//               const modalBody = document.querySelector(".modal-body");
//               modalBody.innerHTML = movieDetail;
//             });
//         });
//       });
//     });
// });

const searchButton = document.querySelector(".search-button");
searchButton.addEventListener("click", async function () {
  try {
    const inputKeyword = document.querySelector(".input-keyword");
    console.log("Keyword:", inputKeyword.value);
    const movies = await getMovies(inputKeyword.value);
    console.log("Movies:", movies);
    updateUI(movies);
  } catch (err) {
    console.log.error(err);
    alert(err.message);
  }
});

function getMovies(keyword) {
  return fetch("https://www.omdbapi.com/?apikey=8d74cc36&s=" + keyword)
    .then((response) => {
      console.log("Fetch response:", response);
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      return response.json();
    })
    .then((response) => {
      console.log("Fetch JSON:", response);
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      return response.Search;
    });
}

function updateUI(movies) {
  let cards = "";
  movies.forEach((m) => {
    console.log("Movie:", m);
    cards += showCards(m);
  });
  const movieContainer = document.querySelector(".movie-container");
  console.log("Cards HTML:", cards);
  movieContainer.innerHTML = cards;
}

// event binding
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("modal-detail-button")) {
    const imdbid = e.target.dataset.imdbid;
    try {
      const movieDetail = await getMovieDetail(imdbid);
      console.log("Movie Detail:", movieDetail);
      updateUIDetail(movieDetail);
    } catch (err) {
      console.log.error(err);
      alert(err.message);
    }
  }
});

function getMovieDetail(imdbid) {
  return fetch("https://www.omdbapi.com/?apikey=8d74cc36&i=" + imdbid)
    .then((response) => {
      console.log("Fetch detail response:", response); // Tambahkan log respons detail untuk debug
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then((m) => {
      console.log("Fetch detail JSON:", m); // Tambahkan log JSON detail untuk debug
      return m;
    });
}

function updateUIDetail(m) {
  const movieDetail = showMovieDetail(m);
  const modalBody = document.querySelector(".modal-body");
  console.log("Modal detail HTML:", movieDetail);
  modalBody.innerHTML = movieDetail;
}

function showCards(m) {
  return `<div class="col-md-4 my-3">
    <div class="card">
      <img src="${m.Poster}" class="card-img-top" />
      <div class="card-body">
        <h5 class="card-title">${m.Title}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
        <a href="#" class="btn btn-primary modal-detail-button" data-toggle="modal" data-target="#moviesDetailModal" data-imdbid=${m.imdbID}>Show Details</a>
      </div>
    </div>
  </div>`;
}

function showMovieDetail(m) {
  return `<div class="container-fluid">
            <div class="row">
              <div class="col-md-3">
                <img src="${m.Poster}" alt="" class="img-fluid" />
              </div>
              <div class="col-md">
                <ul class="list-group">
                  <li class="list-group-item"><h4>${m.Title} ${m.Year}</h4></li>
                  <li class="list-group-item"><strong>Direktor : </strong> ${m.Director}</li>
                  <li class="list-group-item">
                    <strong>Aktor : </strong>
                    ${m.Actors}
                  </li>
                  <li class="list-group-item"><strong>Writer : </strong>${m.Writer}</li>
                  <li class="list-group-item"><strong>Plot : </strong> <br>${m.Plot}</li>
                </ul>
              </div>
            </div>
          </div>`;
}
