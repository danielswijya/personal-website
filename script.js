console.log("Hello World");

const projects = document.querySelector(".project");
console.log(projects);

const myName = document.getElementById("my-name");
myName.textContent = "Daniel Sam Wijaya";
myName.style.color = "white";

let numberOfClicks = 0;
myName.addEventListener("click", function() {
    if (numberOfClicks % 2 == 0){
        myName.style.color = "black";  
    }else {  
        myName.style.color = "blue";  
    }
    numberOfClicks += 1;
});

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

/**
 * The function `nowyouseeme` uses Intersection Observer to add a 'visible' class to elements when they
 * are 10% visible in the viewport.
 */
function nowyouseeme(){
    document.addEventListener("DOMContentLoaded", function () {
        const featureItems = document.querySelectorAll('.feature-item');
    
        const observerOptions = {
            threshold: 0.1 // When 10% of the element is visible
        };
    
        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Stop observing once it's visible
                }
            });
        }, observerOptions);
    
        featureItems.forEach(item => {
            observer.observe(item); // Observe each feature item
        });
    });
}
