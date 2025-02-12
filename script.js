// Runs when the page is fully loaded
window.onload = () => {
    console.log("Script is working!");

    // Change the text of the heading
    document.getElementById("greeting").innerText = "Script is working!";

    // Change background color
    document.body.style.backgroundColor = "#f0f0f0";
};

// Function to change text on button click
function changeText() {
    document.getElementById("greeting").innerText = "Button Clicked!";
}