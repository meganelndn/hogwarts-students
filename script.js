"use strict";
window.addEventListener("DOMContentLoaded", init);

/*------------------------------STUDENT ARRAY----------------------------*/
let studentArr = [];
let currentStudents = [];
let expelledStudents = [];
let bloodStatus = [];

/*-----------------------------FULLNAME OBJECT---------------------------*/
let nameArr = {};

/*-----------------------------OBJECT PROTOTYPE--------------------------*/
const studentObject = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: "",
  house: "",
  prefect: false,
  expelled: false,
  gender: "",
  blood: ""
};

/*-------------------------------INITITALISE-----------------------------*/
function init() {

  // listen for theme selection
  document.querySelector("select#theme").addEventListener("change", function () {
    document.querySelector("body").setAttribute("data-house", this.value);
    console.log("data-house", this.house)
  });

  // event-listeners for filter & sort
  document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", setFilter);
  });
  document.querySelector("[data-sort='firstname']").addEventListener("click", sortFirstName);
  document.querySelector("[data-sort='lastname']").addEventListener("click", sortLastName);

  fetchJson();
}

/*----------------------------------FILTER------------------------------*/
function setFilter() {
  const filter = this.dataset.filter;
  const filteredStudents = sendFiltered(filter);
  currentStudents = filteredStudents;
  fetchList(currentStudents);
}

function sendFiltered(filter) {
  const filterStudents = studentArr.filter(filterFunction);

  function filterFunction(newStudent) {
    //console.log(newStudent)
    return filter === newStudent.house;
  }
  return filterStudents;
}

/*------------------------------------SORT-------------------------------*/
function sortFirstName() {
  if (event.target.dataset.sortDirection === "asc") {
    event.target.dataset.sortDirection = "desc";

    firstNameDesc();
  } else {
    firstNameAsc();

    event.target.dataset.sortDirection = "asc";
  }
}

// ascending order
function firstNameDesc() {
  function compareFirstName(a, b) {
    if (a.firstName < b.firstName) {
      return -1;
    } else if (a.firstName > b.firstName) {
      return 1;
    }
  }
  studentArr.sort(compareFirstName);
  fetchList(studentArr);
  console.log(studentArr)
}

// descending order
function firstNameAsc() {
  function compareFirstName(a, b) {
    if (a.firstName < b.firstName) {
      return 1;
    } else if (a.firstName > b.firstName) {
      return -1;
    }
  }
  studentArr.sort(compareFirstName);
  fetchList(studentArr);
}

function sortLastName() {
  if (event.target.dataset.sortDirection === "asc") {
    event.target.dataset.sortDirection = "desc";

    lastNameDesc();
  } else {
    lastNameAsc();

    event.target.dataset.sortDirection = "asc";
  }
}

function lastNameDesc() {
  function compareLastName(a, b) {
    if (a.lastName < b.lastName) {
      return -1;
    } else if (a.lastName > b.lastName) {
      return 1;
    }
  }
  studentArr.sort(compareLastName);
  fetchList(studentArr);
  console.log(studentArr)
}

// descending order
function lastNameAsc() {
  function compareLastName(a, b) {
    if (a.lastName < b.lastName) {
      return 1;
    } else if (a.lastName > b.lastName) {
      return -1;
    }
  }
  studentArr.sort(compareLastName);
  fetchList(studentArr);
}

/*-----------------------LOAD JSON DATA----------------------*/
function fetchJson() {
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then(res => res.json())
    .then(getStudents);
}

/*---------------------DISPLAY STUDENTLIST-------------------*/
function getStudents(studentArr) {
  studentArr.forEach(separateData);
}

