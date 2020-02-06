window.addEventListener("DOMContentLoaded", fetchJson);

function fetchJson() {
    //console.log("fetchJson")
    fetch("students1991.json")
        .then(res => res.json())
        .then(handleData);
}

function handleData(showAll) {
    console.log(showAll);

    // 1. loop array
    showAll.forEach(showStudents);
}

function showStudents(student) {
    console.log(student);

    // 2. clone template
    const myTemplate = document.querySelector("#myTemplate").content;
    const myCopy = myTemplate.cloneNode(true);

    // 3. textContent & innerHTML
    const oneName = myCopy.querySelector(".studentName");
    oneName.textContent = student.fullname;

    const house = myCopy.querySelector(".houseName");
    house.textContent = student.house;

    // 4. append
    document.querySelector("#students").appendChild(myCopy);


    // Get the modal
    const modal = document.getElementById("myModal");

    // Get the button that opens the modal
    const btn = document.getElementById("modalBtn");

    // Get the <span> element that closes the modal
    const span = document.getElementsByClassName("close")[0];

    // When the user clicks the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}