document.addEventListener("DOMContentLoaded", () => {
  fetch("/views/templates/header.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("header-include").innerHTML = data;
    });

  fetch("/views/templates/footer.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("footer-include").innerHTML = data;
    });
});