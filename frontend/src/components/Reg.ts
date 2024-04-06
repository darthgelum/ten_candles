import { getSocket } from "../pages/Home";

export function askName() {
  let person = localStorage.getItem("name")

  let ex = "Nick and Name(pleaaase)";
  if (!person)
    while (!person || person == ex)
      person = prompt("Please enter your name", ex);
  localStorage.setItem("name", person)
  getSocket().emit("reg", JSON.stringify({ name: person }))
  console.log(person)
}
