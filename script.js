"use strict";
window.addEventListener("DOMContentLoaded", init);

/*---------------------------------ARRAYS--------------------------------*/
let studentArr = [];
let currentStudents = [];
let prefects = [];
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

/*-------------------------------INIT FUNCTION---------------------------*/
function init() {
  // listen for theme selection
  document.querySelector("select#theme").addEventListener("change", function () {
    document.querySelector("body").setAttribute("data-house", this.value);
    console.log("data-house", this.house)
  });

  // event-listener for filtering
  document.querySelectorAll(".filter").forEach(button => {
    button.addEventListener("click", setFilter);
  });

  document.querySelector("[data-filter=expelled]").addEventListener("click", filterExpelled);
  document.querySelector("[data-filter=not-expelled]").addEventListener("click", filterNonExpelled);

  // event-listener for sorting
  document.querySelector("[data-sort=firstname]").addEventListener("click", sortFirstName);
  document.querySelector("[data-sort=lastname]").addEventListener("click", sortLastName);

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
    return filter === newStudent.house;
  }
  return filterStudents;
}


function filterExpelled() {
  const onlyExpelled = studentArr.filter(isExpelled);
  fetchList(onlyExpelled);

  function isExpelled(student) {
    return student.expelled;
  }
}

function filterNonExpelled() {
  const notExpelled = studentArr.filter(isNotExpelled)
  fetchList(notExpelled);

  function isNotExpelled(student) {
    return student.expelled == false;
  }
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
  } else if (nameArr.length === 2) {
    newStudent.middleName = "";
  }

  // last name
  newStudent.lastName = nameArr[nameArr.length - 1];

  if (newStudent.lastName == "Leanne") {
    newStudent.lastName = "";
  }

  // gender
  newStudent.gender = student.gender;

  // house
  newStudent.house = (student.house.substring(0, 1)).toUpperCase() + (student.house.substring(1, )).toLowerCase();

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

  // Clone HTML template
  const template = document.querySelector("#template").content;
  const copy = template.cloneNode(true);

  // Prefect selection: show star "⭐" or "☆"
  copy.querySelector("[data-field=star").dataset.star = student.prefect;
  if (student.prefect === true) {
    copy.querySelector("[data-field=star]").textContent = "⭐";
  } else {
    copy.querySelector("[data-field=star]").textContent = "☆";
  }
  // Set a student as prefect
  copy.querySelector("[data-field=star]").addEventListener("click", function () {
    maxTwo(student);
    differentType(student);
  })

  // Expel a student
  copy.querySelector(".expelBtn").addEventListener("click", function () {
    expelStudent(student);
  })

  // Clone NAME
  copy.querySelector(".studentFirstName", ".studentLastName").textContent = student.firstName + " " + student.middleName + " " + student.lastName;

  // Add student image
  if (student.firstName == "Padma") {
    copy.querySelector(".photo").src = "images/" + student.lastName.toLowerCase() + "_" + "padme" + ".png";
  } else if (student.lastName == "Patil") {
    copy.querySelector(".photo").src = "images/" + student.lastName.toLowerCase() + "_" + student.firstName.toLowerCase() + ".png";
  } else if (student.firstName == "Leanne") {
    copy.querySelector(".photo").alt = "";
  } else if (student.lastName == "Finch-fletchley") {
    copy.querySelector(".photo").src = "images/" + "fletchley" + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
  } else {
    copy.querySelector(".photo").src = "images/" + student.lastName.toLowerCase() + "_" + student.firstName[0].substring(0, 1).toLowerCase() + ".png";
  }

  copy.querySelector(".modalBtn").addEventListener("click", function () {

    // match color and crest with student in modal
    const modal = document.querySelector(".modal-content");
    modal.setAttribute("data-house", student.house);

    // TODO: add blood status

    // add prefect status in modal 
    modal.querySelector(".prefect").textContent = "Prefect: " + student.prefect;

    // TODO: add if expelled or not
    modal.querySelector(".expelled").textContent = "Expelled: " + student.expelled;

    // add student image 
    if (student.firstName == "Padma") {
      modal.querySelector(".modal-photo").src = "images/" + student.lastName.toLowerCase() + "_" + "padme" + ".png";
    } else if (student.lastName == "Patil") {
      modal.querySelector(".modal-photo").src = "images/" + student.lastName.toLowerCase() + "_" + student.firstName.toLowerCase() + ".png";
    } else if (student.firstName == "Leanne") {
      modal.querySelector(".modal-photo").alt = "";
    } else if (student.lastName == "Finch-fletchley") {
      modal.querySelector(".modal-photo").src = "images/" + "fletchley" + "_" + student.firstName.substring(0, 1).toLowerCase() + ".png";
    } else {
      modal.querySelector(".modal-photo").src = "images/" + student.lastName.toLowerCase() + "_" + student.firstName[0].substring(0, 1).toLowerCase() + ".png";
    }

    // add house crest
    modal.querySelector(".crest").src = "house-crests/" + student.house.toLowerCase() + ".png";
    ".png";

    const modalOpen = document.querySelector(".modal-background");
    modalOpen.classList.remove("hide");
    const modalHouse = document.querySelector(".modal-house");
    modalHouse.textContent = "House: " + student.house;
    const modalName = document.querySelector(".modal-name");
    modalName.textContent = "Full name: " + student.firstName + " " + student.middleName + " " + student.lastName;

    // Add gender
    modal.querySelector(".gender").textContent = `Gender: ${student.gender}`;
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

/*---------------------------------PREFECTS SELECTION-------------------------------*/
function maxTwo(student) {

  if (prefects.length > 1) {
    document.querySelector("#onlytwoprefects").classList.add("show");
    console.log(prefects)
    document.querySelector("#onlytwoprefects .student1").textContent = `${prefects[0].firstName} ${prefects[0].lastName}`;
    document.querySelector("#onlytwoprefects .student2").textContent = `${prefects[1].firstName} ${prefects[1].lastName}`;
    document.querySelector("#onlytwoprefects [data-action=remove1]").addEventListener("click", function () {
      console.log(prefects[0])
      prefects[0].prefect = false;
      student.prefect = true;
      fetchList(studentArr)
      document.querySelector("#onlytwoprefects").classList.remove("show")
    })
    document.querySelector("#onlytwoprefects [data-action=remove2]").addEventListener("click", function () {
      console.log(prefects[1])
      prefects[1].prefect = false;
      student.prefect = true;
      fetchList(studentArr)
      document.querySelector("#onlytwoprefects").classList.remove("show")
    })

    document.querySelector("#onlytwoprefects .closebutton").addEventListener("click", function () {
      document.querySelector("#onlytwoprefects").classList.remove("show")
    })
  }
}

function differentType(student) {

  if (student.prefect) {
    student.prefect = false;
  } else {
    function checkGender(x) {
      return x.type === student.gender;
    }
    if (prefects.some(checkGender) == false) {
      student.prefect = true;
    } else {
      document.querySelector("#onlyonegender").classList.add("show")
      document.querySelector("#onlyonegender .student1").textContent = `${prefects[0].firstName} ${prefects[0].lastName}, the ${prefects[0].student.gender}`;
      document.querySelector("#onlyonegender [data-action=remove1]").addEventListener("click", function () {
        console.log(prefects[0])

        prefects[0].prefect = false;
        student.prefect = true;

        fetchList(studentArr);
        document.querySelector("#onlyonegender").classList.remove("show")
      })

      document.querySelector("#onlyonegender .closebutton").addEventListener("click", function () {
        document.querySelector("#onlyonegender").classList.remove("show")
      })

      fetchList(studentArr);
    }

    prefects = studentArr.filter(students => students.prefect == true);
  }

  showStudents(student);
}

/*---------------------------------EXPEL A STUDENT-------------------------------*/
function expelStudent(student) {
  student.expelled = true;
  student.prefect = false;

  currentStudents = studentArr.filter(student => student.expelled === false);

  expelledStudents.push(student);

  fetchList(currentStudents);

  console.log(currentStudents)
  console.log(expelledStudents)
}