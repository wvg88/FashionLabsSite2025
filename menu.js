document.addEventListener("DOMContentLoaded", () => {
    // Get the menu toggle button and navigation menu
    const menuToggle = document.getElementById("menuToggle")
    const navMenu = document.getElementById("navMenu")
    const topButton = document.getElementById("backToTop");
  
    // Toggle menu when the plus icon is clicked
    menuToggle.addEventListener("click", function () {
      // Toggle active class on the plus icon to animate to X
      this.classList.toggle("active")
  
      // Toggle active class on the navigation menu to show/hide
      navMenu.classList.toggle("active")
  
      // Prevent scrolling of the screen content when menu is open
      const screen = document.querySelector(".screen")
      if (navMenu.classList.contains("active")) {
        screen.style.overflow = "hidden"
      } else {
        screen.style.overflow = "auto"
      }
    })
  
    // Close menu when clicking on a navigation link
    const navLinks = document.querySelectorAll(".nav-links a")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        menuToggle.classList.remove("active")
        navMenu.classList.remove("active")
  
        // Re-enable scrolling
        const screen = document.querySelector(".screen")
        screen.style.overflow = "auto"
      })
    })




   
  })
  