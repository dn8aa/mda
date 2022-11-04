const API = "http://localhost:8000/products";
console.log(API);
console.log('fdshfjkdsfhlkh');
//* переменные для инпутов
let title = document.querySelector("#title");
let price = document.querySelector("#price");
let descr = document.querySelector("#descr");
let image = document.querySelector("#image");
let btnAdd = document.querySelector("#btn-add");

//* переменные для карточек
let list = document.querySelector("#products-list");

//* перменные для инпутовЖ редактирование товаров
let editTitle = document.querySelector("#edit-title");
let editPrice = document.querySelector("#edit-price");
let editDescr = document.querySelector("#edit-descr");
let editImage = document.querySelector("#edit-image");
let editSaveBtn = document.querySelector("#btn-save-edit");
let exampleModal = document.querySelector("#exampleModal");
//*search

let searchInp = document.querySelector("#search");
let searchValue = ""; //сюда мы будем сохранять значения которые мы вытащим из инпута

//* pagination
let currentPage = 1;
let pageTotalCount = 1;
let paginationList = document.querySelector(".pagination-list");
let prev = document.querySelector(".prev");
let next = document.querySelector(".next");

// console.log(editTitle, editPrice, editDescr, editImage, editSaveBtn, exampleModal);
// async bc cofe indifr id aynchro
btnAdd.addEventListener("click", async function () {
  //* формируем объект с данными из инпутов
  let obj = {
    title: title.value,
    price: price.value,
    descr: descr.value,
    image: image.value,
  };
  //* проверка на заполненность инпутовБ в случаеЮ если хотя бы один из инпутов пустой, выкидываем return, который останавливает весь код после него
  if (!obj.title.trim() || !obj.price.trim() || !obj.descr.trim()) {
    alert("заполните поле");
  }
  await fetch(API, {
    method: "POST", //укащываем метод
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });
  //* очищаем инпуты после добавления
  title.value = "";
  price.value = "";
  descr.value = "";
  image.value = "";
  //   console.log(obj);
  render();
});

//! отображение карточек товаров-------------------------------------------------
async function render() {
  let products = await fetch(
    `${API}?q=${searchValue}&_page=${currentPage}&_limit=6`
  ) //отправляем get запрос
    .then((res) => res.json()) //переводим в json формат
    .catch((err) => console.log(err)); //отлавливаем ошибку
  drawPaginationButtons();
  // console.log(products);
  list.innerHTML = "";
  products.forEach((element) => {
    // console.log(element);
    let newElem = document.createElement("div");
    newElem.id = element.id;

    newElem.innerHTML = `<div class="card m-5" style="width: 18rem;">
    <img src="${element.image}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${element.title}</h5>
      <p class="card-text">${element.descr}</p>
      <p class="card-text">$ ${element.price}</p>
      <a href="#" id="${element.id}" onclick="deleteProduct(${element.id})" class="btn btn-danger btn-delete">Delete</a>
      <a href="#" id="${element.id}" class="btn btn-dark btn-edit" data-bs-toggle="modal" data-bs-target="#exampleModal" >Edit</a>
    </div>
  </div>`;
    list.append(newElem);
  });
}

render();

//!pagination------------------------------------------
function drawPaginationButtons() {
  fetch(`${API}?q=${searchValue}`) //делаем запос на сервер чтьоы узнать общее колво родуктовр
    .then((res) => res.json())
    .then((data) => {
      pageTotalCount = Math.ceil(data.length / 6); // обзор колво продуктов делис на колво продуктов, которое отобрадается на одной странице
      //pagetotalcount = колво страниц которое у нас будет
      paginationList.innerHTML = "";
      for (let i = 1; i <= pageTotalCount; i++) {
        if (currentPage == i) {
          let page1 = document.createElement("li");
          page1.innerHTML = `<li class="page-item active"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page1);
        } else {
          let page1 = document.createElement("li");
          page1.innerHTML = `<li class="page-item"><a class="page-link page_number" href="#">${i}</a></li>`;
          paginationList.append(page1);
        }
      }
      //
      if (currentPage == 1) {
        prev.classList.add("disabled");
      } else {
        prev.classList.remove("disabled");
      }

      if (currentPage == pageTotalCount) {
        next.classList.add("disabled");
      } else {
        next.classList.remove("disabled");
      }
    });
}
//? кнопка переключения на предыдущую страницу
prev.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  render();
});
//? кнопка переключения на слудущую страницу
next.addEventListener("click", () => {
  if (currentPage >= pageTotalCount) {
    return;
  }
  currentPage++;
  render();
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("page_number")) {
    currentPage = e.target.innerText;
    render()
  }
});

//!удаление продукта------------------------------------------------------------
// document.addEventListener("click", (e) => {
//   console.log(e);
//   console.log(e.target);
//   if (e.target.classList.contains("btn-delete")) {
//     let id = e.target.id; //вытаскиваем id
//     fetch(`${API}/${id}`, {
//       method: "DELETE",
//     }).then(() => render());
//   }
// });
//* метод ниже предпочтительнее
function deleteProduct(id) {
  //   console.log(id);
  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => render());
}

//! edit-----------------------------------------------------------
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;
    //object response
    //promise
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editTitle.value = data.title;
        editPrice.value = data.price;
        editDescr.value = data.descr;
        editImage.value = data.image;

        editSaveBtn.setAttribute("id", data.id);
      });
  }
});

//! сохранение изменеий товара
editSaveBtn.addEventListener("click", function () {
  let id = this.id; // вытаскиваем из кнопки id и ложим ее в переменную
  let title = editTitle.value;
  let price = editPrice.value;
  let descr = editDescr;
  let image = editImage;

  if (!title || !descr || !price || !image) return; // проверка на заполненность полей в модальном окне

  let editedProduct = {
    title: title,
    price: price,
    descr: descr,
    image: image,
  };

  saveEdit(editedProduct, id);
});

function saveEdit(editedProduct, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedProduct),
  }).then(() => {
    render();
  });

  let modal = bootstrap.Modal.getInstance(exampleModal);
  modal.hide();
}

//!search starts here ---------------------------------
searchInp.addEventListener("input", () => {
  searchValue = searchInp.value; //Записывает значение из поисковика в переменную searchVal
  render();
});

