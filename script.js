"use strict";
window.addEventListener("DOMContentLoaded", init);

/*------------------STUDENT ARRAY--------------------*/
let studentArr = [];
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

  fetchJson();
}
/*-------------------SORT-------------------*/
/*------------------FILTER------------------*/

function fetchJson() {
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then(res => res.json())
    .then(getStudents);
}

/*-------------------DISPLAY STUDENTLIST--------------------*/
function getStudents(studentArr) {
  studentArr.forEach(separateNames);
  //console.log(studentArr);
}

/*---------------------CLEAN JSON DATA-----------------------*/
function separateNames(student) {
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

  // image filename
  newStudent.image = newStudent.lastName.toLowerCase() + "_" + newStudent.firstName[0].substring(0, 1).toLowerCase() + ".png";

  // house
  newStudent.house = student.house.toLowerCase();

  studentArr.push(newStudent);
  console.log(studentArr)

  showStudents(newStudent);
}

/*-------------------DISPLAY STUDENTLIST------------------*/
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