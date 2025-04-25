document.addEventListener("DOMContentLoaded", () => {
  fetch("templates/header.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("header-include").innerHTML = data;
    });

  fetch("templates/footer.html")
    .then((res) => res.text())
    .then((data) => {
      document.getElementById("footer-include").innerHTML = data;
    });
});