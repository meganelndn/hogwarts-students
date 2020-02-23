"use strict";
window.addEventListener("DOMContentLoaded", init);

const HTML = {};

let studentArr = [];

const studentObj = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  image: "",
  house: ""
}

function init() {
  console.log("ready");
  HTML.modal = document.querySelector(".modal-background");
  HTML.close = document.querySelector(".close");
  HTML.wrapper = document.querySelector("#students");

  fetchJson();
}

function fetchJson() {
  fetch("https://petlatkea.dk/2020/hogwarts/students.json")
    .then(res => res.json())
    .then(handleData);
}

function selectTheme() {
  document.querySelector("body").setAttribute("data-house", this.value);
}

function handleData(studentArr) {
  console.log(studentArr);
  // loop array
  studentArr.forEach(showStudents);
  // listen for event change
  document.querySelector("select#theme").addEventListener("change", selectTheme);
}


/********************* CLEAN JSON DATA ******************/

function cleanData() {

  // TODO: insert clean data here

  showStudents(student);
}

function showStudents(student) {
  // clone template
  const template = document.querySelector("#template").content;
  const copy = template.cloneNode(true);

  // populate template with content being fetched
  copy.querySelector(".studentName").textContent = student.fullname;

  // textContent in modal
  copy.querySelector(".modalBtn").addEventListener("click", function () {
    const modalOpen = document.querySelector(".modal-background");
    modalOpen.classList.remove("hide");
    const modalHouse = document.querySelector(".modal-house");
    modalHouse.textContent = student.fullname;
    const modalName = document.querySelector(".modal-name");
    modalName.textContent = student.house;
  });

  // append copy to parent element
  document.querySelector("#students").appendChild(copy);

  closeModal();
}

function closeModal() {
  // user can now click anywhere to close the modal
  const modalClose = document.querySelector(".modal-background");
  modalClose.addEventListener("click", () => {
    modalClose.classList.add("hide");
  });
}