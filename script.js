console.log("Hello World");

const projects = document.querySelector(".project");
console.log(projects);

const myName = document.getElementById("my-name");
myName.textContent = "Daniel is a mission-driven builder blending tech, empathy, and strategic curiosity to craft meaningful, user-first solutions across communities";
myName.style.color = "rgb(58, 60, 58)";


const project1 = document.getElementById("project1");
const project2 = document.getElementById("project2");

project1.addEventListener("click", function(){
    window.open("https://github.com");
})

project2.addEventListener("click", function(){
    window.open("https://github.com");
})

const linkedin = document.getElementById("linkedin-img");

linkedin.addEventListener("click", function(){
    window.open("https://linkedin.com/in/daniel-sam-wijaya")
})

const github = document.getElementById("github-img");

github.addEventListener("click", function(){
    window.open("https://github.com");
})

// Special Features
// 
// 
// 

function hideShow() {
    var content = document.getElementById("experiences_1");
    var button = document.getElementById("toggleButton");
    
    // Toggle content display
    if (content.style.display === "none") {
        content.style.display = "block";
        button.textContent = "Show Less"; // Change button text
    } else {
        content.style.display = "none";
        button.textContent = "Show More"; // Change button text
    }
}

// Initial setup to hide content and set button text on page load
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("experiences_1").style.display = "none"; // Hide content initially
    document.getElementById("toggleButton").textContent = "Show More"; // Set initial button text
});

function hideShow2(){
    var y = document.getElementById("content_project_2");
    if (y.style.display === "none"){
        y.style.display = "block";
    }
    else{
        y.style.display = "none";
    }
}

const testimonials = [
  { text: "Daniel is the kind of person who turns vision into action — thoughtful, creative, and driven.", author: "— Placeholder Name" },
  { text: "Working with Daniel felt seamless and inspiring. He asks the right questions.", author: "— Colleague A" },
  { text: "Daniel brings structure, care, and curiosity to every project.", author: "— Mentor B" }
];
let currentIndex = 0;
function showTestimonial(index) {
  const t = testimonials[index];
  document.getElementById("testimonial-text").textContent = `“${t.text}”`;
  document.getElementById("testimonial-author").textContent = t.author;
}
function prevTestimonial() {
  currentIndex = (currentIndex - 1 + testimonials.length) % testimonials.length;
  showTestimonial(currentIndex);
}
function nextTestimonial() {
  currentIndex = (currentIndex + 1) % testimonials.length;
  showTestimonial(currentIndex);
}