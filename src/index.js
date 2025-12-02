import Domo from "@zyrab/domo";
import "./styles.css";
import { Header } from "./components/header.js";
import { Generator } from "./components/generator.js";
import { History } from "./components/history.js";
import "./styles.css";

const App = () => {
  return Domo("div").cls("container flex f-col g-3").child([Header(), Generator(), History()]);
};

document.body.appendChild(App().build());
