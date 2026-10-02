console.log("Welcome to Wonderland CTF 🐇");



function showHint(id, buttonElement) {
  const element = document.getElementById(id);
  if (element) {
    // Check if the page is set to French
    const isFrench = document.documentElement.lang.toLowerCase() === 'fr';
    
    // Toggle visibility
    if (element.style.opacity === "1") {
      element.style.opacity = "0";
      buttonElement.textContent = isFrench ? "Afficher l'indice" : "Show hint";
    } else {
      element.style.opacity = "1";
      buttonElement.textContent = isFrench ? "Masquer l'indice" : "Hide hint";
    }
  }
}