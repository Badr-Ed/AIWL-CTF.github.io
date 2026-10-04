console.log("Welcome to Wonderland CTF 🐇");



function showHint(id, buttonElement, event) {
  if (event) event.preventDefault();

  const element = document.getElementById(id);
  if (!element) return;

  const isVisible = element.style.opacity === "1";
  element.style.opacity = isVisible ? "0" : "1";
  buttonElement.classList.toggle('active', !isVisible);
}