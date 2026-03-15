import { render } from "preact";
import { App } from "./app";
import "./shoelace";
import "./styles.css";
import "./print.css";

render(<App />, document.getElementById("app")!);
