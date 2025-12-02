import Domo from "@zyrab/domo";
import { loginGoogle, logoutUser, auth } from "../firebase.js";
import { onAuthStateChanged } from "firebase/auth";

export const Header = () => {
  const authContainer = Domo("div").cls("flex g-2 aic");

  onAuthStateChanged(auth, (user) => {
    authContainer.clear();
    if (user) {
      authContainer.child([
        Domo("span")
          .txt(user.displayName || "User")
          .cls("small"),
        Domo("button").txt("Logout").cls("btn").on("click", logoutUser),
      ]);
      document.dispatchEvent(new CustomEvent("app:login", { detail: user }));
    } else {
      authContainer.child([Domo("button").txt("Google Login").cls("btn btn-primary").on("click", loginGoogle)]);
      document.dispatchEvent(new CustomEvent("app:logout"));
    }
  });

  return Domo("header")
    .cls("flex jsb aic w-full")
    .css({ marginBottom: "var(--s-4)" })
    .child([
      Domo("div")
        .cls("flex aic g-2")
        .child([
          Domo("h1").txt("QR Studio").cls("h1"),
          Domo("button")
            .txt("☀/☾")
            .cls("btn")
            .on("click", () => {
              document.body.classList.toggle("dark");
            }),
        ]),
      authContainer,
    ]);
};