/*-----------------------CLEAN JSON DATA---------------------*/
function separateData(student) {

  let newStudent = Object.create(studentObject);
  //console.log(student) // logs each student object

  // full name
  let fullName = student.fullname;

  // split full name into parts
  nameArr = fullName.split(" ");

  nameArr.forEach(generalCleanUp);
  console.log(nameArr)

  // first name
  newStudent.firstName = nameArr[0];

  // middle name & nick name
  if (nameArr.length === 3) {
    newStudent.middleName = nameArr[1];
  }

  // last name
  newStudent.lastName = nameArr[nameArr.length - 1];

  // gender
  newStudent.gender = student.gender;

  // house
  newStudent.house = (student.house.substring(0, 1)).toUpperCase() + (student.house.substring(1, )).toLowerCase();
  //newStudent.house = student.house.toLowerCase();

  studentArr.push(newStudent);
  console.log(studentArr)

  function generalCleanUp(fullName, index) {
    // if index 0 = empty, delete from beginning of array
    if (nameArr[0] == "") {
      nameArr.shift();
    }

    // if (nameArr.length -1) = empty, delete from end of array
    if (nameArr[nameArr.length - 1] == "") {
      nameArr.pop();
    }

    /*--------------OBJECT TO ARRAY----------------*/
    let newArr = Array.from(nameArr[index]);

    //delete or change character
    newArr.forEach((character, index) => {
      if (character == '"' || character == `"\"`) {
        newArr[index] = "";
      } else if (index == 0) {
        newArr[0] = newArr[0].toUpperCase();
      } else {
        newArr[index] = newArr[index].toLowerCase();
      }
    });

    // update that string in the fullNameArray after changing each character
    let newStr = newArr.join("");
    nameArr[index] = newStr;
    console.log(newStr)
  }

  fetchList(studentArr);
}

function fetchList(student) {
  document.querySelector("#students").innerHTML = "";

  student.forEach(showStudents);
}

/*-------------------DISPLAY NEW STUDENTLIST------------------*/
function showStudents(student) {

  /* document.querySelector("#search").addEventListener("keyup", function (search) {
    console.log("key up");

    const searchValue = search.target.value.toLowerCase();
    const students = document.querySelector("#student");

    Array.from(students).forEach(student => {
      const name = student.querySelector(".studentFirstName").textContent;
      student.className = "student";

      if (name.toLowerCase().includes(searchValue)) {
        student.classList.add("student");
      } else {
        student.classList.add("hide");
      }
    })
  }) */

  // clone HTML template
  const template = document.querySelector("#template").content;
  const copy = template.cloneNode(true);

  copy.querySelector(".studentFirstName", ".studentLastName").textContent = student.firstName + " " + student.middleName + " " + student.lastName;
  copy.querySelector(".modalBtn").addEventListener("click", function () {

    // match color and crest with student in modal
    const modal = document.querySelector(".modal-content");
    modal.setAttribute("data-house", student.house);

    // TODO: add blood status

    // TODO: add if prefect, expelled, or member of inquisitorial squad

    // add student image 
    if (student.firstName == "Padma") {
      modal.querySelector(".photo").src = "images/" + student.lastName.toLowerCase() + "_" + "padme" + ".png";
    } else if (student.lastName == "Patil") {
      modal.querySelector(".photo").src = "images/" + student.lastName.toLowerCase() + "_" + student.firstName.toLowerCase() + ".png";
    } else if (student.lastName == "Finch-fletchley") {
      modal.querySelector(".photo").src = "images/" + "fletchley" + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
    } else {
      modal.querySelector(".photo").src = "images/" + student.lastName.toLowerCase() + "_" + student.firstName[0].substring(0, 1).toLowerCase() + ".png";
    }

    // add house crest
    modal.querySelector(".crest").src = `house-crests/${student.house.toLowerCase()}.png`;

    const modalOpen = document.querySelector(".modal-background");
    modalOpen.classList.remove("hide");
    const modalHouse = document.querySelector(".modal-house");
    modalHouse.textContent = `House: ${student.house}`;
    const modalName = document.querySelector(".modal-name");
    modalName.textContent = student.firstName + " " + student.middleName + " " + student.lastName;
  });

  // append template copy
  document.querySelector("#students").appendChild(copy);
  console.log(student)
  closeModal();
}

function closeModal() {
  const modalClose = document.querySelector(".modal-background");
  modalClose.addEventListener("click", () => {
    modalClose.classList.add("hide");
  });
}