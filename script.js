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

function init() {
  console.log("ready");

  // listen for theme selection
  document.querySelector("select#theme").addEventListener("change", function () {
    document.querySelector("body").setAttribute("data-house", this.value);
  });

  // TODO: add event-listeners to filter and sort buttons
  document.querySelector("[data-filter='gryffindor']").addEventListener("click", filterGryffindor);
  document.querySelector("[data-filter='hufflepuff']").addEventListener("click", filterHufflepuff);
  document.querySelector("[data-filter='ravenclaw']").addEventListener("click", filterRavenclaw);
  document.querySelector("[data-filter='slytherin']").addEventListener("click", filterSlytherin);

  document.querySelector("[data-sort='firstname']").addEventListener("click", sortName);
  document.querySelector("[data-sort='lastname']").addEventListener("click", sortName);

  fetchJson();
}

/*------------------FILTER------------------*/
function filterGryffindor() {
  const onlyGryffindor = studentArr.filter(isGryffindor);
  showStudents(onlyGryffindor);
}

function isGryffindor(newStudent) {
  return newStudent.house === "gryffindor";
}

function filterHufflepuff() {
  const onlyHufflepuff = studentArr.filter(isHufflepuff);
}

function isHufflepuff(newStudent) {
  return newStudent.house === "hufflepuff";
}

function filterRavenclaw() {
  const onlyRavenclaw = studentArr.filter(isRavenclaw);
}

function isRavenclaw(newStudent) {
  return newStudent.house === "ravenclaw";
}

function filterSlytherin() {
  const onlySlytherin = studentArr.filter(isSlytherin);
}

function isSlytherin(newStudent) {
  return newStudent.house === "slytherin";
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
  newStudent.house = student.house.toLowerCase();

  studentArr.push(newStudent);
  console.log(studentArr)

  showStudents(newStudent);
}

/*-------------------DISPLAY NEW STUDENTLIST------------------*/
function showStudents(newStudent) {
  // clone HTML template
  const template = document.querySelector("#template").content;
  const copy = template.cloneNode(true);

  copy.querySelector(".studentFirstName", ".studentLastName").textContent = newStudent.firstName + " " + newStudent.lastName;
  copy.querySelector(".modalBtn").addEventListener("click", function () {

    // match color and crest with student in modal
    const modal = document.querySelector(".modal-content");
    modal.setAttribute("data-house", newStudent.house);

    // TODO: add blood status

    // TODO: add if prefect, expelled, or member of inquisitorial squad

    // TODO: add student image
    modal.querySelector(".photo").src = `images/${newStudent.lastName.toLowerCase() + "_" + newStudent.firstName[0].substring(0, 1).toLowerCase() + ".png"}`;
    // add house crest
    modal.querySelector(".crest").src = `house-crests/${newStudent.house.toLowerCase()}.png`;

    const modalOpen = document.querySelector(".modal-background");
    modalOpen.classList.remove("hide");
    const modalHouse = document.querySelector(".modal-house");
    modalHouse.textContent = newStudent.house;
    const modalName = document.querySelector(".modal-name");
    modalName.textContent = newStudent.firstName + " " + newStudent.lastName;
  });

  // append template copy
  document.querySelector("#students").appendChild(copy);

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