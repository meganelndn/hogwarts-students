"use strict";
window.addEventListener("DOMContentLoaded", init);

/*------------------STUDENT ARRAY--------------------*/
let studentArr = [];
let currentStudents = [];

/*-----------------FULLNAME OBJECT------------------*/
let nameArr = {};

/*-----------------OBJECT PROTOTYPE------------------*/
const studentObject = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: "",
  house: ""
};

/*-------------------INITITALISE------------------*/
function init() {

  // listen for theme selection
  document.querySelector("select#theme").addEventListener("change", function () {
    document.querySelector("body").setAttribute("data-house", this.value);
  });

  // event-listeners for filter & sort
  document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", setFilter);
  });
  document.querySelectorAll(".sort").forEach(p => {
    p.addEventListener("click", sortName);
  });

  fetchJson();
}

/*----------------------FILTER---------------------*/
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

/*-------------------SORT-------------------*/
function sortName() {
  if (event.target.dataset.sortDirection === "asc") {
    event.target.dataset.sortDirection = "desc";

    nameAsc();
  } else {
    nameDesc();

    event.target.dataset.sortDirection = "asc";
  }
}

// ascending order
function nameDesc() {
  function compareName(a, b) {
    if (a.name < b.name) {
      return -1;
    } else if (a.name > b.name) {
      return 1;
    }
  }
  studentArr.sort(compareName);
  showStudents(studentArr);
}

// descending order
function nameAsc() {
  function compareName(a, b) {
    if (a.name < b.name) {
      return 1;
    } else if (a.name > b.name) {
      return -1;
    }
  }
  studentArr.sort(compareName);
  showStudents(studentArr);
}

/*-----------------------LOAD JSON DATA--------------------*/

function fetchJson() {
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then(res => res.json())
    .then(getStudents);
}

/*-------------------DISPLAY STUDENTLIST--------------------*/
function getStudents(studentArr) {
  studentArr.forEach(separateData);
}

/*---------------------CLEAN JSON DATA-----------------------*/
function separateData(student) {
  // Create new object from prototype
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
  if (nameArr.length > 2) {
    newStudent.middleName = nameArr.slice(1, nameArr.length - 1);
    newStudent.nickName = nameArr.slice(1, nameArr.length - 1);
  }

  // last name
  newStudent.lastName = nameArr[nameArr.length - 1];

  // house
  newStudent.house = student.house.toLowerCase(); /* + student.house(substring(0, 1)).toUpperCase(); */

  studentArr.push(newStudent);
  console.log(studentArr)

  fetchList(studentArr);
}

function fetchList(newStudent) {
  document.querySelector("#students").innerHTML = "";

  newStudent.forEach(showStudents);
}

/*-------------------DISPLAY NEW STUDENTLIST------------------*/
function showStudents(student) {
  // clone HTML template
  const template = document.querySelector("#template").content;
  const copy = template.cloneNode(true);

  copy.querySelector(".studentFirstName", ".studentLastName").textContent = student.firstName + " " + student.lastName;
  copy.querySelector(".modalBtn").addEventListener("click", function () {

    // match color and crest with student in modal
    const modal = document.querySelector(".modal-content");
    modal.setAttribute("data-house", student.house);

    // TODO: add blood status

    // TODO: add if prefect, expelled, or member of inquisitorial squad

    // TODO: add student image
    modal.querySelector(".photo").src = `images/${student.lastName.toLowerCase() + "_" + student.firstName[0].substring(0, 1).toLowerCase() + ".png"}`;
    // add house crest
    modal.querySelector(".crest").src = `house-crests/${student.house.toLowerCase()}.png`;

    const modalOpen = document.querySelector(".modal-background");
    modalOpen.classList.remove("hide");
    const modalHouse = document.querySelector(".modal-house");
    modalHouse.textContent = `House: ${student.house}`;
    const modalName = document.querySelector(".modal-name");
    modalName.textContent = student.firstName + " " + student.lastName;
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

/*-------------------DISPLAY CLEANED UP STUDENTLIST------------------*/
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