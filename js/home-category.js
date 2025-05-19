const categories = [
{ name: "DuffleBags", id: "dufflebags" },
{ name: "Backpacks", id: "backpacks" },
{ name: "TravelPacks", id: "travelpacks" },
];

const categoryDivs = document.querySelectorAll(".cat-z");

categoryDivs.forEach((div, index) => {
if (categories[index]) {
const h1 = div.querySelector("h1");
h1.innerText = categories[index].name;


div.dataset.categoryId = categories[index].id;

div.style.cursor = "pointer";
div.addEventListener("click", () => {
  window.location.href = `category.html?category=${categories[index].id}`;
});


}
});
