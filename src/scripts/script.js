import { render } from "mustache";
//functions for transforming opinion(s) to Html code

function opinion2html(opinion) {
  //in the case of Mustache, we must prepare data beforehand:
  opinion.createdDate = new Date(opinion.created).toDateString();

  //get the template:
  const template = document.getElementById("tea-form").innerHTML;
  //use the Mustache:
  const htmlWOp = render(template, opinion);

  //delete the createdDate item as we created it only for the template rendering:
  delete opinion.createdDate;

  //return the rendered HTML:
  return htmlWOp;
}

function opinionArray2html(sourceData) {
  return sourceData.reduce(
    (htmlWithOpinions, opn) => htmlWithOpinions + opinion2html(opn),
    ""
  ); //"" is the initial value of htmlWithOpinions in reduce. If we do not use it, the first member of sourceData will not be processed correctly
}

let opinions = [];
const opinionsElm = document.getElementById("aaa");
if (localStorage.teeShop) {
  opinions = JSON.parse(localStorage.teeShop);
}
console.log(opinions);
opinionsElm.innerHTML = opinionArray2html(opinions);

const myFrmElm = document.getElementById("best-form");

myFrmElm.addEventListener("submit", processOpnFrmData);

function processOpnFrmData(event) {
  //1.prevent normal event (form sending) processing
  event.preventDefault();

  //2. Read and adjust data from the form (here we remove white spaces before and after the strings)
  const fName = document.getElementById("fname").value.trim();
  const lName = document.getElementById("lname").value.trim();
  const eMail = document.getElementById("mail").value.trim();
  const genderMale = document.getElementById("male").checked;
  const genderFemale = document.getElementById("female").checked;
  const teaBlack = document.getElementById("bt").checked;
  const teaGreen = document.getElementById("gt").checked;
  const teaWhite = document.getElementById("wt").checked;
  const teaOther = document.getElementById("oo").checked;
  const textArea = document.getElementById("text").value.trim();

  //3. Verify the data
  if (fName === "" || lName === "" || eMail === "" || textArea === "") {
    window.alert("Please, enter both your name and opinion");
    return;
  }

  var sex;

  if (genderMale === true) {
    sex = "Male";
  } else {
    sex = "Female";
  }

  var tea;

  if (document.getElementById("bt").checked === true) {
    tea = "Black Tea";
  }
  if (document.getElementById("gt").checked === true) {
    tea = tea + " Green Tea";
  }
  if (document.getElementById("wt").checked === true) {
    tea = tea + " White Tea";
  }
  if (document.getElementById("oo").checked === true) {
    tea = tea + " Other";
  }

  //3. Add the data to the array opinions and local storage
  const newOpinion = {
    name: fName,
    surname: lName,
    email: eMail,
    sex: sex,
    tea: tea,
    text: textArea,
    created: new Date()
  };

  console.log("New opinion:\n " + JSON.stringify(newOpinion));

  opinions.push(newOpinion);

  localStorage.teeShop = JSON.stringify(opinions);

  //update HTML
  opinionsElm.innerHTML += opinion2html(newOpinion);
  //4. Notify the user
  window.alert("Your opinion has been stored. Look to the console");
  console.log("New opinion added");
  console.log(opinions);

  //5. Reset the form
  myFrmElm.reset(); //resets the form
}
